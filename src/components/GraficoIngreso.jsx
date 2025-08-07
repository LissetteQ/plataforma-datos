// GraficoIngreso.jsx
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Box, Typography } from '@mui/material';

const data = [
  { mes: 'Ene', ingreso: 545000 },
  { mes: 'Feb', ingreso: 552000 },
  { mes: 'Mar', ingreso: 563000 },
  { mes: 'Abr', ingreso: 568000 },
  { mes: 'May', ingreso: 572000 },
  { mes: 'Jun', ingreso: 574000 },
  { mes: 'Jul', ingreso: 575000 },
];

export default function GraficoIngreso() {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center', mb: 2 }}>
        Ingreso Promedio Mensual (2024)
      </Typography>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Legend />
          <Bar dataKey="ingreso" fill="#1976d2" name="Ingreso promedio" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
