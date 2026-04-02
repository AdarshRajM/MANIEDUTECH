import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ username: '', password: '', role: 'STUDENT', email: '', contactNumber: '', otp: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState({ email: false, contact: false });
  const [emailOtp, setEmailOtp] = useState('');
  const [contactOtp, setContactOtp] = useState('');
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

  const handleSendEmailOtp = async () => {
    if (!form.username) {
      alert('Please enter username first.');
      return;
    }
    try {
      await axios.post('/auth/verify/email/send-otp', { username: form.username });
      alert('Email OTP sent (mocked in backend).');
    } catch (error) {
      alert('Failed to send email OTP: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  const handleSendContactOtp = async () => {
    if (!form.username) {
      alert('Please enter username first.');
      return;
    }
    try {
      await axios.post('/auth/verify/contact/send-otp', { username: form.username });
      alert('Contact OTP sent (mocked in backend).');
    } catch (error) {
      alert('Failed to send contact OTP: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  const handleVerifyEmail = async () => {
    if (!form.username || !emailOtp) {
      alert('Enter username and email OTP.');
      return;
    }
    try {
      await axios.post('/auth/verify/email', { username: form.username, otp: emailOtp });
      setVerifyStatus((prev) => ({ ...prev, email: true }));
      alert('Email verified.');
    } catch (error) {
      alert('Email verification failed: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  const handleVerifyContact = async () => {
    if (!form.username || !contactOtp) {
      alert('Enter username and contact OTP.');
      return;
    }
    try {
      await axios.post('/auth/verify/contact', { username: form.username, otp: contactOtp });
      setVerifyStatus((prev) => ({ ...prev, contact: true }));
      alert('Contact number verified.');
    } catch (error) {
      alert('Contact verification failed: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  const handleSignup = async () => {
    if (!verifyStatus.email || !verifyStatus.contact) {
      alert('Please verify both email and contact number before signing up.');
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
    <Container maxWidth="sm" sx={{ mt: 6, p: 3, borderRadius: 3, boxShadow: 4, background: 'linear-gradient(135deg, #F3E8FF 0%, #FFF3E8 100%)' }}>
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email ID"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Stack direction="row" spacing={2} sx={{ width: '100%', mt: 2, mb: 1 }} alignItems="center">
          <TextField
            required
            fullWidth
            label="Contact Number"
            type="tel"
            value={form.contactNumber}
            onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
          />
        </Stack>
        
        {form.email.trim().length > 0 && form.contactNumber.trim().length > 0 && (
          <Box sx={{ width: '100%', mb: 1 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <Button variant="contained" onClick={handleSendEmailOtp} disabled={verifyStatus.email}>Send Email Verify OTP</Button>
              <TextField
                fullWidth
                label="Email OTP"
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value)}
              />
              <Button variant="outlined" onClick={handleVerifyEmail} disabled={verifyStatus.email}>Verify Email</Button>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <Button variant="contained" onClick={handleSendContactOtp} disabled={verifyStatus.contact}>Send SMS Verify OTP</Button>
              <TextField
                fullWidth
                label="Contact OTP"
                value={contactOtp}
                onChange={(e) => setContactOtp(e.target.value)}
              />
              <Button variant="outlined" onClick={handleVerifyContact} disabled={verifyStatus.contact}>Verify Contact</Button>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Verified: Email: {verifyStatus.email ? '✅' : '❌'}, Contact: {verifyStatus.contact ? '✅' : '❌'}
            </Typography>
          </Box>
        )}

        <FormControl fullWidth margin="normal">
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

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleSignup}
        >
          Sign Up
        </Button>
        <Button onClick={() => navigate('/login')}>Already have an account? Login</Button>
      </Box>
    </Container>
  );
};

export default Signup;