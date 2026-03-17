import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Button } from '@mui/material';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Courses from './components/Courses';
import Marks from './components/Marks';
import Navbar from './components/Navbar';
import Management from './components/Management';
import Products from './components/Products';
import Wishlist from './components/Wishlist';
import Coupons from './components/Coupons';
import Chatbot from './components/Chatbot';
import SectionLearning from './components/SectionLearning';
import FacultyPortal from './components/FacultyPortal';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8081';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/marks" element={<Marks />} />
          <Route path="/management" element={<Management />} />
          <Route path="/products" element={<Products />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/section" element={<SectionLearning />} />
          <Route path="/faculty" element={<FacultyPortal />} />
        </Routes>
      </Router>
      <Button variant="contained" sx={{ position: 'fixed', bottom: 18, right: 18, borderRadius: '50%', minWidth: '64px', minHeight: '64px' }} onClick={() => window.location.href = '/chatbot'}>
        💬
      </Button>
    </ThemeProvider>
  );
}

export default App;