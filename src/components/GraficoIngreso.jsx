// src/components/GraficoIngreso.jsx
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

const fmtCLP = (n) => `$${(n ?? 0).toLocaleString("es-CL")}`;

function groupAvg(arr, key) {
  const map = new Map();
  for (const r of arr) {
    const k = r[key];
    if (k == null) continue;
    const v = Number(r.ingreso_promedio ?? 0);
    const acc = map.get(k) || { sum: 0, n: 0 };
    acc.sum += v;
    acc.n += 1;
    map.set(k, acc);
  }
  const out = [];
  for (const [k, { sum, n }] of map.entries()) {
    out.push({ k, ingreso: Math.round(sum / Math.max(n, 1)) });
  }
  // ordenar numéricamente (mes o año)
  out.sort((a, b) => Number(a.k) - Number(b.k));
  return out;
}

const monthName = (m) =>
  ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][m - 1] ||
  String(m);

export default function GraficoIngreso() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getDataset().then((r) => setRows(Array.isArray(r) ? r : []));
  }, []);

  const chart = useMemo(() => {
    // ¿hay meses? si sí, graficamos el último año con meses
    const tieneMes = rows.some((r) => Number(r.mes) > 0);
    if (tieneMes) {
      const yearsWithMonth = [...new Set(rows.filter((r) => r.mes).map((r) => r.anio))];
      const year = Math.max(...yearsWithMonth);
      const byMonth = groupAvg(rows.filter((r) => r.anio === year), "mes").map((d) => ({
        etiqueta: monthName(Number(d.k)),
        ingreso: d.ingreso,
      }));
      return { titulo: `Ingreso Promedio Mensual (${year})`, data: byMonth };
    }
    // si no hay meses, agrupamos por año
    const byYear = groupAvg(rows, "anio").map((d) => ({
      etiqueta: String(d.k),
      ingreso: d.ingreso,
    }));
    return { titulo: "Ingreso Promedio Anual", data: byYear };
  }, [rows]);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "center", mb: 2 }}>
        {chart.titulo}
      </Typography>

      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={chart.data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="etiqueta" />
          <YAxis tickFormatter={(v) => v.toLocaleString("es-CL")} />
          <Tooltip formatter={(v) => fmtCLP(v)} />
          <Legend />
          <Bar dataKey="ingreso" name="Ingreso promedio" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
