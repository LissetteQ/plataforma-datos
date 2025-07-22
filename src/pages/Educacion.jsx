// src/pages/Educacion.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Educacion = () => {
  const [serie, setSerie] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("line");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/banco-central")
      .then((response) => {
        const data = response.data;
        console.log("Datos recibidos:", data);

        if (data?.Codigo === 0 && data?.Series?.Obs?.length > 0) {
          setSerie(data.Series);
        } else {
          setError(true);
        }
      })
      .catch((err) => {
        console.error("Error al obtener serie del Banco Central:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const valores = serie?.Obs?.filter((item) => !isNaN(Number(item.value))) || [];
  const labels = valores.map((item) => item.indexDateString);
  const data = valores.map((item) => Number(item.value));

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const logoUrl = "https://www.nodoxxi.cl/wp-content/uploads/2022/08/logo-nodo-xxi.png";

    const tableData = valores.map((item) => [item.indexDateString, item.value]);

    const drawPDF = () => {
      doc.setFontSize(14);
      doc.text("Informe de Macroeconomía", 14, 30);
      doc.setFontSize(11);
      doc.text("Fuente: Banco Central de Chile", 14, 40);
      doc.text("Serie: " + (serie?.descripEsp || "Sin descripción"), 14, 50);
      doc.text("Observaciones válidas:", 14, 60);

      autoTable(doc, {
        head: [["Fecha", "Valor"]],
        body: tableData,
        startY: 65,
      });

      doc.save("macroeconomia_banco_central.pdf");
    };

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = logoUrl;
    img.onload = () => {
      doc.addImage(img, "PNG", 150, 10, 40, 15);
      drawPDF();
    };
    img.onerror = () => {
      console.warn("No se pudo cargar el logo.");
      drawPDF();
    };
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: { xs: 3, sm: 5 }, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Macroeconomía
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={20} />
          <Typography variant="body1">Cargando datos...</Typography>
        </Box>
      )}

      {error && (
        <Typography color="error" variant="body1">
          Error al cargar datos de la API.
        </Typography>
      )}

      {!loading && serie && (
        <Box sx={{ mb: 2, display: "flex", flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'flex-start' }}>
          <TextField
            select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            label="Tipo de gráfico"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="line">Línea</MenuItem>
            <MenuItem value="bar">Barras</MenuItem>
          </TextField>
        </Box>
      )}

      {!loading && serie && (
        <Box sx={{ overflowX: 'auto' }}>
          <Paper sx={{ p: 2, minWidth: 320, width: '100%' }} elevation={3}>
            <ChartContainer
              series={[{
                type: chartType,
                data: data,
                color: chartType === 'line' ? '#FF2703' : '#00CEC8'
              }]}
              xAxis={[{
                data: labels,
                scaleType: 'band',
                id: 'x-axis-id',
                height: 70,
                tickMinStep: 7,
              }]}
              height={300}
              sx={{ width: '100%' }}
              barGapRatio={0.7}
              categoryGapRatio={0.5}
            >
              {chartType === 'bar' && <BarPlot />}
              {chartType === 'line' && <LinePlot />}
              <ChartsXAxis label="Fecha" axisId="x-axis-id" />
            </ChartContainer>
          </Paper>
        </Box>
      )}

      {!loading && serie && (
        <>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Esta gráfica representa la evolución de la serie estadística entregada por el Banco Central de Chile. Los valores han sido filtrados para mostrar sólo observaciones válidas.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button variant="outlined" onClick={handleDownloadPDF}>
              Descargar PDF con información detallada
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Educacion;
