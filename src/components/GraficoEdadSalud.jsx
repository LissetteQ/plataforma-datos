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
  { edad: '0-5', cantidad: 620 },
  { edad: '6-10', cantidad: 755 },
  { edad: '11-15', cantidad: 812 },
  { edad: '16-20', cantidad: 921 },
  { edad: '21-25', cantidad: 1043 },
  { edad: '26-30', cantidad: 1157 },
  { edad: '31-35', cantidad: 1098 },
  { edad: '36-40', cantidad: 968 },
  { edad: '41-45', cantidad: 845 },
  { edad: '46-50', cantidad: 782 },
  { edad: '51-55', cantidad: 710 },
  { edad: '56-60', cantidad: 645 },
  { edad: '61-65', cantidad: 498 },
  { edad: '66-70', cantidad: 412 },
  { edad: '71-75', cantidad: 289 },
  { edad: '76-80', cantidad: 190 },
  { edad: '81-85', cantidad: 122 },
];

export default function GraficoEdadSalud() {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Distribución por Edad Quinquenal (2024)
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="edad" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cantidad" fill="#2196f3" />
        </BarChart>
      </ResponsiveContainer>

      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        La mayor concentración de beneficiarios se encuentra entre los 26 y 35 años, reflejando una fuerte presencia de personas en edad laboral activa dentro del sistema de salud.
      </Typography>
    </Paper>
  );
}