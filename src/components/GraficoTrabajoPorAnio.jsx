import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Box, Typography } from "@mui/material";

const data = [
  { año: "2018", fuerza: 4180, desempleo: 8.2 },
  { año: "2019", fuerza: 4360, desempleo: 8.7 },
  { año: "2021", fuerza: 3980, desempleo: 11.3 },
  { año: "2022", fuerza: 4220, desempleo: 9.1 },
  { año: "2023", fuerza: 4300, desempleo: 7.9 },
  { año: "2024", fuerza: 4239, desempleo: 31.6 },
];

export default function GraficoTrabajoPorAnio() {
  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "center", mb: 2 }}>
        Evolución de Fuerza Laboral y Desempleo (Muestra)
      </Typography>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="año" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="fuerza" fill="#1976d2" name="Fuerza Laboral" />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="desempleo"
            stroke="#fb8c00"
            strokeWidth={3}
            name="Desempleo (%)"
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}