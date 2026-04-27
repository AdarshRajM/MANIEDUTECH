import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Card, CardContent, Alert } from '@mui/material';
import axios from 'axios';

const FacultyTestUpload = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [section, setSection] = useState('A');
    const [msg, setMsg] = useState('');

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/sections/materials', {
                title,
                description,
                materialType: 'TEST',
                sectionName: section
            });
            setMsg('Test successfully created. AI Proctoring will be enforced.');
            setTitle('');
            setDescription('');
        } catch (error) {
            setMsg('Failed to create test.');
        }
    };

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="secondary">
                Create Secure Test
            </Typography>
            <Card sx={{ maxWidth: 600, mx: 'auto', p: 2, borderRadius: 4, boxShadow: 3 }}>
                <CardContent>
                    {msg && <Alert severity={msg.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>{msg}</Alert>}
                    <form onSubmit={handleUpload}>
                        <TextField
                            fullWidth
                            label="Test Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Test Instructions / Questions Link"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Target Section (e.g. A, B)"
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            sx={{ mb: 3 }}
                            required
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.5, borderRadius: 2 }}>
                            Publish Test
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
};

export default FacultyTestUpload;
