import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Card, CardContent, TextField, Button, Box, List, ListItem, ListItemText, Stack } from '@mui/material';
import axios from 'axios';

const SectionLearning = () => {
  const [user, setUser] = useState({ username: '', role: '' });
  const [section, setSection] = useState(localStorage.getItem('section') || 'A');
  const [materials, setMaterials] = useState([]);
  const [live, setLive] = useState([]);
  const [chat, setChat] = useState('');
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

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Section Learning</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Welcome {user.username || 'Guest'} ({user.role || 'N/A'})</Typography>
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

      <Card>
        <CardContent>
          <Typography variant="h6">Materials</Typography>
          <List>
            {materials.length === 0 ? <Typography>No materials.</Typography> : materials.map((m) => (
              <ListItem key={m.id}>
                <ListItemText primary={`${m.materialType}: ${m.title}`} secondary={m.contentUrl || m.description || 'No URL'} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SectionLearning;
