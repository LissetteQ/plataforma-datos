import React from 'react';
import { Paper, Typography } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Vigente', value: 8720 },
  { name: 'No vigente', value: 1280 },
];

const COLORS = ['#66bb6a', '#ef5350'];

export default function GraficoVigenciaSalud() {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Vigencia de los Beneficios (2024)
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        Aproximadamente el 87% de los beneficiarios mantiene su beneficio vigente, lo que indica una alta continuidad en el acceso al sistema de salud.
      </Typography>
    </Paper>
  );
}