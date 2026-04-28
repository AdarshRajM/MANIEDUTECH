import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Alert, Divider } from '@mui/material';
import axios from 'axios';

const ScheduleLiveClass = () => {
  const [liveTitle, setLiveTitle] = useState('');
  const [section, setSection] = useState('A');
  const [liveTime, setLiveTime] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const [message, setMessage] = useState('');

  const scheduleLive = async () => {
    try {
      await axios.post('/sections/live', { title: liveTitle, section, scheduledAt: liveTime, meetingLink: meetLink, description: 'Live class' });
      setMessage('Live class scheduled successfully.');
      setLiveTitle('');
      setSection('A');
      setLiveTime('');
      setMeetLink('');
    } catch (e) {
      setMessage('Live scheduling failed: ' + (e.response?.data?.message || e.message));
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Schedule Live Class</Typography>
        {message && <Alert severity="info" sx={{ mb: 3 }} onClose={() => setMessage('')}>{message}</Alert>}
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
            Set up a live class for your section and provide the meeting link.
          </Typography>
          <TextField fullWidth label="Live Class Title" value={liveTitle} onChange={(e) => setLiveTitle(e.target.value)} sx={{ my: 1 }} />
          <TextField fullWidth label="Section" value={section} onChange={(e) => setSection(e.target.value)} sx={{ my: 1 }} />
          <TextField fullWidth label="Date/Time (ISO)" placeholder="e.g. 2026-05-01T10:00:00Z" value={liveTime} onChange={(e) => setLiveTime(e.target.value)} sx={{ my: 1 }} />
          <TextField fullWidth label="Meeting Link (GMeet / Zoom)" value={meetLink} onChange={(e) => setMeetLink(e.target.value)} sx={{ my: 1 }} />
          <Button variant="contained" color="primary" onClick={scheduleLive} sx={{ mt: 2 }}>Schedule</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ScheduleLiveClass;
