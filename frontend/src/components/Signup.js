import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ username: '', password: '', role: 'STUDENT', email: '', contactNumber: '', otp: '' });
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!form.username || !form.email || !form.contactNumber) {
      alert("Please fill username, email, and contact number before sending OTP");
      return;
    }
    try {
      await axios.post('/auth/signup/send-otp', { username: form.username });
      setOtpSent(true);
      alert('OTP sent to backend console (mocked)');
    } catch (error) {
      alert('Failed to send OTP: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  const handleSignup = async () => {
    if (!form.otp) {
      alert("Please enter the OTP");
      return;
    }
    try {
      await axios.post('/auth/signup', form);
      localStorage.setItem('role', form.role);
      localStorage.setItem('username', form.username);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (error) {
      alert('Signup failed: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          disabled={otpSent}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email ID"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          disabled={otpSent}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Contact Number"
          type="tel"
          value={form.contactNumber}
          onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
          disabled={otpSent}
        />
        <FormControl fullWidth margin="normal" disabled={otpSent}>
          <InputLabel>Role</InputLabel>
          <Select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <MenuItem value="STUDENT">Student</MenuItem>
            <MenuItem value="FACULTY">Faculty</MenuItem>
            <MenuItem value="PRINCIPAL">Principal</MenuItem>
          </Select>
        </FormControl>

        {!otpSent ? (
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSendOtp}
          >
            Send OTP
          </Button>
        ) : (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Enter OTP"
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value })}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSignup}
            >
              Verify & Sign Up
            </Button>
          </>
        )}
        <Button onClick={() => navigate('/login')}>Already have an account? Login</Button>
      </Box>
    </Container>
  );
};

export default Signup;