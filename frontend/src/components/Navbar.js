import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" onClick={() => navigate(-1)}>Back</Button>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">MANI-EDUTECH</Button>
        </Typography>
        {!role && (<><Button color="inherit" component={Link} to="/signup">Signup</Button>
        <Button color="inherit" component={Link} to="/login">Login</Button></>)}
        {role && (
          <>
            <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
            <Button color="inherit" component={Link} to="/courses">Courses</Button>
            <Button color="inherit" component={Link} to="/section">Section</Button>
            <Button color="inherit" component={Link} to="/products">Store</Button>
            <Button color="inherit" component={Link} to="/wishlist">Wishlist</Button>
            <Button color="inherit" component={Link} to="/coupons">Coupons</Button>
          </>
        )}
        <Button color="inherit" component={Link} to="/chatbot">Chatbot</Button>
        {(role === 'FACULTY' || role === 'PRINCIPAL') && (
          <Button color="inherit" component={Link} to="/faculty">Faculty</Button>
        )}
        {(role === 'PRINCIPAL' || role === 'FACULTY') && (
          <Button color="inherit" component={Link} to="/management">Management</Button>
        )}
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;