// src/components/GraficoESIIngresos.jsx
import React, { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
import { Box, Paper, Typography } from "@mui/material";
import { getESIIngresos } from "../services/trabajoApi";

const fmt = (n) => Number(Math.round(n ?? 0)).toLocaleString("es-CL");

export default function GraficoESIIngresos() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getESIIngresos({ anioDesde: 2018, anioHasta: 2024 }).then((r) => {
      setRows(Array.isArray(r) ? r : []);
    });
  }, []);

  const data = useMemo(
    () =>
      rows
        .slice()
        .sort((a, b) => a.anio - b.anio)
        .map((r) => ({ anio: String(r.anio), Total: Number(r.total ?? 0), Hombres: Number(r.hombres ?? 0), Mujeres: Number(r.mujeres ?? 0) })),
    [rows]
  );

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "center", mb: 1 }}>
        Ingreso medio anual — ESI (2018–2024)
      </Typography>

      <Box sx={{ width: "100%", height: 360 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 24, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="anio" />
            <YAxis tickFormatter={(v) => `$${fmt(v)}`} />
            <Tooltip formatter={(v, n) => [`$${fmt(v)}`, n]} labelFormatter={(l) => `Año ${l}`} />
            <Legend />
            <Line type="monotone" dataKey="Hombres" stroke="#1565c0" strokeWidth={2} dot />
            <Line type="monotone" dataKey="Mujeres" stroke="#c2185b" strokeWidth={2} dot />
            <Line type="monotone" dataKey="Total"   stroke="#0b4582" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Typography variant="body2" sx={{ color: "text.secondary", mt: 1, textAlign: "center" }}>
        Fuente: ESI (CSV o fallback desde dataset). Promedios redondeados.
      </Typography>
    </Paper>
  );
}
