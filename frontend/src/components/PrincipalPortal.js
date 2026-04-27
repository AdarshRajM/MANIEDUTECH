import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Grid, Box } from '@mui/material';
import axios from 'axios';

const PrincipalPortal = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalFaculty: 0,
        activeTests: 0,
        blockedStudents: 0
    });

    useEffect(() => {
        // Mocking fetch stats, normally would be an API call like /api/principal/stats
        setStats({
            totalStudents: 150,
            totalFaculty: 12,
            activeTests: 5,
            blockedStudents: 2
        });
    }, []);

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                Principal Dashboard
            </Typography>
            <Typography variant="subtitle1" gutterBottom color="text.secondary" sx={{ mb: 4 }}>
                Overview of school operations, exams, and student activity.
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#e3f2fd', borderRadius: 4, boxShadow: 2 }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Total Students</Typography>
                            <Typography variant="h3">{stats.totalStudents}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#f3e5f5', borderRadius: 4, boxShadow: 2 }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Total Faculty</Typography>
                            <Typography variant="h3">{stats.totalFaculty}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#e8f5e9', borderRadius: 4, boxShadow: 2 }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Active Tests</Typography>
                            <Typography variant="h3">{stats.activeTests}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#ffebee', borderRadius: 4, boxShadow: 2 }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Blocked by Proctoring</Typography>
                            <Typography variant="h3" color="error">{stats.blockedStudents}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ mt: 5 }}>
                <Typography variant="h5" gutterBottom>Recent Activity Logs</Typography>
                <Card sx={{ p: 2, borderRadius: 3 }}>
                    <Typography variant="body2" color="textSecondary">Activity stream will appear here...</Typography>
                </Card>
            </Box>
        </Container>
    );
};

export default PrincipalPortal;
