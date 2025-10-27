import React from "react";
import { Box, Typography } from "@mui/material";

const PALETA = {
  textPrimary: "#1E1E1E",
  textSecondary: "#5A5D63",
};

export default function EduExplicacionLateral() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: { xs: "100%", md: 320 },
      }}
    >
      {/* Bloque 1 */}
      <Box>
        <Typography
          sx={{
            fontWeight: 700,
            color: PALETA.textPrimary,
            fontSize: { xs: "0.95rem", md: "1rem" },
            lineHeight: 1.4,
            mb: 0.75,
          }}
        >
          Financiamiento y sostenibilidad
        </Typography>

        <Typography
          sx={{
            color: PALETA.textSecondary,
            fontSize: { xs: "0.9rem", md: "0.95rem" },
            lineHeight: 1.55,
            textAlign: "justify",
          }}
        >
          El financiamiento es parte del mismo giro: un Estado moderno debe
          asignar recursos con eficiencia y justicia, superar el endeudamiento
          como regla y sacar a la banca del centro de la política educativa. La
          deuda por estudiar afecta a los hogares y tensiona la sostenibilidad
          del sistema; alivios como “Chao Dicom” fueron pasos útiles, pero no
          sustituyen la solución estructural.
        </Typography>
      </Box>

      {/* Bloque 2 */}
      <Box>
        <Typography
          sx={{
            fontWeight: 700,
            color: PALETA.textPrimary,
            fontSize: { xs: "0.95rem", md: "1rem" },
            lineHeight: 1.4,
            mb: 0.75,
          }}
        >
          Para qué sirven estos datos
        </Typography>

        <Typography
          sx={{
            color: PALETA.textSecondary,
            fontSize: { xs: "0.9rem", md: "0.95rem" },
            lineHeight: 1.55,
            textAlign: "justify",
          }}
        >
          Con ese horizonte, esta sección ofrece datos para mirar el panorama
          completo y orientar acuerdos: educación como derecho social, en
          equilibrio con la libertad de enseñanza, puesta al servicio de un
          futuro más justo y democrático. Explora los gráficos, compara series y
          territorios, y descarga las bases para producir tus propios análisis;
          si publicas o compartes resultados, cita siempre la fuente y el
          período de los datos para sostener una conversación educativa
          informada y útil para la toma de decisiones.
        </Typography>
      </Box>
    </Box>
  );
}