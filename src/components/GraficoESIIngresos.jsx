// src/components/GraficoESIIngresos.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Paper, Typography, useMediaQuery, useTheme, Box } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { getESIIngresos } from "../services/trabajoApi";

/* Paleta (FES + Nodo XXI) */
const COL_HOMBRES = "#0B3D91";
const COL_MUJERES = "#D70000";
const COL_TOTAL   = "#fc9797ff";

const pesoCL = (v) => (v == null ? "—" : `$${Number(v).toLocaleString("es-CL")}`);
const pesoCompact = (v) => {
  if (v == null) return "—";
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(v / 1_000)}k`;
};

export default function GraficoESIIngresos() {
  const [rows, setRows] = useState([]);
  const fetched = useRef(false);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    let alive = true;
    (async () => {
      const data = await getESIIngresos();
      if (!alive) return;
      setRows(Array.isArray(data) ? data : []);
    })();
    return () => { alive = false; };
  }, []);

  // Dataset para el gráfico
  const dataset = useMemo(
    () =>
      rows.map((r) => ({
        anio: r.anio,
        hombres: r.hombres ?? null,
        mujeres: r.mujeres ?? null,
        total: r.total ?? null,
      })),
    [rows]
  );

  const values = dataset.flatMap((r) => [r.hombres, r.mujeres, r.total]).filter((v) => v != null);
  const minY = values.length ? Math.min(...values) : 0;
  const maxY = values.length ? Math.max(...values) : 0;
  const pad = Math.round((maxY - minY) * 0.08);

  const yFormatter = pesoCompact;
  const labelFont = isXs ? 11 : 12;

  return (
    <Paper elevation={0} sx={{ p: { xs: 1, sm: 1.5, md: 2 }, boxShadow: "none" }}>
      <Typography
        component="h3"
        sx={{
          fontWeight: 800,
          textAlign: "center",
          mb: { xs: 1, sm: 1.25 },
          color: "#1F2937",
          fontSize: { xs: 14.5, sm: 16 },
        }}
      >
        Ingreso medio anual — ESI (2018–2024)
      </Typography>

      <Box sx={{ overflow: "visible" }}>
        <BarChart
          height={isXs ? 320 : isMdUp ? 420 : 360}
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
              valueFormatter: yFormatter,
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
              // ❌ no usar labelStyle aquí (genera warning)
            },
            tooltip: {
              valueFormatter: (v) => pesoCL(v),
            },
          }}
          sx={{
            "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": { fontSize: labelFont },
            "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": { fontSize: labelFont },
            "& .MuiChartsLegend-label": { fontSize: `${labelFont}px` }, // estiliza leyenda sin prop inválida
          }}
        />
      </Box>
    </Paper>
  );
}
