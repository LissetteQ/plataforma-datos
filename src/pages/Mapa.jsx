import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import LeafletMap from '../components/LeafletMap';
import CategoryLegend from '../components/CategoryLegend/CategoryLegend';

export default function Mapa() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (label) => {
    setSelectedCategory(label);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}
      >
        Mapa Interactivo Región Metropolitana
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          mt: 4,
          backgroundColor: '#f5f5f5',
          p: 3,
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
          }}
        >
          <LeafletMap selectedCategory={selectedCategory} />
        </Box>
      </Box>
    </Container>
  );
}