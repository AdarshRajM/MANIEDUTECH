import React from 'react';
import { 
  Container, Typography, Box, Grid, Paper, Button, Card, CardContent, LinearProgress, 
  AppBar, Toolbar, Stack 
} from '@mui/material';
import { 
  School, Group, Assessment, Security, TrendingUp, Lock, Speed, Cloud 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <Box sx={{
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 12,
        mb: 8,
        borderRadius: '0 0 50px 50px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              🎓 Elevate Your Education
            </Typography>
            <Typography variant="h5" paragraph sx={{ maxWidth: 700, mx: 'auto', mb: 3, opacity: 0.95 }}>
              A comprehensive platform designed to streamline educational institution operations with intelligent student management, course organization, and performance tracking.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button 
                variant="contained" 
                size="large" 
                onClick={() => navigate('/login')}
                sx={{ 
                  backgroundColor: '#000', 
                  color: 'white',
                  fontWeight: 'bold',
                  px: 4,
                  '&:hover': { backgroundColor: '#333' }
                }}
              >
                Get Started
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                onClick={() => navigate('/login')}
                sx={{ 
                  borderColor: 'white', 
                  color: 'white',
                  fontWeight: 'bold',
                  px: 4,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Sign In
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Features Section */}
        <Box mb={8}>
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 6 }}>
            Powerful Features
          </Typography>
          <Grid container spacing={3}>
            {[
              { icon: School, title: 'Course Management', desc: 'Easily organize and manage all courses across your institution', color: '#667eea' },
              { icon: Group, title: 'Student Records', desc: 'Comprehensive student information with unique IDs and sections', color: '#764ba2' },
              { icon: Assessment, title: 'Performance Tracking', desc: 'Monitor progress with advanced marks and grade management', color: '#f093fb' },
              { icon: Security, title: 'Secure Access', desc: 'Role-based authentication with JWT security protocol', color: '#4facfe' }
            ].map((feature, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                  }
                }}>
                  <CardContent sx={{ display: 'flex', width: '100%', gap: 2 }}>
                    <Box>
                      <feature.icon sx={{ fontSize: 50, color: feature.color }} />
                    </Box>
                    <Box flex={1}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.desc}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Why Choose Us */}
        <Box mb={8} sx={{ backgroundColor: '#f5f7ff', p: 6, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 6 }}>
            Why Choose Our System?
          </Typography>
          <Grid container spacing={4}>
            {[
              { icon: Lock, title: 'Enterprise Security', desc: 'JWT token-based authentication with bcrypt password encryption', benefit: '100% Secure' },
              { icon: Speed, title: 'Lightning Fast', desc: 'MongoDB backed performance with optimized queries', benefit: 'Real-time' },
              { icon: TrendingUp, title: 'Scalable', desc: 'Handles thousands of students and courses efficiently', benefit: '+1000 Users' },
              { icon: Cloud, title: 'Cloud Ready', desc: 'Modern stack ready for cloud deployment', benefit: 'Future Proof' }
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Box textAlign="center">
                  <item.icon sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {item.desc}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#667eea', fontWeight: 'bold' }}>
                    {item.benefit}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* User Roles */}
        <Box mb={8}>
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 6 }}>
            For Everyone - Students, Faculty, Principal
          </Typography>
          <Grid container spacing={3}>
            {[
              { role: 'Students', features: ['View enrolled courses', 'Check performance', 'View schedules'], color: '#4facfe' },
              { role: 'Faculty', features: ['Manage courses', 'Add student marks', 'Track progress'], color: '#f093fb' },
              { role: 'Principal', features: ['Full system access', 'Manage all data', 'Analytics'], color: '#667eea' }
            ].map((user, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center', position: 'relative' }}>
                  <Box sx={{ backgroundColor: user.color, color: 'white', py: 2, mb: 2, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {user.role}
                    </Typography>
                  </Box>
                  <Stack spacing={1}>
                    {user.features.map((feat, i) => (
                      <Typography key={i} variant="body2">✓ {feat}</Typography>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Technology Stack */}
        <Box mb={8}>
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 6 }}>
            Built With Modern Technology
          </Typography>
          <Grid container spacing={2}>
            {['Spring Boot', 'React.js', 'MongoDB', 'JWT Auth', 'Material-UI', 'REST APIs'].map((tech, idx) => (
              <Grid item xs={6} sm={4} md={2} key={idx}>
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                    {tech}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box sx={{
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 6,
          borderRadius: 3,
          textAlign: 'center',
          mb: 8
        }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Ready to Revolutionize Your Institution?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3, opacity: 0.95 }}>
            Join thousands of educational institutions using our platform to manage their operations efficiently.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              onClick={() => navigate('/signup')}
              sx={{ 
                backgroundColor: 'white', 
                color: '#667eea',
                fontWeight: 'bold',
                px: 4
              }}
            >
              Sign Up Now
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/login')}
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                fontWeight: 'bold',
                px: 4
              }}
            >
              Log In
            </Button>
          </Stack>
        </Box>

        {/* Footer Stats */}
        <Box sx={{ py: 4, borderTop: '1px solid #e0e0e0', mb: 4 }}>
          <Grid container spacing={2} textAlign="center">
            {[
              { number: '1000+', label: 'Active Users' },
              { number: '500+', label: 'Institutions' },
              { number: '99.9%', label: 'Uptime' },
              { number: '24/7', label: 'Support' }
            ].map((stat, idx) => (
              <Grid item xs={6} md={3} key={idx}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                  {stat.number}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Home;