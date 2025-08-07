import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Hero from '../components/Hero';
import CardGrid from '../components/cards/CardGrid';
import IntroDatosChile from '../components/IntroDatosChile';

const Home = () => {
  return (
    <>
      {/* Sección principal */}
      <Hero />

      {/* Introducción con imagen y texto */}
      <IntroDatosChile />

      {/* Título descriptivo */}
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

      {/* Cards de navegación */}
      <Box sx={{ flexGrow: 1 }}>
        <CardGrid />
      </Box>

      {/* Texto explicativo final */}
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            mb: 2,
          }}
        >
          Plataforma de Visualización de Datos Públicos de Chile
        </Typography>

        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            maxWidth: '800px',
            mx: 'auto',
          }}
        >
          Esta plataforma de acceso abierto permite explorar datos sociales y económicos de Chile a través de gráficos interactivos, mapas georreferenciados y visualizaciones temáticas. Toda la información proviene de fuentes oficiales como el Banco Central, el INE y otras instituciones públicas. El objetivo es facilitar el análisis ciudadano y el uso de datos confiables para la toma de decisiones informadas.
        </Typography>
      </Container>
    </>
  );
};

export default Home;