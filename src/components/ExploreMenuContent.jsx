import React from 'react';
import { Box, Typography, Grid, Paper, Divider } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MapIcon from '@mui/icons-material/Map';
import StorageIcon from '@mui/icons-material/Storage';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function ExploreMenuContent() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}
      >
        Explorar Datos
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
        Accede a una amplia gama de datos públicos de Chile. Explora estadísticas socioeconómicas, geográficas y demográficas para comprender mejor la realidad del país.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              <TrendingUpIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Datos Socioeconómicos
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Información sobre pobreza, desigualdad, ingresos y condiciones de vida
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Fuentes de datos:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Encuesta CASEN <br />
              • Registro Social de Hogares <br />
              • Índice de Desarrollo Humano
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              <MapIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Datos Geográficos
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Mapas interactivos y datos georreferenciados por región y comuna
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Fuentes de datos:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Límites administrativos <br />
              • Centros poblados <br />
              • Infraestructura
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              <StorageIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Estadísticas Públicas
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Datos oficiales del gobierno y organismos públicos
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Fuentes de datos:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • INE <br />
              • MINSAL <br />
              • MINEDUC <br />
              • Ministerio de Desarrollo Social
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              <BarChartIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Indicadores Económicos
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Datos macroeconómicos, empleo, inflación y crecimiento
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Fuentes de datos:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Banco Central <br />
              • DIPRES <br />
              • SII <br />
              • Superintendencias
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}