// src/components/BloqueEconomico.jsx
import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
} from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { bancoCentralService } from "../services/bancoCentralService";
import dayjs from "dayjs";

/**
 * Componente con estilos unificados:
 * - Card con borde sutil y sombra suave
 * - Header con “cinta” de color a la izquierda (colorPrincipal)
 * - Controles (select + toggle) alineados y consistentes
 * - Gráficos con colores por bloque
 * - Sin cambiar la estructura ni los datos de la API
 */
const BloqueEconomico = ({ titulo, descripcion, series, colorPrincipal = "#0B3D91", paleta }) => {
  const [serieSeleccionada, setSerieSeleccionada] = useState(series[0]);
  const [tipoGrafico, setTipoGrafico] = useState("lineas");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // colores derivados
  const colorSuave = useMemo(() => {
    // tono más claro para rellenos de barras
    return `${colorPrincipal}22`; // ~13% alpha
  }, [colorPrincipal]);

  useEffect(() => {
    const hoy = dayjs().format("YYYY-MM-DD");
    const inicio = "2019-01-01";

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await bancoCentralService.getSerie(
          serieSeleccionada.id,
          inicio,
          hoy
        );
        const datos = response?.Series?.Obs || [];
        const formateado = datos.map((obs) => ({
          fecha: (obs.indexDateString || "").slice(0, 7),
          valor: Number.parseFloat(obs.value),
        })).filter((d) => !Number.isNaN(d.valor));

        setData(formateado);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Error al cargar datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serieSeleccionada]);

  const renderChart = () => {
    const ChartComponent = tipoGrafico === "lineas" ? LineChart : BarChart;
    const SeriesVisual = tipoGrafico === "lineas" ? (
      <Line
        type="monotone"
        dataKey="valor"
        stroke={colorPrincipal}
        strokeWidth={2.25}
        dot={false}
        name={serieSeleccionada.nombre}
      />
    ) : (
      <Bar
        dataKey="valor"
        name={serieSeleccionada.nombre}
        fill={colorPrincipal}
        radius={[6, 6, 0, 0]}
      />
    );

    return (
      <ResponsiveContainer width="100%" height={360}>
        <ChartComponent data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#EBEDF0" strokeDasharray="3 3" />
          <XAxis
            dataKey="fecha"
            tick={{ fontSize: 12, fill: paleta?.textSecondary || "#5A5D63" }}
            tickMargin={8}
          />
          <YAxis
            tick={{ fontSize: 12, fill: paleta?.textSecondary || "#5A5D63" }}
            tickMargin={6}
          />
          <Tooltip
            wrapperStyle={{ borderRadius: 8, border: `1px solid ${paleta?.neutralBorder || "#E4E6EB"}` }}
            contentStyle={{ borderRadius: 8 }}
            labelStyle={{ fontWeight: 600 }}
          />
          <Legend
            verticalAlign="top"
            align="left"
            wrapperStyle={{ paddingBottom: 8 }}
            iconType={tipoGrafico === "lineas" ? "line" : "rect"}
          />
          {tipoGrafico === "barras" && (
            <Bar dataKey="valor" name={serieSeleccionada.nombre} fill={colorSuave} />
          )}
          {SeriesVisual}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: `1px solid ${paleta?.neutralBorder || "#E4E6EB"}`,
        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
        overflow: "hidden",
        bgcolor: "#fff",
      }}
    >
      {/* Cinta vertical de color del bloque */}
      <Box
        sx={{
          height: 6,
          bgcolor: colorPrincipal,
        }}
      />

      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              size="small"
              label={titulo.split(" ")[0]} // pequeña etiqueta (ej. "Producto")
              sx={{
                bgcolor: `${colorPrincipal}14`,
                color: colorPrincipal,
                fontWeight: 700,
              }}
            />
            <Typography
              variant="h6"
              sx={{ m: 0, color: paleta?.textPrimary || "#1E1E1E", fontWeight: 800 }}
            >
              {titulo}
            </Typography>
          </Box>

          {/* Controles */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
            <Select
              size="small"
              value={serieSeleccionada.id}
              onChange={(e) =>
                setSerieSeleccionada(series.find((s) => s.id === e.target.value))
              }
              sx={{
                minWidth: 220,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: paleta?.neutralBorder || "#E4E6EB",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: colorPrincipal,
                },
              }}
            >
              {series.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.nombre}
                </MenuItem>
              ))}
            </Select>

            <ToggleButtonGroup
              value={tipoGrafico}
              exclusive
              onChange={(e, value) => value && setTipoGrafico(value)}
              size="small"
              sx={{
                "& .MuiToggleButton-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: paleta?.neutralBorder || "#E4E6EB",
                },
                "& .Mui-selected": {
                  bgcolor: colorPrincipal,
                  color: "#fff",
                  "&:hover": { bgcolor: colorPrincipal },
                },
              }}
            >
              <ToggleButton value="lineas">Líneas</ToggleButton>
              <ToggleButton value="barras">Barras</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Descripción */}
        <Typography
          variant="body2"
          sx={{
            mt: 1.5,
            mb: 2,
            color: paleta?.textSecondary || "#5A5D63",
            lineHeight: 1.6,
          }}
        >
          {descripcion}
        </Typography>

        {/* Contenido */}
        <Box sx={{ minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            renderChart()
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default BloqueEconomico;