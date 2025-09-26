// src/components/GraficoCotizaciones.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { getDataset } from "../services/trabajoApi";
import { Box, Typography } from "@mui/material";

export default function GraficoCotizaciones() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getDataset().then((r) => setRows(r ?? []));
  }, []);

  const data = useMemo(() => {
    const total = rows.length || 1;
    const ambos = rows.filter((d) => d.cotiza_prevision === 1 && d.cotiza_salud === 1).length;
    const una = rows.filter(
      (d) =>
        (d.cotiza_prevision === 1 && d.cotiza_salud === 0) ||
        (d.cotiza_prevision === 0 && d.cotiza_salud === 1)
    ).length;
    const ninguna = rows.filter(
      (d) => d.cotiza_prevision === 0 && d.cotiza_salud === 0
    ).length;

    return [
      { categoria: "Cotiza ambas", porcentaje: Math.round((ambos / total) * 100) },
      { categoria: "Sólo una cotización", porcentaje: Math.round((una / total) * 100) },
      { categoria: "No cotiza", porcentaje: Math.round((ninguna / total) * 100) },
    ];
  }, [rows]);

  return (
    <Box sx={{ width: "100%", height: 360 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "center", mb: 2 }}>
        Cotización previsional y de salud
      </Typography>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="categoria" />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend />
          <Bar dataKey="porcentaje" name="Porcentaje" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}