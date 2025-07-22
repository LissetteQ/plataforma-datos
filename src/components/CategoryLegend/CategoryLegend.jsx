import React from 'react';
import { Box, Typography, FormControlLabel, Checkbox, Stack, Paper } from '@mui/material';

const socioEconomicGroups = [
  { label: 'E', description: 'Muy bajo', color: '#8B0000' },
  { label: 'D', description: 'Bajo', color: '#FF0000' },
  { label: 'C3', description: 'Medio bajo', color: '#FFB400' },
  { label: 'C2', description: 'Medio alto', color: '#FFE066' },
  { label: 'C1', description: 'Alto', color: '#75B5FF' },
  { label: 'AB', description: 'Muy alto', color: '#003399' },
];

export default function CategoryLegend({
  selectedCategory = null,
  onCategoryChange = () => {},
}) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        backgroundColor: '#fff',
        width: '100%',
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          textTransform: 'uppercase',
          fontSize: { xs: '1rem', md: '1.25rem' },
        }}
      >
        Distribución Grupos Económicos RM
      </Typography>

      <Stack spacing={1} sx={{ mt: 2 }}>
        {socioEconomicGroups.map((item) => (
          <FormControlLabel
            key={item.label}
            control={
              <Checkbox
                checked={selectedCategory === item.label}
                onChange={() =>
                  onCategoryChange(selectedCategory === item.label ? null : item.label)
                }
                sx={{
                  color: item.color,
                  '&.Mui-checked': {
                    color: item.color,
                  },
                }}
              />
            }
            label={
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: `${item.color}22`,
                  borderRadius: 1,
                  p: 0.5,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                  }}
                >
                  ({item.description})
                </Typography>
              </Box>
            }
          />
        ))}
      </Stack>
    </Paper>
  );
}