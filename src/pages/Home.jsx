import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Hero from '../components/Hero';
import CardGrid from '../components/cards/CardGrid';

const Home = () => {
  return (
    <>
      <Hero />

      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            textTransform: 'uppercase',
            fontSize: { xs: '1.5rem', md: '2rem' },
            mb: 2,
          }}
        >
          Descubre la Plataforma de Datos
        </Typography>

        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            maxWidth: '700px',
            mx: 'auto',
          }}
        >
          Explora distintas áreas temáticas y accede a datos georreferenciados y visualizaciones interactivas sobre la realidad social y económica de Chile.
        </Typography>
      </Container>

      <Box sx={{ flexGrow: 1 }}>
        <CardGrid />
      </Box>
    </>
  );
};

export default Home;