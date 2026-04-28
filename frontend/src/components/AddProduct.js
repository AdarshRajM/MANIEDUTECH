import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Alert, Grid } from '@mui/material';
import axios from 'axios';

const AddProduct = () => {
  const [product, setProduct] = useState({ name: '', category: '', description: '', price: '', offerPrice: '' });
  const [message, setMessage] = useState('');

  const handleAddProduct = async () => {
    try {
      await axios.post('/products', {
        ...product,
        price: parseFloat(product.price) || 0,
        offerPrice: parseFloat(product.offerPrice) || 0
      });
      setMessage('Product added successfully.');
      setProduct({ name: '', category: '', description: '', price: '', offerPrice: '' });
    } catch (error) {
      setMessage('Failed to add product: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Add New Product / Study Material</Typography>
        {message && <Alert severity="info" sx={{ mb: 3 }} onClose={() => setMessage('')}>{message}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Product Name" margin="normal" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Category" margin="normal" value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Description" margin="normal" multiline rows={3} value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Regular Price" margin="normal" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Offer Price" margin="normal" value={product.offerPrice} onChange={(e) => setProduct({ ...product, offerPrice: e.target.value })} />
          </Grid>
        </Grid>
        <Button variant="contained" color="secondary" size="large" sx={{ mt: 3 }} onClick={handleAddProduct}>Save Product</Button>
      </Paper>
    </Container>
  );
};

export default AddProduct;
