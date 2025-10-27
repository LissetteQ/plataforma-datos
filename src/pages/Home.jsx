// src/pages/Home.jsx
import React from "react";
import { Box, Container, Typography } from "@mui/material";
import Hero from "../components/Hero";
import IntroDatosChile from "../components/IntroDatosChile";
import CardGrid from "../components/cards/CardGrid";

const Home = () => {
  return (
    <Box className="page-bg">
      <Box className="page-overlay">
        {/* Sección hero */}
        <Hero />

        {/* Introducción institucional */}
        <IntroDatosChile />

        {/* Texto explicativo antes de las tarjetas */}
        <Container
          maxWidth="md"
          sx={{
            px: { xs: 2, md: 3 },
            pt: { xs: 2, md: 3 },
            pb: { xs: 1, md: 3 },
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.2rem", md: "1.5rem" },
              textTransform: "uppercase",
              mb: 2,
              color: "text.primary",
            }}
          >
            Explora los datos
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              lineHeight: 1.6,
              maxWidth: "800px",
              mx: "auto",
            }}
          >
            Accede a indicadores y visualizaciones sobre{" "}
            <strong>Macroeconomía</strong>,{" "}
            <strong>Educación</strong>,{" "}
            <strong>Salud</strong> y{" "}
            <strong>Trabajo</strong>. Cada sección presenta
            datos oficiales en formato interactivo y
            descargable para apoyar el análisis público y la
            toma de decisiones informadas.
          </Typography>
        </Container>

        {/* Tarjetas alineadas horizontalmente */}
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "center",
            alignItems: "stretch",
            gap: { xs: 2, md: 3 },
            px: { xs: 2, md: 3 },
            pb: { xs: 4, md: 6 },
          }}
        >
          <CardGrid />
        </Container>

        {/* Cierre institucional */}
        <Container
          maxWidth="md"
          sx={{
            py: { xs: 4, md: 6 },
            px: { xs: 2, md: 3 },
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.1rem", md: "1.4rem" },
              mb: 2,
              color: "text.primary",
            }}
          >
            Plataforma de Visualización de Datos Públicos
            de Chile
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.9rem", md: "1rem" },
              lineHeight: 1.6,
              maxWidth: "800px",
              mx: "auto",
            }}
          >
            Esta plataforma permite explorar datos sociales y
            económicos de Chile mediante gráficos
            interactivos, mapas y visualizaciones temáticas.
            La información proviene de fuentes oficiales
            como el Banco Central y el INE. Su objetivo es
            ofrecer evidencia clara y reutilizable para
            investigación, prensa, políticas públicas y
            trabajo territorial.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;