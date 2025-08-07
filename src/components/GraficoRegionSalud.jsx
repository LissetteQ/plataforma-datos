import React from 'react';
import { Paper, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const data = [
  { region: 'RM', cantidad: 4200 },
  { region: 'Valparaíso', cantidad: 1850 },
  { region: 'Biobío', cantidad: 1320 },
  { region: 'Araucanía', cantidad: 760 },
  { region: 'Coquimbo', cantidad: 590 },
  { region: 'Antofagasta', cantidad: 450 },
  { region: 'Los Lagos', cantidad: 410 },
];

export default function GraficoRegionSalud() {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Beneficiarios por Región (2024)
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="region" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cantidad" fill="#ff9800" />
        </BarChart>
      </ResponsiveContainer>

      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        La Región Metropolitana concentra la mayor cantidad de beneficiarios del sistema, seguida por Valparaíso y Biobío, lo que refleja la densidad poblacional de estas zonas.
      </Typography>
    </Paper>
  );
}