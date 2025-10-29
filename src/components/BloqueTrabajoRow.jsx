// src/components/BloqueTrabajoRow.jsx
import React from "react";
import { Box, Typography, Paper, useMediaQuery, useTheme } from "@mui/material";

export default function BloqueTrabajoRow({
  titulo,
  descripcionLarga,
  children,
  notaFuente,
}) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.25, sm: 1.75, md: 2 },
        borderRadius: 2,
        mb: { xs: 1.5, sm: 2.5, md: 3 },
        bgcolor: "#FFFFFF",
        border: "1px solid #E5E7EB",
        boxShadow: { md: "0 2px 10px rgba(0,0,0,0.04)" },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Sin franja superior */}

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 3 },
        }}
      >
        {/* Texto */}
        <Box
          sx={{
            flexBasis: { md: "32%" },
            maxWidth: { md: "32%" },
            flexShrink: 0,
          }}
        >
          {titulo && (
            <Typography
              variant={isMdUp ? "h6" : "subtitle1"}
              sx={{
                fontWeight: 800,
                lineHeight: 1.2,
                color: "#1E1E1E",
                mb: 1,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              {titulo}
            </Typography>
          )}

          {descripcionLarga && (
            <Typography
              variant="body2"
              sx={{
                color: "#5A5D63",
                fontSize: { xs: "0.9rem", md: "0.9rem" },
                lineHeight: 1.5,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              {descripcionLarga}
            </Typography>
          )}
        </Box>

        {/* Gráfico */}
        <Box
          sx={{
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: "100%",
              minHeight: { xs: 220, sm: 300, md: 360 },
              "& > *": { width: "100%", height: "100%" },
            }}
          >
            {children}
          </Box>

          {notaFuente && (
            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "#6B7280",
                textAlign: "center",
                lineHeight: 1.4,
                mt: 1,
              }}
            >
              {notaFuente}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
