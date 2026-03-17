import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, TextField, Button, Box, List, ListItem, ListItemText, Stack, Divider } from '@mui/material';
import axios from 'axios';

const SectionLearning = () => {
  const [section, setSection] = useState(localStorage.getItem('section') || 'A');
  const [materials, setMaterials] = useState([]);
  const [live, setLive] = useState([]);
  const [chat, setChat] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [user, setUser] = useState({ username: '', role: '' });
  const [newLive, setNewLive] = useState({ title: '', scheduledAt: '', meetingLink: '', description: '', section });

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/auth/me');
      setUser({ username: res.data.username, role: res.data.role });
    } catch (err) {
      console.error('Cannot fetch profile', err);
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(`/sections/materials/section/${section}`);
      setMaterials(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLive = async () => {
    try {
      const res = await axios.get(`/sections/live/${section}`);
      setLive(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChat = async () => {
    try {
      const res = await axios.get(`/sections/chat/${section}`);
      setChatLog(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchMaterials();
    fetchLive();
    fetchChat();
  }, [section]);

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
        description: newLive.description
      });
      setNewLive({ ...newLive, title: '', scheduledAt: '', meetingLink: '', description: '' });
      fetchLive();
      alert('Live class scheduled. Students will see it in section view.');
    } catch (err) {
      console.error(err);
      alert('Could not schedule live class.');
    }
  };

  const sendMessage = async () => {
    if (!chat) return;
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
      await axios.post('/sections/chat', { section, message: '✋ Raise hand' });
      fetchChat();
      alert('Raise hand sent to class chat.');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Section Learning Hub</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Welcome {user.username}. Role: {user.role || 'Guest'}</Typography>
      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <TextField label="Section" value={section} onChange={(e) => setSection(e.target.value)} size="small" />
        <Button variant="contained" onClick={() => { localStorage.setItem('section', section); fetchMaterials(); fetchLive(); fetchChat(); }}>Refresh Section</Button>
      </Box>

      {['FACULTY', 'PRINCIPAL'].includes(user.role) && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">Schedule New Live Class (Faculty/Principal)</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 2 }}>
              <TextField label="Title" value={newLive.title} onChange={(e) => setNewLive({ ...newLive, title: e.target.value })} />
              <TextField label="Section" value={newLive.section} onChange={(e) => { setNewLive({ ...newLive, section: e.target.value }); setSection(e.target.value); }} />
              <TextField type="datetime-local" label="Date & Time" InputLabelProps={{ shrink: true }} value={newLive.scheduledAt} onChange={(e) => setNewLive({ ...newLive, scheduledAt: e.target.value })} />
              <TextField label="Meeting Link" value={newLive.meetingLink} onChange={(e) => setNewLive({ ...newLive, meetingLink: e.target.value })} />
              <TextField label="Description" value={newLive.description} onChange={(e) => setNewLive({ ...newLive, description: e.target.value })} fullWidth multiline minRows={2} sx={{ gridColumn: '1 / span 2' }} />
            </Box>
            <Button variant="contained" sx={{ mt: 2 }} onClick={scheduleLiveClass}>Schedule Live Class</Button>
          </CardContent>
        </Card>
      )}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">Live Classes for Section {section}</Typography>
          <List>
            {live.length === 0 && <Typography>No live class scheduled.</Typography>}
            {live.map((s) => (
              <ListItem key={s.id} secondaryAction={<Button onClick={() => window.open(s.meetingLink, '_blank')}>Join</Button>}>
                <ListItemText
                  primary={`${s.title} — ${new Date(s.scheduledAt).toLocaleString()}`}
                  secondary={`By ${s.facultyUsername ?? 'Instructor'} • ${s.description || 'No description'} • Link: ${s.meetingLink || 'None'}`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Class Chat + Quick Actions</Typography>
            <Button variant="outlined" onClick={raiseHand}>✋ Raise Hand</Button>
            <Button variant="outlined" onClick={() => alert('Voice feature coming soon')}>🎤 Voice Talk</Button>
          </Stack>
          <List sx={{ maxHeight: 200, overflow: 'auto', mb: 1 }}>
            {chatLog.map((msg) => (
              <ListItem key={msg.id}>
                <ListItemText primary={`${msg.sender} (${msg.role})`} secondary={msg.message} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField fullWidth value={chat} onChange={(e) => setChat(e.target.value)} placeholder="Type your message" />
            <Button variant="contained" onClick={sendMessage}>Send</Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">Section Materials</Typography>
          <List>
            {materials.length === 0 && <Typography>No materials yet.</Typography>}
            {materials.map((m) => (
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
