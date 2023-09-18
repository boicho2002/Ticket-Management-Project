import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './Css/TicketTransition.css'
const TicketTable = ({ user, tickets, deleteTicket, handleEditClick, loadMoreTickets, hasMore }) => {
  const [assignedToFilter, setAssignedToFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [createdOnFilter, setCreatedOnFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [ticketInfo, setTicketInfo] = useState(null);

  const filteredTickets = tickets.filter((ticket) => {

    return (
      (assignedToFilter === '' || ticket.user_id.toString() === assignedToFilter) &&
      (priorityFilter === '' || ticket.Priority === priorityFilter) &&
      (stateFilter === '' || ticket.State === stateFilter) &&
      (createdOnFilter === '' || ticket.created_on.toString().includes(createdOnFilter))

    );

  });
  tickets.forEach(ticket => {
    ticket.index = (tickets.indexOf(ticket)) + 1;
    console.log(ticket.user_id)
    if (ticket.user_id === user.id) {
      ticket.createdBy = user.FullName;
      console.log(ticket.createdBy)
    }
  });
  console.log(tickets)
  const priorityColors = {
    High: 'red',
    Moderate: 'orange',
    Critical: '#8B0000',
    Low: 'green',
  };
  const handleViewClick = (ticket) => {
    setTicketInfo(ticket);
  };

  const handleCloseModal = () => {
    setTicketInfo(null);
  };
  const handleSort = (key) => {
    let direction = 'asc';
    console.log(sortConfig.key)
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }
  const sortedTickets = [...filteredTickets].sort((a, b) => {

    if (sortConfig.key === 'index') {
      console.log(a.index)
      const numA = parseInt(a.index, 10);
      const numB = parseInt(b.index, 10);
      console.log(numA)
      if (sortConfig.direction === 'asc') {
        return numA - numB;
      } else {
        return numB - numA;
      }
    } else {

      const keyA = a[sortConfig.key || ''] || '';
      const keyB = b[sortConfig.key || ''] || '';
      console.log(keyA)
      if (sortConfig.direction === 'asc') {

        return keyA.localeCompare(keyB);
      } else {
        return keyB.localeCompare(keyA);
      }
    }
  });


  const columns = [
    { title: 'Number', field: 'index' },
    { title: 'Short Description', field: 'ShortDesc' },
    { title: 'State', field: 'State' },
    {
      title: 'Priority',
      field: 'Priority',

    },
    {
      title: 'Actions',

    },
  ];
  const paperSX = {
    "&:hover": {
      boxShadow: 3,
    },
  };
  return (
    <div>
      <div className="filters" >

        <TextField sx={{ m: 1 }}
          id="standard-basic"
          label="Assigned to"
          variant="standard"
          value={assignedToFilter}
          onChange={(e) => setAssignedToFilter(e.target.value)}
        />
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">Priority</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"Critical"}>Critical</MenuItem>
            <MenuItem value={"High"}>High</MenuItem>
            <MenuItem value={"Moderate"}>Moderate</MenuItem>
            <MenuItem value={"Low"}>Low</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-state-label">State</InputLabel>
          <Select
            labelId="demo-simple-statet-label"
            id="demo-state-select"
            label="State"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="New">New</MenuItem>
            <MenuItem value="In progress">In progress</MenuItem>
            <MenuItem value="Review">Review</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>
        <TextField sx={{ m: 1 }}
          InputLabelProps={{ shrink: true }}
          id="standard-basic"
          type="date"
          label="Created On"
          variant="standard"
          value={createdOnFilter}
          onChange={(e) => setCreatedOnFilter(e.target.value)}
        />

      </div>
      <InfiniteScroll
        dataLength={tickets.length}
        next={loadMoreTickets}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more tickets to load</p>}
        scrollableTarget="scrollTable"
      >
        <TableContainer id="scrollTable" component={Paper} sx={{ maxHeight: "400px" }}>
          <Table stickyHeader>
            <TableHead >
              <TableRow sx={{ backgroundColor: '#EDEDED' }}>
                {columns.map((column) => (
                  <TableCell
                    style={{ cursor: 'pointer' }}
                    key={column.field}
                    onClick={() => handleSort(column.field)}
                  >
                    {column.title}
                    {sortConfig.key === column.field && (
                      <span style={{ transition: 'all 2s ease-out' }}>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TransitionGroup component={null}>
                {sortedTickets.map((ticket) => (
                  <CSSTransition key={ticket.id} timeout={500} classNames="item">
                    <TableRow sx={paperSX} key={ticket.id}>
                      <TableCell>{ticket.id}</TableCell>
                      <TableCell>{ticket.ShortDesc}</TableCell>
                      <TableCell>{ticket.State}</TableCell>
                      <TableCell>
                        <span style={{ color: priorityColors[ticket.Priority] }}>
                          {ticket.Priority}
                        </span>
                      </TableCell>
                      <TableCell>

                        <IconButton onClick={() => deleteTicket(ticket.id)}>
                          <DeleteIcon />
                        </IconButton>
                        <IconButton onClick={() => handleEditClick(ticket)}>
                          <CreateIcon />
                        </IconButton>
                        <IconButton onClick={() => handleViewClick(ticket)} >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </TableBody>
          </Table>
        </TableContainer>
      </InfiniteScroll>

      <Dialog open={Boolean(ticketInfo)} onClose={handleCloseModal}>
        {ticketInfo && (
          <>
            <DialogTitle>Ticket Details</DialogTitle>
            <DialogContent>
              <p><b>ID:</b> {ticketInfo.id}</p>
              <p><b>Short Description:</b> {ticketInfo.ShortDesc}</p>
              <p><b>Description:</b> {ticketInfo.description}</p>
              <p><b>State:</b> {ticketInfo.State}</p>
              <p><b>Priority:</b> {ticketInfo.Priority}</p>
              <p><b>Created on:</b> {ticketInfo.created_on}</p>
              <p><b>Created by:</b> {ticketInfo.createdBy}</p>

            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default TicketTable;
