import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TicketTable from './TicketTable';
import { Typography, Link, Container, Alert, AlertTitle, Select, MenuItem, TextField, Button } from '@mui/material';

import CreateTicket from './CreateTicket';


const TicketList = ({ user, isLoggedIn, ticketListUpdated, createFormOpen, setCreateFormOpen }) => {
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState('');
  const [editFormLoading, setEditFormLoading] = useState(false);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [editTicket, setEditTicket] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    FetchTickets();
    console.log(currentPage)

  }, [ currentPage]);
 

  const updateTicket = (updatedTicket) => {

    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )

    );

  };

  const removeTicket = (ticketId) => {
    setTickets((prevTickets) =>
      prevTickets.filter((ticket) => ticket.id !== ticketId)
    );
  };
  const updateTicketList = (newTicket) => {
    if (hasMore) {
      return;
    }

    setTickets((prevTickets) => [...prevTickets, newTicket]);

  };

  const FetchTickets = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/tickets?page=${currentPage}`);
      if(response.data.length<5){
        setHasMore(false)
      }
      else if(response.data.length===5){
        setHasMore(true)
      }
      const newTickets = response.data;
      console.log(newTickets)
      if (newTickets.length === 0) {
        setHasMore(false);
        return;
      }

      setTickets((prevTickets) => [...prevTickets, ...newTickets]);
      console.log(tickets)
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const loadMoreTickets = () => {
    
      setCurrentPage((prevPage) => prevPage + 1);
    

  }
  const handleEditClick = (ticket) => {

    setEditFormVisible(true);
    setEditTicket(ticket);


  };
  const handleUpdateClick = async () => {

    try {
      setEditFormLoading(true);
      const response = await axios.put(
        `http://localhost:5000/tickets/${editTicket.id}`,
        editTicket,
        { withCredentials: true }
      );
      console.log(response)

      if (response.status === 200) {
        setMessage(response.data.message);
        console.log(message)
        setEditFormVisible(false);
        setAlertSeverity('success')
        updateTicket(editTicket);
        FetchTickets();
      } else {
        setMessage(response.data.message);
        console.log(message)
        setAlertSeverity('error');
      }
      setAlertOpen(true);
    } catch (error) {
      setMessage('Ticket can not be updated');
      setAlertSeverity('error')
      setAlertOpen(true);
    } finally {
      setEditFormLoading(false);

    }


  

  };


  const closeCreateForm = () => {
    setCreateFormOpen(false);
  };
  const deleteTicket = async (ticketId) => {
    await axios.delete(`http://localhost:5000/tickets/${ticketId}`, { withCredentials: true })
      .then(response => {
        if (response.status === 200) {
          setMessage(response.data.message)
          setAlertSeverity('success')
          removeTicket(ticketId);
          FetchTickets();
          tickets.index=tickets.index-5
        
          if (response.data.message === 'You are not admin') {
            setMessage(response.data.message)
            setAlertSeverity('error')

          }

        }
        setAlertOpen(true);

      })
      .catch((error) => {
        console.error('Error deleting ticket:', error);
      });
    

  };

  return (
    <Container sx={{ maxWidth: '1000px' }} style={{ display: 'flex' }}>
      {isLoggedIn ? (
        <>
          <CreateTicket  FetchTickets={FetchTickets} tickets={tickets} isOpen={createFormOpen} handleClose={closeCreateForm} updateTicketList={updateTicketList} />
          <div style={{ flex: 1, height: '100%' }}>
            <Typography variant="h4" gutterBottom>
              Ticket List
            </Typography>

            <TicketTable user={user} hasMore={hasMore} loadMoreTickets={loadMoreTickets} tickets={tickets} deleteTicket={deleteTicket} handleEditClick={handleEditClick} />

          </div>
          {editFormVisible && (
            <div style={{ width: '30%', position: 'sticky', top: '0', margin: 'auto', marginLeft: '16px' }}>
              <Typography variant="h5" gutterBottom>
                Edit Ticket
              </Typography>
              <TextField
                label="Short Desc"
                fullWidth
                margin="normal"
                name="ShortDesc"
                value={editTicket.ShortDesc}
                onChange={(e) => setEditTicket({ ...editTicket, ShortDesc: e.target.value })}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                margin="normal"
                name="description"
                value={editTicket.description}
                onChange={(e) => setEditTicket({ ...editTicket, description: e.target.value })}
              />
              <Select
                label="State"
                fullWidth
                sx={{ marginTop: 1 }}
                name="State"
                value={editTicket.State}
                onChange={(e) => setEditTicket({ ...editTicket, State: e.target.value })}
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="In progress">In progress</MenuItem>
                <MenuItem value="Review">Review</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
              <Select
                label="Priority"
                fullWidth
                sx={{ marginTop: 1 }}
                name="Priority"
                value={editTicket.Priority}
                onChange={(e) => setEditTicket({ ...editTicket, Priority: e.target.value })}
              >
                <MenuItem value="Critical">Critical</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Moderate">Moderate</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
              <Button variant="contained" color="primary" onClick={handleUpdateClick} sx={{ marginTop: 1 }}>
                Update
              </Button>
            </div>

          )}
        </>


      ) : (
        <Typography variant="h5" gutterBottom>
          You have to be logged in to view tickets <Link href="/login">Login here</Link>
        </Typography>
      )
      }
      {
        alertOpen && (
          <div
            style={{
              position: 'fixed',
              top: '65px',
              right: '25px',

            }}
          >
            <Alert severity={alertSeverity} onClose={() => setAlertOpen(false)}>
              <AlertTitle>{alertSeverity === 'success' ? 'Success' : 'Error'}</AlertTitle>
              {message}
            </Alert>
          </div>
        )
      }
    </Container >
  )
}

export default TicketList