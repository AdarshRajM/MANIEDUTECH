import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, MenuItem, Select, InputLabel, FormControl, Divider } from '@mui/material';
import axios from 'axios';

const FacultyPortal = () => {
  const [title, setTitle] = useState('');
  const [section, setSection] = useState('A');
  const [materialType, setMaterialType] = useState('VIDEO');
  const [contentUrl, setContentUrl] = useState('');
  const [description, setDescription] = useState('');
  const [liveTitle, setLiveTitle] = useState('');
  const [liveTime, setLiveTime] = useState('');
  const [meetLink, setMeetLink] = useState('');

  const createMaterial = async () => {
    try {
      await axios.post('/sections/materials', { title, description, section, materialType, contentUrl });
      alert('Material uploaded.');
    } catch (e) {
      alert('Upload failed.');
    }
  };

  const scheduleLive = async () => {
    try {
      await axios.post('/sections/live', { title: liveTitle, section, scheduledAt: liveTime, meetingLink: meetLink, description: 'Live class' });
      alert('Live class scheduled.');
    } catch (e) {
      alert('Live scheduling failed.');
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Faculty / Principal Portal</Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Upload Section Material</Typography>
        <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ my: 1 }} />
        <TextField fullWidth label="Description" value={description} onChange={(e) => setDescription(e.target.value)} sx={{ my: 1 }} />
        <TextField fullWidth label="Content URL" value={contentUrl} onChange={(e) => setContentUrl(e.target.value)} sx={{ my: 1 }} />
        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel>Material Type</InputLabel>
          <Select value={materialType} label="Material Type" onChange={(e) => setMaterialType(e.target.value)}>
            <MenuItem value="VIDEO">VIDEO</MenuItem>
            <MenuItem value="NOTE">NOTE</MenuItem>
            <MenuItem value="TEST">TEST</MenuItem>
          </Select>
        </FormControl>
        <TextField fullWidth label="Section" value={section} onChange={(e) => setSection(e.target.value)} sx={{ my: 1 }} />
        <Button variant="contained" onClick={createMaterial}>Upload Material</Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Schedule Live Class</Typography>
        <TextField fullWidth label="Live Class Title" value={liveTitle} onChange={(e) => setLiveTitle(e.target.value)} sx={{ my: 1 }} />
        <TextField fullWidth label="Section" value={section} onChange={(e) => setSection(e.target.value)} sx={{ my: 1 }} />
        <TextField fullWidth label="Date/Time (ISO)" value={liveTime} onChange={(e) => setLiveTime(e.target.value)} sx={{ my: 1 }} />
        <TextField fullWidth label="Meeting Link" value={meetLink} onChange={(e) => setMeetLink(e.target.value)} sx={{ my: 1 }} />
        <Button variant="contained" onClick={scheduleLive}>Schedule</Button>
      </Box>
    </Container>
  );
};

export default FacultyPortal;
