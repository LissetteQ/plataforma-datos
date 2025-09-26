// src/pages/Trabajo.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import BarChartIcon from "@mui/icons-material/BarChart";

import GraficoTrabajoPorAnio from "../components/GraficoTrabajoPorAnio";
import GraficoSexo from "../components/GraficoSexo";
import GraficoCotizaciones from "../components/GraficoCotizaciones";
import GraficoIngreso from "../components/GraficoIngreso";
import GraficoJornada from "../components/GraficoJornada";
import GraficoTasas from "../components/GraficoTasas";
import GraficoPiramide from "../components/GraficoPiramide";
import GraficoIngresoSexo from "../components/GraficoIngresoSexo";

// NUEVOS: ESI (ingresos)
import ESIIngresosKPIs from "../components/ESIIngresosKPIs";
import GraficoESIIngresos from "../components/GraficoESIIngresos";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getAnual, getTasas } from "../services/trabajoApi";

const formMiles = (n) => Math.round((n ?? 0) / 1000).toLocaleString("es-CL");

export default function Trabajo() {
  const [fuerza, setFuerza] = useState(null);
  const [desempleo, setDesempleo] = useState(null);

  useEffect(() => {
    // Fuerza laboral: último año disponible
    getAnual().then((rows) => {
      const data = Array.isArray(rows) ? rows : [];
      if (!data.length) return;
      const ultimo = data.reduce((a, b) => (a.anio > b.anio ? a : b));
      setFuerza(ultimo.fuerza_laboral);
    });

    // Desempleo: 2024T2 Nacional
    getTasas({ periodo: "2024T2", sexo: "Nacional" }).then((rows) => {
      const r = (Array.isArray(rows) ? rows : [])[0];
      if (r?.td != null) setDesempleo(r.td);
    });
  }, []);

  const dataCards = [
    {
      icon: PeopleIcon,
      title: "Fuerza Laboral",
      value: fuerza != null ? formMiles(fuerza) : "—",
      subtitle: fuerza != null ? "Miles de personas (último año)" : "Cargando...",
    },
    {
      icon: TrendingDownIcon,
      title: "Desempleo",
      value: desempleo != null ? `${desempleo.toFixed(1)}%` : "—",
      subtitle: "Tasa nacional (2024T2)",
    },
    {
      icon: BarChartIcon,
      title: "Salario Mínimo",
      value: "$460.000",
      subtitle: "Pesos chilenos",
    },
  ];

  const exportarPDF = async () => {
    const input = document.getElementById("seccion-trabajo");
    const canvas = await html2canvas(input, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "pt", format: "a4" });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const ratio = pageWidth / canvas.width;
    const imgHeight = canvas.height * ratio;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    pdf.save("reporte-trabajo.pdf");
  };

  const SectionCard = ({ title, children, description }) => (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
      {title && (
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          {title}
        </Typography>
      )}
      {children}
      {description && (
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 2 }}>
          {description}
        </Typography>
      )}
    </Paper>
  );

  return (
    <Container id="seccion-trabajo" maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          fontWeight: 700,
          textTransform: "uppercase",
          color: "#fb8c00",
        }}
      >
        TRABAJO
      </Typography>

      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
          color: "text.secondary",
          maxWidth: 820,
          mx: "auto",
          mb: 1,
        }}
      >
        Estadísticas laborales, tasas de empleo y desempleo, condiciones de trabajo y mercado
        laboral en Chile.
      </Typography>

      <Typography
        variant="body2"
        sx={{
          textAlign: "center",
          color: "text.secondary",
          mt: 0,
          mb: 4,
        }}
      >
        Información basada en datos de la Encuesta Nacional de Empleo (ENE) y ESI, desde{" "}
        <strong>2018</strong> hasta <strong>2024</strong>.
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
        {dataCards.map((item, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 1,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <item.icon sx={{ color: "#fb8c00", fontSize: 24 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {item.title}
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {item.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.subtitle}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <SectionCard
        description="La evolución anual del empleo permite observar el impacto de fenómenos económicos y sociales en la fuerza laboral chilena."
      >
        <GraficoTrabajoPorAnio />
      </SectionCard>

      <SectionCard
        description="Los hombres siguen presentando una tasa de ocupación significativamente mayor."
      >
        <GraficoSexo />
      </SectionCard>

      <SectionCard
        description="Un porcentaje importante de trabajadores no cotiza regularmente."
      >
        <GraficoCotizaciones />
      </SectionCard>

      <SectionCard
        description="La mayoría declara jornada completa, pero hay una porción considerable en jornada parcial."
      >
        <GraficoJornada />
      </SectionCard>

      {/* === NUEVO: ESI Ingresos (KPIs) === */}
      <SectionCard description="Ingreso medio (ESI) para el último año disponible, total y por sexo.">
        <ESIIngresosKPIs />
      </SectionCard>

      {/* === NUEVO: ESI Ingresos (serie anual) === */}
      <SectionCard description="Evolución anual del ingreso medio según ESI para total, hombres y mujeres (2018–2024).">
        <GraficoESIIngresos />
      </SectionCard>

      <SectionCard
        description="El ingreso promedio refleja diferencias por género, región, formalidad y tipo de jornada."
      >
        <GraficoIngreso />
      </SectionCard>

      <SectionCard
        description="Promedio anual de ingresos de hombres y mujeres (a partir del dataset enviado)."
      >
        <GraficoIngresoSexo />
      </SectionCard>

      <SectionCard
        description="TD, TO, TP, TPL y SU1–SU4, junto a TOI y TOSI según ENE."
      >
        <GraficoTasas />
      </SectionCard>

      <SectionCard
        description="Distribución por edades de PET, FDT, OC, DES, ID, TPI, OBE, FTP, FTA, FFT, OI y OSI."
      >
        <GraficoPiramide />
      </SectionCard>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          onClick={exportarPDF}
          variant="contained"
          sx={{ backgroundColor: "#fb8c00", fontWeight: 600 }}
        >
          Descargar reporte PDF
        </Button>
      </Box>
    </Container>
  );
}
