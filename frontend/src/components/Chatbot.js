import React, { useState, useEffect, useRef } from 'react';
import { Typography, TextField, Button, Paper, Box, IconButton, Fab } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const paths = {
  login: "To login, go to the top right and click 'Sign In' or visit the /login page.",
  signup: "To register, click 'Join Now' on the home page or go to /signup. You don't need an OTP, you can skip it!",
  course: "To manage or enroll in courses, log in to your Dashboard, then navigate to 'Courses' from the sidebar.",
  payment: "For payments or buying courses, go to 'Courses', click on 'Enroll/Buy' and proceed to the Payment gateway.",
  mark: "To view your performance, open your Dashboard and click on 'Marks' or 'Analytics'.",
  faculty: "If you are a faculty, select the 'FACULTY' role during Signup. Then go to 'Faculty Portal' to assign marks.",
  contact: "Need help? Fill out the Contact Us form on the home page."
};

const Chatbot = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([{ sender: 'ai', text: 'Hello! I am your AI guide. How can I help you today? You can ask me about how to use this platform or anything else!' }]);
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, open]);

  const ask = async () => {
    if (!query.trim()) return;
    const userMsg = query;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setQuery('');
    
    // Simulate thinking delay
    setMessages(prev => [...prev, { sender: 'ai', text: '...' }]);

    let aiReply = "I am not quite sure how to help with that. Could you ask about courses, signup, login, or any general knowledge?";
    const lowerQ = userMsg.toLowerCase();

    // Check pre-defined paths
    let foundPath = false;
    for (let key in paths) {
      if (lowerQ.includes(key)) {
        aiReply = paths[key] + "\nI hope this path helps!";
        foundPath = true;
        break;
      }
    }

    if (!foundPath) {
      // Try Wikipedia API for general knowledge
      try {
        const res = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(userMsg)}&utf8=&format=json&origin=*`);
        if (res.data.query.search.length > 0) {
          const wikiSnippet = res.data.query.search[0].snippet.replace(/(<([^>]+)>)/gi, "");
          aiReply = "Here is what I found: " + wikiSnippet + "...";
        } else {
          // If no wiki result, generic reply
          aiReply = "I couldn't find an exact answer. If it's about our platform, try asking about 'signup', 'courses', or 'dashboard'.";
        }
      } catch (err) {
        // Fallback
      }
    }

    setTimeout(() => {
      setMessages(prev => {
        const newMsg = [...prev];
        newMsg.pop(); // remove '...'
        return [...newMsg, { sender: 'ai', text: aiReply }];
      });
    }, 800);
  };

  return (
    <>
      {!open && (
        <Fab 
          color="primary" 
          aria-label="chat" 
          sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1500 }}
          onClick={() => setOpen(true)}
        >
          <ChatIcon />
        </Fab>
      )}
      
      {open && (
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, width: { xs: '90%', sm: 350 }, zIndex: 1500, display: 'flex', flexDirection: 'column' }}>
          <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 450 }}>
            {/* Header */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SmartToyIcon />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>AI Assistant</Typography>
              </Box>
              <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>
            
            {/* Messages Area */}
            <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#f4f6f8' }}>
              {messages.map((m, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start', mb: 1.5 }}>
                  <Paper sx={{ 
                    p: 1.5, 
                    maxWidth: '80%', 
                    bgcolor: m.sender === 'user' ? 'primary.main' : 'white',
                    color: m.sender === 'user' ? 'white' : 'text.primary',
                    borderRadius: m.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                    fontSize: '0.9rem'
                  }}>
                    {m.text}
                  </Paper>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>
            
            {/* Input Area */}
            <Box sx={{ p: 1.5, bgcolor: 'white', display: 'flex', gap: 1, borderTop: '1px solid #eee' }}>
              <TextField 
                fullWidth 
                placeholder="Type your message..." 
                variant="outlined" 
                size="small"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && ask()}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
              />
              <IconButton color="primary" onClick={ask} disabled={!query.trim()}>
                <SendIcon />
              </IconButton>
            </Box>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default Chatbot;
