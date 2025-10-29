import * as React from "react";
import {
  Box,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { getPiramide } from "../services/trabajoApi";

const VARIABLES = [
  ["pet", "Población en edad de trabajar (PET)"],
  ["fdt", "Fuerza de trabajo (FDT)"],
  ["oc", "Ocupados (OC)"],
  ["des", "Desocupados (DES)"],
  ["id", "Iniciadores disponibles (ID)"],
  ["tpi", "Tiempo parcial involuntario (TPI)"],
  ["obe", "Ocupados que buscaron empleo (OBE)"],
  ["ftp", "Fuerza de trabajo potencial (FTP)"],
  ["fta", "Fuerza de trabajo ampliada (FTA)"],
  ["fft", "Fuera de la fuerza de trabajo (FFT)"],
  ["oi", "Ocupación informal (OI)"],
  ["osi", "Ocupación en sector informal (OSI)"],
];

const ORDEN_EDAD = [
  "15-24",
  "25-34",
  "35-44",
  "45-54",
  "55-64",
  "65 y más",
];

const COL_HOMBRES = "#005597";
const COL_MUJERES = "#D70000";

export default function GraficoPiramide() {
  const [periodo, setPeriodo] = React.useState("");
  const [periodos, setPeriodos] = React.useState([]);
  const [variable, setVariable] = React.useState("pet");
  const [porcentual, setPorcentual] = React.useState(false);

  const [raw, setRaw] = React.useState([]);
  const [errorMsg, setErrorMsg] = React.useState("");

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await getPiramide();
        const rows = Array.isArray(r) ? r : [];
        if (!mounted) return;

        setRaw(rows);

        const uniq = Array.from(
          new Set(rows.map((d) => String(d.periodo)))
        ).sort((a, b) => a.localeCompare(b));
        setPeriodos(uniq);
        if (!periodo && uniq.length) {
          setPeriodo(uniq[uniq.length - 1]); // último período
        }

        if (!rows.length) {
          setErrorMsg(
            "No hay datos para la pirámide (backend vacío)."
          );
        }
      } catch (e) {
        console.error(e);
        setErrorMsg(
          "No fue posible cargar los datos de la pirámide."
        );
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dataset = React.useMemo(() => {
    const rows = raw.filter(
      (d) => String(d.periodo) === String(periodo)
    );
    if (!rows.length) return [];

    const byAge = new Map();
    for (const r of rows) {
      const tramo = r.tramo_edad;
      if (!byAge.has(tramo))
        byAge.set(tramo, {
          tramo,
          hombres: 0,
          mujeres: 0,
        });
      const key = r.sexo === "Hombre" ? "hombres" : "mujeres";
      const v = Number(r?.[variable] ?? 0);
      if (Number.isFinite(v)) {
        byAge.get(tramo)[key] += v;
      }
    }

    const arr = Array.from(byAge.values()).sort((a, b) => {
      const ia = ORDEN_EDAD.indexOf(a.tramo);
      const ib = ORDEN_EDAD.indexOf(b.tramo);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });

    if (!porcentual) return arr;

    const total =
      arr.reduce(
        (acc, d) =>
          acc + (d.hombres || 0) + (d.mujeres || 0),
        0
      ) || 1;

    return arr.map((d) => ({
      tramo: d.tramo,
      hombres: ((d.hombres || 0) / total) * 100,
      mujeres: ((d.mujeres || 0) / total) * 100,
    }));
  }, [raw, periodo, variable, porcentual]);

  const tituloVar =
    VARIABLES.find(([k]) => k === variable)?.[1] ?? "";

  const valueFormatter = (v) =>
    porcentual
      ? `${(Number(v) || 0).toFixed(1)}%`
      : new Intl.NumberFormat("es-CL", {
          notation: "compact",
          compactDisplay: "short",
        }).format(Number(v) || 0);

  return (
    <Box>
      {/* Controles */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Periodo</InputLabel>
          <Select
            value={periodo}
            label="Periodo"
            onChange={(e) => setPeriodo(e.target.value)}
          >
            {periodos.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          size="small"
          sx={{ minWidth: { xs: 220, sm: 280 } }}
        >
          <InputLabel>Variable</InputLabel>
          <Select
            value={variable}
            label="Variable"
            onChange={(e) => setVariable(e.target.value)}
          >
            {VARIABLES.map(([k, name]) => (
              <MenuItem key={k} value={k}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Switch
              checked={porcentual}
              onChange={(e) => setPorcentual(e.target.checked)}
            />
          }
          label="Mostrar en %"
          sx={{ ml: { xs: 0, sm: "auto" } }}
        />
      </Stack>

      <Typography
        variant="h6"
        sx={{ fontWeight: 700, textAlign: "center", mb: 1 }}
      >
        {`Distribución por tramo de edad y sexo — ${tituloVar} (${
          periodo || "—"
        })`}
      </Typography>

      {errorMsg ? (
        <Alert severity="warning">{errorMsg}</Alert>
      ) : !dataset.length ? (
        <Alert severity="info">
          No hay datos para mostrar en este período.
        </Alert>
      ) : (
        <BarChart
          height={420}
          dataset={dataset}
          xAxis={[
            {
              scaleType: "band",
              dataKey: "tramo",
              valueFormatter: (code, ctx) =>
                ctx.location === "tick"
                  ? code
                  : `Tramo: ${code}`,
            },
          ]}
          yAxis={[
            {
              label: porcentual
                ? "Participación (%)"
                : "Personas",
              width: 80,
              valueFormatter: (v) =>
                porcentual
                  ? `${v.toFixed?.(0)}%`
                  : valueFormatter(v),
            },
          ]}
          series={[
            {
              label: "Hombres",
              dataKey: "hombres",
              color: COL_HOMBRES,
              valueFormatter,
            },
            {
              label: "Mujeres",
              dataKey: "mujeres",
              color: COL_MUJERES,
              valueFormatter,
            },
          ]}
          margin={{ left: 8, right: 16, top: 12, bottom: 8 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              direction: "vertical",
              position: {
                vertical: "top",
                horizontal: "end",
              },
              sx: {
                "& li": {
                  fontSize: 12,
                  fontFamily:
                    "Roboto, system-ui, sans-serif",
                },
              },
            },
          }}
        />
      )}
    </Box>
  );
}