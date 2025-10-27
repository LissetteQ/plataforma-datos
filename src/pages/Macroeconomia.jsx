// src/pages/Macroeconomia.jsx
import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { jsPDF } from "jspdf";
import BloqueMacroeconomicoRow from "../components/BloqueMacroeconomicoRow";

// Paleta
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

// Colores por bloque
const COLORS_BY_BLOCK = {
  PIB: "#0B3D91",
  IMACEC: "#A6110F",
  IPC: "#F39C12",
  "Deuda Pública": "#6C5CE7",
  "Inserción Internacional": "#00A4A6",
  TPM: "#2E7D32",
};

// Datos de bloques
const BLOQUES = [
  {
    key: "PIB",
    titulo: "Producto Interno Bruto (PIB)",
    color: COLORS_BY_BLOCK.PIB,
    textoIntro:
      "La macroeconomía define condiciones concretas de vida: empleo, salarios, precios y expectativas. El PIB mide el valor total de los bienes y servicios producidos en el país. Su evolución muestra si la economía está creciendo o frenándose.",
    explicacionSimple:
      "PIB = todo lo que produce Chile en bienes y servicios. Cuando el PIB crece lento o cae, normalmente se enfría el empleo y los ingresos. Si crece muy rápido, suele mejorar la actividad, pero también puede venir con presiones de precios.",
    impactoPersona:
      "¿Por qué te importa? Porque un PIB estancado suele significar menos inversión, menos trabajo formal y más presión sobre salarios.",
    descripcionGrafico:
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
    textoIntro:
      "El alza del costo de la vida reciente tuvo causas externas —energía, trigo, fletes— que no dependen solo de Chile. El IMACEC permite ver el pulso mensual de la actividad económica y anticipar cómo viene el PIB.",
    explicacionSimple:
      "El IMACEC es como un 'mini PIB' mensual. Te dice si la economía se está activando o frenando AHORA, sin esperar el cierre del año.",
    impactoPersona:
      "Si el IMACEC cae varios meses seguidos, suele bajar la demanda de trabajo y se frenan algunas ramas productivas.",
    descripcionGrafico:
      "El IMACEC refleja la evolución mensual de la actividad económica chilena. Es un buen anticipo del comportamiento del PIB.",
    series: [
      {
        id: "F032.IMC.IND.Z.Z.EP18.Z.Z.1.M",
        nombre: "Imacec desestacionalizado",
      },
      {
        id: "F032.IMC.IND.Z.Z.EP18.Z.Z.0.M",
        nombre: "Imacec serie empalmada",
      },
    ],
  },
  {
    key: "IPC",
    titulo: "Índice de Precios al Consumidor (IPC)",
    color: COLORS_BY_BLOCK.IPC,
    textoIntro:
      "El IPC mide cuánto suben los precios que pagamos en la vida diaria. Subir la tasa de interés puede bajar la inflación, pero también puede encarecer el crédito y frenar a las empresas. Por eso la política monetaria tiene efectos sociales reales.",
    explicacionSimple:
      "El IPC es la inflación. Mide cuánto más caro está llenar la despensa, pagar servicios básicos, transportarse.",
    impactoPersona:
      "Inflación alta = tu sueldo rinde menos. Además, cuando suben las tasas para frenar inflación, se encarece el crédito (consumo, hipotecario, pyme).",
    descripcionGrafico:
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
    textoIntro:
      "Tras décadas de privatización y concentración aparecen los límites del modelo. La deuda pública importa porque muestra cuánto se endeuda el Estado para sostener gasto social, inversión o estabilización en crisis.",
    explicacionSimple:
      "Deuda pública = cuánto debe el Estado. No es automáticamente ‘malo’, pero sí relevante: ¿endeudamiento para sostener derechos sociales o solo para apagar incendios?",
    impactoPersona:
      "Un país que solo se endeuda para emergencias, y no para inversión social y productiva, queda frágil ante crisis.",
    descripcionGrafico:
      "Este indicador muestra el nivel de endeudamiento del Estado y sus instituciones, en relación al tamaño de la economía.",
    series: [
      {
        id: "F051.D7.PPB.C.Z.Z.T",
        nombre: "Deuda bruta Gobierno Central",
      },
      {
        id: "F051.E7.PPB.H.Z.Z.T",
        nombre: "Deuda bruta Banco Central",
      },
    ],
  },
  {
    key: "Inserción Internacional",
    titulo: "Inserción Internacional",
    color: COLORS_BY_BLOCK["Inserción Internacional"],
    textoIntro:
      "Chile es una economía abierta: exporta cobre, litio, alimentos; importa combustibles, tecnología y maquinaria. Seguir exportaciones, importaciones y balanza comercial permite entender dependencia externa y presión de multinacionales.",
    explicacionSimple:
      "Esto muestra cuánto vendemos al mundo (exportaciones) y cuánto compramos (importaciones). Si dependemos mucho de afuera para energía y tecnología, shocks globales nos pegan directo.",
    impactoPersona:
      "Cuando sube el dólar o se encarece el transporte global, suben alimentos, combustible y servicios dentro de Chile.",
    descripcionGrafico:
      "Agrupa indicadores relacionados con el comercio exterior de Chile: exportaciones, importaciones y balanza comercial.",
    series: [
      {
        id: "F068.B1.FLU.Z.0.C.N.Z.Z.Z.Z.6.3.T",
        nombre: "Exportaciones FOB",
      },
      {
        id: "F068.B1.FLU.Z.0.M.N.0.Z.Z.Z.6.3.T",
        nombre: "Importaciones CIF",
      },
      {
        id: "F068.B1.VAR.T0.0.S.N.Z.Z.Z.Z.6.0.M",
        nombre: "Balanza Comercial Mensual",
      },
    ],
  },
  {
    key: "TPM",
    titulo: "Tasa de Interés (TPM)",
    color: COLORS_BY_BLOCK.TPM,
    textoIntro:
      "La TPM es decidida por el Banco Central y define el costo del crédito. Ajustes bruscos pueden aliviar inflación, pero también golpear empleo y crédito para hogares y pymes. Por eso se discute democratizar estas decisiones.",
    explicacionSimple:
      "La TPM es la ‘tasa base’ que empuja cuánto cuesta endeudarse en Chile. Cuando sube, los bancos suben sus tasas.",
    impactoPersona:
      "TPM alta = crédito caro (tarjetas, consumo, pyme, hipotecario). Eso frena gasto e inversión, lo que puede enfriar el empleo.",
    descripcionGrafico:
      "La Tasa de Política Monetaria (TPM) es definida por el Banco Central y orienta el costo del crédito en la economía. Es un instrumento clave de política monetaria.",
    series: [
      { id: "F022.TPM.TIN.D001.NO.Z.D", nombre: "TPM diaria" },
      { id: "F022.TPM.TIN.M001.NO.Z.M", nombre: "TPM mensual" },
    ],
  },
];

const Macroeconomia = () => {
  const [activeId, setActiveId] = useState("");
  const sectionRefs = useRef({});

  const handleScrollTo = (id) => {
    const el = sectionRefs.current[id];
    if (!el) return;
    setActiveId(id);

    const offset = 84;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // PDF dinámico
  const handleDescargarReporte = () => {
    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
    });

    const marginX = 40;
    let y = 60;

    // Portada
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Informe Macroeconómico", marginX, y);
    y += 28;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(
      "Plataforma de Datos Sociales de Chile.\n" +
        "Este informe resume indicadores económicos clave con lenguaje claro\n" +
        "para apoyar análisis ciudadano, sindical y territorial.",
      marginX,
      y
    );
    y += 60;

    // Bloques
    BLOQUES.forEach((bloque, idx) => {
      if (y > 700) {
        doc.addPage();
        y = 60;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(bloque.titulo, marginX, y);
      y += 20;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const explLines = doc.splitTextToSize(
        bloque.explicacionSimple || "",
        515
      );
      doc.text(explLines, marginX, y);
      y += explLines.length * 14 + 6;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("¿Por qué importa para la vida cotidiana?", marginX, y);
      y += 16;

      doc.setFont("helvetica", "normal");
      const impactoLines = doc.splitTextToSize(
        bloque.impactoPersona || "",
        515
      );
      doc.text(impactoLines, marginX, y);
      y += impactoLines.length * 14 + 10;

      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.text(
        "Visualización interactiva disponible en la plataforma.\n" +
          "Incluye series históricas, comparaciones y descarga de datos.",
        marginX,
        y
      );
      y += 28;

      doc.setDrawColor(200);
      doc.line(marginX, y, marginX + 515, y);
      y += 24;

      if (idx === BLOQUES.length - 1) {
        y += 10;
      }
    });

    if (y > 600) {
      doc.addPage();
      y = 60;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Fuentes y uso de la información", marginX, y);
    y += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const footerLines = doc.splitTextToSize(
      "Todas las series provienen del Banco Central de Chile. " +
        "Este documento puede compartirse libremente con cita de la fuente " +
        "y del período de los datos. La interpretación busca traducir " +
        "indicadores técnicos a lenguaje cotidiano sobre empleo, salarios, " +
        "precios, endeudamiento público y condiciones de vida.",
      515
    );
    doc.text(footerLines, marginX, y);

    doc.save("reporte_macroeconomia.pdf");
  };

  return (
    <Box className="page-bg">
      <Box className="page-overlay">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            backgroundColor: "transparent",
            p: { xs: 2, md: 4 },
            flexGrow: 1,
          }}
        >
          {/* Sidebar izquierda */}
          <Box
            sx={{
              flexShrink: 0,
              width: { xs: "100%", md: 260 },
              position: { md: "sticky" },
              top: { md: 90 },
              maxHeight: { md: "80vh" },
              overflowY: { md: "auto" },
              borderRight: { md: `1px solid ${PALETA.neutralBorder}` },
              pr: { md: 2 },
              mb: { xs: 3, md: 0 },
              display: "flex",
              flexDirection: "column",
              backgroundColor: "transparent",
            }}
          >
            {/* Navegación */}
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: PALETA.textPrimary,
                fontWeight: 700,
              }}
            >
              Indicadores
            </Typography>

            <List dense sx={{ py: 0 }}>
              {BLOQUES.map((bloque) => {
                const id = bloque.titulo
                  .toLowerCase()
                  .replace(/[^\w]+/g, "-");
                return (
                  <ListItemButton
                    key={id}
                    selected={activeId === id}
                    onClick={() => handleScrollTo(id)}
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      px: 1.5,
                      "& .MuiListItemText-primary": {
                        fontSize: 14,
                        lineHeight: 1.3,
                        color:
                          activeId === id
                            ? "#fff"
                            : PALETA.textPrimary,
                        fontWeight:
                          activeId === id ? 600 : 500,
                      },
                      "&.Mui-selected": {
                        bgcolor: bloque.color,
                        "&:hover": { bgcolor: bloque.color },
                      },
                    }}
                  >
                    <ListItemText primary={bloque.titulo} />
                  </ListItemButton>
                );
              })}
            </List>

            <Divider
              sx={{
                my: 2,
                borderColor: PALETA.neutralBorder,
              }}
            />

            {/* Botón PDF */}
            <Button
              variant="contained"
              fullWidth
              onClick={handleDescargarReporte}
              startIcon={<PictureAsPdfIcon />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.9rem",
                lineHeight: 1.2,
                py: 1.25,
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                backgroundColor: PALETA.govBlue,
                "&:hover": {
                  backgroundColor: "#072a66",
                },
                mb: 2,
              }}
            >
              Descargar reporte PDF
            </Button>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: PALETA.textSecondary,
                lineHeight: 1.4,
                fontSize: "0.7rem",
              }}
            >
              PDF con explicación simple de cada indicador más
              contexto social. Incluye interpretación pensada
              para personas que no leen gráficos técnicos.
            </Typography>
          </Box>

          {/* Contenido principal */}
          <Box
            flexGrow={1}
            pl={{ md: 4 }}
            sx={{
              width: "100%",
              backgroundColor: "transparent",
            }}
          >
            {/* Cabecera general */}
            <Box
              sx={{
                textAlign: "center",
                maxWidth: "900px",
                mx: "auto",
                mb: 6,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: PALETA.textPrimary,
                  fontWeight: 800,
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                Macroeconomía
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: PALETA.textSecondary,
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  lineHeight: 1.6,
                }}
              >
                Esta sección te permite leer la economía chilena
                con dos capas: la capa técnica (los datos) y la
                capa social (a quién afecta). Revisa producción,
                actividad mensual, inflación, deuda pública,
                comercio exterior y tasa de interés. Desplázate
                por los gráficos y compara períodos. Si
                compartes resultados, cita la fuente y el
                período de los datos.
              </Typography>
            </Box>

            {/* Bloques */}
            {BLOQUES.map((bloque, index) => {
              const id = bloque.titulo
                .toLowerCase()
                .replace(/[^\w]+/g, "-");

              return (
                <Box
                  key={id}
                  id={id}
                  ref={(el) =>
                    (sectionRefs.current[id] = el)
                  }
                  sx={{
                    scrollMarginTop: "100px",
                  }}
                >
                  <BloqueMacroeconomicoRow
                    titulo={bloque.titulo}
                    textoIntro={bloque.textoIntro}
                    color={bloque.color}
                    series={bloque.series}
                    descripcionGrafico={
                      bloque.descripcionGrafico
                    }
                    paleta={PALETA}
                  />

                  {index < BLOQUES.length - 1 && (
                    <Divider
                      sx={{
                        maxWidth: "1600px",
                        mx: "auto",
                        mb: 6,
                        borderColor:
                          PALETA.neutralBorder,
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Macroeconomia;