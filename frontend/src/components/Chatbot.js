import React, { useState } from 'react';
import { Typography, TextField, Button, Paper, Box, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import axios from 'axios';

const Chatbot = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [open, setOpen] = useState(true);

  const ask = async () => {
    try {
      const res = await axios.get('/chatbot', { params: { q: query } });
      setAnswer(res.data);
    } catch (err) {
      setAnswer('Unable to answer right now.');
    }
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, width: 340, zIndex: 1500 }}>
      <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Chatbot</Typography>
          <IconButton size="small" onClick={() => setOpen(!open)}><ChatIcon /></IconButton>
        </Box>
        {open && (
          <>
            <Typography variant="body2" sx={{ mb: 1 }}>Ask quick questions about your courses and section.</Typography>
            <TextField fullWidth value={query} onChange={(e) => setQuery(e.target.value)} label="Ask something" size="small" />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button variant="contained" size="small" onClick={ask}>Ask</Button>
            </Box>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>Answer:</Typography>
            <Paper sx={{ p: 1, backgroundColor: '#f9f9f9', minHeight: 60 }}>{answer || 'No answer yet.'}</Paper>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Chatbot;
