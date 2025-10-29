// src/pages/Buscar.jsx
import React, { useEffect, useMemo, useId } from "react";
import { Box, Typography, Paper, Chip, Stack, Divider } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import indexData from "../search/indexData";

function useQueryFromURL() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  return params.get("q") || "";
}

function Highlight({ text, q }) {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return text;
  const before = text.slice(0, i);
  const match = text.slice(i, i + q.length);
  const after = text.slice(i + q.length);
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
  const q = urlQuery.trim().toLowerCase();
  const baseId = useId();
  const titleId = `buscar-title-${baseId}`;
  const liveId = `buscar-live-${baseId}`;

  useEffect(() => {
    if (urlQuery !== query) setQuery(urlQuery);
  }, [urlQuery, query, setQuery]);

  const resultados = useMemo(() => {
    if (q === "") return [];
    return indexData.filter((item) => {
      const texto = `${item.title} ${item.description} ${item.keywords} ${item.section} ${item.chip}`;
      return texto.toLowerCase().includes(q);
    });
  }, [q]);

  const sugerencias = [
    "desempleo mujeres",
    "Fonasa",
    "UF",
    "endeudamiento educativo",
    "jornada parcial",
  ];

  return (
    <Box
      component="main"
      role="main"
      aria-labelledby={titleId}
      sx={{
        maxWidth: 900,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
        backgroundColor: "#F4F4F4",
        minHeight: "60vh",
      }}
    >
      <Typography
        id={titleId}
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

      <Box
        id={liveId}
        aria-live="polite"
        sx={{
          position: "absolute",
          width: 1,
          height: 1,
          p: 0,
          m: -1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {q === ""
          ? "Escribe una búsqueda para ver resultados."
          : `${resultados.length} resultado${resultados.length === 1 ? "" : "s"} para ${urlQuery}.`}
      </Box>

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
                aria-label={`Buscar ${sug}`}
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
                  "&:hover": { bgcolor: "#082B73" },
                }}
              />
            ))}
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Typography sx={{ color: "#5A5D63", fontSize: "0.95rem" }}>
            Escribe arriba en la barra de búsqueda “desempleo mujeres”, “UF”,
            “Fonasa”, “endeudamiento educativo”, etc. Te llevaremos directo a la
            tarjeta con el gráfico.
          </Typography>
        </>
      )}

      {q !== "" && resultados.length === 0 && (
        <Typography sx={{ color: "#5A5D63", fontSize: "0.95rem" }}>
          No encontramos resultados para “{urlQuery}”.
        </Typography>
      )}

      {q !== "" && resultados.length > 0 && (
        <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
          {resultados.map((item, i) => (
            <Box component="li" key={`${item.path}-${i}`} sx={{ m: 0, p: 0 }}>
              <Paper
                component={Link}
                to={`${item.path}${item.anchorId || ""}`}
                elevation={0}
                aria-label={`Abrir ${item.title}`}
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
                    <Highlight text={item.title} q={q} />
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

                <Typography
                  sx={{
                    color: "#1E1E1E",
                    fontSize: "0.95rem",
                    lineHeight: 1.45,
                    mt: 1.5,
                  }}
                >
                  <Highlight text={item.description} q={q} />
                </Typography>

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
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
