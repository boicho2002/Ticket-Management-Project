import React, { useEffect } from 'react'
import axios from 'axios';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Container, CssBaseline, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from './componentsMain/Navbar';
import LoginComponent from './componentsMain/LoginComponent';
import RegisterComponent from './componentsMain/RegisterComponent';
import TicketList from './componentsMain/TicketList';
import FooterComp from './componentsMain/FooterComp';
import Profile from './componentsMain/Profile';
import { useDarkMode } from './componentsMain/DarkMode';
import HomeComponent from './componentsMain/HomeComponent';
import { useState } from 'react';
const darkTheme = createTheme({
    palette: {
        mode: 'dark',

    },
   
});


export const lightTheme = createTheme({
    palette: {
        mode: 'light',

    },
    
});
function App() {
    const [tickets, setTickets] = useState([]);
    const [ticketListUpdated, setTicketListUpdated] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const [createFormOpen, setCreateFormOpen] = useState(false);
    const [isDarkMode, toggleDarkMode,icon] = useDarkMode();
    const navigate = useNavigate();
    useEffect(() => {

        checkLoggedInStatus();
    }, []);
    
    const openCreateForm = () => {
        setCreateFormOpen(true);
      };
   const handleDarkMode=()=>{
    toggleDarkMode();
   }
    const getTickets = async () => {
        await axios.get('http://localhost:5000/tickets')
          .then((response) => {
            setTickets(response.data);
          })
          .catch((error) => {
            console.error('Error fetching tickets:', error);
          });
      }
    const checkLoggedInStatus = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users/profile', { withCredentials: true });
            console.log(response.data)
            if (response.data.login) {
                setIsLoggedIn(true);
                setUser(response.data.user);
                console.log(user)
            }

        } catch (error) {
            console.error('Check login status error:', error);

        }
    };
    const handleLogout = async () => {
        try {
            await axios.get('http://localhost:5000/users/logout', { withCredentials: true });
            setIsLoggedIn(false);
            setUser({});
        } catch (error) {
            console.error('Logout error:', error);
        }
        navigate('/login')
    };
    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <div className='App' >
                
                <Navbar isDarkMode={isDarkMode} user={user} isLoggedIn={isLoggedIn} handleLogout={handleLogout} openCreateForm={openCreateForm} handleDarkMode={handleDarkMode} icon={icon} />
                <Container style={{ minHeight: '66.9vh'}}>

                    <Routes>
                        <Route path="/" element={<HomeComponent isLoggedIn={isLoggedIn} />} />
                        <Route path="/login" element={<LoginComponent />} />
                        <Route path="/register" element={<RegisterComponent />} />
                        {/* <Route path="/create-ticket" element={<CreateTicket user={user} handleOpen={handleOpen} handleClose={handleClose}/>} /> */}
                        <Route path="/ticketlist" element={<TicketList createFormOpen={createFormOpen} setCreateFormOpen={setCreateFormOpen} isLoggedIn={isLoggedIn} ticketListUpdated={ticketListUpdated} user={user}/>} />
                        <Route path="/profile" element={<Profile user={user} setUser={setUser} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} handleLogout={handleLogout} checkLoggedInStatus={checkLoggedInStatus} />} />
                    </Routes>
                </Container>
                <FooterComp />
            </div>
        </ThemeProvider>
    );
}

export default App