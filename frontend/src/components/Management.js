import React, { useState } from 'react';
import { Container, Typography, Box, Grid, TextField, Button, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Management = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Management Dashboard Hub</Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Navigate to specific management tasks below.
      </Typography>
      {message && <Alert severity="info" sx={{ mb: 2 }} onClose={() => setMessage('')}>{message}</Alert>}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#f0f8ff' } }} onClick={() => navigate('/management/add-course')}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Add Course</Typography>
            <Typography variant="body2" color="text.secondary">Create and manage new courses.</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#f0fff0' } }} onClick={() => navigate('/management/add-product')}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Add Product / Material</Typography>
            <Typography variant="body2" color="text.secondary">Add books, study materials, or test series.</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#fff0f5' } }} onClick={() => navigate('/management/update-marks')}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Update Marks</Typography>
            <Typography variant="body2" color="text.secondary">Update student grades and marks.</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Platform Announcements</Typography>
            <TextField fullWidth label="Announcement Text" margin="dense" multiline rows={3} id="announcementInput" />
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button variant="contained" color="warning" onClick={() => {
                const text = document.getElementById('announcementInput').value;
                if (text.trim()) {
                  const ads = JSON.parse(localStorage.getItem('platform_ads') || '[]');
                  ads.push({ id: Date.now(), text, active: true });
                  localStorage.setItem('platform_ads', JSON.stringify(ads));
                  setMessage('Announcement broadcasted to Home page!');
                  document.getElementById('announcementInput').value = '';
                }
              }}>Broadcast</Button>
              <Button variant="outlined" color="error" onClick={() => {
                localStorage.removeItem('platform_ads');
                setMessage('All announcements cleared.');
              }}>Clear</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Management;
