// src/pages/Trabajo.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import PeopleIcon from "@mui/icons-material/People";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import BarChartIcon from "@mui/icons-material/BarChart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";

import GraficoTrabajoPorAnio from "../components/GraficoTrabajoPorAnio";
import GraficoSexo from "../components/GraficoSexo";
import GraficoCotizaciones from "../components/GraficoCotizaciones";
import GraficoJornada from "../components/GraficoJornada";
import GraficoTasas from "../components/GraficoTasas";
import GraficoPiramide from "../components/GraficoPiramide";
import GraficoIngresoSexo from "../components/GraficoIngresoSexo";
import GraficoESIIngresos from "../components/GraficoESIIngresos";

import { jsPDF } from "jspdf";
import {
  getAnual,
  getTasas,
  getESIIngresosUltimo,
} from "../services/trabajoApi";

/* ====== PALETA ====== */
const PALETA = {
  fesBlue: "#005597",
  fesRed: "#D70000",
  fesYellow: "#FFCC00",
  nodoBlue: "#0B3D91",
  cardBg: "#FFFFFF",
  divider: "#E5E7EB",
};

const PALETA_TEXT = {
  textPrimary: "#1E1E1E",
  textSecondary: "#5A5D63",
  neutralBg: "#F5F6F8",
  neutralBorder: "#E4E6EB",
};

const COLORS = {
  kpiIcon: PALETA.fesBlue,
  kpiTitle: PALETA_TEXT.textPrimary,
  kpiValue: PALETA_TEXT.textPrimary,
  kpiSubtitle: PALETA_TEXT.textSecondary,
  ctaBg: PALETA.fesBlue,
  ctaBgHover: "#00447A",
  accent: PALETA.fesRed,
  cardBorderTop: PALETA.fesYellow,
};

const formMiles = (n) => Math.round((n ?? 0) / 1000).toLocaleString("es-CL");

const KPI_HEIGHT = { xs: 96, sm: 108, md: 116 };
const KPI_GRID = "24px 1fr 14px";

function KpiCard({
  icon: Icon,
  title,
  value,
  subtitle,
  badge,
  iconColor,
  to,
  onClick,
}) {
  const clickable = Boolean(to || onClick);
  const baseProps = clickable ? { component: RouterLink, to: to ?? "#" } : {};

  return (
    <Paper
      elevation={0}
      {...baseProps}
      onClick={onClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      sx={{
        p: { xs: 1, sm: 1.25 },
        borderRadius: 2,
        bgcolor: PALETA.cardBg,
        border: `1px solid ${PALETA.divider}`,
        height: "100%",
        display: "grid",
        gridTemplateRows: KPI_GRID,
        rowGap: 0.375,
        minHeight: KPI_HEIGHT,
        textDecoration: "none",
        cursor: clickable ? "pointer" : "default",
        "&:focus-visible": {
          outline: `3px solid ${PALETA.fesBlue}`,
          outlineOffset: 2,
        },
        "&:hover": clickable
          ? { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }
          : undefined,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          minHeight: 24,
          maxHeight: 24,
          overflow: "hidden",
        }}
      >
        <Icon sx={{ color: iconColor, fontSize: 16, flexShrink: 0 }} />
        <Typography
          sx={{
            fontWeight: 800,
            color: COLORS.kpiTitle,
            fontSize: { xs: 12.5, sm: 13 },
            lineHeight: 1.1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flex: 1,
          }}
          title={title}
        >
          {title}
        </Typography>
        <Box sx={{ ml: 0.5 }}>
          <Box
            sx={{
              fontSize: 9,
              fontWeight: 700,
              px: 0.5,
              py: 0.15,
              borderRadius: 999,
              border: `1px solid ${PALETA.divider}`,
              background: "#FFFDF3",
              color: "#7A5E00",
              minWidth: 46,
              textAlign: "center",
              whiteSpace: "nowrap",
              visibility: badge ? "visible" : "hidden",
            }}
          >
            {badge?.text ?? "—"}
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: { xs: 18, sm: 20, md: 22 },
            lineHeight: 1.05,
            color: COLORS.kpiValue,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={String(value ?? "")}
        >
          {value}
        </Typography>
      </Box>

      <Typography
        sx={{
          color: COLORS.kpiSubtitle,
          fontSize: { xs: 10.5, sm: 11.5 },
          lineHeight: 1.3,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        title={subtitle}
      >
        {subtitle}
      </Typography>
    </Paper>
  );
}

export default function Trabajo() {
  const [fuerza, setFuerza] = useState(null);
  const [desempleo, setDesempleo] = useState(null);
  const [esiUlt, setEsiUlt] = useState(null);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("md"));

  const INDICADORES = [
    { id: "section-esi-anual", label: "Ingreso medio anual — ESI (2018–2024)" },
    { id: "section-fuerza-desempleo", label: "Fuerza Laboral y Desempleo" },
    {
      id: "section-ingreso-por-sexo-2018-2024",
      label: "Ingreso promedio por sexo (2018–2024)",
    },
    { id: "section-cotizaciones", label: "Cotización previsional y de salud" },
    { id: "section-jornada", label: "Tipo de Jornada Laboral" },
    {
      id: "section-ingreso-promedio-anual-sexo",
      label: "Ingreso promedio anual por sexo",
    },
    { id: "section-tasas-ene", label: "Tasas laborales y subutilización (ENE)" },
    { id: "section-pet", label: "Población en edad de trabajar" },
  ];

  const sectionRefs = useRef({});
  const [activeId, setActiveId] = useState("");

  const scrollToSection = (id) => {
    const node = sectionRefs.current[id];
    if (!node) return;
    setActiveId(id);
    const offset = 84;
    const y = node.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  useEffect(() => {
    getAnual().then((rows) => {
      const data = Array.isArray(rows) ? rows : [];
      if (!data.length) return;
      const ultimo = data.reduce((a, b) => (a.anio > b.anio ? a : b));
      setFuerza(ultimo.fuerza_laboral);
    });

    getTasas({ periodo: "2024T2", sexo: "Nacional" }).then((rows) => {
      const r = (Array.isArray(rows) ? rows : [])[0];
      if (r?.td != null) setDesempleo(r.td);
    });

    getESIIngresosUltimo().then((r) => setEsiUlt(r));
  }, []);

  const handleDescargarReporte = () => {
    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
    });

    const marginX = 40;
    let y = 60;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Informe Trabajo y Condiciones Laborales", marginX, y);
    y += 28;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const introLines = doc.splitTextToSize(
      "Este informe resume brevemente situación laboral, ingresos, " +
        "desempleo y condiciones de trabajo en Chile. Está pensado para " +
        "personas y organizaciones que necesitan una lectura rápida " +
        "sin tener que interpretar gráficos técnicos.",
      515
    );
    doc.text(introLines, marginX, y);
    y += introLines.length * 14 + 14;

    const contextoLines = doc.splitTextToSize(
      "El trabajo en Chile atraviesa transformaciones profundas: " +
        "digitalización acelerada, teletrabajo y nuevas formas de empleo " +
        "que tensionan reglas pensadas para otro tiempo. El desafío es " +
        "actualizar derechos, fortalecer la fiscalización y revitalizar " +
        "la organización de las y los trabajadores —incluida la juventud " +
        "sindical— para que la tecnología sume bienestar y no precariedad.",
      515
    );
    doc.text(contextoLines, marginX, y);
    y += contextoLines.length * 14 + 24;

    if (y > 700) {
      doc.addPage();
      y = 60;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("1. Ingreso medio anual — ESI", marginX, y);
    y += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const esiLines = doc.splitTextToSize(
      "La Encuesta Suplementaria de Ingresos (ESI) permite ver cuánto " +
        "ganan en promedio hombres y mujeres cada año. Esto hace visible " +
        "la brecha salarial de género en pesos concretos. " +
        "Un punto clave: cuando la brecha se mantiene alta, significa que " +
        "las mujeres siguen recibiendo menos por su trabajo, incluso si " +
        "tienen calificaciones similares.",
      515
    );
    doc.text(esiLines, marginX, y);
    y += esiLines.length * 14 + 10;

    if (esiUlt && (esiUlt.total || esiUlt.hombres || esiUlt.mujeres)) {
      const ultimoAnio =
        esiUlt?.anio != null ? `Año ${esiUlt.anio}` : "Último año disponible";
      const hombres = esiUlt?.hombres
        ? `$${esiUlt.hombres.toLocaleString("es-CL")}`
        : "—";
      const mujeres = esiUlt?.mujeres
        ? `$${esiUlt.mujeres.toLocaleString("es-CL")}`
        : "—";
      const total = esiUlt?.total
        ? `$${esiUlt.total.toLocaleString("es-CL")}`
        : "—";

      const resumenESI = doc.splitTextToSize(
        `${ultimoAnio}:\n` +
          `• Ingreso promedio hombres: ${hombres}\n` +
          `• Ingreso promedio mujeres: ${mujeres}\n` +
          `• Ingreso promedio total: ${total}\n\n` +
          "Estas cifras están en pesos chilenos corrientes. Leerlas año a año " +
          "permite ver si los ingresos reales se están estancando o mejorando.",
        515
      );
      doc.text(resumenESI, marginX, y);
      y += resumenESI.length * 14 + 20;
    }

    if (y > 700) {
      doc.addPage();
      y = 60;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("2. Fuerza laboral y desempleo", marginX, y);
    y += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const fuerzaLines = doc.splitTextToSize(
      "La fuerza laboral son las personas que están trabajando o buscando trabajo. " +
        "La tasa de desempleo es el porcentaje de esa fuerza laboral que no tiene empleo " +
        "aun queriendo trabajar.\n\n" +
        "Cuando el desempleo sube, no sólo hay más gente sin ingresos: también aumenta la " +
        "presión para aceptar peores condiciones, sueldos más bajos o jornadas más largas.",
      515
    );
    doc.text(fuerzaLines, marginX, y);
    y += fuerzaLines.length * 14 + 10;

    const fuerzaVal =
      fuerza != null ? `${formMiles(fuerza)} mil personas` : "—";
    const desempleoVal =
      desempleo != null ? `${desempleo.toFixed(1)}%` : "—";

    const resumenFuerza = doc.splitTextToSize(
      "Últimos datos disponibles:\n" +
        `• Fuerza laboral total (personas ocupadas o buscando empleo): ${fuerzaVal}\n` +
        `• Tasa de desempleo: ${desempleoVal}\n\n` +
        "Una fuerza laboral grande con desempleo alto suele indicar que la economía no está " +
        "creando suficiente empleo formal y estable.",
      515
    );
    doc.text(resumenFuerza, marginX, y);
    y += resumenFuerza.length * 14 + 20;

    if (y > 700) {
      doc.addPage();
      y = 60;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("3. Brecha salarial por sexo", marginX, y);
    y += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const brechaLines = doc.splitTextToSize(
      "Cuando comparamos el ingreso promedio de hombres y mujeres año a año, " +
        "vemos cuánto más ganan ellos en promedio. Esa diferencia no es sólo “una cifra”; " +
        "se traduce en menos autonomía económica y menor seguridad social para las mujeres.\n\n" +
        "Esta brecha también se acumula en el tiempo: menos ingresos hoy significa menor " +
        "cotización previsional y peores pensiones mañana.",
      515
    );
    doc.text(brechaLines, marginX, y);
    y += brechaLines.length * 14 + 20;

    if (y > 700) {
      doc.addPage();
      y = 60;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("4. Cotización en pensiones y salud", marginX, y);
    y += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const cotizaLines = doc.splitTextToSize(
      "Una proporción importante de las y los trabajadores no cotiza de forma regular " +
        "ni en pensiones ni en salud. Eso significa que el costo del riesgo (enfermarse, " +
        "envejecer sin pensión suficiente) recae en la familia y no en la protección social.\n\n" +
        "Este fenómeno pega más fuerte en trabajo informal, subcontratación, plataformas " +
        "digitales y empleo parcial no deseado.",
      515
    );
    doc.text(cotizaLines, marginX, y);
    y += cotizaLines.length * 14 + 20;

    if (y > 700) {
      doc.addPage();
      y = 60;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("5. Tipo de jornada laboral", marginX, y);
    y += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const jornadaLines = doc.splitTextToSize(
      "La mayoría declara jornada completa. Pero hay un grupo importante en media jornada. " +
        "Ojo: muchas veces la jornada parcial no es una elección libre, sino el resultado " +
        "de no encontrar empleo a tiempo completo. Eso es subempleo.\n\n" +
        "Esto afecta ingresos mensuales, estabilidad y acceso a seguridad social.",
      515
    );
    doc.text(jornadaLines, marginX, y);
    y += jornadaLines.length * 14 + 20;

    if (y > 700) {
      doc.addPage();
      y = 60;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("6. Subutilización laboral", marginX, y);
    y += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const subutilLines = doc.splitTextToSize(
      "La ENE no sólo mide desempleo (personas sin trabajo que buscan). También captura " +
        "subutilización: personas que sí trabajan pero menos horas de las que necesitan " +
        "o en condiciones informales.\n\n" +
        "Esto es clave porque una baja tasa de desempleo NO siempre significa que todo está bien. " +
        "Puede haber gente ocupada en trabajos inestables, con ingresos bajos y sin protección.",
      515
    );
    doc.text(subutilLines, marginX, y);
    y += subutilLines.length * 14 + 20;

    if (y > 700) {
      doc.addPage();
      y = 60;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("7. Edad y participación laboral", marginX, y);
    y += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const edadLines = doc.splitTextToSize(
      "Al mirar por tramo de edad, se ve quiénes están ocupados, quiénes están buscando empleo " +
        "y quiénes quedan fuera de la fuerza de trabajo. Esto permite ubicar tensiones específicas: " +
        "jóvenes que no consiguen su primer empleo estable, mujeres adultas que dejan el trabajo para " +
        "asumir cuidados, o personas mayores que siguen trabajando por necesidad económica.",
      515
    );
    doc.text(edadLines, marginX, y);
    y += edadLines.length * 14 + 28;

    if (y > 650) {
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
      "Los indicadores provienen de la Encuesta Nacional de Empleo (ENE), " +
        "la Encuesta Suplementaria de Ingresos (ESI) y cálculos propios " +
        "a partir de datos laborales. Este documento puede compartirse " +
        "libremente citando la fuente y el período de los datos.\n\n" +
        "La interpretación busca traducir indicadores laborales en efectos " +
        "concretos sobre ingreso, seguridad social, jornada, brechas de género " +
        "y condiciones de vida.",
      515
    );
    doc.text(footerLines, marginX, y);

    doc.save("reporte_trabajo.pdf");
  };
const SectionCard = ({ title, children, description, sx }) => (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.25, sm: 1.75, md: 2 },
        borderRadius: 2,
        mb: { xs: 3, md: 4 },
        bgcolor: PALETA.cardBg,
        border: `1px solid ${PALETA.divider}`,
        boxShadow: { md: "0 2px 10px rgba(0,0,0,0.04)" },
        position: "relative",
        overflow: "hidden",
        ...sx,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          background: COLORS.cardBorderTop,
          pointerEvents: "none",
        }}
      />

      {title && (
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: "1rem", md: "1.05rem" },
            lineHeight: 1.3,
            textAlign: "center",
            color: PALETA_TEXT.textPrimary,
            mb: { xs: 1, md: 1.25 },
          }}
        >
          {title}
        </Typography>
      )}

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", md: 1100 },
            minHeight: { xs: 220, sm: 300, md: 360 },
            "& > *": { width: "100%", height: "100%" },
          }}
        >
          {children}
        </Box>
      </Box>

      {description && (
        <Typography
          sx={{
            mt: { xs: 1, md: 1.25 },
            textAlign: "center",
            maxWidth: 980,
            mx: "auto",
            lineHeight: 1.5,
            fontSize: { xs: "0.9rem", md: "0.9rem" },
            color: PALETA_TEXT.textSecondary,
            whiteSpace: "pre-line",
          }}
        >
          {description}
        </Typography>
      )}
    </Paper>
  );

  const fuerzaValue = fuerza != null ? formMiles(fuerza) : "—";
  const desempleoValue =
    desempleo != null ? `${desempleo.toFixed(1)}%` : "—";

  return (
    <Box sx={{ bgcolor: PALETA_TEXT.neutralBg }}>
      <Container
        id="seccion-trabajo"
        maxWidth="xl"
        sx={{
          py: { xs: 2, md: 4 },
          px: { xs: 1.5, sm: 2 },
        }}
      >
        {/* CABECERA */}
        <Box
          sx={{
            textAlign: "center",
            maxWidth: "900px",
            mx: "auto",
            mb: { xs: 2, md: 3 },
          }}
        >
          <Typography
            component="h1"
            sx={{
              color: PALETA_TEXT.textPrimary,
              fontWeight: 800,
              lineHeight: 1.2,
              fontSize: { xs: "2rem", sm: "2.25rem", md: "2.5rem" },
              mb: 2,
              textAlign: "center",
            }}
          >
            Trabajo
          </Typography>

          <Typography
            component="p"
            sx={{
              color: PALETA_TEXT.textSecondary,
              fontSize: { xs: "0.95rem", md: "1rem" },
              lineHeight: 1.6,
              maxWidth: "900px",
              mx: "auto",
              textAlign: "center",
            }}
          >
            El trabajo en Chile atraviesa transformaciones profundas:
            digitalización acelerada, teletrabajo y nuevas formas de empleo que
            tensionan reglas pensadas para otro tiempo. El desafío es
            actualizar derechos, fortalecer la fiscalización y revitalizar la
            organización de las y los trabajadores —incluida la juventud
            sindical— para que la tecnología sume bienestar y no precariedad.
          </Typography>
        </Box>

        {/* LAYOUT PRINCIPAL */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 0, md: 3 },
          }}
        >
          {/* SIDEBAR */}
          <Box
            sx={{
              flexShrink: 0,
              width: { xs: "100%", md: 260 },
              position: { md: "sticky" },
              top: { md: 90 },
              maxHeight: { md: "80vh" },
              overflowY: { md: "auto" },
              borderRight: {
                md: `1px solid ${PALETA_TEXT.neutralBorder}`,
              },
              pr: { md: 2 },
              mb: { xs: 3, md: 0 },
              display: "flex",
              flexDirection: "column",
              backgroundColor: "transparent",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: PALETA_TEXT.textPrimary,
                fontWeight: 700,
                fontSize: "1rem",
                lineHeight: 1.3,
              }}
            >
              Indicadores
            </Typography>

            <List dense sx={{ py: 0 }}>
              {INDICADORES.map((sec) => (
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
                      color:
                        activeId === sec.id
                          ? "#fff"
                          : PALETA_TEXT.textPrimary,
                      fontWeight: activeId === sec.id ? 600 : 500,
                    },
                    "&.Mui-selected": {
                      bgcolor: PALETA.nodoBlue,
                      "&:hover": { bgcolor: PALETA.nodoBlue },
                    },
                  }}
                >
                  <ListItemText primary={sec.label} />
                </ListItemButton>
              ))}
            </List>

            <Divider
              sx={{
                my: 2,
                borderColor: PALETA_TEXT.neutralBorder,
              }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={handleDescargarReporte}
              sx={{
                backgroundColor: COLORS.ctaBg,
                fontWeight: 700,
                textTransform: "none",
                fontSize: "0.9rem",
                lineHeight: 1.2,
                py: 1.25,
                borderRadius: 2,
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                "&:hover": { backgroundColor: COLORS.ctaBgHover },
              }}
            >
              Descargar reporte PDF
            </Button>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: PALETA_TEXT.textSecondary,
                lineHeight: 1.4,
                fontSize: "0.7rem",
                mt: 1.5,
              }}
            >
              PDF con indicadores laborales más contexto social. Pensado para
              lectura rápida sin gráficos.
            </Typography>
          </Box>

          {/* CONTENIDO PRINCIPAL */}
          <Box
            flexGrow={1}
            sx={{
              width: "100%",
              minWidth: 0,
            }}
          >
            {/* KPIs */}
            <Box
              sx={{
                mt: { xs: 1, md: 2 },
                mb: { xs: 2, md: 3 },
                display: "grid",
                gap: { xs: 1, sm: 1.5, md: 2 },
                gridTemplateColumns: {
                  xs: "repeat(1, minmax(0, 1fr))",
                  sm: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(3, minmax(0, 1fr))",
                  lg: "repeat(4, minmax(0, 1fr))",
                  xl: "repeat(6, minmax(0, 1fr))",
                },
                gridAutoFlow: "row dense",
                alignItems: "stretch",
                justifyItems: "stretch",
                minWidth: 0,
              }}
            >
              {[
                {
                  icon: PeopleIcon,
                  title: "Fuerza Laboral",
                  value: fuerza != null ? formMiles(fuerza) : "—",
                  subtitle: "Miles de personas",
                  iconColor: COLORS.kpiIcon,
                },
                {
                  icon: TrendingDownIcon,
                  title: "Desempleo",
                  value:
                    desempleo != null
                      ? `${desempleo.toFixed(1)}%`
                      : "—",
                  subtitle: "2024T2",
                  iconColor: COLORS.accent,
                },
                {
                  icon: BarChartIcon,
                  title: "Salario Mínimo",
                  value: "$460.000",
                  subtitle: "Pesos",
                  iconColor: COLORS.kpiIcon,
                },
                {
                  icon: AttachMoneyIcon,
                  title: "Ingreso medio (ESI)",
                  value:
                    esiUlt?.total != null
                      ? `$${esiUlt.total.toLocaleString("es-CL")}`
                      : "—",
                  subtitle: esiUlt?.anio ? `Año ${esiUlt.anio}` : "",
                  iconColor: COLORS.kpiIcon,
                },
                {
                  icon: ManIcon,
                  title: "Ingreso — Hombres",
                  value:
                    esiUlt?.hombres != null
                      ? `$${esiUlt.hombres.toLocaleString("es-CL")}`
                      : "—",
                  subtitle: esiUlt?.anio ? `Año ${esiUlt.anio}` : "",
                  iconColor: COLORS.kpiIcon,
                },
                {
                  icon: WomanIcon,
                  title: "Ingreso — Mujeres",
                  value:
                    esiUlt?.mujeres != null
                      ? `$${esiUlt.mujeres.toLocaleString("es-CL")}`
                      : "—",
                  subtitle: esiUlt?.anio ? `Año ${esiUlt.anio}` : "",
                  iconColor: COLORS.accent,
                },
              ].map((k, i) => (
                <KpiCard key={i} {...k} />
              ))}
            </Box>

            {/* === BLOQUE INTRO CON GRÁFICOS A LA IZQUIERDA Y TEXTO A LA DERECHA === */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "flex-start", md: "stretch" },
                gap: { xs: 2, md: 3, lg: 4 },
                mb: { xs: 4, md: 5 },
              }}
            >
              {/* IZQUIERDA: los dos primeros gráficos uno debajo del otro */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* PRIMER GRÁFICO */}
<Box
  id="section-esi-anual"
  ref={(el) =>
    (sectionRefs.current["section-esi-anual"] = el)
  }
  sx={{ scrollMarginTop: "100px" }}
>
  <SectionCard
    title="Ingreso medio anual — ESI (2018–2024)"
    description={
      "Este indicador resume cuánto están ganando hombres y mujeres según la Encuesta Suplementaria de Ingresos. Permite ver si los ingresos suben o se estancan y cuál es la brecha de género en términos concretos."
    }
  >
    <GraficoESIIngresos />
  </SectionCard>
</Box>
{/* SEGUNDO GRÁFICO */}
                <Box
                  id="section-fuerza-desempleo"
                  ref={(el) =>
                    (sectionRefs.current["section-fuerza-desempleo"] = el)
                  }
                  sx={{ scrollMarginTop: "100px" }}
                >
                  <SectionCard
                    title="Fuerza Laboral y Desempleo"
                    description={
                      "La fuerza de trabajo mide cuántas personas están disponibles para trabajar (ocupadas o buscando empleo). La tasa de desempleo muestra qué proporción no logra encontrar trabajo."
                    }
                  >
                    <GraficoTrabajoPorAnio showNote={false} />
                  </SectionCard>
                </Box>
              </Box>

              {/* DERECHA: 3 párrafos */}
<Box
  sx={{
    flexBasis: { xs: "100%", md: "35%", lg: "32%" },
    flexShrink: 0,
    maxWidth: { xs: "100%", md: "35%", lg: "32%" },
    backgroundColor: "transparent",
    borderLeft: {
      md: `1px solid ${PALETA_TEXT.neutralBorder}`,
    },
    pl: { md: 3, lg: 4 },
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  }}
>
  <Typography
    sx={{
      color: PALETA_TEXT.textSecondary,
          fontWeight: 800,
          textAlign: "center",
          mb: { xs: 1, sm: 1.25 },
          color: "#1F2937",
          letterSpacing: 0.2,
    }}
  >
    Hacia un Trabajo Digno y Corresponsable:
  </Typography>


  {/* PÁRRAFO 1 */}
  <Typography
    sx={{
      color: PALETA_TEXT.textSecondary,
      fontSize: { xs: "0.95rem", md: "0.95rem" },
      lineHeight: 1.55,
      maxWidth: 500,
      whiteSpace: "pre-line",
      mt: { xs: 2, md: 3 },
      mb: { xs: 2, md: 3 },
    }}
  >
    La experiencia reciente mostró, además, riesgos y costos trasladados a los
    hogares (equipos, conectividad, espacios), jornadas extendidas y efectos
    psicosociales que se hicieron especialmente visibles en el sector público,
    junto con una sobrecarga de cuidados con sesgo de género que vuelve urgente
    contar con un Sistema Nacional de Cuidados.
  </Typography>

  {/* PÁRRAFO 2 (más abajo aún) */}
  <Typography
    sx={{
      color: PALETA_TEXT.textSecondary,
      fontSize: { xs: "0.95rem", md: "0.95rem" },
      lineHeight: 1.55,
      maxWidth: 500,
      whiteSpace: "pre-line",
      mt: { xs: 3, md: 4 }, // <-- bajado más
      mb: { xs: 1, md: 1 },
    }}
  >
    Con ese marco, proponemos avanzar en cuatro frentes: (1) regular el trabajo
    digital y de plataformas con enfoque de salud laboral y
    corresponsabilidad; (2) instalar una política robusta de cuidados; (3)
    garantizar condiciones dignas en los servicios públicos; y (4) promover
    negociación colectiva y participación juvenil para incidir en las
    mutaciones del empleo. Son pasos claves para productividad, bienestar y
    cohesión social.
  </Typography>

  {/* PÁRRAFO 3 (muy abajo) */}
  <Typography
    sx={{
      color: PALETA_TEXT.textSecondary,
      fontSize: { xs: "0.95rem", md: "0.95rem" },
      lineHeight: 1.55,
      maxWidth: 500,
      whiteSpace: "pre-line",
     mt: { xs: 3, md: 4 }, // <-- bajado más
      mb: { xs: 1, md: 1 },
    }}
  >
    Explora los gráficos de esta sección, compara series y territorios, y
    descarga las bases para producir tus propios análisis; si publicas o
    compartes resultados, cita siempre la fuente y el período de los datos para
    sostener una conversación laboral informada y útil para la toma de
    decisiones.
  </Typography>
</Box>
            </Box>

            {/* === RESTO DE SECCIONES === */}
            <Box
              id="section-ingreso-por-sexo-2018-2024"
              ref={(el) =>
                (sectionRefs.current["section-ingreso-por-sexo-2018-2024"] =
                  el)
              }
              sx={{ scrollMarginTop: "100px" }}
            >
              <SectionCard
                title="Ingreso promedio por sexo (2018–2024)"
                description={
                  "Aquí se ve la diferencia salarial directa entre hombres y mujeres en pesos chilenos."
                }
              >
                <GraficoSexo />
              </SectionCard>
            </Box>

            <Box
              id="section-cotizaciones"
              ref={(el) =>
                (sectionRefs.current["section-cotizaciones"] = el)
              }
              sx={{ scrollMarginTop: "100px" }}
            >
              <SectionCard
                title="Cotización previsional y de salud"
                description={
                  "Una parte importante de trabajadoras y trabajadores no cotiza de forma regular ni en pensiones ni en salud. Eso traslada el riesgo a los hogares."
                }
              >
                <GraficoCotizaciones />
              </SectionCard>
            </Box>

            <Box
              id="section-jornada"
              ref={(el) => (sectionRefs.current["section-jornada"] = el)}
              sx={{ scrollMarginTop: "100px" }}
            >
              <SectionCard
                title="Tipo de Jornada Laboral"
                description={
                  "Mayoría jornada completa, pero hay una fracción relevante en media jornada. Muchas veces esa ‘media jornada’ no es decisión libre, sino subempleo."
                }
              >
                <GraficoJornada />
              </SectionCard>
            </Box>

            <Box
              id="section-ingreso-promedio-anual-sexo"
              ref={(el) =>
                (sectionRefs.current["section-ingreso-promedio-anual-sexo"] =
                  el)
              }
              sx={{ scrollMarginTop: "100px" }}
            >
              <SectionCard
                title="Ingreso promedio anual por sexo"
                description={
                  "Promedio anual agregado desde microdatos. Sirve para ver la persistencia de la brecha de género en el tiempo."
                }
              >
                <GraficoIngresoSexo />
              </SectionCard>
            </Box>

            <Box
              id="section-tasas-ene"
              ref={(el) => (sectionRefs.current["section-tasas-ene"] = el)}
              sx={{ scrollMarginTop: "100px" }}
            >
              <SectionCard
                title="Tasas laborales y subutilización (ENE)"
                description={
                  "Además del desempleo abierto (TD), la ENE mide subutilización: personas que quieren trabajar más horas pero no pueden, o que están disponibles para trabajar pero no buscan activamente."
                }
              >
                <GraficoTasas />
              </SectionCard>
            </Box>

            <Box
              id="section-pet"
              ref={(el) => (sectionRefs.current["section-pet"] = el)}
              sx={{ scrollMarginTop: "100px" }}
            >
              <SectionCard
                title="Población en edad de trabajar"
                description={
                  "Pirámide laboral por tramo de edad y sexo. Muestra dónde están las y los ocupados, desocupados y quienes quedan fuera de la fuerza de trabajo."
                }
              >
                <Box
                  sx={{
                    width: "100%",
                    minHeight: { xs: 280, md: 400 },
                    "& > *": { width: "100%", height: "100%" },
                  }}
                >
                  <GraficoPiramide />
                </Box>
              </SectionCard>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}