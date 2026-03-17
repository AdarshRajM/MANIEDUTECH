import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Pagination, CircularProgress, Box } from '@mui/material';
import axios from 'axios';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [coupon, setCoupon] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (role === 'STUDENT') {
      fetchEnrollments();
    } else {
      fetchCourses();
    }
  }, [page, role]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/courses/paged?page=${page}&size=10`);
      setCourses(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      alert('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const user = username || 'guest';
      const res = await axios.get(`/enrollments/my?registrationNumber=${user}`);
      setEnrollments(res.data);
    } catch (error) {
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post('/courses', { courseName, description, price: parseFloat(price) || 0 });
      setOpen(false);
      setCourseName('');
      setDescription('');
      setPrice('');
      fetchCourses();
    } catch (error) {
      alert('Failed to add course');
    }
  };

  const applyCoupon = async () => {
    try {
      const res = await axios.get(`/offers/apply/${coupon}`);
      setCouponMessage(`Valid: ${res.data.code} gives ${res.data.discountPercent}% on ${res.data.category}`);
    } catch (error) {
      setCouponMessage('Coupon invalid or expired');
    }
  };

  const enrollCourse = async (courseId) => {
    try {
      const user = localStorage.getItem('username');
      const studentRes = await axios.get(`/students/registration/${user}`);
      const student = studentRes.data;
      await axios.post('/enrollments', null, { params: { studentId: student.id, courseId } });
      alert('Enrolled successfully');
      fetchEnrollments();
    } catch (err) {
      alert('Enrollment failed');
    }
  };

  const visibleCourses = role === 'STUDENT' ? enrollments.map((e) => e.course || e) : courses;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Courses</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {role !== 'STUDENT' && <Button variant="contained" onClick={() => setOpen(true)}>Add Course</Button>}
        <TextField label="Coupon code" size="small" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
        <Button variant="outlined" onClick={applyCoupon}>Apply Coupon</Button>
      </Box>
      {couponMessage && <Typography sx={{ mb: 2, color: 'green' }}>{couponMessage}</Typography>}
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Course Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.id}</TableCell>
                  <TableCell>{course.courseName}</TableCell>
                  <TableCell>{course.description || '-'}</TableCell>
                  <TableCell>?{course.price ?? 0}</TableCell>
                  <TableCell>
                    {role === 'STUDENT' ? (
                      <Button variant="outlined" size="small" onClick={() => enrollCourse(course.id)}>Re-enroll</Button>
                    ) : (
                      <Typography variant="caption">Faculty/Principal view</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {role !== 'STUDENT' && <Pagination count={totalPages} page={page + 1} onChange={(e, p) => setPage(p - 1)} />}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Course</DialogTitle>
        <DialogContent>
          <TextField label="Course Name" fullWidth margin="dense" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
          <TextField label="Description" fullWidth margin="dense" value={description} onChange={(e) => setDescription(e.target.value)} />
          <TextField label="Price" fullWidth margin="dense" value={price} onChange={(e) => setPrice(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Courses;
