import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Container, Typography, Card, CardContent, TextField, Button, Box, List, ListItem, ListItemText, Stack, Alert, Paper } from '@mui/material';
import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

const SectionLearning = () => {
  const [user, setUser] = useState({ username: '', role: '' });
  const [section, setSection] = useState(localStorage.getItem('section') || 'A');
  const [materials, setMaterials] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  
  // Proctoring State
  const [warning, setWarning] = useState('');
  const [switchCount, setSwitchCount] = useState(0);
  const [examLock, setExamLock] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [model, setModel] = useState(null);
  const streamRef = useRef(null);
  const [proctoringActive, setProctoringActive] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get('/auth/me');
      setUser({ username: res.data.username, role: res.data.role });
    } catch (err) {}
  }, []);

  const fetchMaterials = useCallback(async () => {
    try {
      const res = await axios.get(`/sections/materials/section/${section}`);
      setMaterials(res.data);
    } catch (err) {}
  }, [section]);

  useEffect(() => {
    fetchProfile();
    fetchMaterials();
  }, [fetchProfile, fetchMaterials]);

  // Load ML Model
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await blazeface.load();
        setModel(loadedModel);
        setIsModelLoaded(true);
      } catch (err) {
        console.error("Failed to load ML model", err);
      }
    };
    loadModel();
  }, []);

  const startProctoring = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera API not supported.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setProctoringActive(true);
      
      try {
        if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
        }
      } catch(e) {}
      
      logAction('PROCTOR_START', 'User started ML proctored session');
    } catch (err) {
      alert("Camera permission denied. Cannot start exam.");
    }
  };

  const stopProctoring = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    setProctoringActive(false);
    if (document.fullscreenElement) {
        try { await document.exitFullscreen(); } catch(e){}
    }
    logAction('PROCTOR_END', 'User ended proctored session');
  };

  const logAction = (eventType, details) => {
      axios.post('/api/tracking', {
          username: user.username || 'unknown',
          event: eventType,
          details: details
      }).catch(()=>{}); // Send to MongoDB backend quietly
  };

  // ML Detection Loop
  useEffect(() => {
    let intervalId;
    if (proctoringActive && isModelLoaded && model && videoRef.current) {
      intervalId = setInterval(async () => {
        if (!examLock && videoRef.current.readyState === 4) {
          const predictions = await model.estimateFaces(videoRef.current, false);
          
          if (predictions.length === 0) {
              handleViolation('Face Not Detected. Please look at the screen.');
          } else if (predictions.length > 1) {
              handleViolation('Multiple faces detected! No cheating allowed.');
          }
        }
      }, 3000); // Check every 3 seconds
    }
    return () => clearInterval(intervalId);
  }, [proctoringActive, isModelLoaded, model, examLock]);

  const handleViolation = (msg) => {
      setSwitchCount(prev => {
          const next = prev + 1;
          setWarning(`${msg} (Warning ${next}/3)`);
          logAction('VIOLATION', `Count: ${next}, Msg: ${msg}`);
          if (next >= 3) {
              setExamLock(true);
              setWarning('EXAM LOCKED. You have exceeded maximum violations. Admin unblock required.');
              logAction('EXAM_LOCKED', 'Exceeded 3 violations');
              stopProctoring();
          }
          return next;
      });
  };

  // Prevent Copy Paste & Tab Switch
  useEffect(() => {
    const handleCopy = (ev) => {
      if (proctoringActive) {
          ev.preventDefault();
          ev.clipboardData.setData('text/plain', 'Cheating strictly prohibited!');
          handleViolation('Copying is blocked');
      }
    };
    const handlePaste = (ev) => {
      if (proctoringActive) {
          ev.preventDefault();
          handleViolation('Pasting is blocked');
      }
    };
    const handleVisibility = () => {
      if (proctoringActive && document.visibilityState !== 'visible') {
          handleViolation('Window switched/Tab lost focus');
      }
    };
    const handleKeydown = (e) => {
        if (proctoringActive) {
            if (e.key === 'Escape' || (e.altKey && e.key === 'Tab')) {
                e.preventDefault();
                handleViolation('Restricted shortcut used');
            }
        }
    };

    window.addEventListener('copy', handleCopy);
    window.addEventListener('paste', handlePaste);
    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [proctoringActive]);

  useEffect(() => {
      return () => {
          if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      };
  }, []);

  return (
    <Container sx={{ py: 4, opacity: examLock ? 0.5 : 1 }}>
      <Typography variant="h4" gutterBottom>Exam & Learning Section</Typography>
      
      {warning && (
          <Alert severity={examLock ? "error" : "warning"} sx={{ mb: 3, fontWeight: 'bold', fontSize: '1.1rem' }}>
              {warning}
          </Alert>
      )}

      {examLock && (
          <Paper sx={{ p: 4, mb: 4, textAlign: 'center', bgcolor: '#ffebee' }}>
              <Typography variant="h5" color="error" fontWeight="bold">Exam Lock Enabled</Typography>
              <Typography>Your session has been strictly locked due to multiple policy violations. You can no longer interact with this page until a faculty member or admin unblocks you via MongoDB.</Typography>
          </Paper>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 3, pointerEvents: examLock ? 'none' : 'auto' }}>
          
          <Box>
              <Card sx={{ mb: 3, background: 'linear-gradient(to right, #1e3c72, #2a5298)', color: 'white' }}>
                  <CardContent>
                      <Typography variant="h6">ML Proctoring Security</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                          This test uses Google TensorFlow Face-Tracking. Do not look away, change tabs, or copy/paste.
                      </Typography>
                      {!proctoringActive && !examLock ? (
                          <Button variant="contained" color="secondary" onClick={startProctoring} disabled={!isModelLoaded}>
                              {isModelLoaded ? "Start Secure Exam Session" : "Loading ML Models..."}
                          </Button>
                      ) : proctoringActive ? (
                          <Button variant="contained" color="error" onClick={stopProctoring}>
                              End Session / Submit
                          </Button>
                      ) : null}
                  </CardContent>
              </Card>

              {activeVideo && proctoringActive && (
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6">Watching: {activeVideo.title}</Typography>
                      <Box sx={{ mt: 1, position: 'relative', width: '100%', height: 0, paddingBottom: '56.25%' }}>
                        <iframe
                          src={activeVideo.contentUrl}
                          title={activeVideo.title}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                          allow="autoplay; fullscreen"
                        />
                      </Box>
                    </CardContent>
                  </Card>
              )}

              <Card>
                <CardContent>
                  <Typography variant="h6">Study Materials & Quizzes</Typography>
                  <List>
                    {materials.length === 0 ? <Typography>No materials.</Typography> : materials.map((m) => (
                      <ListItem key={m.id} sx={{ justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
                        <ListItemText primary={`${m.materialType}: ${m.title}`} secondary={m.contentUrl || m.description || 'No URL'} />
                        {m.materialType === 'VIDEO' ? (
                          <Button variant="outlined" size="small" onClick={() => {
                              if (!proctoringActive) {
                                  alert("Start secure session first!");
                                  return;
                              }
                              setActiveVideo(m);
                          }}>
                            Start Attempt
                          </Button>
                        ) : null}
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
          </Box>

          <Box>
              <Paper sx={{ p: 2, height: 'max-content', position: 'sticky', top: 20 }}>
                  <Typography variant="subtitle2" color="gray" fontWeight="bold" mb={1} align="center">
                      PROCTORING CAMERA
                  </Typography>
                  <div style={{ position: 'relative', width: '100%', borderRadius: 8, overflow: 'hidden', background: '#000', aspectRatio: '4/3' }}>
                      <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          muted 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {!proctoringActive && (
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontSize: 12 }}>
                              Camera Offline
                          </div>
                      )}
                  </div>
                  {proctoringActive && (
                      <Alert severity="info" sx={{ mt: 2, fontSize: 11, '& .MuiAlert-icon': {fontSize: 14} }}>
                          AI scanning for face presence.
                      </Alert>
                  )}
              </Paper>
          </Box>
      </Box>
    </Container>
  );
};

export default SectionLearning;
