import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import LeafletMap from '../components/LeafletMap';
import CategoryLegend from '../components/CategoryLegend/CategoryLegend';

export default function Pobreza() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (label) => {
    setSelectedCategory(label);
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          textTransform: 'uppercase',
          fontSize: { xs: '1.5rem', md: '2rem' },
        }}
      >
        Mapa Georeferenciados
      </Typography>

      <Container maxWidth="md" sx={{ my: { xs: 2, md: 3 } }}>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: { xs: '0.95rem', md: '1.05rem' },
          }}
        >
          En Chile, la pobreza sigue siendo un desafío importante y multifactorial que afecta a millones de personas. A pesar de avances en reducción de índices de pobreza extrema, persisten desigualdades territoriales, económicas y sociales que se reflejan en las condiciones de vida de distintas comunas y grupos socioeconómicos. Esta sección permite explorar datos georreferenciados para comprender mejor la distribución y características de la pobreza en el país.
        </Typography>
      </Container>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 4 },
          mt: { xs: 2, md: 4 },
          backgroundColor: '#f5f5f5',
          p: { xs: 2, md: 3 },
          border: '1px dashed #ccc',
          borderRadius: 2,
          justifyContent: 'flex-start',
          alignItems: { xs: 'center', md: 'flex-start' },
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: '100%', md: '300px' },
          }}
        >
          <CategoryLegend
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            width: '100%',
            minHeight: { xs: '300px', md: '500px' },
          }}
        >
          <LeafletMap selectedCategory={selectedCategory} />
        </Box>
      </Box>
    </Container>
  );
}