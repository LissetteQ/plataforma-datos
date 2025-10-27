import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Box } from "@mui/material";

export default function EduLineSexo({ data }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: 14,
          color: "#555",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        No hay datos disponibles
      </Box>
    );
  }

  // convertimos [{anio, genero:[{sexo,matricula}, ...]}] en
  // [{anio, Hombre: x, Mujer: y, SinInfo: z}, ...]
  const formatted = data.map((row) => {
    const out = { anio: row.anio, Hombre: 0, Mujer: 0, SinInfo: 0 };
    row.genero.forEach((g) => {
      if (g.sexo === "Hombre") out.Hombre = g.matricula;
      else if (g.sexo === "Mujer") out.Mujer = g.matricula;
      else out.SinInfo = g.matricula;
    });
    return out;
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={formatted}
        margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
      >
        <Legend
          verticalAlign="top"
          align="left"
          wrapperStyle={{
            paddingBottom: "10px",
            fontSize: "13px",
          }}
        />
        <XAxis dataKey="anio" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value, name) => [
            value.toLocaleString("es-CL"),
            name === "SinInfo" ? "Sin información" : name,
          ]}
          labelFormatter={(label) => `Año ${label}`}
        />
        <Line
          type="monotone"
          dataKey="Hombre"
          stroke="#1976d2"
          strokeWidth={2}
          dot={{ r: 3, strokeWidth: 1, fill: "#1976d2" }}
          activeDot={{ r: 5 }}
          name="Hombre"
        />
        <Line
          type="monotone"
          dataKey="Mujer"
          stroke="#6a1b9a"
          strokeWidth={2}
          dot={{ r: 3, strokeWidth: 1, fill: "#6a1b9a" }}
          activeDot={{ r: 5 }}
          name="Mujer"
        />
        <Line
          type="monotone"
          dataKey="SinInfo"
          stroke="#999999"
          strokeWidth={2}
          dot={{ r: 3, strokeWidth: 1, fill: "#999999" }}
          activeDot={{ r: 5 }}
          name="Sin información"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
