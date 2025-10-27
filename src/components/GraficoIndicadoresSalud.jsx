// src/components/GraficoIndicadoresSalud.jsx
import * as React from "react";
import { useEffect, useState } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { obtenerIndicador } from "../services/saludService";

const COLORS = {
  publico: "#00897B",
  privado: "#4FD1C5",
  totalPIB: "#FFCC00",
  constPx: "#C42430",
  corrPx: "#EF6A6A",
  ppaPx: "#1F2937",
  axis: "#1F2937",
  grid: "#E5E7EB",
};

// === Helpers ===
function normalizarSerieBase100(rows, key) {
  if (!rows?.length) return {};
  let base = null;
  for (const r of rows) {
    const v = Number(r[key]);
    if (v > 0) {
      base = v;
      break;
    }
  }
  if (!base) return {};
  const out = {};
  rows.forEach((r) => {
    const y = Number(r.anio);
    const v = Number(r[key]);
    if (v > 0) out[y] = (v / base) * 100;
  });
  return out;
}
function mergeYears(...maps) {
  const s = new Set();
  maps.forEach((m) => Object.keys(m).forEach((y) => s.add(Number(y))));
  return [...s].sort((a, b) => a - b);
}
const yTickFormatter = (v) =>
  v == null || isNaN(v) ? "" : `${Math.round(v)} M`;

// === Componente principal ===
export default function GraficoIndicadoresSalud() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const [rowsChart, setRowsChart] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const pibPP = await obtenerIndicador("publico_privado_pib");
        const saludTot = await obtenerIndicador("salud_total_pib");
        const pcConst = await obtenerIndicador("per_capita_constante");
        const pcCorr = await obtenerIndicador("per_capita_corriente");
        const pcPPA = await obtenerIndicador("per_capita_ppa");

        const mPub = normalizarSerieBase100(
          pibPP?.map((r) => ({ anio: r.anio, val: r.publico })) ?? [],
          "val"
        );
        const mPri = normalizarSerieBase100(
          pibPP?.map((r) => ({ anio: r.anio, val: r.privado })) ?? [],
          "val"
        );
        const mTot = normalizarSerieBase100(
          saludTot?.map((r) => ({ anio: r.anio, val: r.valor })) ?? [],
          "val"
        );
        const mCon = normalizarSerieBase100(
          pcConst?.map((r) => ({ anio: r.anio, val: r.valor })) ?? [],
          "val"
        );
        const mCor = normalizarSerieBase100(
          pcCorr?.map((r) => ({ anio: r.anio, val: r.valor })) ?? [],
          "val"
        );
        const mPpa = normalizarSerieBase100(
          pcPPA?.map((r) => ({ anio: r.anio, val: r.valor })) ?? [],
          "val"
        );

        const years = mergeYears(mPub, mPri, mTot, mCon, mCor, mPpa);
        const dataset = years.map((y) => ({
          anio: String(y),
          publico: mPub[y] ?? null,
          privado: mPri[y] ?? null,
          totalPIB: mTot[y] ?? null,
          constPx: mCon[y] ?? null,
          corrPx: mCor[y] ?? null,
          ppaPx: mPpa[y] ?? null,
        }));
        if (alive) setRowsChart(dataset);
      } catch (e) {
        console.error("Error indicadores salud:", e);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const yTickFontSize = isXs ? 12 : 13;
  const yTickColor = COLORS.axis;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        sx={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: { xs: 15, sm: 16 },
          color: COLORS.axis,
          mb: 1,
        }}
      >
        Evolución comparada de financiamiento y gasto en salud (índice base = 100)
      </Typography>

      {/* Leyenda */}
      <Box
        sx={{
          flexWrap: "wrap",
          display: "flex",
          justifyContent: "center",
          gap: 1.5,
          mb: 2,
          fontSize: { xs: 12.5, sm: 13.5 },
          color: COLORS.axis,
        }}
      >
        {[
          { c: COLORS.publico, l: "Gasto Público (%PIB)" },
          { c: COLORS.privado, l: "Gasto Privado (%PIB)" },
          { c: COLORS.totalPIB, l: "Salud Total (%PIB)" },
          { c: COLORS.constPx, l: "Per cápita Constante" },
          { c: COLORS.corrPx, l: "Per cápita Corriente" },
          { c: COLORS.ppaPx, l: "Per cápita PPA" },
        ].map((x, i) => (
          <Box key={i} sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: 2,
                bgcolor: x.c,
                border: "1px solid rgba(0,0,0,0.3)",
                mr: 0.7,
              }}
            />
            {x.l}
          </Box>
        ))}
      </Box>

      <BarChart
        dataset={rowsChart}
        height={isXs ? 320 : 360}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "anio",
            tickLabelStyle: { fontSize: isXs ? 12 : 13, fill: COLORS.axis },
          },
        ]}
        yAxis={[
          {
            label: "Índice (2018 = 100)",
            labelStyle: { fill: yTickColor, fontSize: yTickFontSize },
            tickLabelStyle: {
              fontSize: yTickFontSize,
              fill: yTickColor,
            },
            valueFormatter: yTickFormatter,
            width: isXs ? 70 : 80,
          },
        ]}
        series={[
          { dataKey: "publico", color: COLORS.publico },
          { dataKey: "privado", color: COLORS.privado },
          { dataKey: "totalPIB", color: COLORS.totalPIB },
          { dataKey: "constPx", color: COLORS.constPx },
          { dataKey: "corrPx", color: COLORS.corrPx },
          { dataKey: "ppaPx", color: COLORS.ppaPx },
        ]}
        slotProps={{ legend: { hidden: true } }}
        margin={{
          top: 16,
          right: 16,
          bottom: isXs ? 36 : 44,
          left: isXs ? 72 : 88,
        }}
        sx={{
          backgroundColor: "transparent",
          "& .MuiChartsGrid-line": { stroke: COLORS.grid },
          "& .MuiChartsAxis-line": { stroke: COLORS.axis, strokeWidth: 1 },
          "& .MuiChartsAxis-tick": { stroke: COLORS.axis, strokeWidth: 1 },
        }}
      />

      <Typography
        sx={{
          textAlign: "center",
          mt: 1.5,
          fontSize: 12,
          color: COLORS.axis,
          lineHeight: 1.4,
          px: 1,
        }}
      >
        Nota: Cada barra parte en 100 en su primer año disponible. Esto permite
        comparar tendencias de gasto público, privado y gasto per cápita
        (constante, corriente y PPA) aunque tengan magnitudes distintas.
      </Typography>
    </Box>
  );
}
