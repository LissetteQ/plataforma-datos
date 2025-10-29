import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { getTasas } from "../services/trabajoApi";

const LABELS = {
  td: "TD",
  to: "TO",
  tp: "TP",
  tpl: "TPL",
  su1: "SU1",
  su2: "SU2",
  su3: "SU3",
  su4: "SU4",
  toi: "TOI",
  tosi: "TOSI",
};

const PERIODOS = ["2023T2", "2024T2"];
const SEXOS = ["Nacional", "Hombre", "Mujer"];

const COL_FES_BLUE = "#005597";
const COL_FES_BLUE_LIGHT = "#2B78C5";
const COL_FES_RED = "#D70000";

const fmtPercent = (v) =>
  v == null || Number.isNaN(v) ? "—" : `${Number(v).toFixed(1)}%`;

export default function GraficoTasas() {
  const [vista, setVista] = useState("indicadores"); // "indicadores" | "tiempo"
  const [periodo, setPeriodo] = useState("2024T2");
  const [sexo, setSexo] = useState("Nacional");

  const [rows, setRows] = useState([]); // para vista "tiempo"
  const [rowSel, setRowSel] = useState(null); // para vista "indicadores"
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  // carga para vista indicadores (filtra periodo+sexo)
  useEffect(() => {
    if (vista !== "indicadores") return;
    let alive = true;
    setLoading(true);
    getTasas({ periodo, sexo })
      .then((r) => {
        if (!alive) return;
        const arr = Array.isArray(r) ? r : r?.rows ?? [];
        setRowSel(arr[0] || null);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [vista, periodo, sexo]);

  // carga para vista tiempo (solo filtra sexo)
  useEffect(() => {
    if (vista !== "tiempo") return;
    let alive = true;
    setLoading(true);
    getTasas({ sexo })
      .then((r) => {
        if (!alive) return;
        const arr = (Array.isArray(r) ? r : r?.rows ?? []).filter(
          (d) => d && d.periodo && d.sexo
        );
        arr.sort((a, b) => String(a.periodo).localeCompare(String(b.periodo)));
        setRows(arr);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [vista, sexo]);

  // datos para vista indicadores
  const { xData, yDataBlue, yDataRed } = useMemo(() => {
    if (!rowSel) return { xData: [], yDataBlue: [], yDataRed: [] };
    const keysBlue = ["to", "tp", "toi"]; // empleo/ocupación
    const keysRed = [
      "td",
      "tpl",
      "su1",
      "su2",
      "su3",
      "su4",
      "tosi",
    ]; // desempleo/subutilización

    const x = [...keysBlue, ...keysRed].map((k) => LABELS[k]);
    const yBlue = keysBlue.map((k) => Number(rowSel[k] ?? 0));
    const yRed = keysRed.map((k) => Number(rowSel[k] ?? 0));

    return { xData: x, yDataBlue: yBlue, yDataRed: yRed };
  }, [rowSel]);

  // datos para vista tiempo
  const lineData = useMemo(() => {
    if (!rows.length) return { periods: [], td: [], to: [], tp: [] };
    return {
      periods: rows.map((r) => String(r.periodo)),
      td: rows.map((r) => Number(r.td ?? 0)),
      to: rows.map((r) => Number(r.to ?? 0)),
      tp: rows.map((r) => Number(r.tp ?? 0)),
    };
  }, [rows]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Controles */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 2, alignItems: { xs: "stretch", sm: "center" } }}
      >
        <ToggleButtonGroup
          exclusive
          value={vista}
          onChange={(_, v) => v && setVista(v)}
          size="small"
          color="primary"
          sx={{
            height: 40,
            flexWrap: { xs: "wrap", sm: "nowrap" },
            "& .MuiToggleButton-root": {
              flex: { xs: 1, sm: "initial" },
            },
          }}
        >
          <ToggleButton value="indicadores">Vista: Indicadores</ToggleButton>
          <ToggleButton value="tiempo">Vista: Tiempo</ToggleButton>
        </ToggleButtonGroup>

        {vista === "indicadores" && (
          <>
            <FormControl size="small" fullWidth={isXs} sx={{ minWidth: 150 }}>
              <InputLabel>Periodo</InputLabel>
              <Select
                value={periodo}
                label="Periodo"
                onChange={(e) => setPeriodo(e.target.value)}
              >
                {PERIODOS.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth={isXs} sx={{ minWidth: 150 }}>
              <InputLabel>Ámbito</InputLabel>
              <Select
                value={sexo}
                label="Ámbito"
                onChange={(e) => setSexo(e.target.value)}
              >
                {SEXOS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}

        {vista === "tiempo" && (
          <FormControl size="small" fullWidth={isXs} sx={{ minWidth: 150 }}>
            <InputLabel>Ámbito</InputLabel>
            <Select
              value={sexo}
              label="Ámbito"
              onChange={(e) => setSexo(e.target.value)}
            >
              {SEXOS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Stack>

      <Typography
        variant={isXs ? "subtitle1" : "h6"}
        sx={{ fontWeight: 800, textAlign: "center", mb: 1 }}
      >
        Tasas laborales y subutilización (ENE)
      </Typography>

      {loading ? (
        <Typography variant="body2" sx={{ textAlign: "center" }}>
          Cargando…
        </Typography>
      ) : vista === "indicadores" ? (
        <BarChart
          height={isXs ? 320 : 360}
          xAxis={[
            {
              data: xData,
              scaleType: "band",
              label: "Indicador",
              tickLabelStyle: {
                fontSize: isXs ? 10 : 12,
                angle: isXs ? -25 : 0,
                textAnchor: isXs ? "end" : "middle",
              },
            },
          ]}
          yAxis={[
            {
              min: 0,
              max: 100,
              label: "Porcentaje",
              valueFormatter: (v) => `${v}%`,
              width: isXs ? 58 : 64,
              tickLabelStyle: { fontSize: isXs ? 10 : 12 },
            },
          ]}
          series={[
            {
              data: [...yDataBlue, ...Array(yDataRed.length).fill(null)],
              label: "Actividad / Empleo (TO, TP, TOI)",
              color: COL_FES_BLUE,
              valueFormatter: fmtPercent,
            },
            {
              data: [...Array(yDataBlue.length).fill(null), ...yDataRed],
              label: "Desocupación / Subutilización (TD, TPL, SU, TOSI)",
              color: COL_FES_RED,
              valueFormatter: fmtPercent,
            },
          ]}
          margin={{
            top: 10,
            right: 18,
            bottom: isXs ? 36 : 28,
            left: isXs ? 66 : 78,
          }}
          slotProps={{
            legend: {
              direction: "horizontal",
              position: { vertical: "top", horizontal: "center" },
              sx: {
                "& li": {
                  fontSize: isXs ? 10 : 12,
                  fontWeight: 600,
                  color: "#1F2937",
                  fontFamily: "Roboto, system-ui, sans-serif",
                },
              },
            },
          }}
          sx={{
            "& .MuiBarsItem-root .MuiBarElement-root": { rx: 6 },
            "& .MuiChartsAxis-left .MuiChartsAxis-label": {
              transform: "translate(-10px, 0)",
            },
          }}
        />
      ) : (
        <LineChart
          height={isXs ? 320 : 360}
          xAxis={[
            {
              data: lineData.periods,
              scaleType: "point",
              label: "Periodo",
              tickLabelStyle: { fontSize: isXs ? 10 : 12 },
            },
          ]}
          yAxis={[
            {
              min: 0,
              max: 100,
              label: "Porcentaje",
              valueFormatter: (v) => `${v}%`,
              tickLabelStyle: { fontSize: isXs ? 10 : 12 },
              width: isXs ? 58 : 64,
            },
          ]}
          series={[
            {
              id: "td",
              label: "TD (desempleo)",
              data: lineData.td,
              color: COL_FES_RED,
              showMark: true,
              curve: "monotoneX",
              valueFormatter: fmtPercent,
            },
            {
              id: "to",
              label: "TO (ocupación)",
              data: lineData.to,
              color: COL_FES_BLUE,
              showMark: true,
              curve: "monotoneX",
              valueFormatter: fmtPercent,
            },
            {
              id: "tp",
              label: "TP (participación)",
              data: lineData.tp,
              color: COL_FES_BLUE_LIGHT,
              showMark: true,
              curve: "monotoneX",
              valueFormatter: fmtPercent,
            },
          ]}
          grid={{ horizontal: true, vertical: false }}
          margin={{ top: 10, right: 18, bottom: 28, left: isXs ? 66 : 78 }}
          slotProps={{
            legend: {
              direction: "horizontal",
              position: { vertical: "bottom", horizontal: "center" },
              sx: {
                "& li": {
                  fontSize: isXs ? 10 : 12,
                  fontWeight: 600,
                  color: "#1F2937",
                  fontFamily: "Roboto, system-ui, sans-serif",
                },
              },
            },
          }}
        />
      )}

      <Box sx={{ mt: 1.25 }}>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            textAlign: "center",
            maxWidth: 980,
            mx: "auto",
            lineHeight: 1.45,
            px: { xs: 1, sm: 0 },
          }}
        >
          TO: Tasa de Ocupación · TP: Tasa de Participación · TD: Tasa
          de Desempleo · TPL: Desocupación de larga duración · SU1–SU4:
          Subutilización · TOI/TOSI: Ocupación informal
        </Typography>
      </Box>
    </Box>
  );
}