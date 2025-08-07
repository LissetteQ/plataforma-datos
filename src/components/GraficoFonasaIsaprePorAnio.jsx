// src/components/GraficoFonasaIsaprePorAnio.jsx
import React from 'react';
import { Paper, Typography } from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

const data = [
  { anio: '2018', Fonasa: 13250, Isapre: 2391 },
  { anio: '2019', Fonasa: 13410, Isapre: 2375 },
  { anio: '2020', Fonasa: 13390, Isapre: 2340 },
  { anio: '2021', Fonasa: 13275, Isapre: 2304 },
  { anio: '2022', Fonasa: 13488, Isapre: 2276 },
  { anio: '2023', Fonasa: 13591, Isapre: 2240 },
  { anio: '2024', Fonasa: 13644, Isapre: 2201 },
];

export default function GraficoFonasaIsaprePorAnio() {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mt: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Evolución de Afiliados a Fonasa e Isapre (2018 - 2024)
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="anio" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Fonasa" fill="#4caf50" />
          <Bar dataKey="Isapre" fill="#2196f3" />
        </BarChart>
      </ResponsiveContainer>

      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        Durante los últimos años, el número de afiliados a Fonasa ha mostrado una leve tendencia al alza, 
        mientras que los beneficiarios de Isapre han disminuido. Esto puede estar vinculado a condiciones 
        económicas, cambios en cotizaciones y acceso al sistema privado.
      </Typography>
    </Paper>
  );
}