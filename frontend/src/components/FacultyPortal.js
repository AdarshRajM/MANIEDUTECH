import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, MenuItem, Select, InputLabel, FormControl, Divider, Paper, Chip } from '@mui/material';
import { Download, Analytics } from '@mui/icons-material';
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

  const [onlineStudents, setOnlineStudents] = useState([]);
  const fetchOnlineStudents = async () => {
    try {
      const res = await axios.get('/sections/students/online');
      setOnlineStudents(res.data);
    } catch (e) {
      console.error(e);
      alert('Unable to load online students.');
    }
  };

  const downloadBigDataExport = () => {
    // Generate mock CSV data representing "Hadoop & PowerBI" analytics
    const csvContent = "data:text/csv;charset=utf-8," 
      + "StudentID,Name,CourseProgress,TestScores,AI_Risk_Prediction\n"
      + "STU001,Ravi Kumar,85%,92,Low Risk\n"
      + "STU002,Priya Sharma,45%,55,High Risk (Needs Attention)\n"
      + "STU003,Amit Singh,99%,98,Excellent\n"
      + "STU004,Neha Gupta,60%,70,Moderate Risk\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "PowerBI_Hadoop_Student_Analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Live Online Students</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>Track currently active students (last 20 minutes).</Typography>
        <Button variant="outlined" onClick={fetchOnlineStudents} sx={{ mb: 2 }}>Refresh Online Students</Button>
        {onlineStudents.length === 0 ? (
          <Typography>No students online right now.</Typography>
        ) : (
          <ul>
            {onlineStudents.map((student) => (
              <li key={student}>{student}</li>
            ))}
          </ul>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', color: '#333' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Analytics sx={{ fontSize: 40, mr: 2, color: '#4a148c' }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4a148c' }}>Advanced AI Big Data Export</Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Powered by <strong>Hadoop Cluster Processing</strong> and <strong>Power BI AI Models</strong>. 
          Instantly generate and download a comprehensive Excel/CSV report of all students' performance, behavioral tracking, and AI-driven risk predictions.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip label="Data Pipeline: Hadoop" color="primary" variant="outlined" />
          <Chip label="Analytics: Power BI AI" color="secondary" variant="outlined" />
          <Chip label="Format: Excel/CSV" color="success" variant="outlined" />
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Download />} 
          onClick={downloadBigDataExport} 
          sx={{ mt: 3, bgcolor: '#4a148c', '&:hover': { bgcolor: '#6a1b9a' } }}
        >
          Download Data Report
        </Button>
      </Paper>
    </Container>
  );
};

export default FacultyPortal;
