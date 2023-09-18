import React, { useState } from 'react';
import { AlertTitle, Alert, Paper, Typography, TextField, Button, Grid, Link, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterComponent = () => {
  const [formData, setFormData] = useState({
    fName: '',
    lName: '',
    Username: '',
    PassWord: '',
    role: 'Admin',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [registerSuccessful, setRegisterSuccessful] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {

    if (formData.Username.trim() === '' || formData.PassWord.trim() === '' || formData.fName.trim() === '' || formData.lName.trim() === '') {
      setError('All fields are required.');
      setAlertOpen(true);
      return false;
    }
    if(formData.PassWord.length<8 || formData.PassWord.length>30){
      setError('Password length should be between 8 and 30')
      setAlertOpen(true);
      return false;
    }
    if(formData.Username.length<5){
      setError('Username length should be atleast 5')
      setAlertOpen(true);
      return false;
    }

    return true;
  };

  const RegistrationForm = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/users/register', formData, { withCredentials: true });
      if (response.status === 200) {
        
        setMessage('Registration successful. You can now log in.');
        setAlertOpen(true);
        setRegisterSuccessful(true);
        setTimeout(() => { navigate('/login') }, 2000)
        setError('');

      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        setError(error.response.data.message || 'Registration failed. Please check your information.');
        setAlertOpen(true);
      } else {
        setError('Registration failed. Please check your information.');
        setAlertOpen(true);
      }
    }
  };

  return (
    <div style={{ position: 'relative' }}>
    <Grid container justifyContent="center" alignItems="center" height="80vh">
      <Grid item xs={10} sm={6} md={4}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h5" gutterBottom>
            Register
          </Typography>
          <TextField
            label="First Name"
            fullWidth
            margin="normal"
            name="fName"
            onChange={handleInputChange}
            value={formData.fName}
            required
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="normal"
            name="lName"
            onChange={handleInputChange}
            value={formData.lName}
            required
          />
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            name="Username"
            onChange={handleInputChange}
            value={formData.Username}
            required
          />
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            name="PassWord"
            type="password"
            onChange={handleInputChange}
            value={formData.PassWord}
            required
          />
          <Select
            label="Role"
            fullWidth
            margin="normal"
            name="role"
            onChange={handleInputChange}
            value={formData.role}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Developer">Developer</MenuItem>
            <MenuItem value="QA">QA</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
          </Select>

          <Button variant="contained" color="primary" fullWidth onClick={RegistrationForm} sx={{marginTop:2}}>
            Register
          </Button>

          <Typography variant="body2" sx={{ marginTop: 1 }}>
            Already have an account? <Link href="/login">Login here</Link>
          </Typography>
          {/* {error && <p style={{ color: 'red' }}>{error}</p>}
          {message && <p style={{ color: 'green' }}>{message}</p>} */}
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
        <Alert severity="error" onClose={() => setAlertOpen(false)}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </div>
    )}
    {registerSuccessful && (
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
        }}
      >
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          Register Successful! Redirecting to Login...
        </Alert>
      </div>
    )}
  </div>
  );
};

export default RegisterComponent;
