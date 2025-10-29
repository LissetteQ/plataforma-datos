// src/pages/Buscar.jsx
import React, { useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import indexData from "../search/indexData";

function useQueryFromURL() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  return params.get("q") || "";
}

// resaltar coincidencias
function highlight(text, q) {
  if (!q) return text;

  const lower = text.toLowerCase();
  const idx = lower.indexOf(q.toLowerCase());
  if (idx === -1) return text;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + q.length);
  const after = text.slice(idx + q.length);

  return (
    <>
      {before}
      <Box
        component="mark"
        sx={{
          backgroundColor: "transparent",
          color: "#A6110F",
          fontWeight: 600,
        }}
      >
        {match}
      </Box>
      {after}
    </>
  );
}

export default function Buscar() {
  const { query, setQuery } = useSearch();
  const urlQuery = useQueryFromURL();

  // sincronizar contexto con la URL
  useEffect(() => {
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [urlQuery, query, setQuery]);

  const q = urlQuery.trim().toLowerCase();

  // filtrar resultados con keywords, título, etc.
  const resultados = useMemo(() => {
    if (q === "") return [];
    return indexData.filter((item) => {
      const textoGlobal = `${item.title} ${item.description} ${item.keywords} ${item.section} ${item.chip}`;
      return textoGlobal.toLowerCase().includes(q);
    });
  }, [q]);

  // chips sugerencias
  const sugerencias = [
    "desempleo mujeres",
    "Fonasa",
    "UF",
    "endeudamiento educativo",
    "jornada parcial",
  ];

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
        backgroundColor: "#F4F4F4",
        minHeight: "60vh",
      }}
    >
      {/* título */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: "#1E1E1E",
          mb: 2,
          fontFamily: "Poppins, sans-serif",
        }}
      >
        Resultados de búsqueda
      </Typography>

      {/* sugerencias si no hay query */}
      {q === "" && (
        <>
          <Typography
            sx={{
              color: "#5A5D63",
              fontSize: "0.95rem",
              lineHeight: 1.4,
              mb: 1.5,
            }}
          >
            Prueba con temas como:
          </Typography>

          <Stack
            direction="row"
            flexWrap="wrap"
            rowGap={1}
            columnGap={1}
            sx={{ mb: 3 }}
          >
            {sugerencias.map((sug, i) => (
              <Chip
                key={i}
                label={sug}
                component={Link}
                to={`/buscar?q=${encodeURIComponent(sug)}`}
                clickable
                sx={{
                  bgcolor: "#0B3D91",
                  color: "#fff",
                  fontSize: "0.75rem",
                  height: 28,
                  borderRadius: "999px",
                  textDecoration: "none",
                  "&:hover": {
                    bgcolor: "#082B73",
                  },
                }}
              />
            ))}
          </Stack>
          <Divider sx={{ mb: 3 }} />

          <Typography sx={{ color: "#5A5D63", fontSize: "0.95rem" }}>
            Escribe arriba en la barra de búsqueda “desempleo mujeres”, “UF”,
            “Fonasa”, “endeudamiento educativo”, etc. Te vamos a llevar directo
            a la tarjeta con el gráfico.
          </Typography>
        </>
      )}

      {/* sin resultados */}
      {q !== "" && resultados.length === 0 && (
        <Typography sx={{ color: "#5A5D63", fontSize: "0.95rem" }}>
          No encontramos resultados para “{urlQuery}”.
        </Typography>
      )}

      {/* resultados */}
      {q !== "" &&
        resultados.length > 0 &&
        resultados.map((item, i) => (
          <Paper
            key={i}
            component={Link}
            to={`${item.path}${item.anchorId || ""}`}
            elevation={0}
            sx={{
              textDecoration: "none",
              display: "block",
              mb: 2,
              p: 2,
              borderRadius: 2,
              border: "1px solid #E1E4E8",
              backgroundColor: "#fff",
              boxShadow:
                "0 8px 20px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.03)",
              "&:hover": {
                borderColor: "#0B3D91",
                boxShadow:
                  "0 16px 32px rgba(0,0,0,0.06), 0 4px 10px rgba(0,0,0,0.04)",
              },
            }}
          >
            {/* Header fila: título + chips */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "baseline",
                rowGap: 1,
                columnGap: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#0B3D91",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "1.1rem",
                  lineHeight: 1.3,
                }}
              >
                {highlight(item.title, q)}
              </Typography>

              <Stack direction="row" spacing={1}>
                <Chip
                  size="small"
                  label={item.section}
                  sx={{
                    bgcolor: "#0B3D91",
                    color: "#fff",
                    fontSize: "0.7rem",
                    height: 22,
                    borderRadius: "999px",
                  }}
                />
                {item.chip && (
                  <Chip
                    size="small"
                    label={item.chip}
                    sx={{
                      bgcolor: "#A6110F",
                      color: "#fff",
                      fontSize: "0.7rem",
                      height: 22,
                      borderRadius: "999px",
                    }}
                  />
                )}
              </Stack>
            </Box>

            {/* Descripción */}
            <Typography
              sx={{
                color: "#1E1E1E",
                fontSize: "0.95rem",
                lineHeight: 1.45,
                mt: 1.5,
              }}
            >
              {highlight(item.description, q)}
            </Typography>

            {/* ruta destino visible tipo /trabajo#card-... */}
            <Typography
              sx={{
                color: "#5A5D63",
                fontSize: "0.8rem",
                lineHeight: 1.4,
                mt: 1.5,
                fontFamily: "monospace",
              }}
            >
              {item.path}
              {item.anchorId ? item.anchorId : ""}
            </Typography>
          </Paper>
        ))}
    </Box>
  );
}
