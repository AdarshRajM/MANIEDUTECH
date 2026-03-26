import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Forgot Password States
  const [forgotDialogOpen, setForgotDialogOpen] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role || 'STUDENT');
      localStorage.setItem('username', response.data.username || username);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      window.location.href = '/dashboard';
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  const handleForgotSendOtp = async () => {
    try {
      await axios.post('/auth/forgot-password/send-otp', { username: forgotUsername });
      setForgotOtpSent(true);
      alert('OTP sent to backend console (mocked)');
    } catch (error) {
      alert('Failed to send OTP: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleForgotReset = async () => {
    try {
      await axios.post('/auth/forgot-password/reset', { 
        username: forgotUsername, 
        otp: forgotOtp, 
        newPassword: newPassword 
      });
      alert('Password reset successfully! Please login with your new password.');
      setForgotDialogOpen(false);
      setForgotOtpSent(false);
      setForgotUsername('');
      setForgotOtp('');
      setNewPassword('');
    } catch (error) {
      alert('Password reset failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Tip: use seeded default user: Username: "Adarsh Raj", Password: "Mani789" if you do not have an account yet.
        </Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 1 }}
          onClick={handleLogin}
        >
          Sign In
        </Button>
        <Button 
          fullWidth 
          color="secondary" 
          onClick={() => setForgotDialogOpen(true)}
        >
          Forgot Password?
        </Button>
      </Box>

      <Dialog open={forgotDialogOpen} onClose={() => setForgotDialogOpen(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          {!forgotOtpSent ? (
            <>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Enter your username. We will send an OTP to your registered email/phone (mocked to server console).
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                label="Username"
                fullWidth
                value={forgotUsername}
                onChange={(e) => setForgotUsername(e.target.value)}
              />
            </>
          ) : (
            <>
              <TextField
                margin="dense"
                label="Enter OTP"
                fullWidth
                value={forgotOtp}
                onChange={(e) => setForgotOtp(e.target.value)}
              />
              <TextField
                margin="dense"
                label="New Password"
                type="password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForgotDialogOpen(false)}>Cancel</Button>
          {!forgotOtpSent ? (
            <Button onClick={handleForgotSendOtp} variant="contained" color="secondary">
              Send OTP
            </Button>
          ) : (
            <Button onClick={handleForgotReset} variant="contained" color="primary">
              Verify & Reset
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login;