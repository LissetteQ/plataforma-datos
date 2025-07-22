import React from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import PublicIcon from '@mui/icons-material/Public';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';

export default function AcercaDe() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}
      >
        Acerca de Nosotros
      </Typography>

      <Typography
        variant="body1"
        sx={{
          textAlign: 'center',
          color: 'text.secondary',
          maxWidth: 800,
          mx: 'auto',
          mb: 4,
        }}
      >
        Somos una plataforma dedicada a democratizar el acceso a datos públicos de Chile, 
        facilitando la comprensión de la realidad social y económica del país a través de 
        información confiable y herramientas accesibles.
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
        {[
          { icon: <StorageIcon fontSize="large" />, value: '150+', label: 'Datasets Disponibles' },
          { icon: <PublicIcon fontSize="large" />, value: '346', label: 'Comunas Cubiertas' },
          { icon: <PeopleAltIcon fontSize="large" />, value: '5,000+', label: 'Usuarios Activos' },
          { icon: <TrackChangesIcon fontSize="large" />, value: '1M+', label: 'APIs Consumidas' },
        ].map((item, index) => (
          <Grid key={index} item xs={6} sm={3}>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                textAlign: 'center',
                borderRadius: 2,
              }}
            >
              <Box sx={{ mb: 1 }}>{item.icon}</Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {item.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CenterFocusStrongIcon />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Nuestra Misión
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Facilitar el acceso democrático a datos públicos de Chile, promoviendo la transparencia, 
              la investigación y la toma de decisiones informadas para contribuir al desarrollo social 
              y económico del país.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <EmojiObjectsIcon />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Nuestra Visión
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Ser la plataforma de referencia para datos públicos en Chile, reconocida por su calidad, 
              accesibilidad e impacto en la generación de conocimiento y políticas públicas basadas en evidencia.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}