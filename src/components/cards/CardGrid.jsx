import React from 'react';
import { Box } from '@mui/material';
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

const CardGrid = () => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))',
        gap: 2,
        p: 3,
      }}
    >
      {cards.map((card) => (
        <CardItem
          key={card.id}
          title={card.title}
          description={card.description}
          image={card.image}
          route={card.route} 
        />
      ))}
    </Box>
  );
};

export default CardGrid;