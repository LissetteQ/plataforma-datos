// src/components/BloqueEconomico.jsx
import { useEffect, useState } from "react";
import {
  Card, CardContent, Typography, Select, MenuItem, Box,
  CircularProgress, Alert, ToggleButtonGroup, ToggleButton
} from "@mui/material";
import {
  ResponsiveContainer, LineChart, BarChart, Line, Bar, XAxis, YAxis,
  Tooltip, Legend, CartesianGrid
} from "recharts";
import { bancoCentralService } from "../services/bancoCentralService";
import dayjs from "dayjs";

const BloqueEconomico = ({ titulo, descripcion, series }) => {
  const [serieSeleccionada, setSerieSeleccionada] = useState(series[0]);
  const [tipoGrafico, setTipoGrafico] = useState("lineas");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          fecha: obs.indexDateString.slice(0, 7),
          valor: parseFloat(obs.value),
        }));
        setData(formateado);
        setError(null);
      } catch (err) {
        setError("Error al cargar datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serieSeleccionada]);

  const renderChart = () => {
    const ChartComponent = tipoGrafico === "lineas" ? LineChart : BarChart;
    const DataComponent = tipoGrafico === "lineas" ? (
      <Line
        type="monotone"
        dataKey="valor"
        stroke="#1976d2"
        name={serieSeleccionada.nombre}
      />
    ) : (
      <Bar dataKey="valor" fill="#1976d2" name={serieSeleccionada.nombre} />
    );

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Legend />
          {DataComponent}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Typography variant="h6">{titulo}</Typography>
          <Select
            size="small"
            value={serieSeleccionada.id}
            onChange={(e) =>
              setSerieSeleccionada(series.find((s) => s.id === e.target.value))
            }
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
          >
            <ToggleButton value="lineas">Líneas</ToggleButton>
            <ToggleButton value="barras">Barras</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
          {descripcion}
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          renderChart()
        )}
      </CardContent>
    </Card>
  );
};

export default BloqueEconomico;
