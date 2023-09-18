import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { Alert, Paper, Typography, TextField, Button, Grid, Link, AlertTitle } from '@mui/material';
import axios from 'axios';


const LoginComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success'); // Default to success
  const [alertOpen, setAlertOpen] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState(false);

  const navigate = useNavigate();
  const handleLogin = async () => {
    await axios
      .post('http://localhost:5000/users/login', { username, password }, { withCredentials: true })
      .then(response => {
        console.log('Login response', response.data)
        setMessage(response.data.message);
        if (response.status === 200) {
          setMessage('Login successful.');
          setAlertSeverity('success');
          setLoginSuccessful(true);
          setTimeout(() => {
              navigate('/profile');
            }, 2000);
        }
      })
      .catch(error => {
        setMessage('Login failed. Please check your credentials.');
        setAlertSeverity('error');
        setAlertOpen(true);
      });
  };
  return (
    <div style={{ position: 'relative' }}>
    <Grid container justifyContent="center" alignItems="center" height="80vh">
      <Grid item xs={10} sm={6} md={4}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
            Login
          </Button>

          <Typography variant="body2" sx={{ marginTop: 1 }}>
            Don't have an account? <Link href="/register" >Register here</Link>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
    {alertOpen && (
      <div
        style={{
          position: 'absolute',
          bottom: '20px', 
          right: '20px', 
        }}
      >
        <Alert severity={alertSeverity} onClose={() => setAlertOpen(false)}>
          <AlertTitle>{alertSeverity === 'success' ? 'Success' : 'Error'}</AlertTitle>
          {message}
        </Alert>
      </div>
    )}
    {loginSuccessful && (
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
        }}
      >
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          Login Successful! Redirecting to Profile...
        </Alert>
      </div>
    )}
  </div>
  );
};


export default LoginComponent