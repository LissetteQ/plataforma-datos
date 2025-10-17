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

// Iconos
import PeopleIcon from "@mui/icons-material/People";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import BarChartIcon from "@mui/icons-material/BarChart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";

// Gráficos
import GraficoTrabajoPorAnio from "../components/GraficoTrabajoPorAnio";
import GraficoSexo from "../components/GraficoSexo";
import GraficoCotizaciones from "../components/GraficoCotizaciones";
import GraficoIngreso from "../components/GraficoIngreso"; // <- si deseas, puedes borrar esta línea
import GraficoJornada from "../components/GraficoJornada";
import GraficoTasas from "../components/GraficoTasas";
import GraficoPiramide from "../components/GraficoPiramide";
import GraficoIngresoSexo from "../components/GraficoIngresoSexo";
// ESI ingresos (línea anual)
import GraficoESIIngresos from "../components/GraficoESIIngresos";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getAnual, getTasas, getESIIngresosUltimo } from "../services/trabajoApi";

/* ====== PALETA (FES + Nodo XXI) ====== */
const PALETA = {
  fesBlue: "#005597",
  fesRed: "#D70000",
  fesYellow: "#FFCC00",
  nodoBlue: "#0B3D91",
  ink: "#1F2937",
  gray500: "#6B7280",
  cardBg: "#FFFFFF",
  divider: "#E5E7EB",
};

const COLORS = {
  kpiIcon: PALETA.fesBlue,
  kpiTitle: PALETA.ink,
  kpiValue: PALETA.ink,
  kpiSubtitle: PALETA.gray500,
  ctaBg: PALETA.fesBlue,
  ctaBgHover: "#00447A",
  accent: PALETA.fesRed,
  cardBorderTop: PALETA.fesYellow,
};

const formMiles = (n) => Math.round((n ?? 0) / 1000).toLocaleString("es-CL");

const GraficoBox = ({ children, min = 220, smH = 300, mdH = 360 }) => (
  <Box
    sx={{
      width: "100%",
      minHeight: { xs: min, sm: smH, md: mdH },
      "& > *": { width: "100%", height: "100%" },
    }}
  >
    {children}
  </Box>
);

const KPI_HEIGHT = { xs: 96, sm: 108, md: 116 };
const KPI_GRID = "24px 1fr 14px";

function KpiCard({ icon: Icon, title, value, subtitle, badge, iconColor, to, onClick }) {
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
        "&:focus-visible": { outline: `3px solid ${PALETA.fesBlue}`, outlineOffset: 2 },
        "&:hover": clickable ? { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" } : undefined,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minHeight: 24, maxHeight: 24, overflow: "hidden" }}>
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
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  // ===== Menú de navegación (sin duplicados) =====
  const INDICADORES = [
    { id: "section-esi-anual", label: "Ingreso medio anual — ESI (2018–2024)" },
    { id: "section-fuerza-desempleo", label: "Evolución de Fuerza Laboral y Desempleo" },
    { id: "section-ingreso-por-sexo-2018-2024", label: "Ingreso promedio por sexo (2018–2024)" },
    { id: "section-cotizaciones", label: "Cotización previsional y de salud" },
    { id: "section-jornada", label: "Tipo de Jornada Laboral" },
    { id: "section-ingreso-promedio-anual-sexo", label: "Ingreso promedio por sexo (promedio anual)" },
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

  const exportarPDF = async () => {
    const input = document.getElementById("seccion-trabajo");
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const ratio = pageWidth / canvas.width;
    const imgHeight = canvas.height * ratio;
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    pdf.save("reporte-trabajo.pdf");
  };

  const SectionCard = ({ title, children, description, sx }) => (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.25, sm: 1.75, md: 2 },
        borderRadius: 2,
        mb: { xs: 1.5, sm: 2.5, md: 3 },
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
          variant={isXs ? "subtitle2" : "subtitle1"}
          sx={{
            fontWeight: 800,
            mb: { xs: 0.75, sm: 1 },
            textAlign: "center",
            color: PALETA.ink,
          }}
        >
          {title}
        </Typography>
      )}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: { xs: "100%", md: 1100 } }}>{children}</Box>
      </Box>
      {description && (
        <Typography
          variant="body2"
          sx={{
            color: COLORS.kpiSubtitle,
            mt: { xs: 0.75, md: 1 },
            textAlign: "center",
            maxWidth: 980,
            mx: "auto",
            lineHeight: 1.45,
          }}
        >
          {description}
        </Typography>
      )}
    </Paper>
  );

  const fuerzaValue = fuerza != null ? formMiles(fuerza) : "—";
  const desempleoValue = desempleo != null ? `${desempleo.toFixed(1)}%` : "—";

  return (
    <Box sx={{ bgcolor: "#F9FAFB" }}>
      <Container
        id="seccion-trabajo"
        maxWidth="xl"
        sx={{
          py: { xs: 1.5, md: 3 },
          px: { xs: 1, sm: 1.5 },
          borderLeft: { md: `1px solid ${PALETA.divider}` },
        }}
      >
        {/* Encabezado */}
        <Box
          sx={{
            mb: { xs: 1.5, sm: 2.5 },
            width: "100%",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 28, sm: 36, md: 44 },
              fontWeight: 900,
              lineHeight: 1.1,
              color: PALETA.ink,
              mb: { xs: 0.75, sm: 1 },
              letterSpacing: { xs: 0.2, sm: 0.3 },
              textAlign: "center",
              width: "100%",
              maxWidth: { xs: "100%", lg: 1100 },
              mx: "auto",
            }}
          >
            Trabajo
          </Typography>

          <Typography
            component="p"
            sx={{
              color: PALETA.gray500,
              fontSize: { xs: 14, sm: 16, md: 17 },
              lineHeight: 1.5,
              textAlign: "center",
              width: "100%",
              maxWidth: 980,
              mx: "auto",
              px: { xs: 1, sm: 0 },
            }}
          >
            Visualización de indicadores con datos de ENE y ESI. Selecciona un
            indicador para navegar por las secciones.
          </Typography>
        </Box>

        {/* Layout */}
        <Box sx={{ display: "flex", gap: { xs: 0, md: 3 }, flexDirection: { xs: "column", md: "row" } }}>
          {/* Menú lateral */}
          <Box
            sx={{
              flexShrink: 0,
              width: { xs: "100%", md: 300 },
              position: { md: "sticky" },
              top: { md: 90 },
              maxHeight: { md: "80vh" },
              overflowY: { md: "auto" },
              borderRight: { md: `1px solid ${PALETA.divider}` },
              pr: { md: 2 },
              mb: { xs: 2, md: 0 },
            }}
          >
            <Typography variant="h6" sx={{ mb: 1.25, color: PALETA.ink, fontWeight: 800, letterSpacing: 0.2 }}>
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
                    px: 1.25,
                    "& .MuiListItemText-primary": {
                      fontSize: 14,
                      lineHeight: 1.3,
                      color: activeId === sec.id ? "#fff" : PALETA.ink,
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

            <Divider sx={{ my: 2, borderColor: PALETA.divider }} />

            <Button
              onClick={exportarPDF}
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: COLORS.ctaBg,
                fontWeight: 800,
                textTransform: "none",
                py: 1,
                borderRadius: 2,
                "&:hover": { backgroundColor: COLORS.ctaBgHover },
              }}
            >
              Descargar reporte PDF
            </Button>
          </Box>

          {/* Contenido principal */}
          <Box flexGrow={1} sx={{ minWidth: 0, width: "100%" }}>
            {/* KPIs */}
            <Box
              sx={{
                mt: { xs: 2, md: 3.5 },
                mb: { xs: 1.75, md: 3 },
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
                  value: fuerzaValue,
                  subtitle: "Miles de personas",
                  iconColor: COLORS.kpiIcon,
                },
                {
                  icon: TrendingDownIcon,
                  title: "Desempleo",
                  value: desempleoValue,
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
                  value: esiUlt?.total != null ? `$${esiUlt.total.toLocaleString("es-CL")}` : "—",
                  subtitle: esiUlt?.anio ? `Año ${esiUlt.anio}` : "",
                  iconColor: COLORS.kpiIcon,
                },
                {
                  icon: ManIcon,
                  title: "Ingreso — Hombres",
                  value: esiUlt?.hombres != null ? `$${esiUlt.hombres.toLocaleString("es-CL")}` : "—",
                  subtitle: esiUlt?.anio ? `Año ${esiUlt.anio}` : "",
                  iconColor: COLORS.kpiIcon,
                },
                {
                  icon: WomanIcon,
                  title: "Ingreso — Mujeres",
                  value: esiUlt?.mujeres != null ? `$${esiUlt.mujeres.toLocaleString("es-CL")}` : "—",
                  subtitle: esiUlt?.anio ? `Año ${esiUlt.anio}` : "",
                  iconColor: COLORS.accent,
                },
              ].map((k, i) => (
                <KpiCard key={i} {...k} />
              ))}
            </Box>

            {/* Secciones */}
            <Box
              id="section-esi-anual"
              ref={(el) => (sectionRefs.current["section-esi-anual"] = el)}
              sx={{ scrollMarginTop: "100px" }}
            >
              <SectionCard>
                <GraficoBox>
                  <GraficoESIIngresos />
                </GraficoBox>
              </SectionCard>
            </Box>

            <Box
              id="section-fuerza-desempleo"
              ref={(el) => (sectionRefs.current["section-fuerza-desempleo"] = el)}
              sx={{ scrollMarginTop: "100px" }}
            >
              <SectionCard description="La evolución anual del empleo permite observar el impacto de fenómenos económicos y sociales en la fuerza laboral chilena.">
                <GraficoBox>
                  <GraficoTrabajoPorAnio showNote={false} />
                </GraficoBox>
              </SectionCard>
            </Box>

            {/* SOLO BARRAS para ingreso por sexo */}
            <Box
              id="section-ingreso-por-sexo-2018-2024"
              ref={(el) => (sectionRefs.current["section-ingreso-por-sexo-2018-2024"] = el)}
              sx={{ scrollMarginTop: "100px" }}
            >
              <SectionCard description="Este gráfico de barras muestra el ingreso promedio por sexo a lo largo del tiempo (2018–2024).">
                <GraficoBox>
                  <GraficoSexo />
                </GraficoBox>
              </SectionCard>
            </Box>

            <Box
              id="section-cotizaciones"
              ref={(el) => (sectionRefs.current["section-cotizaciones"] = el)}
              sx={{ scrollMarginTop: "100px" }}
            >
              <SectionCard description="Un porcentaje importante de trabajadores no cotiza regularmente.">
                <GraficoBox>
                  <GraficoCotizaciones />
                </GraficoBox>
              </SectionCard>
            </Box>

            <Box
              id="section-jornada"
              ref={(el) => (sectionRefs.current["section-jornada"] = el)}
              sx={{ scrollMarginTop: "100px" }}
            >
              <SectionCard description="La mayoría declara jornada completa, pero hay una porción considerable en jornada parcial.">
                <GraficoBox>
                  <GraficoJornada />
                </GraficoBox>
              </SectionCard>
            </Box>

            {/* Mantienes tu otro gráfico de ingresos promedio anual si lo deseas */}
            <Box
              id="section-ingreso-promedio-anual-sexo"
              ref={(el) => (sectionRefs.current["section-ingreso-promedio-anual-sexo"] = el)}
              sx={{ scrollMarginTop: "100px" }}
            >
              <SectionCard description="Promedio anual de ingresos de hombres y mujeres (a partir del dataset enviado).">
                <GraficoBox>
                  <GraficoIngresoSexo />
                </GraficoBox>
              </SectionCard>
            </Box>

            <Box
              id="section-tasas-ene"
              ref={(el) => (sectionRefs.current["section-tasas-ene"] = el)}
              sx={{ scrollMarginTop: "100px" }}
            >
              <SectionCard description="TD, TO, TP, TPL y SU1–SU4, junto a TOI y TOSI según ENE.">
                <GraficoBox>
                  <GraficoTasas />
                </GraficoBox>
              </SectionCard>
            </Box>

            <Box
              id="section-pet"
              ref={(el) => (sectionRefs.current["section-pet"] = el)}
              sx={{ scrollMarginTop: "100px" }}
            >
              <SectionCard
                title="Población en edad de trabajar"
                description="Distribución por edades de PET, FDT, OC, DES, ID, TPI, OBE, FTP, FTA, FFT, OI y OSI."
              >
                <GraficoBox mdH={400}>
                  <GraficoPiramide />
                </GraficoBox>
              </SectionCard>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
