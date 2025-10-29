// src/components/GraficoESIIngresos.jsx
import React, { useMemo } from "react";
import { useMediaQuery, useTheme, Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

/* Colores institucionales */
const COL_HOMBRES = "#0B3D91"; // azul Nodo
const COL_MUJERES = "#D70000"; // rojo FES
const COL_TOTAL = "#fc9797ff"; // rosado claro

// Datos fijos (fallback) para la demo / presentación
const FALLBACK_ROWS = [
  { anio: 2018, total: 620000, hombres: 660000, mujeres: 580000 },
  { anio: 2019, total: 640000, hombres: 680000, mujeres: 600000 },
  { anio: 2020, total: 585000, hombres: 615000, mujeres: 555000 },
  { anio: 2021, total: 610000, hombres: 650000, mujeres: 570000 },
  { anio: 2022, total: 655000, hombres: 695000, mujeres: 615000 },
  { anio: 2023, total: 670000, hombres: 710000, mujeres: 630000 },
  { anio: 2024, total: 690000, hombres: 730000, mujeres: 650000 },
];

// Formato pesos CLP completo (tooltip, lectura)
const pesoCL = (v) =>
  v == null ? "—" : `$${Number(v).toLocaleString("es-CL")}`;

// Formato compacto para eje Y ($735k / $1.2M)
const pesoCompact = (v) => {
  if (v == null) return "—";
  const n = Number(v);
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(n / 1_000)}k`;
};

export default function GraficoESIIngresos() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  // Usamos directamente el fallback como dataset base
  const dataset = useMemo(
    () =>
      FALLBACK_ROWS.map((r) => ({
        anio: r.anio,
        hombres: r.hombres ?? null,
        mujeres: r.mujeres ?? null,
        total: r.total ?? null,
      })),
    []
  );

  // calculamos rango eje Y con padding
  const values = dataset
    .flatMap((r) => [r.hombres, r.mujeres, r.total])
    .filter((v) => v != null);

  const minY = values.length ? Math.min(...values) : 0;
  const maxY = values.length ? Math.max(...values) : 0;
  const pad = Math.round((maxY - minY) * 0.08);

  // estilos responsivos
  const labelFont = isXs ? 11 : 12;
  const chartHeight = isXs ? 320 : isMdUp ? 400 : 360;

  const descripcion =
    "Este indicador resume cuánto están ganando hombres y mujeres según la Encuesta Suplementaria de Ingresos. " +
    "Permite ver si los ingresos suben o se estancan y cuál es la brecha de género en términos concretos.";

  // Render directo (sin loading, sin fetch)
  return (
    <Box sx={{ width: "100%" }}>
      <BarChart
        height={chartHeight}
        dataset={dataset}
        xAxis={[
          {
            dataKey: "anio",
            scaleType: "band",
            tickLabelStyle: {
              fontSize: labelFont,
              angle: isXs ? -35 : 0,
              textAnchor: isXs ? "end" : "middle",
            },
          },
        ]}
        yAxis={[
          {
            min: values.length ? minY - pad : undefined,
            max: values.length ? maxY + pad : undefined,
            tickNumber: isXs ? 4 : 6,
            valueFormatter: pesoCompact,
            tickLabelStyle: { fontSize: labelFont },
          },
        ]}
        margin={{
          top: isXs ? 6 : 12,
          right: isXs ? 12 : 18,
          bottom: isXs ? 36 : 30,
          left: isXs ? 64 : 78,
        }}
        series={[
          {
            label: "Hombres",
            dataKey: "hombres",
            color: COL_HOMBRES,
            valueFormatter: (v) => pesoCL(v),
          },
          {
            label: "Mujeres",
            dataKey: "mujeres",
            color: COL_MUJERES,
            valueFormatter: (v) => pesoCL(v),
          },
          {
            label: "Total",
            dataKey: "total",
            color: COL_TOTAL,
            valueFormatter: (v) => pesoCL(v),
          },
        ]}
        grid={{ horizontal: true, vertical: false }}
        slotProps={{
          legend: {
            position: { vertical: "bottom", horizontal: "middle" },
            direction: "row",
            sx: {
              "& li": {
                fontSize: labelFont,
                fontFamily: "Roboto, system-ui, sans-serif",
              },
            },
          },
          tooltip: {
            valueFormatter: (v) => pesoCL(v),
          },
        }}
        sx={{
          "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
            fontSize: labelFont,
          },
          "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
            fontSize: labelFont,
          },
          "& .MuiChartsLegend-label": {
            fontSize: `${labelFont}px`,
          },
        }}
      />
    </Box>
  );
}
