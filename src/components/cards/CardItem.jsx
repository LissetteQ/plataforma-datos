import React from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { Link } from 'react-router-dom';

const CardItem = ({ title, description, image, route }) => {
  return (
    <Card
      elevation={0}
      sx={{
        position: 'relative',
        height: 430,
        borderRadius: 3,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
        border: '1px solid #E6E9EF',
        boxShadow: '0 2px 8px rgba(15,23,42,.06)',
        transition: 'transform .28s ease, box-shadow .28s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 10px 28px rgba(2,6,23,.12)',
        },
      }}
    >
      <CardActionArea
        component={Link}
        to={route}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        {/* 🔵 Zona del ícono con halo azul concentrado */}
        <Box
          sx={{
            position: 'relative',
            height: '36%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            background: `
              radial-gradient(
                circle 60px at center,
                rgba(0, 170, 255, 0.85) 0%,     /* azul brillante central */
                rgba(100, 200, 255, 0.45) 35%,  /* degradado suave */
                rgba(180, 230, 255, 0.1) 80%,   /* halo difuso */
                rgba(255, 255, 255, 0.0) 100%   /* se desvanece rápido */
              )
            `,
          }}
        >
          {/* Imagen del ícono */}
          <Box
            component="img"
            src={image}
            alt={title}
            sx={{
              width: 110,
              height: 110,
              objectFit: 'contain',
              zIndex: 1,
              filter: `
                drop-shadow(0 5px 10px rgba(0,160,255,0.35))
                drop-shadow(0 0 8px rgba(0,200,255,0.25))
              `,
              transition: 'transform .3s ease',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          />
        </Box>

        {/* Contenido */}
        <CardContent sx={{ position: 'relative', pt: 1.5, pb: 6 }}>
          <Typography
            variant="overline"
            sx={{ letterSpacing: 1.5, color: 'text.secondary', opacity: 0.9 }}
          >
            DATASET
          </Typography>

          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: 'text.primary', mt: 0.5, mb: 1 }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', lineHeight: 1.5, pb: 5 }}
          >
            {description}
          </Typography>

          {/* Botón flecha */}
          <IconButton
            sx={{
              position: 'absolute',
              right: 16,
              bottom: 16,
              width: 40,
              height: 40,
              borderRadius: '999px',
              color: '#0F172A',
              bgcolor: '#EEF2F7',
              boxShadow: 'inset 0 0 0 1px #E3E8EF',
              transition: 'transform .25s ease, background-color .25s ease',
              '&:hover': { bgcolor: '#E6EBF2', transform: 'translateX(2px)' },
            }}
          >
            <ArrowForwardIosRoundedIcon fontSize="small" />
          </IconButton>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CardItem;
