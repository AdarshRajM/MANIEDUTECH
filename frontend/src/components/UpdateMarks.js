import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Alert, Grid } from '@mui/material';
import axios from 'axios';

const UpdateMarks = () => {
  const [marks, setMarks] = useState({ studentId: '', courseId: '', marks: '', grade: '' });
  const [message, setMessage] = useState('');

  const handleAddMarks = async () => {
    try {
      await axios.post('/marks', null, {
        params: {
          studentId: marks.studentId,
          courseId: marks.courseId,
          marks: parseFloat(marks.marks),
          grade: marks.grade
        }
      });
      setMessage('Marks updated successfully.');
      setMarks({ studentId: '', courseId: '', marks: '', grade: '' });
    } catch (error) {
      setMessage('Failed to update marks: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Update Student Marks</Typography>
        {message && <Alert severity="info" sx={{ mb: 3 }} onClose={() => setMessage('')}>{message}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Student ID" margin="normal" value={marks.studentId} onChange={(e) => setMarks({ ...marks, studentId: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Course ID" margin="normal" value={marks.courseId} onChange={(e) => setMarks({ ...marks, courseId: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Marks" margin="normal" value={marks.marks} onChange={(e) => setMarks({ ...marks, marks: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Grade" margin="normal" value={marks.grade} onChange={(e) => setMarks({ ...marks, grade: e.target.value })} />
          </Grid>
        </Grid>
        <Button variant="contained" color="success" size="large" sx={{ mt: 3 }} onClick={handleAddMarks}>Update Marks</Button>
      </Paper>
    </Container>
  );
};

export default UpdateMarks;
