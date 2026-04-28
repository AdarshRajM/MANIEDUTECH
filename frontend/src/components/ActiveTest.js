import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, Paper, Button, Alert, Snackbar } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ActiveTest = () => {
  const [searchParams] = useSearchParams();
  const testType = searchParams.get('type');
  const navigate = useNavigate();
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  const [hasStarted, setHasStarted] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  
  useEffect(() => {
    // Only add listeners if test has started and not blocked
    if (!hasStarted || isBlocked) return;

    const handleKeyDown = (e) => {
      const blockedKeys = ['Escape', 'Control', 'Alt', 'Meta', 'Fn']; // Meta is Windows key
      if (blockedKeys.includes(e.key) || e.ctrlKey || e.altKey || e.metaKey) {
        e.preventDefault();
        triggerWarning(`Key '${e.key}' is blocked during the test!`);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerWarning("You switched tabs or minimized the window!");
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        triggerWarning("Exited full screen!");
        // Try to re-enter
        document.documentElement.requestFullscreen().catch(() => {});
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Periodically check if video track is still running (simulating face check)
    const checkMediaInterval = setInterval(() => {
      if (streamRef.current) {
        const videoTrack = streamRef.current.getVideoTracks()[0];
        if (!videoTrack || videoTrack.readyState === 'ended' || !videoTrack.enabled) {
          triggerWarning("Camera feed lost or covered. Face must be visible!");
        }
      }
    }, 5000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      clearInterval(checkMediaInterval);
    };
  }, [hasStarted, isBlocked, warnings]);

  const triggerWarning = (msg) => {
    setAlertMsg(msg);
    setWarnings(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setIsBlocked(true);
        exitTest();
      }
      return newCount;
    });
  };

  const startTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      await document.documentElement.requestFullscreen();
      setHasStarted(true);
    } catch (err) {
      alert("Camera and Microphone access is REQUIRED to start the test.");
    }
  };

  const exitTest = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setHasStarted(false);
  };

  const handleFinish = () => {
    alert("Test submitted successfully.");
    exitTest();
    navigate('/tests');
  };

  if (isBlocked) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>TEST BLOCKED</Typography>
        <Typography variant="h6">You have exceeded the maximum number of warnings.</Typography>
        <Button variant="contained" sx={{ mt: 4 }} onClick={() => navigate('/tests')}>Return to Dashboard</Button>
      </Container>
    );
  }

  if (!hasStarted) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>Proctoring Setup</Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            This test requires your camera and microphone to be active, and runs in full-screen mode. Do not switch tabs or press restricted keys (Esc, Ctrl, Alt, Window). 3 warnings will result in termination.
          </Typography>
          <Button variant="contained" color="primary" onClick={startTest}>Grant Permissions & Start Test</Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', width: '100vw', p: 3, position: 'relative' }}>
      {/* Video Feed overlay */}
      <Box sx={{ position: 'fixed', bottom: 20, right: 20, width: 150, height: 112, bgcolor: '#000', borderRadius: 2, overflow: 'hidden', boxShadow: 3, zIndex: 1000 }}>
        <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </Box>

      <Typography variant="h5" gutterBottom>Ongoing Test - {testType}</Typography>
      <Typography color="error" variant="subtitle2" sx={{ mb: 4 }}>Warnings: {warnings} / 3</Typography>

      <Paper sx={{ p: 4, minHeight: '50vh' }}>
        {testType === 'MCQ' && (
          <Typography>Question 1: What is the time complexity of binary search?</Typography>
        )}
        {testType === 'WRITTEN' && (
          <Typography>Please write an essay on Data Structures in the provided editor.</Typography>
        )}
        {testType === 'PHOTO_UPLOAD' && (
          <Box>
            <Typography variant="h6" gutterBottom>Upload Written Answer Sheet</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>Please take a clear photo of your written answers using your mobile device.</Typography>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              style={{ padding: '10px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </Box>
        )}
      </Paper>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" color="success" onClick={handleFinish}>Submit Test</Button>
      </Box>

      <Snackbar
        open={!!alertMsg}
        autoHideDuration={4000}
        onClose={() => setAlertMsg('')}
        message={alertMsg}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Box>
  );
};

export default ActiveTest;
