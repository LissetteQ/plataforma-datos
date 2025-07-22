import React from 'react';
import { Box, Container, Typography, TextField, Button, Grid, IconButton, Paper } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CloseIcon from '@mui/icons-material/Close';

export default function Contactanos() {
  return (
    <Box sx={{ backgroundColor: '#fff' }}>
      {/* Franja roja con título */}
      <Box
        sx={{
          width: '100%',
          bgcolor: '#B71C1C',
          color: 'white',
          py: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Contáctanos
        </Typography>
      </Box>

      {/* Formulario + Redes */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={1} sx={{ p: { xs: 2, md: 4 } }}>
          <Grid container spacing={2} alignItems="flex-start">
            {/* Campos de formulario */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    variant="outlined"
                    multiline
                    rows={5}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: '#B71C1C',
                      '&:hover': { bgcolor: '#A31515' },
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    Enviar
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {/* Redes sociales */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-end' },
                alignItems: 'center',
                gap: 2,
                mt: { xs: 3, md: 0 },
              }}
            >
              <IconButton sx={{ bgcolor: '#d7c7bb' }}>
                <FacebookIcon sx={{ color: '#B71C1C' }} />
              </IconButton>
              <IconButton sx={{ bgcolor: '#d7c7bb' }}>
                <CloseIcon sx={{ color: '#B71C1C' }} />
              </IconButton>
              <IconButton sx={{ bgcolor: '#d7c7bb' }}>
                <InstagramIcon sx={{ color: '#B71C1C' }} />
              </IconButton>
              <IconButton sx={{ bgcolor: '#d7c7bb' }}>
                <LinkedInIcon sx={{ color: '#B71C1C' }} />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}