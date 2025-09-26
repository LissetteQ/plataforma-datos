// src/components/GraficoIngresoAnual.jsx
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
} from "recharts";
import { Box, Typography } from "@mui/material";
import { getAnual } from "../services/trabajoApi";

const fmtCLP = (n) => `$${(n ?? 0).toLocaleString("es-CL")}`;

export default function GraficoIngresoAnual() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getAnual().then((r) => {
      const data = (r ?? []).map((d) => ({
        anio: d.anio,
        ingreso_promedio: Number(d.ingreso_promedio ?? 0),
        tasa_desempleo: Number(d.tasa_desempleo ?? 0),
      }));
      setRows(data);
    });
  }, []);

  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "center", mb: 2 }}>
        Ingreso Medio de la Población (Anual)
      </Typography>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={rows} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="anio" />
          <YAxis yAxisId="left" tickFormatter={(v) => v.toLocaleString("es-CL")} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 15]} />
          <Tooltip
            formatter={(v, n) => (n === "Ingreso promedio" ? fmtCLP(v) : `${v}%`)}
            labelFormatter={(l) => `Año: ${l}`}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="ingreso_promedio"
            name="Ingreso promedio"
            radius={[6, 6, 0, 0]}
          />
          <Line
            yAxisId="right"
            dataKey="tasa_desempleo"
            name="Desempleo (%)"
            strokeWidth={3}
            type="monotone"
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
