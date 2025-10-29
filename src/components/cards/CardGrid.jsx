import React from 'react';
import { Box, Typography } from '@mui/material';
import CardItem from './CardItem';

const cards = [
  {
    id: 1,
    title: 'Macroeconomía',
    description: 'Datos relevantes sobre el desempeño macroeconómico de Chile: PIB, inflación y empleo.',
    image: '/img/grafico.png',
    route: '/macroeconomia',
  },
  {
    id: 3,
    title: 'Educación',
    description: 'Indicadores y datos sobre educación en Chile.',
    image: '/img/libro.png',
    route: '/educacion',
  },
  {
    id: 4,
    title: 'Salud',
    description: 'Estadísticas y datos del sistema de salud.',
    image: '/img/salud.png',
    route: '/salud',
  },
  {
    id: 5,
    title: 'Trabajo',
    description: 'Información sobre empleo y condiciones laborales.',
    image: '/img/trabajo.png',
    route: '/trabajo',
  },
];

const srOnly = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

const CardGrid = () => {
  const titleId = 'home-secciones-title';

  return (
    <Box
      component="section"
      role="region"
      aria-labelledby={titleId}
      sx={{ width: '100%' }}
    >
      {/* Título accesible del landmark (no visible) */}
      <Typography id={titleId} component="h2" sx={srOnly}>
        Secciones principales del sitio
      </Typography>

      <Box
        component="ul"
        role="list"
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))',
          gap: 2,
          p: 3,
          m: 0,
          listStyle: 'none',
        }}
      >
        {cards.map((card) => {
          const itemLabelId = `cardgrid-item-${card.id}-label`;
          const itemDescId = `cardgrid-item-${card.id}-desc`;

          return (
            <Box
              key={card.id}
              component="li"
              role="listitem"
              aria-labelledby={itemLabelId}
              aria-describedby={itemDescId}
              sx={{ minWidth: 0 }}
            >
              {/* Etiquetas accesibles para el item (no visibles) */}
              <Typography id={itemLabelId} component="span" sx={srOnly}>
                {card.title}
              </Typography>
              <Typography id={itemDescId} component="span" sx={srOnly}>
                {card.description}
              </Typography>

              {/* Tarjeta visual existente */}
              <CardItem
                title={card.title}
                description={card.description}
                image={card.image}
                route={card.route}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default CardGrid;
