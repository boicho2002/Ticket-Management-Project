import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link,useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';

const Navbar = ({ isDarkMode,isLoggedIn, user, handleLogout, openCreateForm , handleDarkMode, icon}) => {
  const navigate=useNavigate()
  const host='http://localhost:3000/ticketlist'
  const getGradientBackground = () => {
    if (isDarkMode) {
      return {
        background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.9) 15%, rgba(0, 0, 0, 0.9) 100%)',
      };
    } else {
      return {
        background: 'rgb(2, 0, 36)',
        background: 'linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 15%, rgba(0, 212, 255, 1) 100%)',
      };
    }
  };
  return (
    <AppBar position="static" width="100%" sx={getGradientBackground()}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} style={{cursor:'pointer'}} onClick={()=>{navigate('/')}}>
        <AirplaneTicketIcon fontSize='large'/> Ticket Management
        </Typography>
        <Button onClick={handleDarkMode}>{icon}</Button>
        {isLoggedIn ? (
          <>
          {host==='http://localhost:3000/ticketlist' ?(
            <Button color="inherit" component={Link} to="/ticketlist" onClick={openCreateForm}>
              Create New Ticket
            </Button>
          ):(
            <Button color="inherit">
              Create New Ticket
            </Button>
          )}
            <IconButton color="inherit" component={Link} to="/profile">
              <AccountCircleIcon />
              <Typography sx={{ marginLeft: 1 }}>{user.FullName}</Typography>
            </IconButton>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;
