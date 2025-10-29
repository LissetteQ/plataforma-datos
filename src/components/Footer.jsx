import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import XIcon from '@mui/icons-material/X';



const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#e6e6e6', 
        color: 'white',
        px: 3,
        py: 5,
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        overflow: 'visible',
        marginTop: '100px',
      }}
    >
      {/* Logo Nodo + texto */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <img
          src="/img/logoNodo_COLOR.png"
          alt="Logo Nodo XXI Blanco"
          style={{ height: '60px', objectFit: 'contain' }}
        />
        <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif', color: 'black' }}>
          Desarrollado por Integratek Chile para Fundación Nodo XXI.
        </Typography>
      </Box>

      {/* Iconos sociales */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton color="black" href="https://www.facebook.com/Nodoxxi" target="_blank">
          <FacebookIcon />
        </IconButton>
        <IconButton color="black" href="https://x.com/NodoXXI" target="_blank">
          <XIcon />
        </IconButton>
        <IconButton color="black" href="https://www.instagram.com/nodoxxi/?hl=es" target="_blank">
          <InstagramIcon />
        </IconButton>
        <IconButton color="black" href="#" target="_blank">
                  <IconButton color="black" href="https://www.nodoxxi.cl/#" target="_blank"></IconButton>
          <RssFeedIcon />
        </IconButton>
      </Box>

      {/* Logo FES mucho más arriba */}
      <Box
        sx={{
          position: 'absolute',
          top: '-70px',
          right: '40px', 
          lineHeight: 0,
        }}
      >
        <img
          src="/img/FES-Logo_Standard_Rot_Bildschirm.png"
          alt="Logo FES"
          style={{ height: '100px', objectFit: 'contain', display: 'block' }}
        />
      </Box>
    </Box>
  );
};

export default Footer;
