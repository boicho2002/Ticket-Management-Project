import React from 'react'
import { Typography, Container, Button, Card, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
const HomeComponent = ({ isLoggedIn }) => {
    return (
        <Container maxWidth="md">
            <Card sx={{ marginTop: 1 }}>
                <CardMedia

                    component="img"
                    alt="Ticket Management System"
                    height="auto"
                    image="https://images.unsplash.com/photo-1538905386057-4a5a580c45a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                />
                <div>
                    <Typography variant="h4" gutterBottom>
                        Welcome to the Ticket Management System
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Our system allows you to manage and track various tasks, issues, or requests using tickets.
                        You can create, view, and manage tickets efficiently to streamline your work processes.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Whether you are part of a support team, a project manager, or just need to keep track of tasks,
                        our Ticket Management System can help you stay organized and productive.
                    </Typography>
                    
                    {isLoggedIn ? (
                        <div>
                       <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/ticketlist"
                        style={{ marginRight: '16px' }}
                    >
                        View Tickets
                    </Button> 
                    <Button variant="outlined" color="primary" component={Link} to="/profile">
                            Profile
                        </Button>
                        </div>
                    ) : (
                        <Button variant="outlined" color="primary" component={Link} to="/login">
                            Log In
                        </Button>
                    )

                    }
                </div>
            </Card>
        </Container>
    );

}

export default HomeComponent