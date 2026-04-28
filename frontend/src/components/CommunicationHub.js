import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Grid, List, ListItem, ListItemText, Divider, Avatar, Stack } from '@mui/material';
import { Search, VideoCall, Call, GroupAdd } from '@mui/icons-material';

const CommunicationHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // { id, name, type: 'direct'|'group' }
  const [messages, setMessages] = useState({}); // { chatId: [ {sender, text} ] }
  const [currentMsg, setCurrentMsg] = useState('');
  const [inCall, setInCall] = useState(false);

  // Mock data for search
  const mockStudents = [
    { id: 'STU001', name: 'Ravi Kumar', regNo: 'REG1001' },
    { id: 'STU002', name: 'Priya Sharma', regNo: 'REG1002' },
    { id: 'STU003', name: 'Amit Singh', regNo: 'REG1003' }
  ];

  const handleSearch = () => {
    const results = mockStudents.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.regNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  const startChat = (student) => {
    setActiveChat({ id: student.id, name: student.name, type: 'direct' });
    if (!messages[student.id]) {
      setMessages({ ...messages, [student.id]: [] });
    }
  };

  const sendMessage = () => {
    if (!currentMsg.trim() || !activeChat) return;
    const newMsg = { sender: 'Me', text: currentMsg };
    const chatHistory = messages[activeChat.id] || [];
    setMessages({ ...messages, [activeChat.id]: [...chatHistory, newMsg] });
    setCurrentMsg('');
  };

  const startVideoCall = () => {
    setInCall(true);
  };

  if (inCall) {
    // using Jitsi Meet for instant secure video calling
    const roomName = `MANIEDUTECH_${activeChat?.id || 'GROUP'}_${Date.now()}`;
    return (
      <Box sx={{ height: '100vh', width: '100%' }}>
        <Button variant="contained" color="error" onClick={() => setInCall(false)} sx={{ m: 2, position: 'absolute', zIndex: 10 }}>
          End Call
        </Button>
        <iframe
          src={`https://meet.jit.si/${roomName}`}
          allow="camera; microphone; fullscreen; display-capture"
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Video Call"
        />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Communication Hub</Typography>
      
      <Grid container spacing={3} sx={{ height: '70vh' }}>
        {/* Sidebar - Search & Contacts */}
        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField 
                fullWidth 
                size="small" 
                placeholder="Search Name or Reg No..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="contained" onClick={handleSearch}><Search /></Button>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Search Results / Contacts</Typography>
            <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {searchResults.length > 0 ? searchResults.map(student => (
                <ListItem button key={student.id} onClick={() => startChat(student)} sx={{ borderRadius: 2, mb: 1, bgcolor: '#f5f5f5' }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>{student.name[0]}</Avatar>
                  <ListItemText primary={student.name} secondary={`ID: ${student.id} | Reg: ${student.regNo}`} />
                </ListItem>
              )) : (
                <Typography variant="body2" sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                  Search for students to start chatting.
                </Typography>
              )}
            </List>

            <Button variant="outlined" startIcon={<GroupAdd />} sx={{ mt: 2 }}>
              Create Section Group
            </Button>
          </Paper>
        </Grid>

        {/* Chat Area */}
        <Grid item xs={12} md={8} sx={{ height: '100%' }}>
          <Paper sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {activeChat ? (
              <>
                {/* Chat Header */}
                <Box sx={{ p: 2, bgcolor: '#e3f2fd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">{activeChat.name}</Typography>
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" color="success" startIcon={<Call />} onClick={startVideoCall}>Voice</Button>
                    <Button variant="contained" color="secondary" startIcon={<VideoCall />} onClick={startVideoCall}>Video</Button>
                  </Stack>
                </Box>
                <Divider />
                
                {/* Messages */}
                <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#fafafa' }}>
                  {(messages[activeChat.id] || []).map((msg, idx) => (
                    <Box key={idx} sx={{ mb: 2, display: 'flex', justifyContent: msg.sender === 'Me' ? 'flex-end' : 'flex-start' }}>
                      <Paper sx={{ p: 1.5, px: 2, bgcolor: msg.sender === 'Me' ? 'primary.light' : 'white', color: msg.sender === 'Me' ? 'white' : 'text.primary', borderRadius: 4 }}>
                        <Typography variant="body1">{msg.text}</Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>

                {/* Input */}
                <Divider />
                <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                  <TextField 
                    fullWidth 
                    size="small" 
                    placeholder="Type a message..." 
                    value={currentMsg}
                    onChange={(e) => setCurrentMsg(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button variant="contained" onClick={sendMessage}>Send</Button>
                </Box>
              </>
            ) : (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6" color="text.secondary">Select a contact to start communicating</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CommunicationHub;
