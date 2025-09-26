// src/components/GraficoJornada.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { getDataset } from "../services/trabajoApi";
import { Box, Typography } from "@mui/material";

const COLORS = ["#fb8c00", "#90caf9"];

export default function GraficoJornada() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getDataset().then((r) => setRows(r ?? []));
  }, []);

  const data = useMemo(() => {
    const total = rows.length || 1;
    const completa = rows.filter((d) => (d.jornada || "").toLowerCase() === "completa").length;
    const parcial = rows.filter((d) => (d.jornada || "").toLowerCase() !== "completa").length;
    return [
      { name: "Jornada completa", value: Math.round((completa / total) * 100) },
      { name: "Media jornada", value: Math.round((parcial / total) * 100) },
    ];
  }, [rows]);

  return (
    <Box sx={{ width: "100%", height: 320 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "center", mb: 2 }}>
        Tipo de Jornada Laboral
      </Typography>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={110} label>
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}