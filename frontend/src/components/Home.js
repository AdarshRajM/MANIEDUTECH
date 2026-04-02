import React from 'react';
import axios from 'axios';
import { 
  Container, Typography, Box, Grid, Button, Stack, Paper, TextField, Alert 
} from '@mui/material';
import { 
  School, Group, Assessment, Security, TrendingUp, Lock, Speed, Cloud 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = React.useState({ name: '', email: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = React.useState('');

  const handleContactSubmit = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactStatus('Please complete name, email and message');
      return;
    }
    try {
      await axios.post('/auth/contact', contactForm);
      setContactStatus('Thanks! Your message is sent and administrator will follow-up soon.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setContactStatus('Cannot submit now. Please retry later.');
    }
  };

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes float3D {
            0% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
            50% { transform: translateY(-20px) rotateX(10deg) rotateY(-5deg); drop-shadow: 0 25px 35px rgba(0,0,0,0.2); }
            100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
          }
          @keyframes pulseGlow {
            0% { box-shadow: 0 0 15px rgba(102, 126, 234, 0.4); }
            50% { box-shadow: 0 0 30px rgba(118, 75, 162, 0.8); }
            100% { box-shadow: 0 0 15px rgba(102, 126, 234, 0.4); }
          }
          .glass-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.4s ease;
          }
          .glass-card:hover {
            transform: translateY(-10px) scale(1.05) perspective(1000px) rotateX(5deg) rotateY(-5deg);
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            border-color: rgba(255, 255, 255, 0.4);
          }
          .hero-3d-text {
            text-shadow: 2px 2px 0px #333, 4px 4px 0px #222, 6px 6px 15px rgba(0,0,0,0.5);
          }
          .animated-bg {
            background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab, #667eea, #764ba2);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
          }
        `}
      </style>

      {/* Hero Section */}
      <Box className="animated-bg" sx={{
        color: 'white',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        borderRadius: '0 0 80px 80px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h2" component="h1" className="hero-3d-text" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: '3rem', md: '5rem' }, lineHeight: 1.1 }}>
                Elevate Your <br />
                <span style={{ color: '#ffd700' }}>Education Base</span>
              </Typography>
              <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9, fontWeight: 300, fontSize: '1.2rem', textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
                Experience a truly modern platform designed to revolutionize administrative operations, courses, and student success tracking with stunning clarity.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={() => navigate('/signup')}
                  sx={{ 
                    backgroundColor: '#fff', 
                    color: '#764ba2',
                    fontWeight: 800,
                    px: 5,
                    py: 1.5,
                    borderRadius: '30px',
                    animation: 'pulseGlow 2s infinite',
                    transition: 'transform 0.3s',
                    '&:hover': { backgroundColor: '#f0f0f0', transform: 'scale(1.1)' }
                  }}
                >
                  Join Now
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  onClick={() => navigate('/login')}
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.8)', 
                    color: 'white',
                    fontWeight: 'bold',
                    borderWidth: '2px',
                    px: 5,
                    py: 1.5,
                    borderRadius: '30px',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: '2px' }
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <Box sx={{ 
                animation: 'float3D 6s ease-in-out infinite',
                width: '100%',
                height: '400px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0))',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.4)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 30px 60px rgba(0,0,0,0.4)'
              }}>
                 <School sx={{ fontSize: 120, color: 'white', filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.3))' }} />
                 <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>Interactive Hub</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section - 3D Cards */}
      <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', zIndex: 10, mb: 10 }}>
        <Grid container spacing={4}>
          {[
            { icon: School, title: 'Courses', color: '#ff6b6b', grad: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)' },
            { icon: Group, title: 'Students', color: '#4facfe', grad: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)' },
            { icon: Assessment, title: 'Analytics', color: '#ff9a9e', grad: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)' },
            { icon: Security, title: 'Security', color: '#43e97b', grad: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)' }
          ].map((feature, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Paper className="glass-card" sx={{ 
                p: 4, 
                textAlign: 'center', 
                height: '100%',
                background: feature.grad,
                color: '#333',
                borderRadius: '24px',
              }}>
                <Box sx={{ 
                  backgroundColor: 'white', 
                  width: 80, height: 80, 
                  lineHeight: '90px', 
                  borderRadius: '50%', 
                  mx: 'auto', mb: 2,
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }}>
                  <feature.icon sx={{ fontSize: 40, color: feature.color, verticalAlign: 'middle' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{feature.title}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Why Choose Us */}
      <Box mb={8} sx={{ background: '#0a0a0a', color: 'white', py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 900, mb: 8, color: '#fff' }}>
            Why Choose Our System?
          </Typography>
          <Grid container spacing={6}>
            {[
              { icon: Lock, title: 'Enterprise Security', desc: 'Bank-grade JWT token-based authentication for absolute data privacy.' },
              { icon: Speed, title: 'Lightning Fast', desc: 'React & Spring Boot architecture guarantees millisecond responses.' },
              { icon: TrendingUp, title: 'Ultra Scalable', desc: 'Engineered to handle exponential growth without breaking a sweat.' },
              { icon: Cloud, title: 'Cloud Native', desc: 'Deploy anywhere, scale everywhere. The true power of modern infra.' }
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 3, 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '20px',
                  transition: '0.3s',
                  '&:hover': { borderColor: '#667eea', boxShadow: '0 0 20px rgba(102, 126, 234, 0.4)', transform: 'translateY(-5px)' }
                }}>
                  <item.icon sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>{item.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact / Feedback Section */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Box sx={{ p: 4, backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', mb: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>Contact Us</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>Fill this form to submit feedback or support request. We will email you at adarshrajmanii@gmail.com</Typography>
          {contactStatus && <Alert severity={contactStatus.startsWith('Thanks') ? 'success' : 'warning'} sx={{ mb: 2 }}>{contactStatus}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><TextField fullWidth label="Name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Subject" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline minRows={4} label="Message" value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} /></Grid>
            <Grid item xs={12}><Button variant="contained" onClick={handleContactSubmit}>Submit Contact Request</Button></Grid>
          </Grid>
        </Box>
      </Container>
      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Box className="animated-bg" sx={{
          color: 'white',
          p: { xs: 5, md: 8 },
          borderRadius: '40px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 900, mb: 3 }}>
            Ready for the Future?
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 5, opacity: 0.9, maxWidth: '600px', mx: 'auto' }}>
            Join forward-thinking institutions that have already transformed their educational management.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/signup')}
            sx={{ 
              backgroundColor: '#111', 
              color: '#fff',
              fontWeight: 800,
              fontSize: '1.2rem',
              px: 6,
              py: 2,
              borderRadius: '50px',
              transition: 'all 0.3s',
              border: '2px solid transparent',
              '&:hover': { 
                backgroundColor: 'transparent', 
                border: '2px solid #fff',
                transform: 'scale(1.05)'
              }
            }}
          >
            Launch Your Portal
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;