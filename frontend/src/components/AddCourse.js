import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import axios from 'axios';

const AddCourse = () => {
  const [course, setCourse] = useState({ courseName: '', description: '', price: '' });
  const [message, setMessage] = useState('');

  const handleAddCourse = async () => {
    try {
      await axios.post('/courses', { ...course, price: parseFloat(course.price) || 0.0 });
      setMessage('Course added successfully.');
      setCourse({ courseName: '', description: '', price: '' });
    } catch (error) {
      setMessage('Failed to add course: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Add New Course</Typography>
        {message && <Alert severity="info" sx={{ mb: 3 }} onClose={() => setMessage('')}>{message}</Alert>}
        <TextField fullWidth label="Course Name" margin="normal" value={course.courseName} onChange={(e) => setCourse({ ...course, courseName: e.target.value })} />
        <TextField fullWidth label="Description" margin="normal" multiline rows={4} value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} />
        <TextField fullWidth label="Price" margin="normal" value={course.price} onChange={(e) => setCourse({ ...course, price: e.target.value })} />
        <Button variant="contained" color="primary" size="large" sx={{ mt: 3 }} onClick={handleAddCourse}>Save Course</Button>
      </Paper>
    </Container>
  );
};

export default AddCourse;
