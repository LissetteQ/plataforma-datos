// src/components/BloqueMacroeconomicoRow.jsx
import { Box, Typography } from "@mui/material";
import BloqueEconomico from "./BloqueEconomico";

/**
 * Layout final:
 *
 * Desktop (md+):
 *   grid de 2 columnas: gráfico grande (4fr) | texto (2fr)
 *   El bloque de texto queda verticalmente centrado respecto al gráfico.
 *
 * Mobile:
 *   1 columna apilada: texto primero, gráfico después.
 */

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

const BloqueMacroeconomicoRow = ({
  titulo,
  textoIntro,
  color,
  series,
  descripcionGrafico,
  paleta,
}) => {
  // IDs accesibles (estables por render)
  const titleId = `bloque-macro-title-${Math.random().toString(36).slice(2, 8)}`;
  const descId = `${titleId}-desc`;

  return (
    <Box
      component="section"
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",      // mobile: una columna
          md: "4fr 2fr",  // desktop: gráfico más ancho, look rectangular
        },
        columnGap: { xs: 0, md: 4 },
        rowGap: { xs: 3, md: 0 },
        alignItems: { xs: "start", md: "stretch" },
        mb: 8,
        maxWidth: "1600px",
        mx: "auto",
        width: "100%",
        px: { xs: 1.5, sm: 2, md: 2 },
      }}
    >
      {/* Encabezado accesible (solo lectores) para etiquetar la región */}
      <Typography id={titleId} component="h2" sx={srOnly}>
        {titulo}
      </Typography>

      {/* Columna gráfico:
         - En mobile se muestra DESPUÉS del texto (order 1)
         - En desktop va a la izquierda (order 0)
         - Se estira horizontalmente */}
      <Box
        sx={{
          order: { xs: 1, md: 0 },
          minWidth: 0,
          width: "100%",
          maxWidth: "100%",
          display: "flex",
        }}
      >
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <BloqueEconomico
            titulo={titulo}
            descripcion={descripcionGrafico}
            series={series}
            colorPrincipal={color}
            paleta={paleta}
          />
        </Box>
      </Box>

      {/* Columna texto:
         - En mobile aparece primero (order 0)
         - En desktop va a la derecha (order 1)
         - Centrado verticalmente respecto al gráfico en desktop */}
      <Box
        sx={{
          order: { xs: 0, md: 1 },
          display: "flex",
          flexDirection: "column",
          justifyContent: { xs: "flex-start", md: "center" },
          alignSelf: { xs: "auto", md: "center" },
          maxWidth: "100%",
          width: "100%",
          textAlign: { xs: "left", md: "left" },
          pr: { xs: 0, md: 2 },
        }}
      >
        {/* Título visible (apoya a usuarios videntes; el h2 real es sr-only) */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: paleta.textPrimary,
            mb: 1,
            fontSize: { xs: "1.1rem", md: "1.4rem" },
            lineHeight: 1.3,
            wordBreak: "break-word",
          }}
        >
          {titulo}
        </Typography>

        <Typography
          id={descId}
          variant="body1"
          sx={{
            color: paleta.textSecondary,
            fontSize: { xs: "0.9rem", md: "1rem" },
            lineHeight: 1.6,
            textAlign: "justify",
            mb: 2,
          }}
        >
          {textoIntro}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: paleta.textSecondary,
            fontSize: "0.7rem",
            lineHeight: 1.4,
          }}
        >
          Fuente: Banco Central de Chile.
        </Typography>
      </Box>
    </Box>
  );
};

export default BloqueMacroeconomicoRow;
