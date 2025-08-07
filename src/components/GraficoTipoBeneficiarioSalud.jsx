// src/components/GraficoTipoBeneficiarioSalud.jsx
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
  { tipo: 'Cotizante Titular', cantidad: 5148 },
  { tipo: 'Carga Legal', cantidad: 3478 },
  { tipo: 'Carga Médica', cantidad: 393 },
  { tipo: 'Beneficiario Cotizante', cantidad: 527 },
  { tipo: 'Sin clasificación', cantidad: 245 },
  { tipo: 'Sin Especificar', cantidad: 209 },
];

export default function GraficoTipoBeneficiarioSalud() {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Distribución por Tipo de Beneficiario (2024)
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tipo" angle={-15} textAnchor="end" height={70} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#4caf50" />
        </BarChart>
      </ResponsiveContainer>

      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        En 2024, la mayoría de los beneficiarios corresponden a Cotizantes Titulares y Cargas Legales. 
        Esta distribución refleja la composición del sistema de salud chileno, donde gran parte de la población 
        está afiliada a través de empleadores o como cargas familiares.
      </Typography>
    </Paper>
  );
}