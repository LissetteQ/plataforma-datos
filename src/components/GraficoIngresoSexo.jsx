// src/components/GraficoIngresoSexo.jsx
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
import { Box, Typography } from "@mui/material";
import { getDataset } from "../services/trabajoApi";

export default function GraficoIngresoSexo() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getDataset().then((r) => setRows(Array.isArray(r) ? r : []));
  }, []);

  const data = useMemo(() => {
    // promedio por año y sexo
    const map = new Map(); // anio -> { Hombre:{sum,n}, Mujer:{sum,n} }
    for (const r of rows) {
      const a = r.anio;
      const s = r.sexo;
      const v = Number(r.ingreso_promedio ?? 0);
      if (!map.has(a)) map.set(a, { Hombre: { sum: 0, n: 0 }, Mujer: { sum: 0, n: 0 } });
      const g = map.get(a)[s];
      if (g) { g.sum += v; g.n += 1; }
    }
    const out = [];
    for (const [anio, g] of map.entries()) {
      out.push({
        anio,
        Hombre: Math.round(g.Hombre.sum / Math.max(g.Hombre.n, 1)),
        Mujer: Math.round(g.Mujer.sum / Math.max(g.Mujer.n, 1)),
      });
    }
    out.sort((x, y) => x.anio - y.anio);
    return out;
  }, [rows]);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "center", mb: 1 }}>
        Ingreso promedio por sexo (promedio anual)
      </Typography>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="anio" />
          <YAxis tickFormatter={(v) => v.toLocaleString("es-CL")} />
          <Tooltip formatter={(v) => `$${Number(v).toLocaleString("es-CL")}`} />
          <Legend />
          <Bar dataKey="Hombre" name="Hombres" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Mujer" name="Mujeres" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}