import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: 420, md: 520 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        backgroundImage: 'url("/img/Baner.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "visible",
      }}
    >
      {/* Overlay principal (degradé formal) */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(5,16,31,0.82) 0%, rgba(5,16,31,0.68) 45%, rgba(5,16,31,0.45) 100%)",
        }}
      />
      {/* Viñeta sutil para foco central */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(60% 60% at 50% 40%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Contenido */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          px: { xs: 2.5, md: 4 },
          width: "100%",
          maxWidth: 1000,
          textAlign: "center",
        }}
      >
        {/* Eyebrow/Píldora superior */}
        <Chip
          label="DATOS PARA LA DEMOCRACIA"
          sx={{
            mb: { xs: 1.5, md: 2 },
            color: "rgba(255,255,255,0.9)",
            bgcolor: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.18)",
            fontWeight: 600,
            letterSpacing: 1,
            backdropFilter: "blur(2px)",
          }}
          size="small"
        />

        {/* Título */}
        <Typography
          component="h1"
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: { xs: 0.5, md: 1 },
            textShadow: "0 2px 8px rgba(0,0,0,0.35)",
            fontSize: { xs: "1.75rem", sm: "2.1rem", md: "2.75rem" },
            lineHeight: 1.15,
          }}
        >
          Plataforma de Datos Sociales de Chile
        </Typography>

        {/* Subrayado discreto del título */}
        <Box
          sx={{
            mx: "auto",
            mt: 1.5,
            width: { xs: 80, md: 100 },
            height: 4,
            borderRadius: 2,
            background:
              "linear-gradient(90deg, rgba(111,207,255,0.9) 0%, rgba(56,189,248,0.9) 100%)",
          }}
        />

        {/* Descripción */}
        <Typography
          component="p"
          sx={{
            mt: { xs: 2, md: 2.5 },
            mx: "auto",
            maxWidth: 820,
            fontFamily: "Poppins, sans-serif",
            fontWeight: 300,
            lineHeight: 1.6,
            fontSize: { xs: "0.95rem", md: "1.05rem" },
            color: "rgba(255,255,255,0.95)",
            textShadow: "0 1px 4px rgba(0,0,0,0.35)",
          }}
        >
          Accede a indicadores y visualizaciones sobre{" "}
          <Box component="span" sx={{ fontWeight: 700, color: "#a7e3ff" }}>
            Macroeconomía
          </Box>
          ,{" "}
          <Box component="span" sx={{ fontWeight: 700, color: "#a7e3ff" }}>
            Educación
          </Box>
          ,{" "}
          <Box component="span" sx={{ fontWeight: 700, color: "#a7e3ff" }}>
            Salud
          </Box>{" "}
          y{" "}
          <Box component="span" sx={{ fontWeight: 700, color: "#a7e3ff" }}>
            Trabajo
          </Box>
          . Cada sección presenta datos oficiales en formato interactivo y
          descargable para apoyar el análisis público y la toma de decisiones
          informadas.
        </Typography>

        {/* Barra de búsqueda (glass + sombra) */}
        <Box
          sx={{
            mt: { xs: 3, sm: 4, md: 5 },
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 780,
              p: 1,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
              backdropFilter: "blur(6px)",
            }}
          >
            <SearchBar bgColor="rgba(255,255,255,0.92)" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
