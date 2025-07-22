import React from 'react';
import { Box } from '@mui/material';
import CardItem from './CardItem';

const cards = [
  {
    id: 1,
    title: 'Macroeconomía',
    description: 'Datos relevantes sobre el desempeño macroeconómico de Chile: PIB, inflación y empleo.',
    image: '/img/Educacion.jpg',
    route: '/educacion',
  },
  {
    id: 2,
    title: 'Pensiones',
    description: 'Información clave del sistema de pensiones.',
    image: '/img/Pensiones.jpg',
    route: '/pensiones',
  },
  {
    id: 3,
    title: 'Pobreza',
    description: 'Indicadores y datos sobre pobreza en Chile.',
    image: '/img/Pobreza.jpg',
    route: '/pobreza',
  },
  {
    id: 4,
    title: 'Salud',
    description: 'Estadísticas y datos del sistema de salud.',
    image: '/img/Salud.jpg',
    route: '/salud',
  },
  {
    id: 5,
    title: 'Trabajo',
    description: 'Información sobre empleo y condiciones laborales.',
    image: '/img/Trabajo.jpg',
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
          route={card.route}       // ✅ ¡AQUÍ se pasa el route!
        />
      ))}
    </Box>
  );
};

export default CardGrid;
