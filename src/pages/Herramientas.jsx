import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import DownloadIcon from '@mui/icons-material/Download';
import MapIcon from '@mui/icons-material/Map';
import BarChartIcon from '@mui/icons-material/BarChart';
import StorageIcon from '@mui/icons-material/Storage';
import DescriptionIcon from '@mui/icons-material/Description';

export default function Herramientas() {
  const tools = [
    {
      icon: <CodeIcon />,
      title: 'API de Datos',
      status: 'Disponible',
      statusColor: 'success',
      description:
        'Accede programáticamente a todos nuestros datasets mediante nuestra API REST',
      features: [
        'Endpoints RESTful',
        'Autenticación por token',
        'Documentación completa',
        'Rate limiting',
      ],
      button: 'Usar Herramienta',
    },
    {
      icon: <DownloadIcon />,
      title: 'Descarga de Datasets',
      status: 'Disponible',
      statusColor: 'success',
      description:
        'Descarga datasets completos en múltiples formatos',
      features: ['CSV', 'JSON', 'Excel', 'Shapefile (GIS)'],
      button: 'Usar Herramienta',
    },
    {
      icon: <MapIcon />,
      title: 'Visualizador de Mapas',
      status: 'Beta',
      statusColor: 'info',
      description:
        'Herramienta interactiva para crear mapas temáticos',
      features: [
        'Capas personalizables',
        'Filtros avanzados',
        'Exportar imágenes',
        'Compartir mapas',
      ],
      button: 'Ver Detalles',
    },
    {
      icon: <BarChartIcon />,
      title: 'Generador de Gráficos',
      status: 'Próximamente',
      statusColor: 'warning',
      description:
        'Crea visualizaciones personalizadas de los datos',
      features: [
        'Múltiples tipos de gráficos',
        'Personalización avanzada',
        'Exportar SVG/PNG',
        'Código embebido',
      ],
      button: 'Próximamente',
    },
    {
      icon: <StorageIcon />,
      title: 'Query Builder',
      status: 'Desarrollo',
      statusColor: 'warning',
      description:
        'Constructor visual de consultas para datasets complejos',
      features: [
        'Interfaz drag & drop',
        'Filtros múltiples',
        'Agregaciones',
        'Vista previa en tiempo real',
      ],
      button: 'Próximamente',
    },
    {
      icon: <DescriptionIcon />,
      title: 'Reportes Automáticos',
      status: 'Planificado',
      statusColor: 'default',
      description:
        'Genera reportes automáticos basados en los datos',
      features: [
        'Plantillas predefinidas',
        'Programación automática',
        'Múltiples formatos',
        'Distribución por email',
      ],
      button: 'Próximamente',
    },
  ];

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}
      >
        Herramientas
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
        Conjunto de herramientas diseñadas para facilitar el acceso, análisis y
        visualización de datos públicos chilenos. Desde APIs hasta herramientas
        de visualización interactiva.
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {tools.map((tool, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                  {tool.icon}
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {tool.title}
                  </Typography>
                  <Chip
                    label={tool.status}
                    color={tool.statusColor}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {tool.description}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Características:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tool.features.map((f, i) => (
                    <React.Fragment key={i}>
                      • {f}
                      <br />
                    </React.Fragment>
                  ))}
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="inherit"
                  disabled={tool.status !== 'Disponible' && tool.status !== 'Beta'}
                  fullWidth
                  sx={{
                    backgroundColor:
                      tool.status === 'Disponible' || tool.status === 'Beta'
                        ? 'black'
                        : '#f0f0f0',
                    color:
                      tool.status === 'Disponible' || tool.status === 'Beta'
                        ? 'white'
                        : 'text.secondary',
                    '&:hover':
                      tool.status === 'Disponible' || tool.status === 'Beta'
                        ? { backgroundColor: '#333' }
                        : {},
                  }}
                >
                  {tool.button}
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}