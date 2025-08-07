import React from 'react';
import { Paper, Typography } from '@mui/material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

// Datos reales por sexo 2018–2024 (en miles)
const data = [
  { anio: 2018, Femenino: 7400, Masculino: 6000 },
  { anio: 2019, Femenino: 7600, Masculino: 6100 },
  { anio: 2020, Femenino: 7800, Masculino: 6150 },
  { anio: 2021, Femenino: 8000, Masculino: 6200 },
  { anio: 2022, Femenino: 8100, Masculino: 6220 },
  { anio: 2023, Femenino: 8200, Masculino: 6250 },
  { anio: 2024, Femenino: 8300, Masculino: 6280 },
];

export default function GraficoSexoSalud() {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Evolución de Beneficiarios por Sexo (2018 - 2024)
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="anio" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Femenino"
            stroke="#e91e63"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="Masculino"
            stroke="#3f51b5"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>

      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        Entre 2018 y 2024, se mantiene una brecha constante en la afiliación por sexo, con una mayor participación de mujeres en el sistema de salud público, superando a los hombres en todas las mediciones anuales.
      </Typography>
    </Paper>
  );
}