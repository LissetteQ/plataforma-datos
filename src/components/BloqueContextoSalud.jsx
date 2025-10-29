// src/components/BloqueContextoSalud.jsx
import React from "react";
import { Box, Paper, Typography } from "@mui/material";

const PALETA = {
  ink: "#1F2937",       // casi negro
  gray500: "#6B7280",   // texto secundario
  cardBg: "#FFFFFF",
  divider: "#E5E7EB",
};

const srOnly = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

export default function BloqueContextoSalud() {
  const titleId = "ctx-salud-title";

  return (
    <Paper
      component="section"
      role="region"
      aria-labelledby={titleId}
      elevation={0}
      sx={{
        borderRadius: 2,
        bgcolor: PALETA.cardBg,
        border: `1px solid ${PALETA.divider}`,
        p: { xs: 1.5, sm: 2, md: 2.5 },
      }}
    >
      {/* Título accesible (no visible) */}
      <Typography id={titleId} component="h2" sx={srOnly}>
        Contexto de salud
      </Typography>

      {/* Texto político / editorial */}
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          textAlign: "center",
        }}
      >
        <Typography
          component="p"
          sx={{
            fontSize: { xs: 13, sm: 14 },
            lineHeight: 1.5,
            color: PALETA.gray500,
            mb: 1.5,
          }}
        >
          La salud mental requiere prioridad efectiva en cobertura y prevención
          de riesgos psicosociales, evitando que sus costos recaigan en hogares
          y en el sector público. Estas transformaciones forman parte de una
          reforma estructural ineludible para alinear el sistema con el derecho
          a la salud.
        </Typography>

        <Typography
          component="p"
          sx={{
            fontSize: { xs: 13, sm: 14 },
            lineHeight: 1.5,
            color: PALETA.gray500,
          }}
        >
          Explora los gráficos de esta sección, compara series y territorios, y
          descarga las bases para realizar tus propios análisis; si publicas o
          compartes resultados, cita la fuente y el período de los datos. Con
          evidencia transparente y criterios de bien común, es posible superar
          un modelo centrado en la mercantilización y avanzar hacia un sistema
          de salud más justo, eficiente y democrático.
        </Typography>
      </Box>
    </Paper>
  );
}
