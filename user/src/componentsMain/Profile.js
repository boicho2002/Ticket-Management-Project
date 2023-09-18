import React, { useEffect } from 'react';

import { Link as Link2 } from 'react-router-dom';
import { Container, Typography, Button, Grid, Card, CardContent, Avatar, Link } from '@mui/material';

const Profile = ({ isLoggedIn, user, handleLogout, setUser, setIsLoggedIn, checkLoggedInStatus }) => {
    useEffect(() => {

        checkLoggedInStatus();
    }, []);
    return (
        <div>


            <Container maxWidth="sm">
                <Typography variant="h4" component="h1" gutterBottom>
                    User Profile
                </Typography>
                {isLoggedIn ? (
                   
                    <Card elevation={3}>
                        
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={3}>
                                    <Avatar>{user.FullName && user.FullName[0]}</Avatar>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="h4">Welcome, {user.FullName}!</Typography>
                                    <Typography variant="subtitle1">Role: {user.role}</Typography>
                                </Grid>
                            </Grid>
                            <Button variant="contained" color="primary" onClick={handleLogout} sx={{ marginTop: 2 }}>
                                Logout
                            </Button>
                            <Button color="inherit" component={Link2} to="/ticketlist" sx={{ marginTop: 2 }}>
                                View Tickets
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Typography variant="h5" gutterBottom>
                        You are not logged in!<Link href="/login" > Login here</Link>
                    </Typography>
                )}
            </Container>
        </div>
    )
}

export default Profile