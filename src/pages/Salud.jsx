// src/pages/Salud.jsx
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
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import jsPDF from "jspdf";

import {
  obtenerBeneficiarios,
  obtenerTipo,
  formatMiles,
} from "../services/saludService";

import GraficoPoblacionSexoSalud from "../components/GraficoPoblacionSexoSalud";
import GraficoIndicadoresSalud from "../components/GraficoIndicadoresSalud";

/* ====== PALETA (FES + Nodo XXI) ====== */
const PALETA = {
  fesBlue: "#005597",
  fesRed: "#C42430",
  fesYellow: "#FFCC00",
  ink: "#1F2937",
  gray500: "#6B7280",
  cardBg: "#FFFFFF",
  divider: "#E5E7EB",
};

const COLORS = {
  ctaBg: PALETA.fesBlue,
  ctaBgHover: "#00447A",
};

/* ===== KPI CARD ===== */
const KPI_HEIGHT = { xs: 96, sm: 108, md: 116 };
const KPI_GRID = "24px 1fr 14px";

function KpiCard({
  icon: Icon,
  title,
  value,
  subtitle,
  badge,
  iconColor = PALETA.fesBlue,
}) {
  return (
    <Paper
      elevation={0}
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
      }}
    >
      {/* fila título + badge */}
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
            color: PALETA.ink,
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
          }}
        >
          {badge ?? "—"}
        </Box>
      </Box>

      {/* valor grande */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: { xs: 18, sm: 20, md: 22 },
            lineHeight: 1.05,
            color: PALETA.ink,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={String(value ?? "")}
        >
          {value}
        </Typography>
      </Box>

      {/* sub */}
      <Typography
        sx={{
          color: PALETA.gray500,
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

/* ===== Fallbacks ===== */
const FALLBACK_BEN = [
  { anio: 2018, fonasa: 14102709, isapre: 3404896 },
  { anio: 2019, fonasa: 14841577, isapre: 3431126 },
  { anio: 2020, fonasa: 15142528, isapre: 3339226 },
  { anio: 2021, fonasa: 15233814, isapre: 3330254 },
  { anio: 2022, fonasa: 15613584, isapre: 3151885 },
  { anio: 2023, fonasa: 16229898, isapre: 2788257 },
  { anio: 2024, fonasa: 16752189, isapre: 2630026 },
];

const FALLBACK_TIPO = {
  2018: {
    FONASA: { Titular: 11196721, Carga: 2905988 },
    ISAPRE: { Titular: 1971099, Carga: 1433797 },
  },
  2019: {
    FONASA: { Titular: 11837415, Carga: 3004162 },
    ISAPRE: { Titular: 2020344, Carga: 1410782 },
  },
  2020: {
    FONASA: { Titular: 12080551, Carga: 3061977 },
    ISAPRE: { Titular: 1971662, Carga: 1367564 },
  },
  2021: {
    FONASA: { Titular: undefined, Carga: undefined },
    ISAPRE: { Titular: 1988803, Carga: 1341451 },
  },
  2022: {
    FONASA: { Titular: 12612537, Carga: 3001047 },
    ISAPRE: { Titular: 1901844, Carga: 1250041 },
  },
  2023: {
    FONASA: { Titular: 13087603, Carga: 3142295 },
    ISAPRE: { Titular: 1699294, Carga: 1088963 },
  },
  2024: {
    FONASA: { Titular: 13511933, Carga: 3240256 },
    ISAPRE: { Titular: undefined, Carga: undefined },
  },
};

export default function Salud() {
  const sectionRefs = useRef({});
  const [activeId, setActiveId] = useState("");

  // series totales FONASA/ISAPRE
  const [years, setYears] = useState([]);
  const [fonasa, setFonasa] = useState([]);
  const [isapre, setIsapre] = useState([]);

  // titular/carga por sistema
  const [serieTipo, setSerieTipo] = useState({});

  // Sidebar / índice
  const INDICADORES = [
    { id: "kpis-beneficiarios", label: "Beneficiarios" },
    { id: "kpis-desglose", label: "Titulares / Cargas" },
    { id: "grafico-sexo", label: "Población por sexo y sistema" },
    { id: "grafico-indicadores", label: "Financiamiento y gasto (índice)" },
  ];

  // === fetch beneficiarios ===
  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const rows = await obtenerBeneficiarios();
        const sorted = (rows || [])
          .map((r) => ({
            anio: Number(r.anio),
            fonasa: Number(r.fonasa || 0),
            isapre: Number(r.isapre || 0),
          }))
          .filter((r) => Number.isFinite(r.anio))
          .sort((a, b) => a.anio - b.anio);

        if (!sorted.length) throw new Error("sin datos backend");
        if (on) {
          setYears(sorted.map((r) => r.anio));
          setFonasa(sorted.map((r) => r.fonasa));
          setIsapre(sorted.map((r) => r.isapre));
        }
      } catch {
        if (on) {
          setYears(FALLBACK_BEN.map((r) => r.anio));
          setFonasa(FALLBACK_BEN.map((r) => r.fonasa));
          setIsapre(FALLBACK_BEN.map((r) => r.isapre));
        }
      }
    })();
    return () => {
      on = false;
    };
  }, []);

  // === fetch titulares/cargas ===
  useEffect(() => {
    let on = true;
    const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024];

    (async () => {
      const acc = {};
      for (const y of YEARS) {
        try {
          const data = await obtenerTipo(y);
          acc[y] = {};
          for (const r of data?.rows ?? []) {
            const sys = String(r.sistema || "").toUpperCase();
            if (!acc[y][sys]) acc[y][sys] = {};
            acc[y][sys].Titular = Number(r.Titular || 0);
            acc[y][sys].Carga = Number(r.Carga || 0);
          }
        } catch {
          // fallback después
        }
      }
      for (const y of YEARS) {
        if (!acc[y]) acc[y] = {};
        for (const sys of ["FONASA", "ISAPRE"]) {
          if (!acc[y][sys]) acc[y][sys] = {};
          for (const k of ["Titular", "Carga"]) {
            const fb = FALLBACK_TIPO[y]?.[sys]?.[k];
            if (!Number.isFinite(acc[y][sys][k]) || acc[y][sys][k] === 0) {
              if (Number.isFinite(fb)) acc[y][sys][k] = fb;
            }
          }
        }
      }
      if (on) setSerieTipo(acc);
    })();

    return () => {
      on = false;
    };
  }, []);

  // ===== helpers KPI =====
  const firstYear = years[0];
  const lastYear = years[years.length - 1];
  const lastF = fonasa.at(-1) ?? 0;
  const firstF = fonasa[0] ?? 0;
  const lastI = isapre.at(-1) ?? 0;
  const firstI = isapre[0] ?? 0;

  const pct = (a, b) => (a ? ((b - a) / a) * 100 : 0);
  const pctFmt = (n) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

  const yearsAll = [2018, 2019, 2020, 2021, 2022, 2023, 2024];

  const latestNonZero = (valuesByYear) => {
    const nonZero = valuesByYear.filter(([, v]) => Number(v) > 0);
    if (!nonZero.length)
      return { firstY: null, lastY: null, firstV: 0, lastV: 0 };
    const firstY = nonZero[0][0];
    const firstV = nonZero[0][1];
    const lastY = nonZero[nonZero.length - 1][0];
    const lastV = nonZero[nonZero.length - 1][1];
    return { firstY, lastY, firstV, lastV };
  };

  const F_T = latestNonZero(
    yearsAll.map((y) => [y, serieTipo?.[y]?.FONASA?.Titular ?? 0])
  );
  const F_C = latestNonZero(
    yearsAll.map((y) => [y, serieTipo?.[y]?.FONASA?.Carga ?? 0])
  );
  const I_T = latestNonZero(
    yearsAll.map((y) => [y, serieTipo?.[y]?.ISAPRE?.Titular ?? 0])
  );
  const I_C = latestNonZero(
    yearsAll.map((y) => [y, serieTipo?.[y]?.ISAPRE?.Carga ?? 0])
  );

  // ===== scroll sidebar =====
  const scrollToSection = (id) => {
    const node = sectionRefs.current[id];
    if (!node) return;
    setActiveId(id);

    const OFFSET = 84;
    const y = node.getBoundingClientRect().top + window.scrollY - OFFSET;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  // ===== export PDF (informe analítico) =====
  const exportarPDF = () => {
    const pdf = new jsPDF({
      unit: "pt",
      format: "a4",
    });

    const left = 40;
    let cursorY = 50;

    const line = (text, size = 11, bold = false) => {
      pdf.setFont("helvetica", bold ? "bold" : "normal");
      pdf.setFontSize(size);
      const lines = pdf.splitTextToSize(text, 500);
      pdf.text(lines, left, cursorY);
      cursorY += lines.length * (size + 4);
      cursorY += 6;
    };

    const sectionTitle = (t) => {
      pdf.setDrawColor(0);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.text(t, left, cursorY);
      cursorY += 20;
    };

    const ensureSpace = (need = 120) => {
      if (cursorY + need > pdf.internal.pageSize.getHeight() - 40) {
        pdf.addPage();
        cursorY = 50;
      }
    };

    // encabezado
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Informe de Salud", left, cursorY);
    cursorY += 24;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    const fechaGen = new Date().toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    pdf.text(`Generado: ${fechaGen}`, left, cursorY);
    cursorY += 28;

    // sección 1
    const variacionFonasa = pctFmt(pct(firstF, lastF));
    const variacionIsapre = pctFmt(pct(firstI, lastI));

    sectionTitle("1. Cobertura: beneficiarios por sistema");

    line(
      `Fonasa (${lastYear}): ${formatMiles(
        lastF
      )} beneficiarios. Variación ${firstYear}–${lastYear}: ${variacionFonasa}.`,
      11
    );
    line(
      `Isapre (${lastYear}): ${formatMiles(
        lastI
      )} beneficiarios. Variación ${firstYear}–${lastYear}: ${variacionIsapre}.`,
      11
    );

    ensureSpace();

    line(
      "Estas cifras muestran cuántas personas están cubiertas por el sistema público (Fonasa) y por aseguradoras privadas (Isapre). Un alza en Fonasa y/o una baja en Isapre puede indicar traslado de población al seguro público.",
      10
    );

    ensureSpace();

    // sección 2
    sectionTitle("2. Titulares y cargas por sistema");

    line(
      `Fonasa último año disponible: Titulares ${formatMiles(
        F_T.lastV
      )}, Cargas ${formatMiles(F_C.lastV)}.`,
      11
    );
    line(
      `Isapre último año disponible: Cotizantes ${formatMiles(
        I_T.lastV
      )}, Cargas ${formatMiles(I_C.lastV)}.`,
      11
    );

    ensureSpace();

    line(
      "Titular / cotizante es quien aporta la cotización directa. 'Carga' es quien accede a cobertura gracias a ese titular. Esta relación permite dimensionar dependencia económica dentro de cada sistema.",
      10
    );

    ensureSpace();

    // sección 3
    sectionTitle("3. Notas metodológicas");

    line(
      `Años cubiertos: ${firstYear}–${lastYear}. En algunos casos hay vacíos en ciertos años (por ejemplo, datos de cargas/titulares faltantes o declarados como 0); esos valores fueron reemplazados usando las últimas cifras oficiales disponibles para mantener la continuidad de lectura.`,
      10
    );

    line(
      "Las cifras provienen de registros administrativos del sistema público (Fonasa) y privado (Isapres), además de agregaciones internas para estandarizar formatos anuales.",
      10
    );

    pdf.save("informe-salud.pdf");
  };

  return (
    <Box sx={{ bgcolor: "#F9FAFB" }}>
      <Container
        id="seccion-salud"
        maxWidth="xl"
        sx={{
          py: { xs: 1.5, md: 3 },
          px: { xs: 1, sm: 1.5 },
          borderLeft: { md: `1px solid ${PALETA.divider}` },
        }}
      >
        {/* ====== Header ====== */}
        <Box
          sx={{
            mb: { xs: 1.5, sm: 2 },
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
              lineHeight: 1.2,
              color: PALETA.ink,
              mb: { xs: 0.5, sm: 1 },
              letterSpacing: { xs: 0.2, sm: 0.3 },
              textAlign: "center",
              width: "100%",
              maxWidth: { xs: "100%", lg: 1100 },
              mx: "auto",
            }}
          >
            Salud
          </Typography>

          <Typography
            component="p"
            sx={{
              color: PALETA.gray500,
              fontSize: { xs: "0.95rem", md: "1rem" },
              lineHeight: 1.6,
              textAlign: "center",
              width: "100%",
              maxWidth: 980,
              mx: "auto",
              px: { xs: 1, sm: 0 },
            }}
          >
            La salud en Chile vive un punto de inflexión. La crisis del
            aseguramiento privado evidenció los límites de un esquema
            segmentado y regresivo; el horizonte que proponemos es avanzar hacia
            financiamiento solidario, fortalecimiento de la APS y rectoría
            pública que reduzca listas de espera y garantice acceso oportuno con
            enfoque territorial y de género.
          </Typography>
        </Box>

        {/* ====== GRID PRINCIPAL ====== */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 0, md: 3 },
          }}
        >
          {/* ----- Sidebar izquierdo ----- */}
          <Box
            sx={{
              flexShrink: 0,
              width: { xs: "100%", md: 260 },
              position: { md: "sticky" },
              top: { md: 90 },
              maxHeight: { md: "80vh" },
              overflowY: { md: "auto" },
              borderRight: { md: `1px solid ${PALETA.divider}` },
              pr: { md: 2 },
              mb: { xs: 2, md: 0 },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 1.25,
                color: PALETA.ink,
                fontWeight: 800,
                letterSpacing: 0.2,
                fontSize: 15,
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
                    px: 1.25,
                    "& .MuiListItemText-primary": {
                      fontSize: 14,
                      lineHeight: 1.3,
                      color: activeId === sec.id ? "#fff" : PALETA.ink,
                      fontWeight: activeId === sec.id ? 600 : 500,
                    },
                    "&.Mui-selected": {
                      bgcolor: PALETA.fesBlue,
                      "&:hover": { bgcolor: PALETA.fesBlue },
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
              Descargar informe PDF
            </Button>
          </Box>

          {/* ----- Contenido principal ----- */}
          <Box flexGrow={1} sx={{ minWidth: 0, width: "100%" }}>
            {/* KPIs Beneficiarios */}
            <Box
              id="kpis-beneficiarios"
              ref={(el) => (sectionRefs.current["kpis-beneficiarios"] = el)}
              sx={{ scrollMarginTop: "100px" }}
            >
              <Box
                sx={{
                  display: "grid",
                  gap: { xs: 1, sm: 1.5, md: 2 },
                  gridTemplateColumns: {
                    xs: "repeat(1, minmax(0, 1fr))",
                    sm: "repeat(2, minmax(0, 1fr))",
                  },
                  mb: { xs: 1.5, sm: 2, md: 2.5 },
                }}
              >
                <KpiCard
                  icon={PeopleIcon}
                  title="Fonasa — Beneficiarios"
                  value={formatMiles(lastF)}
                  subtitle={
                    firstYear && lastYear ? `${firstYear}–${lastYear}` : ""
                  }
                  badge={pctFmt(pct(firstF, lastF))}
                  iconColor={PALETA.fesBlue}
                />
                <KpiCard
                  icon={PeopleIcon}
                  title="Isapre — Beneficiarios"
                  value={formatMiles(lastI)}
                  subtitle={
                    firstYear && lastYear ? `${firstYear}–${lastYear}` : ""
                  }
                  badge={pctFmt(pct(firstI, lastI))}
                  iconColor={PALETA.fesRed}
                />
              </Box>
            </Box>

            {/* KPIs Titulares / Cargas */}
            <Box
              id="kpis-desglose"
              ref={(el) => (sectionRefs.current["kpis-desglose"] = el)}
              sx={{
                scrollMarginTop: "100px",
                mb: { xs: 1.5, sm: 2, md: 2.5 },
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gap: { xs: 1, sm: 1.5, md: 2 },
                  gridTemplateColumns: {
                    xs: "repeat(1, minmax(0, 1fr))",
                    sm: "repeat(2, minmax(0, 1fr))",
                  },
                }}
              >
                <KpiCard
                  icon={PeopleIcon}
                  title="Fonasa — Titulares"
                  value={formatMiles(F_T.lastV)}
                  subtitle={
                    F_T.firstY && F_T.lastY ? `${F_T.firstY}–${F_T.lastY}` : ""
                  }
                  badge={pctFmt(pct(F_T.firstV, F_T.lastV))}
                  iconColor={PALETA.fesBlue}
                />
                <KpiCard
                  icon={PeopleIcon}
                  title="Fonasa — Cargas"
                  value={formatMiles(F_C.lastV)}
                  subtitle={
                    F_C.firstY && F_C.lastY ? `${F_C.firstY}–${F_C.lastY}` : ""
                  }
                  badge={pctFmt(pct(F_C.firstV, F_C.lastV))}
                  iconColor={PALETA.fesBlue}
                />
                <KpiCard
                  icon={PeopleIcon}
                  title="Isapre — Cotizantes"
                  value={formatMiles(I_T.lastV)}
                  subtitle={
                    I_T.firstY && I_T.lastY ? `${I_T.firstY}–${I_T.lastY}` : ""
                  }
                  badge={pctFmt(pct(I_T.firstV, I_T.lastV))}
                  iconColor={PALETA.fesRed}
                />
                <KpiCard
                  icon={PeopleIcon}
                  title="Isapre — Cargas"
                  value={formatMiles(I_C.lastV)}
                  subtitle={
                    I_C.firstY && I_C.lastY ? `${I_C.firstY}–${I_C.lastY}` : ""
                  }
                  badge={pctFmt(pct(I_C.firstV, I_C.lastV))}
                  iconColor={PALETA.fesRed}
                />
              </Box>
            </Box>

            {/* Gráfico población por sexo y sistema + nota lateral estilo macro */}
            <Box
              id="grafico-sexo"
              ref={(el) => (sectionRefs.current["grafico-sexo"] = el)}
              sx={{
                scrollMarginTop: "100px",
                mb: { xs: 2.5, sm: 3 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "stretch", md: "center" }, // centrado vertical en desktop
                  gap: { xs: 1.5, md: 3 },
                }}
              >
                {/* gráfico */}
                <Box
                  sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    bgcolor: PALETA.cardBg,
                    border: `1px solid ${PALETA.divider}`,
                    borderRadius: 2,
                    p: { xs: 1.25, sm: 1.5, md: 2 },
                  }}
                >
                  <GraficoPoblacionSexoSalud />
                </Box>

                {/* texto lateral estilo macroeconomía */}
                <Box
                  sx={{
                    flexShrink: 0,
                    width: { xs: "100%", md: 320, lg: 360 },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.05rem" },
                      lineHeight: 1.25,
                      fontWeight: 800,
                      color: PALETA.ink,
                      mb: 1.5,
                    }}
                  >
                    Salud mental y derecho a la salud
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: { xs: "0.95rem", md: "1rem" },
                      lineHeight: 1.6,
                      color: PALETA.gray500,
                      mb: 2,
                      textAlign: "left",
                    }}
                  >
                    La salud mental requiere prioridad efectiva en cobertura y
                    prevención de riesgos psicosociales, evitando que sus
                    costos recaigan en hogares y en el sector público. Estas
                    transformaciones forman parte de una reforma estructural
                    ineludible para alinear el sistema con el derecho a la
                    salud.
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: { xs: "0.8rem", md: "0.8rem" },
                      lineHeight: 1.4,
                      color: PALETA.gray500,
                      fontWeight: 400,
                      fontStyle: "italic",
                    }}
                  >
                    Fuente: elaboración propia en base a registros
                    administrativos de Fonasa e Isapre.
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Gráfico comparado índice base 100 + nota lateral estilo macro */}
            <Box
              id="grafico-indicadores"
              ref={(el) => (sectionRefs.current["grafico-indicadores"] = el)}
              sx={{ scrollMarginTop: "100px", mb: { xs: 4, sm: 5 } }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "stretch", md: "center" }, // centrado vertical
                  gap: { xs: 1.5, md: 3 },
                }}
              >
                {/* gráfico */}
                <Box
                  sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    bgcolor: PALETA.cardBg,
                    border: `1px solid ${PALETA.divider}`,
                    borderRadius: 2,
                    p: { xs: 1.25, sm: 1.75, md: 2 },
                  }}
                >
                  <GraficoIndicadoresSalud />
                </Box>

                {/* texto lateral "Cómo usar estos datos" */}
                <Box
                  sx={{
                    flexShrink: 0,
                    width: { xs: "100%", md: 320, lg: 360 },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.05rem" },
                      lineHeight: 1.25,
                      fontWeight: 800,
                      color: PALETA.ink,
                      mb: 1.5,
                    }}
                  >
                    Cómo usar estos datos
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: { xs: "0.95rem", md: "1rem" },
                      lineHeight: 1.6,
                      color: PALETA.gray500,
                      mb: 2,
                      textAlign: "left",
                    }}
                  >
                    Explora los gráficos de esta sección, compara series y
                    territorios, y descarga las bases para realizar tus propios
                    análisis; si publicas o compartes resultados, cita la fuente
                    y el período de los datos. Con evidencia transparente y
                    criterios de bien común, es posible superar un modelo
                    centrado en la mercantilización y avanzar hacia un sistema
                    de salud más justo, eficiente y democrático.
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: { xs: "0.8rem", md: "0.8rem" },
                      lineHeight: 1.4,
                      color: PALETA.gray500,
                      fontStyle: "italic",
                    }}
                  >
                    Fuente: Nodo XXI / FES. Series anuales estandarizadas.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
