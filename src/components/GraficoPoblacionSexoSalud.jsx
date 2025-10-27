// src/components/GraficoPoblacionSexoSalud.jsx
import * as React from "react";
import { useEffect, useState } from "react";
import { Box, useMediaQuery, useTheme, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { obtenerSexo } from "../services/saludService";

const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024];

/* ===== Colores (Nodo XXI) ===== */
const COLORS = {
  // Teal (Fonasa)
  fonasaH: "#0FA3A9",
  fonasaM: "#40D5C6",
  // Naranjas (Isapre)
  isapreH: "#FF4B2B",
  isapreM: "#FF6A3D",
  axis: "#0F172A",
  grid: "#E5E7EB",
};

// Etiquetas cortas (millones)
const fmtM = (v) => {
  if (v == null) return "";
  const m = v / 1_000_000;
  // 0, 5, 10, 15 → sin decimales; otros → 1 decimal
  const isInt = Math.abs(m - Math.round(m)) < 1e-6;
  return `${m.toLocaleString("es-CL", {
    maximumFractionDigits: isInt ? 0 : 1,
    minimumFractionDigits: isInt ? 0 : 1,
  })} M`;
};

/* ======= Fallbacks (derivados de tus tablas) ======= */
const FB_FONASA = {
  2018: { HOMBRE: 6609609, MUJER: 7492953, INDETERMINADO: 147 },
  2019: { HOMBRE: 6994917, MUJER: 7846315, INDETERMINADO: 345 },
  2020: { HOMBRE: 7189752, MUJER: 7952362, INDETERMINADO: 414 },
  2022: { HOMBRE: 7432827, MUJER: 8180051, INDETERMINADO: 706 },
  2023: { HOMBRE: 7744672, MUJER: 8484218, INDETERMINADO: 1008 },
  2024: { HOMBRE: 8015233, MUJER: 8735710, INDETERMINADO: 1246 },
};
const FB_ISAPRE = {
  2018: { HOMBRE: 1852419, MUJER: 1552477, INDETERMINADO: 0 },
  2019: { HOMBRE: 1874354, MUJER: 1556613, INDETERMINADO: 0 },
  2020: { HOMBRE: 1810756, MUJER: 1528217, INDETERMINADO: 0 },
  2021: { HOMBRE: 1785996, MUJER: 1543990, INDETERMINADO: 268 },
  2022: { HOMBRE: 1680646, MUJER: 1471066, INDETERMINADO: 173 },
  2023: { HOMBRE: 1479124, MUJER: 1308991, INDETERMINADO: 142 },
};

export default function GraficoPoblacionSexoSalud() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const height = isXs ? 280 : 380;

  const [fH, setFH] = useState([]);
  const [fM, setFM] = useState([]);
  const [iH, setIH] = useState([]);
  const [iM, setIM] = useState([]);

  useEffect(() => {
    let on = true;
    (async () => {
      const acc = { fH: [], fM: [], iH: [], iM: [] };
      for (const y of YEARS) {
        try {
          const data = await obtenerSexo(y); // { year, fonasa:[{name,value}], isapre:[{name,value}] }
          const mapF = Object.fromEntries(
            (data?.fonasa ?? []).map((r) => [String(r.name).toUpperCase(), Number(r.value || 0)])
          );
          const mapI = Object.fromEntries(
            (data?.isapre ?? []).map((r) => [String(r.name).toUpperCase(), Number(r.value || 0)])
          );
          acc.fH.push(mapF["HOMBRE"] || FB_FONASA[y]?.HOMBRE || 0);
          acc.fM.push(mapF["MUJER"] || FB_FONASA[y]?.MUJER || 0);
          acc.iH.push(mapI["HOMBRE"] || FB_ISAPRE[y]?.HOMBRE || 0);
          acc.iM.push(mapI["MUJER"] || FB_ISAPRE[y]?.MUJER || 0);
        } catch {
          acc.fH.push(FB_FONASA[y]?.HOMBRE ?? 0);
          acc.fM.push(FB_FONASA[y]?.MUJER ?? 0);
          acc.iH.push(FB_ISAPRE[y]?.HOMBRE ?? 0);
          acc.iM.push(FB_ISAPRE[y]?.MUJER ?? 0);
        }
      }
      if (on) {
        setFH(acc.fH);
        setFM(acc.fM);
        setIH(acc.iH);
        setIM(acc.iM);
      }
    })();
    return () => { on = false; };
  }, []);

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
        Población por Sexo y Sistema de Salud (2018–2024)
      </Typography>

      <BarChart
        height={height}
        xAxis={[{ data: YEARS.map(String) }]}
        series={[
          { label: "Fonasa — Hombres", data: fH, color: COLORS.fonasaH, stack: "F", valueFormatter: fmtM },
          { label: "Fonasa — Mujeres", data: fM, color: COLORS.fonasaM, stack: "F", valueFormatter: fmtM },
          { label: "Isapre — Hombres", data: iH, color: COLORS.isapreH, stack: "I", valueFormatter: fmtM },
          { label: "Isapre — Mujeres", data: iM, color: COLORS.isapreM, stack: "I", valueFormatter: fmtM },
        ]}
        yAxis={[{ valueFormatter: fmtM }]}  // ← etiquetas cortas y legibles
        slotProps={{ legend: { position: "top", direction: "row", itemGap: 12 } }}
        sx={{
          backgroundColor: "transparent",
          "& .MuiChartsAxis-tickLabel": {
            fontSize: isXs ? 11 : 12,
            fill: COLORS.axis,
            textOverflow: "unset",
            overflow: "visible",
          },
          "& .MuiChartsGrid-line": { stroke: COLORS.grid },
        }}
        // margen suficiente para que entre "20 M" incluso en móvil
        margin={{ top: 24, right: 16, bottom: isXs ? 28 : 36, left: isXs ? 56 : 68 }}
      />
      <Box sx={{ textAlign: "center", mt: 1, fontSize: 12 }}>
        Población por sexo y sistema (2018–2024). Barras apiladas: Fonasa (teal) e Isapre (naranja).
      </Box>
    </Box>
  );
}