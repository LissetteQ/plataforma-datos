// src/components/GraficoESIIngresos.jsx
import React, { useMemo } from "react";
import { useMediaQuery, useTheme, Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

const COL_HOMBRES = "#0B3D91";
const COL_MUJERES = "#D70000";
const COL_TOTAL = "#fc9797ff";

const FALLBACK_ROWS = [
  { anio: 2018, total: 620000, hombres: 660000, mujeres: 580000 },
  { anio: 2019, total: 640000, hombres: 680000, mujeres: 600000 },
  { anio: 2020, total: 585000, hombres: 615000, mujeres: 555000 },
  { anio: 2021, total: 610000, hombres: 650000, mujeres: 570000 },
  { anio: 2022, total: 655000, hombres: 695000, mujeres: 615000 },
  { anio: 2023, total: 670000, hombres: 710000, mujeres: 630000 },
  { anio: 2024, total: 690000, hombres: 730000, mujeres: 650000 },
];

const pesoCL = (v) =>
  v == null ? "—" : `$${Number(v).toLocaleString("es-CL")}`;

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

  const dataset = useMemo(() => FALLBACK_ROWS, []);

  const values = dataset
    .flatMap((r) => [r.hombres, r.mujeres, r.total])
    .filter((v) => v != null);

  const minY = values.length ? Math.min(...values) : 0;
  const maxY = values.length ? Math.max(...values) : 0;
  const pad = Math.round((maxY - minY) * 0.08);

  const labelFont = isXs ? 11 : 12;
  const chartHeight = isXs ? 300 : isMdUp ? 400 : 360;

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <BarChart
        height={chartHeight}
        dataset={dataset}
        xAxis={[
          {
            dataKey: "anio",
            scaleType: "band",
            tickLabelStyle: {
              fontSize: labelFont,
              angle: isXs ? 0 : 0,
              textAnchor: "middle",
            },
          },
        ]}
        yAxis={[
          {
            min: minY - pad,
            max: maxY + pad,
            tickNumber: isXs ? 4 : 6,
            valueFormatter: pesoCompact,
            tickLabelStyle: { fontSize: labelFont },
          },
        ]}
        margin={{
          top: isXs ? 6 : 12,
          right: isXs ? 10 : 18,
          bottom: isXs ? 18 : 30,
          left: isXs ? 60 : 80,
        }}
        series={[
          { label: "Hombres", dataKey: "hombres", color: COL_HOMBRES, valueFormatter: pesoCL },
          { label: "Mujeres", dataKey: "mujeres", color: COL_MUJERES, valueFormatter: pesoCL },
          { label: "Total", dataKey: "total", color: COL_TOTAL, valueFormatter: pesoCL },
        ]}
        grid={{ horizontal: true, vertical: false }}
        slotProps={{
          legend: {
            position: { vertical: "bottom", horizontal: "middle" },
            direction: "row",
            sx: { "& li": { fontSize: labelFont } },
          },
          tooltip: { valueFormatter: pesoCL },
        }}
        sx={{
          "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
            fontSize: labelFont,
          },
          "& .MuiChartsLegend-label": { fontSize: `${labelFont}px` },
        }}
      />

      {/* Línea de años visible solo en móviles */}
      {isXs && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 1.5,
            mt: 1,
          }}
        >
          {dataset.map((d) => (
            <Typography
              key={d.anio}
              sx={{
                fontSize: "11px",
                flex: 1,
                textAlign: "center",
              }}
            >
              {d.anio}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
}
