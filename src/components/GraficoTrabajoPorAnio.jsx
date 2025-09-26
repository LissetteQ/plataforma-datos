// src/components/GraficoTrabajoPorAnio.jsx
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { getAnual } from "../services/trabajoApi";
import { Box, Typography } from "@mui/material";

const fmtMiles = (n) => (n ?? 0).toLocaleString("es-CL");
const fmtPerc = (n) => `${(n ?? 0).toFixed(1)}%`;

export default function GraficoTrabajoPorAnio() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getAnual().then((r) => {
      const data = (r ?? []).map((d) => ({
        anio: d.anio,
        fuerza_laboral: d.fuerza_laboral,
        tasa_desempleo: d.tasa_desempleo,
      }));
      setRows(data);
    });
  }, []);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "center", mb: 2 }}>
        Evolución de Fuerza Laboral y Desempleo (Muestra)
      </Typography>

      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart data={rows} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="anio" />
          <YAxis
            yAxisId="left"
            tickFormatter={fmtMiles}
            label={{ value: "Fuerza laboral", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 15]}
            tickFormatter={(v) => `${v}`}
            label={{ value: "Desempleo (%)", angle: 90, position: "insideRight" }}
          />
          <Tooltip
            formatter={(value, name) =>
              name === "Fuerza Laboral" ? fmtMiles(value) : fmtPerc(value)
            }
            labelFormatter={(l) => `Año: ${l}`}
          />
          <Legend />
          <Bar
            yAxisId="left"
            name="Fuerza Laboral"
            dataKey="fuerza_laboral"
            radius={[6, 6, 0, 0]}
          />
          <Line
            yAxisId="right"
            name="Desempleo (%)"
            dataKey="tasa_desempleo"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            type="monotone"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}
