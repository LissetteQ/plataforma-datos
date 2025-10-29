// src/components/GraficoJornada.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { getDataset } from "../services/trabajoApi";

/* Colores corporativos:
   - FES Chile azul:  #005597
   - FES Chile rojo:  #D70000
*/
const COL_COMPLETA = "#005597"; // Jornada completa (FES azul)
const COL_MEDIA = "#D70000"; // Media jornada (FES rojo)
const STROKE = "rgba(0,0,0,0.14)";

export default function GraficoJornada() {
  const [rows, setRows] = useState([]);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    getDataset().then((r) => setRows(Array.isArray(r) ? r : []));
  }, []);

  const datos = useMemo(() => {
    const total = rows.length || 1;

    const completa = rows.filter(
      (d) => (d.jornada || "").toLowerCase() === "completa"
    ).length;
    const media = total - completa;

    const pctComp = Math.round((completa / total) * 100);
    const pctMedia = Math.round((media / total) * 100);

    const compDeCada10 = Math.round((pctComp / 100) * 10);
    const mediaDeCada10 = 10 - compDeCada10;

    return {
      categorias: ["Jornada completa", "Media jornada"],
      total,
      completa,
      media,
      pctComp,
      pctMedia,
      compDeCada10,
      mediaDeCada10,
    };
  }, [rows]);

  const {
    categorias,
    total,
    completa,
    media,
    pctComp,
    pctMedia,
    compDeCada10,
    mediaDeCada10,
  } = datos;

  const height = isXs ? 280 : isMdUp ? 360 : 320;
  const labelFont = isXs ? 11 : 12;

  return (
    <Box sx={{ width: "100%" }}>
      {/* TÍTULO INTERNO REMOVIDO */}

      <BarChart
        height={height}
        xAxis={[
          {
            data: categorias,
            scaleType: "band",
            tickLabelStyle: { fontSize: labelFont },
          },
        ]}
        yAxis={[
          {
            min: 0,
            max: 100,
            tickNumber: isXs ? 4 : 6,
            label: "Porcentaje",
            valueFormatter: (v) => `${v}%`,
            tickLabelStyle: { fontSize: labelFont },
          },
        ]}
        grid={{ horizontal: true, vertical: false }}
        margin={{
          top: isXs ? 8 : 12,
          right: isXs ? 12 : 16,
          bottom: isXs ? 42 : 46,
          left: isXs ? 56 : 68,
        }}
        series={[
          {
            label: "Jornada completa",
            data: [pctComp, 0],
            stack: "jornada",
            color: COL_COMPLETA,
            valueFormatter: (v) => `${v}%`,
          },
          {
            label: "Media jornada",
            data: [0, pctMedia],
            stack: "jornada",
            color: COL_MEDIA,
            valueFormatter: (v) => `${v}%`,
          },
        ]}
        sx={{
          ".MuiBarElement-root": {
            rx: 10,
            stroke: STROKE,
            strokeWidth: 1,
          },
          "& .MuiChartsTooltip-paper": { p: isXs ? 0.75 : 1 },
        }}
        slotProps={{
          legend: {
            direction: "horizontal", // antes "row" ❌
            position: {
              vertical: "top",
              horizontal: "center", // antes "middle" ❌
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
          barLabel: { position: "top" },
          tooltip: {
            trigger: "item",
            valueFormatter: (v) => `${v}%`,
          },
        }}
      />

      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          textAlign: "center",
          mt: 1.25,
          px: { xs: 2, md: 0 },
        }}
      >
        En la muestra ({total} registros): <b>{pctComp}%</b> jornada completa (
        {completa} casos) y <b>{pctMedia}%</b> media jornada ({media} casos).
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "#6B7280",
          textAlign: "center",
          mt: 0.75,
          maxWidth: 980,
          mx: "auto",
          px: { xs: 2, md: 0 },
          lineHeight: 1.45,
        }}
      >
        Aproximadamente, <b>{compDeCada10} de cada 10</b> personas trabajan con
        jornada completa y <b>{mediaDeCada10} de cada 10</b> con media jornada.
      </Typography>
    </Box>
  );
}
