import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password States
  const [forgotDialogOpen, setForgotDialogOpen] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Captcha States
  const [captchaText, setCaptchaText] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCorrectPos, setCaptchaCorrectPos] = useState(0);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaText(`${num1} + ${num2} = ?`);
    setCaptchaCorrectPos(num1 + num2);
    setCaptchaInput('');
  };

  const handleLogin = async () => {
    if (parseInt(captchaInput) !== captchaCorrectPos) {
      alert("Incorrect CAPTCHA answer!");
      generateCaptcha();
      return;
    }
    setIsLoading(true);
    let attempt = 0;
    while (attempt < 3) {
      try {
        const response = await axios.post('/auth/login', { username, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role || 'STUDENT');
        localStorage.setItem('username', response.data.username || username);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        window.location.href = '/dashboard';
        return;
      } catch (error) {
        attempt += 1;
        if (attempt >= 3) {
          const message = error.response?.data?.message || error.message || 'Unknown error';
          if (!window.navigator.onLine) {
            alert('Network issue detected: please check your internet connection and retry.');
          } else {
            alert('Login failed: ' + message);
          }
          setIsLoading(false);
          return;
        }
        await new Promise((r) => setTimeout(r, 700));
      }
    }
    setIsLoading(false);
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
    <Container maxWidth="sm" sx={{ mt: 6, p: 3, borderRadius: 3, boxShadow: 4, background: 'linear-gradient(135deg, #F1F8FF 0%, #E8F7F3 100%)' }}>
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
        
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2 }}>
           <Typography variant="h6" sx={{ backgroundColor: '#f0f0f0', p: 1, borderRadius: 1, letterSpacing: 2, mr: 2, userSelect: 'none' }}>
             {captchaText}
           </Typography>
           <TextField
             required
             label="Captcha Verify"
             size="small"
             value={captchaInput}
             onChange={(e) => setCaptchaInput(e.target.value)}
             sx={{ flexGrow: 1 }}
           />
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 1 }}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
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