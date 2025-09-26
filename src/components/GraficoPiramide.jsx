// src/components/GraficoPiramideSexo.jsx
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
import {
  Box,
  Paper,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { getPiramide } from "../services/trabajoApi";

const VARIABLES = [
  ["pet", "Población en edad de trabajar (PET)"],
  ["fdt", "Fuerza de trabajo (FDT)"],
  ["oc", "Ocupados (OC)"],
  ["des", "Desocupados (DES)"],
  ["id", "Iniciadores disponibles (ID)"],
  ["tpi", "Tiempo parcial involuntario (TPI)"],
  ["obe", "Ocupados que buscaron empleo (OBE)"],
  ["ftp", "Fuerza de trabajo potencial (FTP)"],
  ["fta", "Fuerza de trabajo ampliada (FTA)"],
  ["fft", "Fuera de la fuerza de trabajo (FFT)"],
  ["oi", "Ocupación informal (OI)"],
  ["osi", "Ocupación en sector informal (OSI)"],
];

const ORDEN_EDAD = ["15-24", "25-34", "35-44", "45-54", "55-64", "65 y más"];

export default function GraficoPiramideSexo() {
  const [periodo, setPeriodo] = useState("2024T2");
  const [variable, setVariable] = useState("pet");
  const [porcentual, setPorcentual] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getPiramide({ periodo }).then((r) => setRows(Array.isArray(r) ? r : []));
  }, [periodo]);

  const data = useMemo(() => {
    const byAge = new Map(); // tramo -> { Hombres, Mujeres }
    for (const r of rows) {
      const tramo = r.tramo_edad;
      if (!byAge.has(tramo)) byAge.set(tramo, { tramo_edad: tramo, Hombres: 0, Mujeres: 0 });
      const key = r.sexo === "Hombre" ? "Hombres" : "Mujeres";
      byAge.get(tramo)[key] += Number(r?.[variable] ?? 0);
    }

    // ordenar por tramo
    const arr = Array.from(byAge.values()).sort((a, b) => {
      const ia = ORDEN_EDAD.indexOf(a.tramo_edad);
      const ib = ORDEN_EDAD.indexOf(b.tramo_edad);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });

    if (!porcentual) {
      // valores absolutos: H a la izquierda (negativos), M a la derecha (positivos)
      return arr.map((d) => ({
        tramo_edad: d.tramo_edad,
        Hombres: -Math.abs(d.Hombres || 0),
        Mujeres: Math.abs(d.Mujeres || 0),
      }));
    }

    // porcentual: sobre el total general (H+M de todos los tramos)
    const total = arr.reduce((acc, d) => acc + (d.Hombres || 0) + (d.Mujeres || 0), 0) || 1;
    return arr.map((d) => ({
      tramo_edad: d.tramo_edad,
      Hombres: -((Math.abs(d.Hombres || 0) / total) * 100),
      Mujeres: (Math.abs(d.Mujeres || 0) / total) * 100,
    }));
  }, [rows, variable, porcentual]);

  // dominio simétrico (mismo ancho a izq y der)
  const maxAbs = useMemo(() => {
    const vals = data.flatMap((d) => [Math.abs(d.Hombres), Math.abs(d.Mujeres)]);
    return Math.max(1, ...vals);
  }, [data]);

  const tituloVar = VARIABLES.find(([k]) => k === variable)?.[1] ?? "";

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Periodo</InputLabel>
          <Select value={periodo} label="Periodo" onChange={(e) => setPeriodo(e.target.value)}>
            <MenuItem value="2024T2">2024T2</MenuItem>
            {/* agrega más periodos cuando tu API los entregue */}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 280 }}>
          <InputLabel>Variable</InputLabel>
          <Select value={variable} label="Variable" onChange={(e) => setVariable(e.target.value)}>
            {VARIABLES.map(([k, name]) => (
              <MenuItem key={k} value={k}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Switch
              checked={porcentual}
              onChange={(e) => setPorcentual(e.target.checked)}
            />
          }
          label="Mostrar en %"
          sx={{ ml: "auto" }}
        />
      </Stack>

      <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "center", mb: 1 }}>
        Pirámide por tramo de edad y sexo — {tituloVar} ({periodo})
      </Typography>

      <Box sx={{ width: "100%", height: 420 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 24, left: 24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[-maxAbs, maxAbs]}
              tickFormatter={(v) =>
                porcentual ? `${Math.abs(v).toFixed(1)}%` : Math.abs(v).toLocaleString("es-CL")
              }
            />
            <YAxis type="category" dataKey="tramo_edad" />
            <Tooltip
              formatter={(v, n) => [
                porcentual ? `${Math.abs(Number(v)).toFixed(1)}%` : Math.abs(Number(v)).toLocaleString("es-CL"),
                n,
              ]}
              labelFormatter={(l) => `Tramo: ${l}`}
            />
            <Legend />
            <Bar dataKey="Hombres" name="Hombres" fill="#0b4582" />
            <Bar dataKey="Mujeres" name="Mujeres" fill="#eb3c46" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}