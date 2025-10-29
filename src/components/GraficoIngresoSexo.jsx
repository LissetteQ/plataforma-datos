// src/components/GraficoIngresoSexo.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { getDataset } from "../services/trabajoApi";

const COL_HOMBRES = "#0B3D91";
const COL_MUJERES = "#D70000";
const STROKE = "rgba(0,0,0,0.14)";

const parseCLP = (v) => {
  if (v == null || v === "") return null;
  const s = String(v).replace(/[^\d,.\-]/g, "").replace(/\./g, "").replace(/,/g, ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

const fmtCLP = (v) =>
  v == null
    ? "—"
    : `$${Number(v).toLocaleString("es-CL", {
        maximumFractionDigits: 0,
      })}`;

const fmtCLPCompact = (v) => {
  if (v == null) return "—";
  const n = Number(v);
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(n / 1_000)}k`;
};

export default function GraficoIngresoSexo() {
  const [rows, setRows] = useState([]);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    getDataset().then((r) => setRows(Array.isArray(r) ? r : []));
  }, []);

  const { xLabels, serieH, serieM, ultimo } = useMemo(() => {
    const acc = new Map(); // anio -> { Hombre:{s,c}, Mujer:{s,c} }
    for (const r of rows) {
      const anio = Number(parseCLP(r.anio ?? r.año ?? r.year ?? r.ano));
      const sexo = String(r.sexo || r.genero || "").trim();
      const v = parseCLP(
        r.ingreso_promedio ??
          r["ingreso promedio"] ??
          r.ingreso_medio ??
          r["ingreso medio"] ??
          r.ingreso ??
          r.promedio
      );
      if (!Number.isFinite(anio) || v == null) continue;
      if (sexo !== "Hombre" && sexo !== "Mujer") continue;

      if (!acc.has(anio))
        acc.set(anio, {
          Hombre: { s: 0, c: 0 },
          Mujer: { s: 0, c: 0 },
        });
      const slot = acc.get(anio)[sexo];
      slot.s += v;
      slot.c += 1;
    }

    const years = Array.from(acc.keys()).sort((a, b) => a - b);
    const hombres = years.map((y) => {
      const g = acc.get(y).Hombre;
      return g.c ? Math.round(g.s / g.c) : null;
    });
    const mujeres = years.map((y) => {
      const g = acc.get(y).Mujer;
      return g.c ? Math.round(g.s / g.c) : null;
    });

    let ult = null;
    for (let i = years.length - 1; i >= 0; i--) {
      const h = hombres[i], m = mujeres[i];
      if (h != null && m != null) {
        const brecha = h - m;
        const pct = m > 0 ? (brecha / m) * 100 : 0;
        ult = { anio: years[i], h, m, brecha, pct };
        break;
      }
    }

    return {
      xLabels: years.map(String),
      serieH: hombres,
      serieM: mujeres,
      ultimo: ult,
    };
  }, [rows]);

  if (!rows.length) {
    return (
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2">Cargando…</Typography>
      </Box>
    );
  }

  const height = isXs ? 300 : isMdUp ? 380 : 340;
  const labelFont = isXs ? 11 : 12;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant={isXs ? "subtitle1" : "h6"}
        sx={{
          fontWeight: 800,
          textAlign: "center",
          mb: { xs: 1, md: 1.25 },
          color: "#1F2937",
        }}
      >
        Ingreso promedio por sexo (promedio anual)
      </Typography>

      <BarChart
        height={height}
        xAxis={[
          {
            data: xLabels,
            scaleType: "band",
            tickLabelStyle: { fontSize: labelFont },
          },
        ]}
        yAxis={[
          {
            tickNumber: isXs ? 4 : 6,
            valueFormatter: (v) => fmtCLPCompact(v),
            tickLabelStyle: { fontSize: labelFont },
          },
        ]}
        grid={{ horizontal: true, vertical: false }}
        margin={{
          top: isXs ? 8 : 12,
          right: isXs ? 10 : 14,
          bottom: isXs ? 42 : 46,
          left: isXs ? 64 : 78,
        }}
        series={[
          {
            id: "hombres",
            label: "Hombres",
            data: serieH,
            color: COL_HOMBRES,
            valueFormatter: (v) => fmtCLP(v),
          },
          {
            id: "mujeres",
            label: "Mujeres",
            data: serieM,
            color: COL_MUJERES,
            valueFormatter: (v) => fmtCLP(v),
          },
        ]}
        sx={{
          ".MuiBarElement-root": { rx: 8, stroke: STROKE, strokeWidth: 1 },
          "& .MuiChartsTooltip-paper": { p: isXs ? 0.75 : 1 },
        }}
        slotProps={{
          legend: {
            direction: "horizontal",
            position: {
              vertical: "bottom",
              horizontal: "center",
            },
            sx: {
              "& li": {
                fontSize: labelFont,
                fontWeight: 600,
                color: "#1F2937",
                fontFamily: "Roboto, system-ui, sans-serif",
              },
            },
          },
          tooltip: {
            trigger: "item",
            valueFormatter: (v) => fmtCLP(v),
          },
        }}
      />

      {ultimo && (
        <Typography
          variant="body2"
          sx={{
            mt: 1.5,
            color: "text.secondary",
            textAlign: "center",
            maxWidth: 980,
            mx: "auto",
            px: { xs: 2, md: 0 },
            lineHeight: 1.45,
          }}
        >
          En <b>{ultimo.anio}</b>, el ingreso promedio fue{" "}
          <b>{fmtCLP(ultimo.h)}</b> en hombres y <b>{fmtCLP(ultimo.m)}</b> en
          mujeres; la brecha alcanzó <b>{fmtCLP(ultimo.brecha)}</b>{" "}
          {ultimo.pct ? `(${ultimo.pct.toFixed(1)}% más en hombres).` : null}
        </Typography>
      )}
    </Box>
  );
}
