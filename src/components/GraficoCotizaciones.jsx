import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { categoria: 'Cotiza ambas', porcentaje: 58.9 },
  { categoria: 'Sólo una cotización', porcentaje: 13.7 },
  { categoria: 'No cotiza', porcentaje: 27.4 },
];

export default function GraficoCotizaciones() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="categoria" />
        <YAxis domain={[0, 100]} />
        <Tooltip formatter={(value) => `${value}%`} />
        <Bar dataKey="porcentaje" fill="#fb8c00" />
      </BarChart>
    </ResponsiveContainer>
  );
}