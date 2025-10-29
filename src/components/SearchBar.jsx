// src/components/SearchBar.jsx
import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  ClickAwayListener,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";

// Sugerencias locales rápidas que llevamos al buscador global
const SUGGESTIONS = [
  {
    label: "Desempleo mujeres",
    detail: "Brecha de desocupación por sexo",
  },
  {
    label: "Fonasa",
    detail: "Cobertura de salud por asegurador",
  },
  {
    label: "UF",
    detail: "Indicadores de reajustabilidad",
  },
  {
    label: "Endeudamiento educativo",
    detail: "Carga financiera por estudiar",
  },
  {
    label: "Jornada parcial",
    detail: "Distribución de horas trabajadas",
  },
];

export default function SearchBar({ bgColor = "rgba(255,255,255,0.85)" }) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const { setQuery } = useSearch();
  const navigate = useNavigate();
  const ref = useRef();

  // usuario presiona Enter
  const handleSubmit = (e) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    setQuery(q);
    setOpen(false);
    navigate(`/buscar?q=${encodeURIComponent(q)}`);
  };

  // usuario hace click en sugerencia
  const handleSelectSuggestion = (label) => {
    setQuery(label);
    setOpen(false);
    navigate(`/buscar?q=${encodeURIComponent(label)}`);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box
        sx={{ position: "relative", width: "100%", maxWidth: 800 }}
        ref={ref}
      >
        {/* caja búsqueda principal */}
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            bgcolor: bgColor,
            borderRadius: 4,
            width: "100%",
          }}
          elevation={0}
          onClick={() => setOpen(true)}
        >
          <InputBase
            placeholder="Buscar"
            sx={{ ml: 1, flex: 1, color: "black" }}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setOpen(true);
            }}
          />
          <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>

        {/* dropdown sugerencias locales */}
        {open && (
          <Paper
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              mt: 1,
              borderRadius: 2,
              border: "1px solid rgba(0,0,0,0.08)",
              maxHeight: 320,
              overflowY: "auto",
              boxShadow:
                "0 12px 32px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08)",
              backgroundColor: "#fff",
              zIndex: 10,
            }}
            elevation={3}
          >
            <List disablePadding>
              {SUGGESTIONS.map((sug, i) => (
                <ListItemButton
                  key={i}
                  onClick={() => handleSelectSuggestion(sug.label)}
                  sx={{
                    alignItems: "flex-start",
                    "&:hover": {
                      bgcolor: "rgba(11,61,145,0.07)", // azul primario diluido
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "#0B3D91",
                          fontFamily: "Poppins, sans-serif",
                          lineHeight: 1.3,
                        }}
                      >
                        {sug.label}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: "#5A5D63",
                          lineHeight: 1.3,
                          mt: 0.5,
                        }}
                      >
                        {sug.detail}
                      </Typography>
                    }
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
}
