import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Pagination, CircularProgress } from '@mui/material';
import axios from 'axios';

const Marks = () => {
  const [marks, setMarks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ studentId: '', courseId: '', marks: '', grade: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMarks();
  }, [page]);

  const fetchMarks = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const response = await axios.get(`/marks?page=${page}&size=10`, config);
      setMarks(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      alert('Failed to fetch marks');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post('/marks', null, { ...config, params: form });
      setOpen(false);
      setForm({ studentId: '', courseId: '', marks: '', grade: '' });
      fetchMarks();
    } catch (error) {
      alert('Failed to add marks');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Marks</Typography>
      <Button variant="contained" onClick={() => setOpen(true)}>Add Marks</Button>
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Marks</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Faculty</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {marks.map((mark) => (
                <TableRow key={mark.id}>
                  <TableCell>{mark.student.name}</TableCell>
                  <TableCell>{mark.course.courseName}</TableCell>
                  <TableCell>{mark.marks}</TableCell>
                  <TableCell>{mark.grade}</TableCell>
                  <TableCell>{mark.faculty.username}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Pagination count={totalPages} page={page + 1} onChange={(e, p) => setPage(p - 1)} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Marks</DialogTitle>
        <DialogContent>
          <TextField label="Student ID" fullWidth margin="dense" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} />
          <TextField label="Course ID" fullWidth margin="dense" value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} />
          <TextField label="Marks" fullWidth margin="dense" value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })} />
          <TextField label="Grade" fullWidth margin="dense" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Marks;