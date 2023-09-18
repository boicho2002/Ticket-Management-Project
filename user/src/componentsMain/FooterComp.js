import React from 'react';
import { Typography, Container, Grid, Link, Box } from '@mui/material';
import { Facebook, Instagram, Twitter } from "@mui/icons-material";

const FooterComp = () => {
  return (
    <Box
      bottom='0'
      width="100%"
      component="footer"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        p: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              About
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ticket Management System, dedicated to provide best user experiance.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact 
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Studentski Grad,Sofia
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: boycho.boychev@dss.bg
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: 0884939817
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Follow
            </Typography>
            <Link href="https://www.facebook.com/" color="inherit">
              <Facebook />
            </Link>
            <Link
              href="https://www.instagram.com/"
              color="inherit"
              sx={{ pl: 1, pr: 1 }}
            >
              <Instagram />
            </Link>
            <Link href="https://www.twitter.com/" color="inherit">
              <Twitter />
            </Link>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="http://localhost:3000/">
              Ticket Management System
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
        </Box>
      </Container>
    </Box>
  );


}
export default FooterComp;
