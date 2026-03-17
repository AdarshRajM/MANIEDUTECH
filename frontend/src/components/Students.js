import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Pagination, CircularProgress } from '@mui/material';
import axios from 'axios';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', registrationNumber: '', section: '', rollNumber: '', courseId: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [page, searchQuery]);

  const fetchStudents = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const url = searchQuery ? `/students/search?query=${searchQuery}&page=${page}&size=10` : `/students/paged?page=${page}&size=10`;
    try {
      const response = await axios.get(url, config);
      setStudents(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      alert('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post('/students', form, config);
      setOpen(false);
      setForm({ name: '', registrationNumber: '', section: '', rollNumber: '', courseId: '' });
      fetchStudents();
    } catch (error) {
      alert('Failed to add student');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Students</Typography>
      <TextField label="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      <Button variant="contained" onClick={() => setOpen(true)}>Add Student</Button>
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Registration Number</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Roll Number</TableCell>
                <TableCell>Course</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.registrationNumber}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>{student.courseName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Pagination count={totalPages} page={page + 1} onChange={(e, p) => setPage(p - 1)} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Student</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="dense" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="Registration Number" fullWidth margin="dense" value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} />
          <TextField label="Section" fullWidth margin="dense" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} />
          <TextField label="Roll Number" fullWidth margin="dense" value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} />
          <TextField label="Course ID" fullWidth margin="dense" value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Students;