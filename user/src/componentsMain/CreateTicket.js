import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';
import axios from 'axios';
const CreateTicket = ({ FetchTickets, tickets, user, isOpen, handleClose, updateTicketList }) => {

  const [formData, setFormData] = useState({
    ShortDesc: '',
    description: '',
    State: 'New',
    Priority: 'Low',

  })


  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleValidationSubmit = () => {
    if (formData.ShortDesc.trim() === '' || formData.description.trim() === '') {
      setError('All fields are required')
      return false;
    }
    return true;
  }
  const CreateForm = async (e) => {

    if (!handleValidationSubmit()) {
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/tickets/create', formData, { withCredentials: true });
      if (response.status === 200) {
        setMessage('Creation successful');
        const { insertId } = response.data;
        const newTicket = { ...formData, id: insertId };
        updateTicketList(newTicket);
        FetchTickets();
        setError('');
        handleClose();
        setFormData({
          ShortDesc: '',
          description: '',
          State: 'New',
          Priority: 'Low',

        });


        console.log('updateTicketList called');
        navigate('/ticketlist')

        console.log(formData);
      }

    } catch (error) {
      console.error('Creation error', error);
      if (error.response) {
        setError(error.response.data.message || 'Creation failed. Please check your information.');
      } else {
        setError('Creation. Please check your information.');
      }
    }
  }
  return (

    <div>
      <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create Ticket</DialogTitle>
        <DialogContent>
          <TextField
            label="Short Desc"
            fullWidth
            margin="normal"
            name="ShortDesc"
            onChange={handleInputChange}
            value={formData.ShortDesc}
            required
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            name="description"
            onChange={handleInputChange}
            value={formData.description}
            required
          />
          <Select
            label="State"
            fullWidth
            sx={{ marginTop: 1 }}
            name="State"
            onChange={handleInputChange}
            value={formData.State}
            disabled
          >
            <MenuItem value="New">New</MenuItem>
          </Select>
          <Select
            label="Priority"
            fullWidth
            sx={{ marginTop: 1 }}
            name="Priority"
            onChange={handleInputChange}
            value={formData.Priority}
          >
            <MenuItem value="Critical">Critical</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Moderate">Moderate</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" fullWidth onClick={CreateForm} sx={{ marginTop: 2 }}>
            Submit
          </Button>
          <Button variant="contained" color="primary" fullWidth onClick={() => { handleClose(); navigate('/ticketlist') }} sx={{ marginTop: 2 }}>
            Cancel
          </Button>
        </DialogActions>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
      </Dialog >
    </div>
  )
}

export default CreateTicket