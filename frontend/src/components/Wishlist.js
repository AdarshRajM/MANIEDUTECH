import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import axios from 'axios';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const username = localStorage.getItem('username') || 'testuser';

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await axios.get(`/wishlist/${username}`);
        setItems(data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWishlist();
  }, [username]);

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>My Wishlist</Typography>
        {items.length === 0 ? (
          <Typography>No wishlist items yet.</Typography>
        ) : (
          <List>
            {items.map((item) => (
              <ListItem key={item.id} divider>
                <ListItemText primary={item.courseName} secondary={`Course ID: ${item.courseId}`} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default Wishlist;


