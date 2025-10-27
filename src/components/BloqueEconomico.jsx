// src/components/BloqueEconomico.jsx
import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  useMediaQuery,
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
 * Gráfico responsive (2018 -> hoy)
 * Tarjeta más panorámica/rectangular
 */

const BloqueEconomico = ({
  titulo,
  descripcion,
  series,
  colorPrincipal = "#0B3D91",
  paleta,
}) => {
  const [serieSeleccionada, setSerieSeleccionada] = useState(series[0]);
  const [tipoGrafico, setTipoGrafico] = useState("lineas");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // responsive breakpoints
  const isXs = useMediaQuery("(max-width:480px)");
  const isSm = useMediaQuery("(max-width:768px)");

  // altura del gráfico -> más rectangular
  const chartHeight = isXs ? 220 : isSm ? 260 : 300;

  // color translúcido para barras
  const colorSuave = useMemo(() => `${colorPrincipal}22`, [colorPrincipal]);

  useEffect(() => {
    const hoy = dayjs().format("YYYY-MM-DD");
    const inicio = "2018-01-01";

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await bancoCentralService.getSerie(
          serieSeleccionada.id,
          inicio,
          hoy
        );
        const datos = response?.Series?.Obs || [];

        const formateado = datos
          .map((obs) => ({
            fecha: (obs.indexDateString || "").slice(0, 7),
            valor: Number.parseFloat(obs.value),
          }))
          .filter((d) => !Number.isNaN(d.valor));

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

  const formatTick = (yyyyMm) => {
    if (!yyyyMm) return "";
    const [Y, M] = yyyyMm.split("-");
    return `${M}/${Y.slice(-2)}`; // "05/24"
  };

  const formatTooltipLabel = (yyyyMm) => {
    if (!yyyyMm) return "";
    const [Y, M] = yyyyMm.split("-");
    const MES = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const idx = parseInt(M, 10) - 1;
    return `${MES[idx]} ${Y}`;
  };

  const renderChart = () => {
    const ChartComponent = tipoGrafico === "lineas" ? LineChart : BarChart;

    return (
      <ResponsiveContainer width="100%" height={chartHeight}>
        <ChartComponent
          data={data}
          margin={{
            top: 20,
            right: 16,
            left: isXs ? 8 : 16,
            bottom: 32,
          }}
        >
          <CartesianGrid stroke="#EBEDF0" strokeDasharray="3 3" />

          <XAxis
            dataKey="fecha"
            tick={{
              fontSize: 11,
              fill: paleta?.textSecondary || "#5A5D63",
            }}
            tickFormatter={formatTick}
            interval="preserveStartEnd"
            minTickGap={isXs ? 28 : 40}
            tickMargin={12}
            height={40}
          />

          <YAxis
            tick={{
              fontSize: 11,
              fill: paleta?.textSecondary || "#5A5D63",
            }}
            width={isXs ? 32 : 42}
            tickMargin={4}
          />

          <Tooltip
            wrapperStyle={{
              borderRadius: 8,
              border: `1px solid ${paleta?.neutralBorder || "#E4E6EB"}`,
            }}
            contentStyle={{ borderRadius: 8 }}
            labelStyle={{ fontWeight: 600 }}
            labelFormatter={formatTooltipLabel}
          />

          <Legend
            verticalAlign="top"
            align="left"
            wrapperStyle={{
              paddingBottom: 8,
              fontSize: 12,
            }}
          />

          {tipoGrafico === "lineas" ? (
            <Line
              type="monotone"
              dataKey="valor"
              stroke={colorPrincipal}
              strokeWidth={2.2}
              dot={false}
              name={serieSeleccionada.nombre}
            />
          ) : (
            <Bar
              dataKey="valor"
              fill={colorPrincipal}
              name={serieSeleccionada.nombre}
              radius={[4, 4, 0, 0]}
              barSize={isXs ? 4 : 6}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        bgcolor: "#fff",
        borderRadius: 1.5, // borde más suave
        p: { xs: 2, md: 2 }, // menos padding alto en desktop
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        border: `1px solid ${paleta?.neutralBorder || "#E4E6EB"}`,
        overflow: "hidden",
      }}
    >
      {/* Controles arriba del gráfico */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          flexWrap: "wrap",
          rowGap: 1,
          columnGap: 1.5,
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        {/* Chip + título */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1,
            maxWidth: "100%",
          }}
        >
          <Chip
            size="small"
            label={titulo.split(" ")[0] || "Índice"}
            sx={{
              bgcolor: `${colorPrincipal}14`,
              color: colorPrincipal,
              fontWeight: 700,
              fontSize: "0.7rem",
            }}
          />
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: paleta?.textPrimary || "#1E1E1E",
              lineHeight: 1.3,
              fontSize: { xs: "0.9rem", md: "1rem" },
              wordBreak: "break-word",
              maxWidth: { xs: "100%", sm: "420px" },
            }}
          >
            {titulo}
          </Typography>
        </Box>

        {/* Controles serie + tipo gráfico */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
            rowGap: 1,
            columnGap: 1,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Select
            size="small"
            value={serieSeleccionada.id}
            onChange={(e) =>
              setSerieSeleccionada(
                series.find((s) => s.id === e.target.value)
              )
            }
            sx={{
              minWidth: { xs: "100%", sm: 200 },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: paleta?.neutralBorder || "#E4E6EB",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: colorPrincipal,
              },
              fontSize: "0.8rem",
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
            onChange={(e, val) => val && setTipoGrafico(val)}
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.75rem",
                paddingInline: 1.25,
                borderColor: paleta?.neutralBorder || "#E4E6EB",
              },
              "& .Mui-selected": {
                bgcolor: colorPrincipal,
                color: "#fff",
                "&:hover": {
                  bgcolor: colorPrincipal,
                  color: "#fff",
                },
              },
            }}
          >
            <ToggleButton value="lineas">Líneas</ToggleButton>
            <ToggleButton value="barras">Barras</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Descripción (oculta en XS para no robar alto al gráfico) */}
      {descripcion && (
        <Typography
          variant="body2"
          sx={{
            color: paleta?.textSecondary || "#5A5D63",
            lineHeight: 1.5,
            fontSize: { xs: "0.8rem", md: "0.85rem" },
            mb: 2,
            display: { xs: "none", sm: "block" },
          }}
        >
          {descripcion}
        </Typography>
      )}

      {/* Área del gráfico */}
      <Box
        sx={{
          minHeight: chartHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <CircularProgress size={28} />
        ) : error ? (
          <Alert severity="error" sx={{ fontSize: "0.8rem" }}>
            {error}
          </Alert>
        ) : (
          renderChart()
        )}
      </Box>
    </Box>
  );
};

export default BloqueEconomico;