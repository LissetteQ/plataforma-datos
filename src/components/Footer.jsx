import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import RssFeedIcon from '@mui/icons-material/RssFeed';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#A6110F',
        color: 'white',
        px: 3,
        py: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      {/* Logo + texto */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <img
          src="/img/Logo_NODO_BLANCO.png"
          alt="Logo Nodo XXI Blanco"
          style={{ height: '60px', objectFit: 'contain' }}
        />
        <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif' }}>
          Desarrollado por Integratek Chile para Fundación Nodo XXI.
        </Typography>
      </Box>

      {/* Iconos sociales */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton color="inherit" href="https://www.facebook.com" target="_blank">
          <FacebookIcon />
        </IconButton>
        <IconButton color="inherit" href="https://www.twitter.com" target="_blank">
          <TwitterIcon />
        </IconButton>
        <IconButton color="inherit" href="https://www.instagram.com" target="_blank">
          <InstagramIcon />
        </IconButton>
        <IconButton color="inherit" href="#" target="_blank">
          <RssFeedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;