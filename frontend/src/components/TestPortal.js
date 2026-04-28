import React from 'react';
import { Container, Typography, Grid, Paper, Button, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Assignment, Create, CameraAlt } from '@mui/icons-material';

const TestPortal = () => {
  const navigate = useNavigate();

  const mockTests = [
    { id: 1, title: 'Mid-Term MCQ Exam', type: 'MCQ', duration: '60 mins', icon: <Assignment /> },
    { id: 2, title: 'DSA Written Test', type: 'WRITTEN', duration: '90 mins', icon: <Create /> },
    { id: 3, title: 'Physics Hand-written Upload', type: 'PHOTO_UPLOAD', duration: '120 mins', icon: <CameraAlt /> }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Proctored Test Portal</Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Select a test below to begin. Ensure your camera and microphone are working. Tests run in a secure, full-screen environment.
      </Typography>

      <Grid container spacing={3}>
        {mockTests.map(test => (
          <Grid item xs={12} md={4} key={test.id}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3, boxShadow: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
              <Box sx={{ mb: 2, color: 'primary.main' }}>
                {test.icon}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{test.title}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Chip label={test.type} size="small" color="secondary" />
                <Chip label={test.duration} size="small" variant="outlined" />
              </Box>
              <Button 
                variant="contained" 
                fullWidth 
                onClick={() => navigate(`/tests/active/${test.id}?type=${test.type}`)}
              >
                Start Test
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TestPortal;
