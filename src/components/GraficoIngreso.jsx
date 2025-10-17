// src/components/GraficoIngreso.jsx
import React, { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { getESIIngresos } from "../services/trabajoApi";

// Paleta coherente con FES/Nodo XXI
const COL_HOMBRES = "#1565c0"; // azul
const COL_MUJERES = "#c2185b"; // magenta

const fmtCLP = (v) =>
  v == null
    ? "—"
    : `$${Number(v).toLocaleString("es-CL", { maximumFractionDigits: 0 })}`;

export default function GraficoIngreso() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    let alive = true;
    (async () => {
      try {
        // Trae ESI (2018–2024 por sexo). Si el endpoint no está, hace fallback automático.
        const data = await getESIIngresos();
        if (!alive) return;

        const clean = (Array.isArray(data) ? data : [])
          .map((r) => ({
            anio: Number(r.anio),
            hombres: r.hombres ?? null,
            mujeres: r.mujeres ?? null,
          }))
          .filter((r) => Number.isFinite(r.anio))
          .sort((a, b) => a.anio - b.anio);

        setRows(clean);
      } catch (e) {
        console.error("Error cargando ESI ingresos:", e);
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ mt: 1.5, textAlign: "center" }}>
        <Typography variant="body2">Cargando…</Typography>
      </Box>
    );
  }

  if (!rows.length) {
    return (
      <Box sx={{ mt: 1.5, textAlign: "center" }}>
        <Typography variant="body2">No hay datos para mostrar.</Typography>
      </Box>
    );
  }

  const x = rows.map((r) => String(r.anio));
  const serieH = rows.map((r) => r.hombres ?? null);
  const serieM = rows.map((r) => r.mujeres ?? null);

  const chartHeight = isXs ? 260 : isMdUp ? 360 : 310;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        boxShadow: "none",
        bgcolor: "transparent",
      }}
    >
      {/* TÍTULO CENTRADO */}
      <Typography
        variant={isXs ? "subtitle1" : "h6"}
        sx={{
          fontWeight: 800,
          textAlign: "center",
          mb: { xs: 1, sm: 1.25 },
          color: "#1F2937",
          letterSpacing: 0.2,
        }}
      >
        Ingreso promedio por sexo (2018–2024)
      </Typography>

      <Box sx={{ width: "100%" }}>
        <LineChart
          height={chartHeight}
          xAxis={[
            {
              data: x,
              scaleType: "point",
              tickLabelStyle: { fontSize: isXs ? 10 : 12 },
            },
          ]}
          yAxis={[
            {
              valueFormatter: (v) =>
                v == null ? "" : `$${Math.round(v).toLocaleString("es-CL")}`,
              tickLabelStyle: { fontSize: isXs ? 10 : 12 },
            },
          ]}
          series={[
            {
              id: "hombres",
              label: "Hombres",
              data: serieH,
              color: COL_HOMBRES,
              showMark: true,
              curve: "monotoneX",
              valueFormatter: (v) => fmtCLP(v),
            },
            {
              id: "mujeres",
              label: "Mujeres",
              data: serieM,
              color: COL_MUJERES,
              showMark: true,
              curve: "monotoneX",
              valueFormatter: (v) => fmtCLP(v),
            },
          ]}
          margin={{
            top: isXs ? 6 : 10,
            right: isXs ? 12 : 18,
            bottom: isXs ? 26 : 34,
            left: isXs ? 54 : 80,
          }}
          grid={{ horizontal: true, vertical: false }}
          slotProps={{
            legend: {
              position: { vertical: "bottom", horizontal: "middle" },
              direction: "row",
            },
          }}
          sx={{
            "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": { fontSize: 12 },
            "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": { fontSize: 12 },
            "& .MuiChartsTooltip-root .MuiChartsTooltip-paper": {
              p: isXs ? 0.75 : 1,
            },
          }}
        />
      </Box>
    </Paper>
  );
}
