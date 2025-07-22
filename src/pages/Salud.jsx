import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PeopleIcon from '@mui/icons-material/People';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

export default function Salud() {
  const dataCards = [
    {
      icon: FavoriteBorderIcon,
      title: 'Esperanza de Vida',
      value: '80.2',
      subtitle: 'Años promedio',
    },
    {
      icon: PeopleIcon,
      title: 'Cobertura FONASA',
      value: '78%',
      subtitle: 'Población cubierta',
    },
    {
      icon: MonitorHeartIcon,
      title: 'Médicos',
      value: '2.6',
      subtitle: 'Por 1000 habitantes',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          textTransform: 'uppercase',
          color: '#e53935',
        }}
      >
        Salud
      </Typography>

      <Typography
        variant="body1"
        sx={{
          textAlign: 'center',
          color: 'text.secondary',
          maxWidth: 700,
          mx: 'auto',
          mb: 4,
        }}
      >
        Indicadores de salud pública, acceso a servicios médicos, sistema de salud y bienestar en Chile.
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {dataCards.map((item, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 1,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <item.icon sx={{ color: '#e53935', fontSize: 24 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {item.title}
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {item.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.subtitle}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          mt: 5,
          p: 3,
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Próximamente
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Esta sección estará disponible próximamente con datos detallados sobre salud en Chile.
        </Typography>
      </Box>
    </Container>
  );
}
