// src/components/GraficoTrabajoPorAnio.jsx
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMediaQuery, useTheme } from "@mui/material";
import { getAnual } from "../services/trabajoApi";
import {
  ChartContainer,
  BarPlot,
  LinePlot,
  ChartsXAxis,
  ChartsYAxis,
  ChartsTooltip,
  ChartsLegend,
  ChartsGrid,
} from "@mui/x-charts";

const PALETA = {
  fesBlue: "#005597",
  fesRed: "#D70000",
  nodoBlue: "#0B3D91",
  gray500: "#6B7280",
  divider: "#E5E7EB",
};

const COLORS = {
  title: PALETA.nodoBlue,
  bar: PALETA.fesBlue,
  line: PALETA.fesRed,
  axis: PALETA.gray500,
  grid: PALETA.divider,
};

// ---- FORMATOS (compactos para que no se corten)
const fmtMiles = (n) =>
  (Number.isFinite(n) ? Math.round(n) : 0).toLocaleString("es-CL");
const fmtPerc = (n) =>
  `${Number.isFinite(n) ? (Math.round(n * 10) / 10).toFixed(1) : "0.0"}%`;

// 4.2M / 0.5M / 250k…
const fmtCompactCL = (v) => {
  if (!Number.isFinite(v)) return "";
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `${Math.round(v / 1_000)}k`;
  return String(v);
};

export default function GraficoTrabajoPorAnio({
  showNote = false,
  note,
  heightXs = 320,
  heightMd = 400,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const tickFont = isXs ? 11 : 12;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await getAnual();
        if (!mounted) return;
        const data = (Array.isArray(r) ? r : [])
          .map((d) => ({
            anio: Number(d.anio ?? d.ano ?? d.year ?? d.ano_trimestre),
            fuerza_laboral: Number(d.fuerza_laboral ?? d.fdt ?? NaN),
            tasa_desempleo: Number(d.tasa_desempleo ?? d.td ?? NaN),
          }))
          .filter((d) => Number.isFinite(d.anio))
          .sort((a, b) => a.anio - b.anio);
        setRows(data);
      } catch (e) {
        console.error("Error cargando getAnual()", e);
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2">Cargando…</Typography>
      </Box>
    );

  if (!rows.length)
    return (
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2">
          No hay datos disponibles para mostrar.
        </Typography>
      </Box>
    );

  const xData = rows.map((d) => String(d.anio));
  const fuerzaData = rows.map((d) =>
    Number.isFinite(d.fuerza_laboral) ? d.fuerza_laboral : null
  );
  const desempleoData = rows.map((d) =>
    Number.isFinite(d.tasa_desempleo) ? d.tasa_desempleo : null
  );

  // ====== límites y densidad de ticks para que quepan
  const maxFuerza = Math.max(...fuerzaData.filter((v) => v != null));
  const maxTD = Math.max(
    10,
    Math.ceil(
      Math.max(...desempleoData.filter((v) => v != null)) * 1.2
    )
  );

  // Redondea el tope de fuerza a múltiplos de 0.5M para ticks bonitos
  const roundUpTo = (v, step) => Math.ceil(v / step) * step;
  const yLeftMax = roundUpTo(maxFuerza || 0, 500_000);

  return (
    <Box sx={{ mt: { xs: 1.25, md: 2.25 }, width: "100%", minWidth: 0 }}>
      <Typography
        variant={isXs ? "subtitle1" : "h6"}
        sx={{
          fontWeight: 800,
          textAlign: "center",
          mb: { xs: 1, md: 1.5 },
          color: COLORS.title,
        }}
      >
        Evolución de Fuerza Laboral y Desempleo
      </Typography>

      <Box
        sx={{
          height: { xs: heightXs, md: heightMd },
          px: { xs: 1, sm: 2, md: 3 },
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          overflow: "visible",
          touchAction: "pan-x pan-y",
        }}
      >
        <ChartContainer
          xAxis={[
            {
              id: "x",
              data: xData,
              scaleType: "band",
              tickLabelStyle: { fontSize: tickFont, fill: COLORS.axis },
            },
          ]}
          yAxis={[
            {
              id: "yLeft",
              label: "Fuerza laboral (personas)",
              min: 0,
              max: yLeftMax,           // <- tope redondeado
              tickMinStep: 250_000,    // <- evita superpoblación
              tickNumber: isXs ? 5 : 6,
              tickLabelStyle: { fontSize: tickFont, fill: COLORS.axis },
              valueFormatter: fmtCompactCL, // <- 4.2M / 850k / 0
            },
            {
              id: "yRight",
              position: "right",
              label: "Desempleo (%)",
              min: 0,
              max: maxTD,
              tickLabelStyle: { fontSize: tickFont, fill: COLORS.axis },
              valueFormatter: (v) => fmtPerc(v),
            },
          ]}
          series={[
            {
              id: "fuerza",
              type: "bar",
              yAxisKey: "yLeft",
              data: fuerzaData,
              color: COLORS.bar,
              valueFormatter: (v) => `${fmtMiles(v)} personas`,
              borderRadius: 6,
            },
            {
              id: "desempleo",
              type: "line",
              yAxisKey: "yRight",
              data: desempleoData,
              color: COLORS.line,
              curve: "monotoneX",
              showMark: true,
              markSize: 4,
              lineWidth: 3,
              valueFormatter: (v) => fmtPerc(v),
            },
          ]}
          // margen izquierdo optimizado: con formato compacto ya no se corta
          margin={{
            top: isXs ? 8 : 12,
            right: isXs ? 48 : 60,
            bottom: isXs ? 10 : 12,
            left: isXs ? 60 : 80,
          }}
        >
          <ChartsGrid vertical horizontal sx={{ stroke: COLORS.grid, opacity: 0.7 }} />
          <BarPlot />
          <LinePlot />
          <ChartsXAxis axisId="x" />
          <ChartsYAxis axisId="yLeft" />
          <ChartsYAxis axisId="yRight" />
          <ChartsTooltip />
          <ChartsLegend
            direction="row"
            position={{ vertical: "bottom", horizontal: "middle" }}
            slotProps={{ legend: { labelStyle: { fontSize: isXs ? 11 : 12 } } }}
          />
        </ChartContainer>
      </Box>

      {showNote && (
        <Typography
          variant="body2"
          sx={{ color: PALETA.gray500, textAlign: "center", mt: 1 }}
        >
          {note ??
            "La evolución anual del empleo permite observar el impacto de fenómenos económicos y sociales en la fuerza laboral chilena."}
        </Typography>
      )}
    </Box>
  );
}
