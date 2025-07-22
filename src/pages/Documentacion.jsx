import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  Paper,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import MenuBookIcon from '@mui/icons-material/Menu';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

export default function Documentacion() {
  const [tab, setTab] = useState(0);

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
  };

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
        Documentación
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
        Encuentra toda la información que necesitas para aprovechar al máximo
        nuestra plataforma de datos. Desde guías básicas hasta documentación
        técnica avanzada.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Resumen" />
          <Tab label="API" />
          <Tab label="Datos" />
          <Tab label="Tutoriales" />
        </Tabs>
      </Box>

      {/* TAB CONTENTS */}
      {tab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LightbulbIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Guía de Inicio Rápido
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Aprende a usar la plataforma en pocos minutos
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Cómo navegar por la plataforma" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Búsqueda y filtrado de datos" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Descarga de datasets" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Primeros pasos con la API" />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CodeIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Documentación de API
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Referencia completa de nuestra API REST
              </Typography>
              <List dense>
                <ListItem><ListItemText primary="Autenticación y tokens" /></ListItem>
                <ListItem><ListItemText primary="Endpoints disponibles" /></ListItem>
                <ListItem><ListItemText primary="Parámetros y filtros" /></ListItem>
                <ListItem><ListItemText primary="Ejemplos de código" /></ListItem>
                <ListItem><ListItemText primary="Rate limiting y mejores prácticas" /></ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}

      {tab === 1 && (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Documentación de API
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Referencia detallada de autenticación, endpoints y uso de la API REST para desarrolladores.
          </Typography>
          <List dense>
            <ListItem><ListItemText primary="Autenticación y manejo de tokens" /></ListItem>
            <ListItem><ListItemText primary="Lista de endpoints disponibles" /></ListItem>
            <ListItem><ListItemText primary="Filtros avanzados y parámetros" /></ListItem>
            <ListItem><ListItemText primary="Ejemplos de código en múltiples lenguajes" /></ListItem>
            <ListItem><ListItemText primary="Buenas prácticas y rate limiting" /></ListItem>
          </List>
        </Paper>
      )}

      {tab === 2 && (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Diccionario de Datos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Definiciones y metadatos de todos los datasets
          </Typography>
          <List dense>
            <ListItem><ListItemText primary="Estructura de datos socioeconómicos" /></ListItem>
            <ListItem><ListItemText primary="Variables geográficas" /></ListItem>
            <ListItem><ListItemText primary="Códigos y clasificaciones" /></ListItem>
            <ListItem><ListItemText primary="Fuentes y metodologías" /></ListItem>
          </List>
        </Paper>
      )}

      {tab === 3 && (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Tutoriales
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Guías paso a paso para casos de uso comunes
          </Typography>
          <List dense>
            <ListItem><ListItemText primary="Análisis de pobreza por comuna" /></ListItem>
            <ListItem><ListItemText primary="Creación de mapas temáticos" /></ListItem>
            <ListItem><ListItemText primary="Comparación de indicadores regionales" /></ListItem>
            <ListItem><ListItemText primary="Integración con herramientas externas" /></ListItem>
          </List>
        </Paper>
      )}

      {/* SECCIÓN FIJA DE DESCARGABLES */}
      <Box sx={{ mt: 5 }}>
        <Divider sx={{ mb: 3 }}>Descargables en PDF</Divider>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <PictureAsPdfIcon color="secondary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Manual de Usuario</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Aprende a usar la plataforma con esta guía descargable.
              </Typography>
              <Button variant="outlined" size="small" startIcon={<PictureAsPdfIcon />}>
                Descargar PDF
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <PictureAsPdfIcon color="secondary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Referencia de API</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Especificación técnica de nuestra API REST.
              </Typography>
              <Button variant="outlined" size="small" startIcon={<PictureAsPdfIcon />}>
                Descargar PDF
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}