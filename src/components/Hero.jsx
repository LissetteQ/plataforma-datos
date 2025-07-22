import React from 'react';
import { Box, Typography, InputBase, Paper, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Hero = () => {
  return (
    <Box
      sx={{
        height: { xs: 250, sm: 350 },
        backgroundImage: 'url("/img/Baner.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0, 0, 0, 0.4)',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 800,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          Plataforma de Datos Sociales de Chile
        </Typography>

        <Paper
          component="form"
          sx={{
            mt: { xs: 3, sm: 5, md: 7 },  
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: { xs: '100%', sm: 400 },
            bgcolor: 'rgba(255, 255, 255, 0.85)',
            borderRadius: 4,
          }}
          elevation={0}
        >
          <InputBase
            sx={{
              ml: 1,
              flex: 1,
              color: 'black',
            }}
            placeholder="Buscar..."
            inputProps={{ 'aria-label': 'buscar' }}
          />
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>
    </Box>
  );
};

export default Hero;
