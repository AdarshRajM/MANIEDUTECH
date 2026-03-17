import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box, Snackbar, Alert, Stack } from '@mui/material';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load products');
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    setMessage(`${product.name} added to cart`);
  };

  const checkout = () => {
    if (cart.length === 0) {
      setMessage('Add at least one item to cart');
      return;
    }
    setMessage(`Order placed for ${cart.length} item(s). Payment options: UPI / Card / NetBanking`);
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + (item.offerPrice || item.price || 0), 0);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>Learning Store</Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>Enroll in courses, buy books, and purchase test series with flexible payment.</Typography>
      <Grid container spacing={2}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{p.name}</Typography>
                <Typography variant="body2" color="text.secondary">{p.category}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{p.description}</Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  Price: ₹{p.price}  
                  {p.offerPrice ? <span style={{ color: 'green', fontWeight: 700 }}> Offer: ₹{p.offerPrice}</span> : null}
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" fullWidth onClick={() => addToCart(p)}>Add to cart</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, p: 2, border: '1px dashed #cccccc', borderRadius: 2 }}>
        <Typography variant="h6">Cart ({cart.length})</Typography>
        {cart.length === 0 ? <Typography>No items in cart.</Typography> : (
          <Stack spacing={1} sx={{ mt: 1 }}>
            {cart.map((item, i) => <Typography key={i}>• {item.name} - ₹{item.offerPrice || item.price}</Typography>)}
            <Typography sx={{ fontWeight: 'bold', mt: 1 }}>Total: ₹{total.toFixed(2)}</Typography>
          </Stack>
        )}
        <Button variant="contained" sx={{ mt: 2 }} onClick={checkout}>Checkout (UPI / Card / NetBanking)</Button>
      </Box>

      <Snackbar open={!!message} autoHideDuration={3000} onClose={() => setMessage('')}>
        <Alert severity="info" onClose={() => setMessage('')}>{message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default Products;
