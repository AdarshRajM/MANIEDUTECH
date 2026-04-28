import React from 'react';
import { Container, Typography, Grid, Paper, Button, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Assignment, Create, CameraAlt } from '@mui/icons-material';
import { motion } from 'framer-motion';

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
        {mockTests.map((test, index) => (
          <Grid item xs={12} md={4} key={test.id}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', background: 'linear-gradient(145deg, #ffffff, #f0f0f0)' }}>
                <Box sx={{ mb: 2, color: 'primary.main', '& > svg': { fontSize: 50 } }}>
                  {test.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{test.title}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
                  <Chip label={test.type} size="small" color="secondary" />
                  <Chip label={test.duration} size="small" variant="outlined" />
                </Box>
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={() => navigate(`/tests/active/${test.id}?type=${test.type}`)}
                  sx={{ borderRadius: 8, textTransform: 'none', fontWeight: 'bold' }}
                >
                  Start Secure Test
                </Button>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TestPortal;
