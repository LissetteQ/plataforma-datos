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
  bar: PALETA.fesBlue,
  line: PALETA.fesRed,
  axis: PALETA.gray500,
  grid: PALETA.divider,
};

// Helpers numéricos
const parseCL = (v) => {
  if (v == null || v === "") return null;
  const s = String(v)
    .replace(/[^\d,.\-]/g, "")
    .replace(/\./g, "")
    .replace(/,/g, ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};
const fmtMiles = (n) =>
  (Number.isFinite(n) ? Math.round(n) : 0).toLocaleString("es-CL");
const fmtPerc = (n) =>
  `${Number.isFinite(n) ? (Math.round(n * 10) / 10).toFixed(1) : "0.0"}%`;
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

  // 👇 Nuevo: consideramos "compacto" todo <900px
  const isCompact = useMediaQuery(theme.breakpoints.down("md"));

  const tickFont = isCompact ? 11 : 12;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await getAnual();
        if (!mounted) return;
        const data = (Array.isArray(r) ? r : [])
          .map((d) => ({
            anio: Number(
              parseCL(d.anio ?? d.ano ?? d.year ?? d.ano_trimestre)
            ),
            fuerza_laboral: parseCL(
              d.fuerza_laboral ?? d.fdt ?? d["fuerza laboral"]
            ),
            tasa_desempleo: parseCL(
              String(d.tasa_desempleo ?? d.td ?? "").replace("%", "")
            ),
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

  // ==========================================
  // DATA
  // ==========================================
  // Forzamos eje 2018-2024 en orden fijo
  const forcedYears = [2018, 2019, 2020, 2021, 2022, 2023, 2024];

  // indexamos los datos reales por año
  const byYear = {};
  rows.forEach((r) => {
    byYear[r.anio] = r;
  });

  // construimos arrays alineados al rango fijo
  const xData = forcedYears.map(String);
  const fuerzaData = forcedYears.map(
    (year) => byYear[year]?.fuerza_laboral ?? null
  );
  const desempleoData = forcedYears.map(
    (year) => byYear[year]?.tasa_desempleo ?? null
  );

  // escalas Y
  const maxFuerza = Math.max(...fuerzaData.filter((v) => v != null));
  const maxTD = Math.max(
    10,
    Math.ceil(Math.max(...desempleoData.filter((v) => v != null)) * 1.2)
  );

  const roundUpTo = (v, step) => Math.ceil((v || 0) / step) * step;
  const yLeftMax = roundUpTo(maxFuerza, 500_000);

  // estilos del eje X:
  // - si estamos en vista compacta, escondemos los labels internos
  //   porque vamos a dibujar la fila manual abajo
  // - en vista grande, sí los mostramos
  const xAxisTickLabelStyle = isCompact
    ? { fontSize: tickFont, fill: "transparent" }
    : { fontSize: tickFont, fill: COLORS.axis };

  return (
    <Box sx={{ mt: { xs: 1.25, md: 2.25 }, width: "100%", minWidth: 0 }}>
      <Box
        sx={{
          // en pantallas compactas dejamos un poquito más de alto
          height: { xs: heightXs + 28, md: heightMd },
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
              tickLabelStyle: xAxisTickLabelStyle,
              tickPlacement: "middle",
            },
          ]}
          yAxis={[
            {
              id: "yLeft",
              label: "Fuerza laboral (personas)",
              min: 0,
              max: yLeftMax,
              tickMinStep: 250_000,
              tickNumber: isCompact ? 5 : 6,
              tickLabelStyle: { fontSize: tickFont, fill: COLORS.axis },
              valueFormatter: fmtCompactCL,
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
              color: PALETA.fesBlue,
              valueFormatter: (v) => `${fmtMiles(v)} personas`,
              borderRadius: 6,
            },
            {
              id: "desempleo",
              type: "line",
              yAxisKey: "yRight",
              data: desempleoData,
              color: PALETA.fesRed,
              curve: "monotoneX",
              showMark: true,
              markSize: 4,
              lineWidth: 3,
              valueFormatter: (v) => fmtPerc(v),
            },
          ]}
          margin={{
            top: isCompact ? 8 : 12,
            right: isCompact ? 48 : 60,
            bottom: isCompact ? 26 : 36,
            left: isCompact ? 60 : 80,
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
                  color: COLORS.axis,
                  fontSize: tickFont,
                  fontWeight: 500,
                  fontFamily: "Roboto, system-ui, sans-serif",
                },
              },
            },
            tooltip: {},
          }}
        >
          <ChartsGrid
            vertical
            horizontal
            sx={{ stroke: PALETA.divider, opacity: 0.7 }}
          />
          <BarPlot />
          <LinePlot />
          <ChartsXAxis axisId="x" />
          <ChartsYAxis axisId="yLeft" />
          <ChartsYAxis axisId="yRight" />
          <ChartsTooltip />
        </ChartContainer>
      </Box>

      {/* Fila manual con los años
         Ahora se muestra en TODA vista "compacta" (<900px),
         no solo en xs (<600px)
      */}
      {isCompact && (
        <Box
          sx={{
            mt: 0.5,
            px: { xs: 1, sm: 2 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "Roboto, system-ui, sans-serif",
              fontSize: "11px",
              lineHeight: 1.2,
              color: COLORS.axis,
            }}
          >
            {xData.map((year) => (
              <Box
                key={year}
                sx={{
                  textAlign: "center",
                  flex: "1 1 0",
                  minWidth: 0,
                }}
              >
                {year}
              </Box>
            ))}
          </Box>
        </Box>
      )}

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
