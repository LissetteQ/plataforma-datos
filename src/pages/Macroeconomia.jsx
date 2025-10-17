// src/pages/Macroeconomia.jsx
import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import BloqueEconomico from "../components/BloqueEconomico";

/**
 * Paleta base (inspirada en FES y Gobierno de Chile)
 * - FES rojo: #A6110F
 * - Azul institucional: #0B3D91
 * - Grises suaves para fondo y bordes
 */
const PALETA = {
  fesRed: "#A6110F",
  govBlue: "#0B3D91",
  navy: "#082B73",
  sky: "#1976d2",
  neutralBg: "#F5F6F8",
  neutralBorder: "#E4E6EB",
  textPrimary: "#1E1E1E",
  textSecondary: "#5A5D63",
};

// Colores por bloque para los gráficos (consistentes en toda la página)
const COLORS_BY_BLOCK = {
  PIB: "#0B3D91",              // azul institucional
  IMACEC: "#A6110F",           // rojo FES
  IPC: "#F39C12",              // naranja (inflación)
  "Deuda Pública": "#6C5CE7",  // violeta
  "Inserción Internacional": "#00A4A6", // teal
  TPM: "#2E7D32",              // verde
};

const bloques = [
  {
    key: "PIB",
    titulo: "Producto Interno Bruto (PIB)",
    color: COLORS_BY_BLOCK.PIB,
    descripcion:
      "El PIB mide el valor total de los bienes y servicios producidos en el país. Su evolución muestra el crecimiento o contracción de la economía.",
    series: [
      { id: "F032.PIB.FLU.R.CLP.2018.Z.Z.1.M", nombre: "PIB real 2018" },
      { id: "F032.PIB.FLU.N.CLP.EP18.Z.Z.0.T", nombre: "PIB nominal" },
      { id: "F032.PIB.PP.Z.USD.2018.Z.Z.0.A", nombre: "PIB per cápita USD" },
    ],
  },
  {
    key: "IMACEC",
    titulo: "Índice Mensual de Actividad Económica (IMACEC)",
    color: COLORS_BY_BLOCK.IMACEC,
    descripcion:
      "El IMACEC refleja la evolución mensual de la actividad económica chilena. Es un buen anticipo del comportamiento del PIB.",
    series: [
      { id: "F032.IMC.IND.Z.Z.EP18.Z.Z.1.M", nombre: "Imacec desestacionalizado" },
      { id: "F032.IMC.IND.Z.Z.EP18.Z.Z.0.M", nombre: "Imacec serie empalmada" },
    ],
  },
  {
    key: "IPC",
    titulo: "Índice de Precios al Consumidor (IPC)",
    color: COLORS_BY_BLOCK.IPC,
    descripcion:
      "El IPC mide la variación de los precios de bienes y servicios. Es el principal indicador de inflación en el país.",
    series: [
      { id: "F074.IPC.V12.Z.EP23.C.M", nombre: "IPC Variación Anual" },
      { id: "G073.IPCSV.V12.2023.M", nombre: "IPC Anual sin volátiles" },
      { id: "G073.IPCV.V12.2023.M", nombre: "IPC Anual volátiles" },
    ],
  },
  {
    key: "Deuda Pública",
    titulo: "Deuda Pública",
    color: COLORS_BY_BLOCK["Deuda Pública"],
    descripcion:
      "Este indicador muestra el nivel de endeudamiento del Estado y sus instituciones, en relación al tamaño de la economía.",
    series: [
      { id: "F051.D7.PPB.C.Z.Z.T", nombre: "Deuda bruta Gobierno Central" },
      { id: "F051.E7.PPB.H.Z.Z.T", nombre: "Deuda bruta Banco Central" },
    ],
  },
  {
    key: "Inserción Internacional",
    titulo: "Inserción Internacional",
    color: COLORS_BY_BLOCK["Inserción Internacional"],
    descripcion:
      "Agrupa indicadores relacionados con el comercio exterior de Chile: exportaciones, importaciones y balanza comercial.",
    series: [
      { id: "F068.B1.FLU.Z.0.C.N.Z.Z.Z.Z.6.3.T", nombre: "Exportaciones FOB" },
      { id: "F068.B1.FLU.Z.0.M.N.0.Z.Z.Z.6.3.T", nombre: "Importaciones CIF" },
      { id: "F068.B1.VAR.T0.0.S.N.Z.Z.Z.Z.6.0.M", nombre: "Balanza Comercial Mensual" },
    ],
  },
  {
    key: "TPM",
    titulo: "Tasa de Interés (TPM)",
    color: COLORS_BY_BLOCK.TPM,
    descripcion:
      "La Tasa de Política Monetaria (TPM) es definida por el Banco Central y orienta el costo del crédito en la economía. Es un instrumento clave de política monetaria.",
    series: [
      { id: "F022.TPM.TIN.D001.NO.Z.D", nombre: "TPM diaria" },
      { id: "F022.TPM.TIN.M001.NO.Z.M", nombre: "TPM mensual" },
    ],
  },
];

const Macroeconomia = () => {
  const secciones = useMemo(
    () =>
      bloques.map((b) => ({
        id: b.titulo.toLowerCase().replace(/[^\w]+/g, "-"),
        label: b.titulo,
        color: b.color,
      })),
    []
  );

  // refs de secciones (para el scroll suave)
  const sectionRefs = useRef({});
  // solo cambia por clic
  const [activeId, setActiveId] = useState("");

  const scrollToSection = (id) => {
    const node = sectionRefs.current[id];
    if (!node) return;
    setActiveId(id);
    const offset = 84; // ajusta si tienes AppBar
    const y = node.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        p: { xs: 2, md: 4 },
        bgcolor: PALETA.neutralBg,
      }}
    >
      {/* Lista vertical (menú) */}
      <Box
        sx={{
          flexShrink: 0,
          width: { xs: "100%", md: 300 },
          position: { md: "sticky" },
          top: { md: 90 },
          maxHeight: { md: "80vh" },
          overflowY: { md: "auto" },
          borderRight: { md: `1px solid ${PALETA.neutralBorder}` },
          pr: { md: 2 },
          mb: { xs: 3, md: 0 },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 1.5,
            color: PALETA.textPrimary,
            fontWeight: 700,
            letterSpacing: 0.2,
          }}
        >
          Indicadores
        </Typography>
        <List dense sx={{ py: 0 }}>
          {secciones.map((sec) => (
            <ListItemButton
              key={sec.id}
              selected={activeId === sec.id}
              onClick={() => scrollToSection(sec.id)}
              sx={{
                borderRadius: 1.5,
                mb: 0.5,
                px: 1.5,
                "& .MuiListItemText-primary": {
                  fontSize: 14,
                  lineHeight: 1.3,
                  color: activeId === sec.id ? "#fff" : PALETA.textPrimary,
                  fontWeight: activeId === sec.id ? 600 : 500,
                },
                "&.Mui-selected": {
                  bgcolor: sec.color,
                  "&:hover": { bgcolor: sec.color },
                },
              }}
            >
              <ListItemText primary={sec.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Contenido */}
      <Box flexGrow={1} pl={{ md: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: "center",
            color: PALETA.textPrimary,
            fontWeight: 800,
            letterSpacing: 0.2,
          }}
        >
          Indicadores Macroeconómicos de Chile
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: PALETA.textSecondary,
            textAlign: "justify",
            maxWidth: 1100,
          }}
        >
          Visualización de indicadores con datos reales del Banco Central de Chile.
          Selecciona un indicador en la lista para navegar por las secciones.
        </Typography>

        {bloques.map((bloque) => {
          const id = bloque.titulo.toLowerCase().replace(/[^\w]+/g, "-");
          return (
            <Box
              key={id}
              id={id}
              ref={(el) => (sectionRefs.current[id] = el)}
              sx={{ scrollMarginTop: "100px", mb: 5 }}
            >
              <BloqueEconomico
                titulo={bloque.titulo}
                descripcion={bloque.descripcion}
                series={bloque.series}
                colorPrincipal={bloque.color}     // <— color del bloque
                paleta={PALETA}                   // <— paleta para card/controles
              />
              <Divider sx={{ my: 3, borderColor: PALETA.neutralBorder }} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Macroeconomia;