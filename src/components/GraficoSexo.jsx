// src/components/GraficoSexo.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ChartContainer } from "@mui/x-charts/ChartContainer";
import { BarPlot } from "@mui/x-charts/BarChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { ChartsTooltip } from "@mui/x-charts/ChartsTooltip";
import { getESIIngresos } from "../services/trabajoApi";

// Paleta institucional
const COLOR_HOMBRES = "#003A8C";
const COLOR_MUJERES = "#6D2B8F";

// Tooltip CLP sin decimales
const fmtCLP = (v) =>
  (v ?? 0).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

// Eje Y compacto para móviles
const fmtCLPCompact = (v) => {
  if (v == null) return "";
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(v / 1_000)}k`;
};

export default function GraficoSexo() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await getESIIngresos({ anioDesde: 2018, anioHasta: 2024 });
        if (!mounted) return;
        const ordered = (Array.isArray(r) ? r : r?.rows ?? [])
          .filter((d) => Number.isFinite(Number(d.anio)))
          .map((d) => ({
            anio: Number(d.anio),
            hombres: Number(d.hombres ?? 0),
            mujeres: Number(d.mujeres ?? 0),
          }))
          .sort((a, b) => a.anio - b.anio);
        setRows(ordered);
      } catch (e) {
        console.error("[GraficoSexo] getESIIngresos error:", e);
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const dataset = useMemo(() => rows.map((r) => ({ ...r })), [rows]);

  // ===== Texto único solicitado =====
  const textoDescripcion =
    "En 2024, el ingreso promedio fue $735.000 en hombres y $635.000 en mujeres; la brecha alcanzó $100.000 (15,7%). Valores en pesos chilenos corrientes.";

  if (loading) {
    return (
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="body2">Cargando…</Typography>
      </Box>
    );
  }
  if (!rows.length) {
    return (
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="body2">
          No hay datos disponibles para mostrar.
        </Typography>
      </Box>
    );
  }

  const height = isXs ? 340 : 420;
  const margin = {
    top: 16,
    right: isXs ? 20 : 28,
    bottom: isXs ? 56 : 54,
    left: isXs ? 88 : 110, // espacio para que NO se junten números con el rótulo del eje
  };

  return (
    <Box sx={{ width: "100%", mt: 1 }}>
      <Typography
        variant={isXs ? "subtitle1" : "h6"}
        sx={{ fontWeight: 800, textAlign: "center", mb: 1.25 }}
      >
        Ingreso promedio por sexo (2018–2024)
      </Typography>

      <ChartContainer
        height={height}
        dataset={dataset}
        series={[
          {
            type: "bar",
            dataKey: "hombres",
            label: "Hombres",
            color: COLOR_HOMBRES,
            valueFormatter: (v) => fmtCLP(v),
          },
          {
            type: "bar",
            dataKey: "mujeres",
            label: "Mujeres",
            color: COLOR_MUJERES,
            valueFormatter: (v) => fmtCLP(v),
          },
        ]}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "anio",
            label: "Año",
            tickLabelStyle: { fontSize: isXs ? 11 : 12 },
            labelStyle: { fontSize: isXs ? 11 : 12 },
          },
        ]}
        yAxis={[
          {
            label: "Ingreso promedio (CLP)",
            valueFormatter: fmtCLPCompact,
            tickLabelStyle: { fontSize: isXs ? 11 : 12 },
            labelStyle: { fontSize: isXs ? 11 : 12 },
          },
        ]}
        margin={margin}
        sx={{
          "& .MuiChartsAxis-left .MuiChartsAxis-label": {
            transform: "translate(-8px, 0)", // separa label de los ticks
          },
          "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
            textAnchor: "end",
          },
        }}
      >
        <BarPlot />
        <ChartsXAxis />
        <ChartsYAxis />
        <ChartsTooltip />
      </ChartContainer>

      {/* Leyenda simple */}
      <Box
        sx={{
          mt: 1.25,
          display: "flex",
          justifyContent: "center",
          gap: 4,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: 5, bgcolor: COLOR_HOMBRES }} />
          <Typography variant="body2">Hombres</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: 5, bgcolor: COLOR_MUJERES }} />
          <Typography variant="body2">Mujeres</Typography>
        </Box>
      </Box>

      {/* Descripción única (sin duplicados) */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography
          variant="body2"
          sx={{
            mt: 1.75,
            mb: 0.5,
            color: "text.secondary",
            textAlign: "center",
            maxWidth: 980,
            px: 2,
            lineHeight: 1.5,
          }}
        >
          {textoDescripcion}
        </Typography>
      </Box>
    </Box>
  );
}
