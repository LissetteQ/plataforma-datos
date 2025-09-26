// src/components/GraficoTasas.jsx
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
import { Box, Typography, Stack, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { getTasas } from "../services/trabajoApi";

const LABELS = {
  td: "TD",
  to: "TO",
  tp: "TP",
  tpl: "TPL",
  su1: "SU1",
  su2: "SU2",
  su3: "SU3",
  su4: "SU4",
  toi: "TOI",
  tosi: "TOSI",
};

const PERIODOS = ["2023T2", "2024T2"];
const SEXOS = ["Nacional", "Hombre", "Mujer"];

export default function GraficoTasas() {
  const [periodo, setPeriodo] = useState("2024T2");
  const [sexo, setSexo] = useState("Nacional");
  const [row, setRow] = useState(null);

  useEffect(() => {
    getTasas({ periodo, sexo }).then((rows) => setRow((rows ?? [])[0] || null));
  }, [periodo, sexo]);

  const data = useMemo(() => {
    if (!row) return [];
    return Object.keys(LABELS).map((k) => ({
      indicador: LABELS[k],
      valor: Number(row[k] ?? 0),
    }));
  }, [row]);

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Periodo</InputLabel>
          <Select value={periodo} label="Periodo" onChange={(e) => setPeriodo(e.target.value)}>
            {PERIODOS.map((p) => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Ámbito</InputLabel>
          <Select value={sexo} label="Ámbito" onChange={(e) => setSexo(e.target.value)}>
            {SEXOS.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "center", mb: 1 }}>
        Tasas laborales y subutilización (ENE)
      </Typography>

      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="indicador" />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} />
          <Legend />
          <Bar dataKey="valor" name="Porcentaje" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
