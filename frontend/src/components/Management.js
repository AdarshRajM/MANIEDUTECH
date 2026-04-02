import React, { useState } from 'react';
import { Container, Typography, Box, Grid, TextField, Button, Paper, Alert } from '@mui/material';
import axios from 'axios';

const Management = () => {
  const [course, setCourse] = useState({ courseName: '', description: '', price: '' });
  const [product, setProduct] = useState({ name: '', category: '', description: '', price: '', offerPrice: '' });
  const [marks, setMarks] = useState({ studentId: '', courseId: '', marks: '', grade: '' });
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

  const handleAddProduct = async () => {
    try {
      await axios.post('/products', {
        ...product,
        price: parseFloat(product.price) || 0,
        offerPrice: parseFloat(product.offerPrice) || 0
      });
      setMessage('Product added successfully.');
      setProduct({ name: '', category: '', description: '', price: '', offerPrice: '' });
    } catch (error) {
      setMessage('Failed to add product: ' + (error.response?.data?.message || error.message));
    }
  };

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Management Dashboard</Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Add Courses, Products (book/test material), and student marks from a single admin panel.
      </Typography>
      {message && <Alert severity="info" sx={{ mb: 2 }} onClose={() => setMessage('')}>{message}</Alert>}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Add New Course</Typography>
            <TextField fullWidth label="Course Name" margin="dense" value={course.courseName} onChange={(e) => setCourse({ ...course, courseName: e.target.value })} />
            <TextField fullWidth label="Description" margin="dense" value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} />
            <TextField fullWidth label="Price" margin="dense" value={course.price} onChange={(e) => setCourse({ ...course, price: e.target.value })} />
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddCourse}>Save Course</Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Add New Product / Study Material</Typography>
            <TextField fullWidth label="Name" margin="dense" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
            <TextField fullWidth label="Category" margin="dense" value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })} />
            <TextField fullWidth label="Description" margin="dense" value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
            <TextField fullWidth label="Price" margin="dense" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} />
            <TextField fullWidth label="Offer Price" margin="dense" value={product.offerPrice} onChange={(e) => setProduct({ ...product, offerPrice: e.target.value })} />
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddProduct}>Save Product</Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Update Student Marks</Typography>
            <TextField fullWidth label="Student ID" margin="dense" value={marks.studentId} onChange={(e) => setMarks({ ...marks, studentId: e.target.value })} />
            <TextField fullWidth label="Course ID" margin="dense" value={marks.courseId} onChange={(e) => setMarks({ ...marks, courseId: e.target.value })} />
            <TextField fullWidth label="Marks" margin="dense" value={marks.marks} onChange={(e) => setMarks({ ...marks, marks: e.target.value })} />
            <TextField fullWidth label="Grade" margin="dense" value={marks.grade} onChange={(e) => setMarks({ ...marks, grade: e.target.value })} />
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddMarks}>Update Marks</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Platform Announcements</Typography>
            <TextField fullWidth label="Announcement Text" margin="dense" multiline rows={3} id="announcementInput" />
            <Button variant="contained" sx={{ mt: 2 }} color="warning" onClick={() => {
              const text = document.getElementById('announcementInput').value;
              if (text.trim()) {
                const ads = JSON.parse(localStorage.getItem('platform_ads') || '[]');
                ads.push({ id: Date.now(), text, active: true });
                localStorage.setItem('platform_ads', JSON.stringify(ads));
                setMessage('Announcement broadcasted to Home page!');
                document.getElementById('announcementInput').value = '';
              }
            }}>Broadcast to Home</Button>
            <Button variant="outlined" sx={{ mt: 2, ml: 1 }} color="error" onClick={() => {
              localStorage.removeItem('platform_ads');
              setMessage('All announcements cleared.');
            }}>Clear All</Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Management;
