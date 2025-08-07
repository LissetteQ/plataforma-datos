// src/pages/Salud.jsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Divider,
  Paper,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PeopleIcon from '@mui/icons-material/People';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

// Importar componentes gráficos específicos de Salud
import GraficoSexoSalud from '../components/GraficoSexoSalud';
import GraficoTipoBeneficiarioSalud from '../components/GraficoTipoBeneficiarioSalud';
import GraficoEdadSalud from '../components/GraficoEdadSalud';
import GraficoVigenciaSalud from '../components/GraficoVigenciaSalud';
import GraficoRegionSalud from '../components/GraficoRegionSalud';
import GraficoFonasaIsaprePorAnio from '../components/GraficoFonasaIsaprePorAnio'; // ✅ este es el correcto

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
        Salud en Chile
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
        Indicadores clave del sistema de salud, incluyendo distribución por edad, sexo, tipo de beneficiario y cobertura regional.
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {dataCards.map((item, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
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

      <Box sx={{ mt: 6 }}>
        <GraficoSexoSalud />
        <Divider sx={{ my: 4 }} />
        <GraficoTipoBeneficiarioSalud />
        <Divider sx={{ my: 4 }} />
        <GraficoEdadSalud />
        <Divider sx={{ my: 4 }} />
        <GraficoVigenciaSalud />
        <Divider sx={{ my: 4 }} />
        <GraficoRegionSalud />
        <Divider sx={{ my: 4 }} />
        <GraficoFonasaIsaprePorAnio />
      </Box>
    </Container>
  );
}