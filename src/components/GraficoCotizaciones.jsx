// src/components/GraficoCotizaciones.jsx
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { getDataset } from "../services/trabajoApi";

// Colores institucionales
const COLORS = {
  cotiza: "#005597",
  noCotiza: "#5BC1D1",
};

// Helper: cuenta válidos (0/1), cotiza=1, noCotiza=0
function buildMetric(rows, field) {
  let valid = 0,
    si = 0;
  for (const r of rows) {
    const v = Number(r?.[field]);
    if (v === 0 || v === 1) {
      valid += 1;
      if (v === 1) si += 1;
    }
  }
  const total = rows.length;
  const pct = (n, d) => (d ? (n / d) * 100 : 0);
  const pSi = pct(si, total);
  const pNo = 100 - pSi;
  return {
    total,
    valid,
    missing: total - valid,
    siCount: si,
    noCount: valid - si,
    pSi: Math.round(pSi),
    pNo: Math.round(pNo),
  };
}

export default function GraficoCotizaciones() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getDataset().then((r) => setRows(Array.isArray(r) ? r : []));
  }, []);

  const model = useMemo(() => {
    const prev = buildMetric(rows, "cotiza_prevision");
    const salud = buildMetric(rows, "cotiza_salud");
    return {
      xData: ["Previsión", "Salud"],
      cotiza: [prev.pSi, salud.pSi],
      noCotiza: [prev.pNo, salud.pNo],
      total: rows.length,
      detail: { prev, salud },
    };
  }, [rows]);

  if (!rows.length) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: 200,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No hay datos disponibles para mostrar cotizaciones.
        </Typography>
      </Box>
    );
  }

  const fmtPct = (v) => `${v ?? 0}%`;

  return (
    <Box sx={{ width: "100%" }}>
      {/* TÍTULO INTERNO REMOVIDO */}

      <BarChart
        height={300}
        xAxis={[
          {
            data: model.xData,
            scaleType: "band",
            tickPlacement: "middle",
            paddingInner: 0.2,
            paddingOuter: 0.1,
            tickLabelStyle: { fontSize: 12 },
          },
        ]}
        yAxis={[{ width: 56, label: "Porcentaje", min: 0, max: 100 }]}
        series={[
          {
            data: model.cotiza,
            label: "Cotiza",
            color: COLORS.cotiza,
            barMaxWidth: 22,
            valueFormatter: fmtPct,
          },
          {
            data: model.noCotiza,
            label: () => "No cotiza",
            color: COLORS.noCotiza,
            barMaxWidth: 22,
            valueFormatter: fmtPct,
          },
        ]}
        margin={{ top: 20, right: 16, bottom: 42, left: 64 }}
        sx={{
          "--Charts-gridLineDash": "3 3",
          ".MuiChartsGrid-line": { stroke: COLORS.noCotiza, opacity: 0.25 },
          ".MuiBarElement-root": { rx: 6, ry: 6 },
          ".MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
            transform: "translateY(4px)",
          },
        }}
      />

      <Typography
        variant="caption"
        sx={{
          display: "block",
          textAlign: "center",
          mt: 1,
          color: "text.secondary",
        }}
      >
        Total de registros: {model.total.toLocaleString("es-CL")}
      </Typography>

      {/* Línea de verificación con conteos y válidos por categoría */}
      <Typography
        variant="caption"
        sx={{
          display: "block",
          textAlign: "center",
          mt: 0.5,
          color: "text.secondary",
        }}
      >
        Previsión: {model.detail.prev.siCount}/{model.detail.prev.total} cotiza (
        {fmtPct(model.detail.prev.pSi)}),{" "}
        {model.detail.prev.total - model.detail.prev.siCount}/
        {model.detail.prev.total} no cotiza (
        {fmtPct(model.detail.prev.pNo)})
        {model.detail.prev.missing
          ? ` — faltantes: ${model.detail.prev.missing}`
          : ""}
        .&nbsp; Salud: {model.detail.salud.siCount}/
        {model.detail.salud.total} cotiza (
        {fmtPct(model.detail.salud.pSi)}),{" "}
        {model.detail.salud.total - model.detail.salud.siCount}/
        {model.detail.salud.total} no cotiza (
        {fmtPct(model.detail.salud.pNo)})
        {model.detail.salud.missing
          ? ` — faltantes: ${model.detail.salud.missing}`
          : ""}
        .
      </Typography>
    </Box>
  );
}
