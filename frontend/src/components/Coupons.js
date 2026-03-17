import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Box } from '@mui/material';
import axios from 'axios';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [category, setCategory] = useState('ALL');
  const [expires, setExpires] = useState('');

  const fetchCoupons = async () => {
    const res = await axios.get('/offers');
    setCoupons(res.data);
  };

  useEffect(() => { fetchCoupons(); }, []);

  const addCoupon = async () => {
    try {
      await axios.post('/offers', {
        code,
        discountPercent: parseFloat(discount),
        category,
        expiryDate: expires || null,
        active: true
      });
      setCode(''); setDiscount(''); setExpires('');
      fetchCoupons();
    } catch (e) {
      alert('Failed to add coupon');
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Coupons & Offers</Typography>
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <TextField label="Code" value={code} onChange={(e) => setCode(e.target.value)} />
        <TextField label="Discount %" value={discount} onChange={(e) => setDiscount(e.target.value)} />
        <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <TextField label="Expiry (YYYY-MM-DD)" value={expires} onChange={(e) => setExpires(e.target.value)} />
        <Button variant="contained" onClick={addCoupon}>Add</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Expiry</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.code}</TableCell>
                <TableCell>{c.discountPercent}%</TableCell>
                <TableCell>{c.category}</TableCell>
                <TableCell>{c.expiryDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Coupons;
