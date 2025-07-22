import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ExploreMenuContent from '../components/ExploreMenuContent';

export default function ExplorarDatos() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Box>
        <ExploreMenuContent />
      </Box>
    </Container>
  );
}