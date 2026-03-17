import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
          sx={{ mt: 3, mb: 2 }}
          onClick={handleLogin}
        >
          Sign In
        </Button>
      </Box>
    </Container>
  );
};

export default Login;