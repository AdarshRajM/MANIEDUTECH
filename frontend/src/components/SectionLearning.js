import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Container, Typography, Card, CardContent, TextField, Button, Box, List, ListItem, ListItemText, Stack, Alert } from '@mui/material';
import axios from 'axios';

const SectionLearning = () => {
  const [user, setUser] = useState({ username: '', role: '' });
  const [section, setSection] = useState(localStorage.getItem('section') || 'A');
  const [materials, setMaterials] = useState([]);
  const [live, setLive] = useState([]);
  const [chat, setChat] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);
  const [warning, setWarning] = useState('');
  const [switchCount, setSwitchCount] = useState(0);
  const [screenSwitchCount, setScreenSwitchCount] = useState(0);
  const [examLock, setExamLock] = useState(false);
  const [trackingEvents, setTrackingEvents] = useState([]);
  const videoAreaRef = useRef(null);
  const [chatLog, setChatLog] = useState([]);
  const [newLive, setNewLive] = useState({ title: '', scheduledAt: '', meetingLink: '', description: '', section });
  const [activeMeeting, setActiveMeeting] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get('/auth/me');
      setUser({ username: res.data.username, role: res.data.role });
    } catch (err) {
      console.error('Cannot fetch profile', err);
    }
  }, []);

  const fetchMaterials = useCallback(async () => {
    try {
      const res = await axios.get(`/sections/materials/section/${section}`);
      setMaterials(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [section]);

  const fetchLive = useCallback(async () => {
    try {
      const res = await axios.get(`/sections/live/${section}`);
      setLive(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [section]);

  const fetchChat = useCallback(async () => {
    try {
      const res = await axios.get(`/sections/chat/${section}`);
      setChatLog(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [section]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    fetchMaterials();
    fetchLive();
    fetchChat();
  }, [fetchMaterials, fetchLive, fetchChat]);

  useEffect(() => {
    const handleCopy = (ev) => {
      ev.preventDefault();
      ev.clipboardData.setData('text/plain', 'Copy is disabled here');
      setWarning('Copy is disabled during tests.');
      axios.post('/sections/activity/monitor', { event: 'copy_attempt', details: 'copy blocked' }).catch(() => {});
    };
    const handlePaste = (ev) => {
      ev.preventDefault();
      setWarning('Paste is disabled during tests.');
      axios.post('/sections/activity/monitor', { event: 'paste_attempt', details: 'paste blocked' }).catch(() => {});
    };
    window.addEventListener('copy', handleCopy);
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  useEffect(() => {
    const handleExamEvent = (eventName, detail) => {
      if (examLock) {
        return;
      }
      setTrackingEvents((prev) => [...prev, { event: eventName, detail, ts: Date.now() }]);
      axios.post('/sections/activity/monitor', { event: eventName, details: detail }).catch(() => {});
      if (eventName === 'window_switch') {
        const next = screenSwitchCount + 1;
        setScreenSwitchCount(next);
        setWarning(`Window switch detected ${next} times. Keep focus. Once 3+ switches happen your session will lock.`);
        if (next >= 3) {
          setExamLock(true);
          setWarning('Exam locked due to repeated window switching. Contact admin.');
          axios.post('/sections/exam/lock', { reason: 'frequent_window_switch' }).catch(() => {});
        }
      }
      if (eventName === 'fullscreen_exit' || eventName === 'escape_pressed') {
        setExamLock(true);
        setWarning('Exam locked due to fullscreen exit or ESC key usage. Contact admin.');
        axios.post('/sections/exam/lock', { reason: eventName }).catch(() => {});
      }
    };

    const handleKeyDown = (e) => {
      if (examLock) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        handleExamEvent('escape_pressed', 'User pressed Escape in exam mode');
        return;
      }
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        handleExamEvent('app_switch_try', 'Alt+Tab pressed');
        return;
      }
      if ((e.ctrlKey && e.key.toLowerCase() === 'tab') || e.key === 'F11') {
        e.preventDefault();
        handleExamEvent('app_switch_try', `${e.key} pressed`);
      }
    };

    const handleBlur = () => {
      if (examLock) return;
      handleExamEvent('window_switch', `blur event state=${document.visibilityState}`);
    };

    const handleFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      if (!active && !examLock && activeVideo) {
        handleExamEvent('fullscreen_exit', 'Fullscreen exited during exam video');
      }
    };

    const handleBeforeUnload = (e) => {
      if (!examLock) {
        const message = 'Exiting this page during exam may be considered cheating. Continue?';
        e.returnValue = message;
        return message;
      }
      return null;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [examLock, screenSwitchCount, activeVideo]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') {
        const next = switchCount + 1;
        setSwitchCount(next);
        setWarning(`You switched away from test/video area ${next} times. Stay focused to avoid lock.`);
        axios.post('/sections/activity/monitor', { event: 'window_switch', details: `count=${next}` }).catch(() => {});
      }
    };
    window.addEventListener('visibilitychange', handleVisibility);
    return () => window.removeEventListener('visibilitychange', handleVisibility);
  }, [switchCount]);

  const scheduleLiveClass = async () => {
    if (!newLive.title.trim() || !newLive.scheduledAt || !newLive.meetingLink.trim()) {
      alert('Please fill title, date/time, and meeting link.');
      return;
    }
    try {
      await axios.post('/sections/live', {
        title: newLive.title,
        section: newLive.section,
        scheduledAt: newLive.scheduledAt,
        meetingLink: newLive.meetingLink,
        description: newLive.description,
      });
      setNewLive({ ...newLive, title: '', scheduledAt: '', meetingLink: '', description: '' });
      fetchLive();
      alert('Live class scheduled.');
    } catch (err) {
      console.error(err);
      alert('Could not schedule live class.');
    }
  };

  const sendMessage = async () => {
    if (!chat.trim()) return;
    try {
      await axios.post('/sections/chat', { section, message: chat });
      setChat('');
      fetchChat();
    } catch (err) {
      console.error(err);
    }
  };

  const raiseHand = async () => {
    try {
      await axios.post('/sections/chat', { section, message: '✔ Raise hand' });
      fetchChat();
      alert('Raise hand sent.');
    } catch (err) {
      console.error(err);
    }
  };

  const watchVideo = async (material) => {
    if (examLock) {
      alert('Exam is locked due to policy violation. Contact administrator.');
      return;
    }
    try {
      await axios.post(`/sections/materials/${material.id}/watch`);
      setActiveVideo(material);
      setWarning('Video in fullscreen. Please do not switch windows while watching.');
      if (videoAreaRef.current && videoAreaRef.current.requestFullscreen) {
        videoAreaRef.current.requestFullscreen().catch(() => {});
      }
    } catch (err) {
      console.error(err);
      alert('Unable to record video watch.');
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Section Learning</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Welcome {user.username || 'Guest'} ({user.role || 'N/A'})</Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        Exam Mode: 1) AI assistance disabled by policy 2) Copy/paste blocked 3) Window switch, ESC, screen-share triggers lock.
      </Alert>
      {examLock && <Alert severity="error" sx={{ mb: 2 }}>Exam locked due to violation. Contact faculty immediately.</Alert>}
      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <TextField label="Section" value={section} onChange={(e) => setSection(e.target.value)} size="small" />
        <Button variant="contained" onClick={() => { localStorage.setItem('section', section); fetchMaterials(); fetchLive(); fetchChat(); }}>Refresh</Button>
      </Box>

      {['FACULTY', 'PRINCIPAL'].includes(user.role) && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">Schedule Live Class</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 2 }}>
              <TextField label="Title" value={newLive.title} onChange={(e) => setNewLive({ ...newLive, title: e.target.value })} />
              <TextField label="Section" value={newLive.section} onChange={(e) => { setNewLive({ ...newLive, section: e.target.value }); setSection(e.target.value); }} />
              <TextField type="datetime-local" label="Date & Time" InputLabelProps={{ shrink: true }} value={newLive.scheduledAt} onChange={(e) => setNewLive({ ...newLive, scheduledAt: e.target.value })} />
              <TextField label="Meeting Link" value={newLive.meetingLink} onChange={(e) => setNewLive({ ...newLive, meetingLink: e.target.value })} />
              <TextField label="Description" fullWidth multiline minRows={2} value={newLive.description} onChange={(e) => setNewLive({ ...newLive, description: e.target.value })} sx={{ gridColumn: '1 / span 2' }} />
            </Box>
            <Button variant="contained" sx={{ mt: 2 }} onClick={scheduleLiveClass}>Schedule</Button>
          </CardContent>
        </Card>
      )}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Live Classes</Typography>
          <List>
            {live.length === 0 ? <Typography>No live classes scheduled.</Typography> : live.map((item) => (
              <ListItem key={item.id} secondaryAction={
                <Button variant="contained" color="primary" onClick={() => setActiveMeeting(item.meetingLink || `maniedutech-live-${item.id}`)}>
                  Join Active Class
                </Button>
              }>
                <ListItemText primary={item.title} secondary={`${new Date(item.scheduledAt).toLocaleString()} • ${item.description || 'No description'}`} />
              </ListItem>
            ))}
          </List>
          
          {activeMeeting && (
            <Box sx={{ mt: 3, p: 2, border: '1px solid #ddd', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" color="secondary">🟢 Live Video & Voice Call</Typography>
                <Button variant="outlined" color="error" onClick={() => setActiveMeeting(null)}>Leave Class</Button>
              </Stack>
              <Box sx={{ width: '100%', height: '500px', backgroundColor: '#000', borderRadius: 2, overflow: 'hidden' }}>
                <iframe 
                  src={`https://meet.jit.si/${encodeURIComponent(activeMeeting)}`}
                  allow="camera; microphone; fullscreen; display-capture; autoplay"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="Live Class Video"
                />
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Class Chat</Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Button variant="outlined" color="info" onClick={raiseHand}>✋ Raise Hand</Button>
            <Button variant="outlined" color="success" onClick={() => setActiveMeeting(`maniedutech-voice-${section}`)}>📞 Join Voice Room</Button>
          </Stack>
          <List sx={{ maxHeight: 200, overflow: 'auto', mb: 2, border: '1px solid #eee', borderRadius: 1, p: 1 }}>
            {chatLog.map((msg) => (
              <ListItem key={msg.id}>
                <ListItemText primary={`${msg.sender} (${msg.role})`} secondary={msg.message} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField fullWidth value={chat} onChange={(e) => setChat(e.target.value)} placeholder="Type message" />
            <Button variant="contained" onClick={sendMessage}>Send</Button>
          </Box>
        </CardContent>
      </Card>

      {warning && <Alert severity="warning" sx={{ mb: 2 }}>{warning}</Alert>}
      {activeVideo && (
        <Card sx={{ mb: 2 }} ref={videoAreaRef}>
          <CardContent>
            <Typography variant="h6">Watching: {activeVideo.title}</Typography>
            <Box sx={{ mt: 1, position: 'relative', width: '100%', height: 0, paddingBottom: '56.25%' }}>
              <iframe
                src={activeVideo.contentUrl}
                title={activeVideo.title}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                allow="autoplay; fullscreen; camera; microphone"
              />
            </Box>
            {switchCount > 0 && <Typography color="error" sx={{ mt: 2 }}>Window switch detected {switchCount} times. Repeated switches may lead to temporary lock by admin.</Typography>}
          </CardContent>
        </Card>
      )}
      <Card>
        <CardContent>
          <Typography variant="h6">Materials</Typography>
          <List>
            {materials.length === 0 ? <Typography>No materials.</Typography> : materials.map((m) => (
              <ListItem key={m.id} sx={{ justifyContent: 'space-between' }}>
                <ListItemText primary={`${m.materialType}: ${m.title}`} secondary={m.contentUrl || m.description || 'No URL'} />
                {m.materialType === 'VIDEO' ? (
                  <Button variant="outlined" size="small" onClick={() => watchVideo(m)}>
                    Watch Video
                  </Button>
                ) : null}
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SectionLearning;
