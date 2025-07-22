import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BugReportIcon from '@mui/icons-material/BugReport';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

export default function Soporte() {
  return (
    <Box sx={{ backgroundColor: '#fff', py: 4 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: 700, mb: 2 }}
        >
          Centro de Soporte
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{
            color: 'text.secondary',
            maxWidth: 800,
            mx: 'auto',
            mb: 4,
          }}
        >
          Encuentra respuestas a tus preguntas, reporta problemas o solicita ayuda.
          Estamos aquí para asegurar que tengas la mejor experiencia con nuestra
          plataforma.
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {/* Card 1 */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Centro de Ayuda
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', mt: 1, mb: 2 }}
              >
                Busca respuestas en nuestra base de conocimientos
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: 'black',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#333' },
                }}
              >
                Buscar Ayuda
              </Button>
            </Paper>
          </Grid>

          {/* Card 2 */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
              <BugReportIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Reportar Problema
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', mt: 1, mb: 2 }}
              >
                Informa sobre errores técnicos o de datos
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: 'black',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#333' },
                }}
              >
                Reportar
              </Button>
            </Paper>
          </Grid>

          {/* Card 3 */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
              <LightbulbIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Sugerir Mejora
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', mt: 1, mb: 2 }}
              >
                Comparte ideas para mejorar la plataforma
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: 'black',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#333' },
                }}
              >
                Sugerir
              </Button>
            </Paper>
          </Grid>

          {/* Card 4 */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Chat en Vivo
              </Typography>
              <Chip
                label="Próximamente"
                size="small"
                sx={{
                  bgcolor: '#eeeeee',
                  mt: 1,
                  mb: 2,
                  color: 'text.secondary',
                }}
              />
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', mb: 2 }}
              >
                Habla directamente con nuestro equipo
              </Typography>
              <Button
                variant="contained"
                fullWidth
                disabled
                sx={{
                  bgcolor: '#999',
                  textTransform: 'none',
                }}
              >
                Iniciar Chat
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}