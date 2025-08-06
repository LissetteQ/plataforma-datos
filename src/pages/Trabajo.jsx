import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import BarChartIcon from '@mui/icons-material/BarChart';
import GraficoTrabajoPorAnio from '../components/GraficoTrabajoPorAnio.jsx';

export default function Trabajo() {
  const dataCards = [
    {
      icon: PeopleIcon,
      title: 'Fuerza Laboral',
      value: '4.239',
      subtitle: 'Personas activas (muestra 2024)',
    },
    {
      icon: TrendingDownIcon,
      title: 'Desempleo',
      value: '31.6%',
      subtitle: 'Tasa nacional (muestra)',
    },
    {
      icon: BarChartIcon,
      title: 'Salario Mínimo',
      value: '$460.000',
      subtitle: 'Pesos chilenos',
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
          color: '#fb8c00',
        }}
      >
        Trabajo
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
        Estadísticas laborales, tasas de empleo y desempleo, condiciones de trabajo y mercado laboral en Chile.
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
                <item.icon sx={{ color: '#fb8c00', fontSize: 24 }} />
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

      <Box sx={{ mt: 5 }}>
        <GraficoTrabajoPorAnio />
      </Box>
    </Container>
  );
}
