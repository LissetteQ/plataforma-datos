import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import BarChartIcon from '@mui/icons-material/BarChart';

import GraficoTrabajoPorAnio from '../components/GraficoTrabajoPorAnio.jsx';
import GraficoSexo from '../components/GraficoSexo.jsx';
import GraficoCotizaciones from '../components/GraficoCotizaciones.jsx';
import GraficoIngreso from '../components/GraficoIngreso.jsx';
import GraficoJornada from '../components/GraficoJornada.jsx';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Trabajo() {
  const dataCards = [
    {
      icon: PeopleIcon,
      title: 'Fuerza Laboral',
      value: '4.239',
      subtitle: 'Personas activas (muestra 2024)',
    },
    {
      icon: TrendingDownIcon,
      title: 'Desempleo',
      value: '31.6%',
      subtitle: 'Tasa nacional (muestra)',
    },
    {
      icon: BarChartIcon,
      title: 'Salario Mínimo',
      value: '$460.000',
      subtitle: 'Pesos chilenos',
    },
  ];

  const exportarPDF = async () => {
    const input = document.getElementById('seccion-trabajo');
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('reporte-trabajo.pdf');
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
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
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
          textAlign: 'center',
          fontWeight: 700,
          textTransform: 'uppercase',
          color: '#fb8c00',
        }}
      >
        Trabajo
      </Typography>

      <Typography
        variant="body1"
        sx={{
          textAlign: 'center',
          color: 'text.secondary',
          maxWidth: 700,
          mx: 'auto',
          mb: 1,
        }}
      >
        Estadísticas laborales, tasas de empleo y desempleo, condiciones de trabajo y mercado laboral en Chile.
      </Typography>

      <Typography
        variant="body2"
        sx={{
          textAlign: 'center',
          color: 'text.secondary',
          mt: 0,
          mb: 4,
        }}
      >
        Información basada en datos de la Encuesta Nacional de Empleo (ENE), desde <strong>2018</strong> hasta <strong>2024</strong>.
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
        {dataCards.map((item, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 1,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <item.icon sx={{ color: '#fb8c00', fontSize: 24 }} />
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
        title="Evolución de Fuerza Laboral y Desempleo (Muestra)"
        description="La evolución anual del empleo permite observar el impacto de fenómenos económicos y sociales en la fuerza laboral chilena."
      >
        <GraficoTrabajoPorAnio />
      </SectionCard>

      <SectionCard
        title="Participación laboral por sexo"
        description="Los hombres siguen presentando una tasa de ocupación significativamente mayor."
      >
        <GraficoSexo />
      </SectionCard>

      <SectionCard
        title="Cotización previsional y de salud"
        description="Un porcentaje importante de trabajadores no cotiza regularmente."
      >
        <GraficoCotizaciones />
      </SectionCard>

      <SectionCard
        title="Tipo de Jornada Laboral"
        description="La mayoría declara jornada completa, pero hay una porción considerable en jornada parcial."
      >
        <GraficoJornada />
      </SectionCard>

      <SectionCard
        title="Ingreso Promedio Mensual"
        description="El ingreso promedio mensual estimado para 2024 ronda los $570.000 pesos chilenos. Este valor refleja una mediana de ingresos entre ocupados y ocupadas mayores de 15 años, considerando distintas ramas de actividad económica, niveles educacionales y tipos de jornada. Si bien representa un leve incremento respecto a años anteriores, aún persisten brechas salariales importantes por género, región y formalidad laboral."
      >
        <GraficoIngreso />
      </SectionCard>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          onClick={exportarPDF}
          variant="contained"
          sx={{ backgroundColor: '#fb8c00', fontWeight: 600 }}
        >
          Descargar reporte PDF
        </Button>
      </Box>
    </Container>
  );
}
