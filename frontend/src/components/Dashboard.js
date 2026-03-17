import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, CardActions, Button, Box, 
  LinearProgress, Paper, Stack, Chip, Avatar, TextField, List, ListItem, ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { School, People, Assessment, TrendingUp, MenuBook, CheckCircle } from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ students: 0, courses: 0, marks: 0 });
  const [offers, setOffers] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [doubt, setDoubt] = useState('');
  const [doubtAnswer, setDoubtAnswer] = useState('');
  const [streak, setStreak] = useState(5);
  const [streakMsg, setStreakMsg] = useState('Keep your streak alive by practicing daily!');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }
    setAuthenticated(true);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const [studentsRes, coursesRes, marksRes, offersRes] = await Promise.all([
        axios.get('/students', config).catch(() => ({ data: [] })),
        axios.get('/courses', config).catch(() => ({ data: [] })),
        axios.get('/marks?page=0&size=1', config).catch(() => ({ data: { totalElements: 0 } })),
        axios.get('/offers').catch(() => ({ data: [] }))
      ]);
      setStats({
        students: studentsRes.data?.length || 0,
        courses: coursesRes.data?.length || 0,
        marks: marksRes.data?.totalElements || 0
      });
      setOffers(offersRes.data || []);
    } catch (error) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    try {
      const res = await axios.get(`/courses/search?q=${encodeURIComponent(query)}`);
      setSearchResults(res.data || []);
    } catch (err) {
      console.error('Search failed', err);
      setSearchResults([]);
    }
  };

  const solveDoubt = async () => {
    if (!doubt.trim()) {
      setDoubtAnswer('Please ask a valid doubt.');
      return;
    }
    try {
      const res = await axios.post('/ai/doubt', { question: doubt.trim() });
      setDoubtAnswer(res.data.answer || 'AI could not generate an answer');
    } catch (err) {
      console.error('Doubt solve failed', err);
      setDoubtAnswer('Failed to get answer. Please try again later.');
    }
  };

  const refreshStreak = () => {
    setStreak(prev => {
      const next = Math.min(prev + 1, 7);
      setStreakMsg(next === 7 ? '🔥 7 day streak! Keep going!' : `🔥 ${next} day streak`);
      return next;
    });
  };

  if (!authenticated) {
    return (
      <Box sx={{
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <School sx={{ fontSize: 80, color: '#667eea', mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              Welcome to Dashboard
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary" sx={{ mb: 4 }}>
              Please sign in or sign up to access the full features of MANI-EDUTECH.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button 
                variant="contained" 
                size="large" 
                onClick={() => navigate('/login')}
                sx={{ px: 4, fontWeight: 'bold' }}
              >
                Sign In
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                onClick={() => navigate('/signup')}
                sx={{ px: 4, fontWeight: 'bold' }}
              >
                Sign Up
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  const StatCard = ({ icon: Icon, title, value, color, navigate: navPath }) => (
    <Card sx={{
      background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
      border: `2px solid ${color}`,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: `0 12px 24px ${color}40`
      }
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, mr: 2 }}>
            <Icon />
          </Avatar>
          <Typography variant="h6" sx={{ color, fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 'bold', color, mb: 1 }}>
          {value}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={Math.min((value / 100) * 100, 100)} 
          sx={{ backgroundColor: `${color}20`, '& .MuiLinearProgress-bar': { backgroundColor: color } }}
        />
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          variant="contained" 
          onClick={() => navigate(navPath)}
          sx={{ backgroundColor: color, width: '100%', '&:hover': { backgroundColor: color } }}
        >
          Manage
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ py: 4, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
            📊 Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's your system overview.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <StatCard
              icon={People}
              title="Students"
              value={stats.students}
              color="#667eea"
              navigate="/students"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              icon={MenuBook}
              title="Courses"
              value={stats.courses}
              color="#764ba2"
              navigate="/courses"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              icon={Assessment}
              title="Marks"
              value={stats.marks}
              color="#f093fb"
              navigate="/marks"
            />
          </Grid>
        </Grid>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <TrendingUp sx={{ fontSize: 40, color: '#667eea' }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Performance</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stats.marks > 50 ? 'Excellent' : stats.marks > 20 ? 'Good' : 'Getting Started'}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <CheckCircle sx={{ fontSize: 40, color: '#4caf50' }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>System Status</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ✓ All systems operational
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2, mb: 6 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            ⚡ Quick Actions & Offers
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Active Offers</Typography>
            {offers.length === 0 ? (
              <Typography variant="body2">No offers available right now.</Typography>
            ) : (
              <Box component="ul" sx={{ pl: 3 }}>
                {offers.map((o) => (
                  <li key={o.id}>{o.code}: {o.discountPercent}% on {o.category}</li>
                ))}
              </Box>
            )}
          </Box>
          <Grid container spacing={2}>
            {[
              { label: 'View Students', path: '/students', color: '#667eea' },
              { label: 'View Courses', path: '/courses', color: '#764ba2' },
              { label: 'View Marks', path: '/marks', color: '#f093fb' },
              { label: 'Section Hub', path: '/section', color: '#4facfe' }
            ].map((action, idx) => (
              <Grid item xs={6} sm={3} key={idx}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate(action.path)}
                  sx={{
                    borderColor: action.color,
                    color: action.color,
                    fontWeight: 'bold',
                    py: 2,
                    '&:hover': {
                      backgroundColor: `${action.color}10`,
                      borderColor: action.color
                    }
                  }}
                >
                  {action.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* AI Insight + Live class + Notifications */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }} elevation={2}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>🚀 AI Test Analysis</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                After recent tests, our AI suggests focusing on weak topics to improve your score.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip label="Weak: Recursion" color="error" />
                <Chip label="Weak: Backtracking" color="warning" />
                <Chip label="Strong: Array Basics" color="success" />
              </Box>
              <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/section')}>Study Plan</Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }} elevation={2}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>📢 Live Class & Notifications</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Next class: Advanced DSA on recursion at 4:30 PM today.
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Button size="small" variant="outlined" onClick={() => navigate('/section')}>Join Class</Button>
                <Button size="small" variant="outlined" onClick={() => window.alert('Reminder set for class')}>Set Reminder</Button>
              </Stack>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Recent Notifications</Typography>
              <List dense>
                <ListItem><ListItemText primary="New discount: 25% off AI course" /></ListItem>
                <ListItem><ListItemText primary="Live class starts in 20 minutes" /></ListItem>
                <ListItem><ListItemText primary="Test results published" /></ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>📈 Weekly Progress</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Track completion and engagement over the week.</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box sx={{ flex: 1, bgcolor: '#e8f0fe', p: 1, borderRadius: 1 }}><Typography variant="caption">Mon</Typography><Typography>40%</Typography></Box>
                <Box sx={{ flex: 1, bgcolor: '#d1f2eb', p: 1, borderRadius: 1 }}><Typography variant="caption">Tue</Typography><Typography>58%</Typography></Box>
                <Box sx={{ flex: 1, bgcolor: '#fff3cd', p: 1, borderRadius: 1 }}><Typography variant="caption">Wed</Typography><Typography>72%</Typography></Box>
                <Box sx={{ flex: 1, bgcolor: '#f8d7da', p: 1, borderRadius: 1 }}><Typography variant="caption">Thu</Typography><Typography>66%</Typography></Box>
                <Box sx={{ flex: 1, bgcolor: '#d4edda', p: 1, borderRadius: 1 }}><Typography variant="caption">Fri</Typography><Typography>85%</Typography></Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>🏆 Gamified Leaderboard</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Your rank among classmates based on weekly progress.</Typography>
              <List dense>
                <ListItem><ListItemText primary="1. Ravi - 980 pts" secondary=" 🔥 7 Day Streak" /></ListItem>
                <ListItem><ListItemText primary="2. Priya - 910 pts" secondary="💡 Top DSA problem solver" /></ListItem>
                <ListItem><ListItemText primary="3. You - 860 pts" secondary="Keep going!" /></ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Info Cards */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }} elevation={2}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>🔎 Course Search (Fast)</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField fullWidth value={query} onChange={(e) => setQuery(e.target.value)} label="Search course" size="small" />
                <Button variant="contained" onClick={performSearch}>Search</Button>
              </Box>
              {searchResults.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No results yet.</Typography>
              ) : (
                <List dense>
                  {searchResults.map((course) => (
                    <ListItem key={course.id}>
                      <ListItemText primary={course.courseName} secondary={course.description} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }} elevation={2}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>🤖 AI Doubt Solver</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Ask a technical doubt and get instant guidance.</Typography>
              <TextField fullWidth multiline rows={2} value={doubt} onChange={(e) => setDoubt(e.target.value)} placeholder="Explain binary tree..." sx={{ mb: 1 }} />
              <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={solveDoubt}>Solve</Button>
                <Button variant="outlined" onClick={refreshStreak}>Daily Practice + Streak</Button>
              </Stack>
              <Typography sx={{ mt: 1, fontWeight: 'bold' }}>Streak: {streak} day(s)</Typography>
              <Typography variant="body2" color="text.secondary">{streakMsg}</Typography>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>Answer:</Typography>
              <Paper variant="outlined" sx={{ p: 1, minHeight: 60, backgroundColor: '#f8f9fa' }}>
                <Typography variant="body2">{doubtAnswer || 'Ask a doubt to get AI help.'}</Typography>
              </Paper>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          {[
            { title: '🔒 Secure Access', desc: 'JWT token-based authentication protecting all data' },
            { title: '⚡ Real-time', desc: 'Instant updates and data synchronization' },
            { title: '📱 Responsive', desc: 'Works seamlessly on all devices' },
            { title: '🎯 Role-Based', desc: 'Different access levels for each user type' }
          ].map((info, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {info.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {info.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;