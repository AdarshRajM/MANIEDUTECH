import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Card, CardContent, Alert } from '@mui/material';
import axios from 'axios';

const FacultyVideoUpload = () => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [section, setSection] = useState('A');
    const [msg, setMsg] = useState('');

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/sections/materials', {
                title,
                contentUrl: url,
                materialType: 'VIDEO',
                sectionName: section
            });
            setMsg('Video successfully uploaded for tracking!');
            setTitle('');
            setUrl('');
        } catch (error) {
            setMsg('Failed to upload video.');
        }
    };

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                Upload Educational Video
            </Typography>
            <Card sx={{ maxWidth: 600, mx: 'auto', p: 2, borderRadius: 4, boxShadow: 3 }}>
                <CardContent>
                    {msg && <Alert severity={msg.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>{msg}</Alert>}
                    <form onSubmit={handleUpload}>
                        <TextField
                            fullWidth
                            label="Video Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Video URL (e.g. YouTube Embed Link)"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
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
                        <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ py: 1.5, borderRadius: 2 }}>
                            Publish Video
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
};

export default FacultyVideoUpload;
