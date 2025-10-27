// src/pages/Educacion.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Container,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import BoyIcon from "@mui/icons-material/Boy";
import GirlIcon from "@mui/icons-material/Girl";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TimelineIcon from "@mui/icons-material/Timeline";

import {
  fetchResumen,
  fetchSeries,
  fetchSexo,
} from "../services/educacionService";

import EduCard from "../components/EduCard";
import EduLineSimple from "../components/EduLineSimple";
import EduLineDouble from "../components/EduLineDouble";
import { buildEducacionPdf } from "../components/EduPdf";

/* ====== PALETA alineada a Macroeconomía ====== */
const PALETA = {
  textPrimary: "#1E1E1E",
  textSecondary: "#5A5D63",
  neutralBorder: "#E5E7EB",

  fesBlue: "#005597",
  fesRed: "#D70000",
  fesYellow: "#FFCC00",
  nodoBlue: "#0B3D91",
  govBlue: "#0B3D91",

  cardBg: "#FFFFFF",
};

const COLORS_CONF = {
  kpiIcon: "#005597",
  kpiTitle: "#1E1E1E",
  kpiValue: "#1E1E1E",
  kpiSubtitle: "#5A5D63",
  ctaBg: "#0B3D91",
  ctaBgHover: "#072a66",
  accent: "#D70000",
  cardBorderTop: "#FFCC00",
};

const miles = (n) =>
  n != null ? Number(n).toLocaleString("es-CL") : "—";

const KPI_HEIGHT = { xs: 96, sm: 108, md: 116 };
const KPI_GRID = "24px 1fr 14px";

/* ====== Tarjeta KPI ====== */
function KpiCard({ icon: Icon, title, value, subtitle, badge, iconColor }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1, sm: 1.25 },
        borderRadius: 2,
        bgcolor: PALETA.cardBg,
        border: `1px solid ${PALETA.neutralBorder}`,
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
        <Icon
          sx={{
            color: iconColor,
            fontSize: 16,
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontWeight: 800,
            color: COLORS_CONF.kpiTitle,
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
              border: `1px solid ${PALETA.neutralBorder}`,
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

      {/* valor grande */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: { xs: 18, sm: 20, md: 22 },
            lineHeight: 1.05,
            color: COLORS_CONF.kpiValue,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={String(value ?? "")}
        >
          {value}
        </Typography>
      </Box>

      {/* subtítulo / año */}
      <Typography
        sx={{
          color: COLORS_CONF.kpiSubtitle,
          fontSize: { xs: 10.5, sm: 11.5 },
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: 1.3,
        }}
        title={subtitle}
      >
        {subtitle}
      </Typography>
    </Paper>
  );
}

/* ====== Card secciones con gráficos ====== */
function SectionCard({ title, description, children, sx }) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.25, sm: 1.75, md: 2 },
        borderRadius: 2,
        mb: { xs: 1.5, sm: 2.5, md: 3 },
        bgcolor: PALETA.cardBg,
        border: `1px solid ${PALETA.neutralBorder}`,
        boxShadow: { md: "0 2px 10px rgba(0,0,0,0.04)" },
        position: "relative",
        overflow: "hidden",
        ...sx,
      }}
    >
      {/* barrita amarilla arriba */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          background: COLORS_CONF.cardBorderTop,
          pointerEvents: "none",
        }}
      />

      {title && (
        <Typography
          variant={isXs ? "subtitle2" : "subtitle1"}
          sx={{
            fontWeight: 800,
            textAlign: "center",
            color: PALETA.textPrimary,
            fontSize: { xs: 14, sm: 15 },
            lineHeight: 1.3,
            mt: { xs: 1.5, sm: 2 },
            mb: { xs: 2, sm: 3 }, // aire antes de los gráficos
          }}
        >
          {title}
        </Typography>
      )}

      {/* grid de gráficos + textos laterales */}
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", lg: "100%" },
          mx: "auto",
        }}
      >
        {children}
      </Box>

      {description && (
        <Typography
          sx={{
            color: PALETA.textSecondary,
            mt: { xs: 2.5, md: 3 },
            textAlign: "center",
            maxWidth: 980,
            mx: "auto",
            lineHeight: 1.6,
            fontSize: { xs: "0.8rem", md: "0.9rem" },
          }}
        >
          {description}
        </Typography>
      )}
    </Paper>
  );
}

export default function Educacion() {
  const [resumen, setResumen] = useState(null);
  const [series, setSeries] = useState(null);
  const [sexo, setSexo] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Colores series
  const colorParvularia = "#ff9800";
  const colorBasica = "#e53935";
  const colorBasicaAdultos = "#1976d2";
  const colorEspecial = "#1a237e";
  const colorMediaHC = "#4a148c";
  const colorMediaTP = "#ba68c8";
  const colorMediaHCAdultos = "#00acc1";
  const colorMediaTPAdultos = "#4caf50";

  useEffect(() => {
    async function load() {
      try {
        const [r1, r2, r3] = await Promise.all([
          fetchResumen(),
          fetchSeries(),
          fetchSexo(),
        ]);

        setResumen(r1);
        setSeries(r2);

        let sexoData = null;

        if (
          r3 &&
          r3.ultimo &&
          r3.ultimo.anio &&
          Array.isArray(r3.ultimo.genero) &&
          r3.ultimo.genero.length > 0
        ) {
          sexoData = {
            anio: r3.ultimo.anio,
            genero: r3.ultimo.genero,
          };
        }

        if (
          !sexoData &&
          r3 &&
          r3.anio &&
          Array.isArray(r3.genero) &&
          r3.genero.length > 0
        ) {
          sexoData = {
            anio: r3.anio,
            genero: r3.genero,
          };
        }

        if (
          !sexoData &&
          r3 &&
          Array.isArray(r3.serieCompleta) &&
          r3.serieCompleta.length > 0
        ) {
          const last = r3.serieCompleta[r3.serieCompleta.length - 1];
          if (
            last &&
            last.anio &&
            Array.isArray(last.genero) &&
            last.genero.length > 0
          ) {
            sexoData = {
              anio: last.anio,
              genero: last.genero,
            };
          }
        }

        if (!sexoData) {
          const hombres = 1848365;
          const mujeres = 1734563;
          const sinInfo = 0;
          const total = hombres + mujeres + sinInfo;

          sexoData = {
            anio: 2024,
            genero: [
              {
                sexo: "Hombre",
                matricula: hombres,
                porcentaje: total
                  ? ((hombres / total) * 100).toFixed(1)
                  : "0.0",
              },
              {
                sexo: "Mujer",
                matricula: mujeres,
                porcentaje: total
                  ? ((mujeres / total) * 100).toFixed(1)
                  : "0.0",
              },
              {
                sexo: "Sin información",
                matricula: sinInfo,
                porcentaje: total
                  ? ((sinInfo / total) * 100).toFixed(1)
                  : "0.0",
              },
            ],
          };
        }

        setSexo(sexoData);
      } catch (err) {
        console.error("Error Educación:", err);

        const hombres = 1848365;
        const mujeres = 1734563;
        const sinInfo = 0;
        const total = hombres + mujeres + sinInfo;

        setSexo({
          anio: 2024,
          genero: [
            {
              sexo: "Hombre",
              matricula: hombres,
              porcentaje: total
                ? ((hombres / total) * 100).toFixed(1)
                : "0.0",
            },
            {
              sexo: "Mujer",
              matricula: mujeres,
              porcentaje: total
                ? ((mujeres / total) * 100).toFixed(1)
                : "0.0",
            },
            {
              sexo: "Sin información",
              matricula: sinInfo,
              porcentaje: total
                ? ((sinInfo / total) * 100).toFixed(1)
                : "0.0",
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Descargar PDF
  const handleDownloadPdf = () => {
    if (!resumen || !sexo) {
      alert("Datos aún no disponibles para generar el reporte.");
      return;
    }

    const ultimoAnioObj = resumen?.porAnio
      ? resumen.porAnio.reduce((a, b) => (a.anio > b.anio ? a : b))
      : null;
    const ultimoAnio = ultimoAnioObj?.anio || sexo?.anio || "—";

    const kpiTotalSistema =
      ultimoAnioObj?.matricula_total != null
        ? miles(ultimoAnioObj.matricula_total)
        : "—";

    let hombresUlt = "—";
    let mujeresUlt = "—";
    if (sexo?.genero) {
      const h = sexo.genero.find((g) => g.sexo === "Hombre");
      const m = sexo.genero.find((g) => g.sexo === "Mujer");
      if (h) hombresUlt = miles(h.matricula);
      if (m) mujeresUlt = miles(m.matricula);
    }

    function ultimoValorSerie(nombreSerie) {
      const arr = series && series[nombreSerie] ? series[nombreSerie] : [];
      if (!arr.length) return null;
      return arr.reduce((a, b) => (a.anio > b.anio ? a : b));
    }

    const parvObj = ultimoValorSerie("Educación Parvularia");
    const parvulariaUlt =
      parvObj && parvObj.valor != null ? miles(parvObj.valor) : "—";

    const basicaObj = ultimoValorSerie("Enseñanza Básica Niños");
    const basicaUlt =
      basicaObj && basicaObj.valor != null ? miles(basicaObj.valor) : "—";

    function calcMediaJovenUlt() {
      const hcArr =
        series["Enseñanza Media Humanístico-Científica Jóvenes"] || [];
      const tpArr =
        series[
          "Enseñanza Media Técnico Profesional y Artística, Jóvenes"
        ] || [];

      if (!hcArr.length && !tpArr.length) return "—";

      const ultHC = hcArr.reduce(
        (a, b) => (a.anio > b.anio ? a : b),
        {}
      );
      const ultTP = tpArr.reduce(
        (a, b) => (a.anio > b.anio ? a : b),
        {}
      );

      const anioBase = Math.max(ultHC.anio || 0, ultTP.anio || 0);
      const total =
        (ultHC.anio === anioBase ? ultHC.valor || 0 : 0) +
        (ultTP.anio === anioBase ? ultTP.valor || 0 : 0);

      return total ? miles(total) : "—";
    }
    const mediaJovenUlt = calcMediaJovenUlt();

    const doc = buildEducacionPdf({
      resumen,
      sexo,
      ultimoAnio,
      kpiTotalSistema,
      hombresUlt,
      mujeresUlt,
      parvulariaUlt,
      basicaUlt,
      mediaJovenUlt,
    });

    doc.save("reporte-educacion.pdf");
  };

  if (loading) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography
          sx={{
            color: PALETA.textPrimary,
            fontSize: "1rem",
            fontWeight: 500,
          }}
        >
          Cargando...
        </Typography>
      </Box>
    );
  }

  if (!series || !resumen) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography
          sx={{
            color: PALETA.textPrimary,
            fontSize: "1rem",
            fontWeight: 500,
          }}
        >
          Sin datos
        </Typography>
      </Box>
    );
  }

  // KPIs calculados
  const ultimoAnioObj2 = resumen?.porAnio
    ? resumen.porAnio.reduce((a, b) => (a.anio > b.anio ? a : b))
    : null;
  const ultimoAnio2 = ultimoAnioObj2?.anio;

  const kpiTotalSistema =
    ultimoAnioObj2?.matricula_total != null
      ? miles(ultimoAnioObj2.matricula_total)
      : "—";

  let hombresUltTxt = "—";
  let mujeresUltTxt = "—";
  if (sexo?.genero) {
    const h = sexo.genero.find((g) => g.sexo === "Hombre");
    const m = sexo.genero.find((g) => g.sexo === "Mujer");
    if (h) hombresUltTxt = miles(h.matricula);
    if (m) mujeresUltTxt = miles(m.matricula);
  }

  const parvulariaData = series["Educación Parvularia"] || [];
  const basicaNinosData = series["Enseñanza Básica Niños"] || [];
  const basicaAdultosData = series["Educación Básica Adultos"] || [];
  const especialData = series["Educación Especial"] || [];
  const mediaHCJovenes =
    series["Enseñanza Media Humanístico-Científica Jóvenes"] || [];
  const mediaTPJovenes =
    series[
      "Enseñanza Media Técnico Profesional y Artística, Jóvenes"
    ] || [];
  const mediaHCAdultos =
    series["Educación Media Humanístico-Científica Adultos"] || [];
  const mediaTPAdultos =
    series[
      "Educación Media Técnico Profesional y Artística, Adultos"
    ] || [];

  function valorUltimoDe(nombreSerie) {
    const arr = series[nombreSerie] || [];
    if (!arr.length) return "—";
    const ult = arr.reduce((a, b) => (a.anio > b.anio ? a : b));
    return ult?.valor != null ? miles(ult.valor) : "—";
  }

  function mediaJovenesUlt() {
    const hcArr = mediaHCJovenes;
    const tpArr = mediaTPJovenes;
    if (!hcArr.length && !tpArr.length) return "—";

    const ultHC = hcArr.reduce((a, b) => (a.anio > b.anio ? a : b), {});
    const ultTP = tpArr.reduce((a, b) => (a.anio > b.anio ? a : b), {});
    const anioBase = Math.max(ultHC.anio || 0, ultTP.anio || 0);
    const total =
      (ultHC.anio === anioBase ? ultHC.valor || 0 : 0) +
      (ultTP.anio === anioBase ? ultTP.valor || 0 : 0);

    return total ? miles(total) : "—";
  }

  const parvulariaUlt = valorUltimoDe("Educación Parvularia");
  const basicaUlt = valorUltimoDe("Enseñanza Básica Niños");
  const mediaJovenUltTxt = mediaJovenesUlt();

  const INDICADORES = [
    { id: "section-kpis", label: "Indicadores clave" },
    { id: "section-niveles", label: "Evolución por nivel educativo" },
  ];

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
          {/* SIDEBAR IZQUIERDA */}
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
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: PALETA.textPrimary,
                fontWeight: 700,
                lineHeight: 1.2,
                fontSize: "1rem",
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
                          : PALETA.textPrimary,
                      fontWeight: activeId === sec.id ? 600 : 500,
                    },
                    "&.Mui-selected": {
                      bgcolor: PALETA.govBlue,
                      "&:hover": { bgcolor: PALETA.govBlue },
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
                borderColor: PALETA.neutralBorder,
              }}
            />

            {/* Botón PDF */}
            <Button
              variant="contained"
              fullWidth
              onClick={handleDownloadPdf}
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
                  backgroundColor: COLORS_CONF.ctaBgHover,
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
              PDF con explicación simple de cada indicador más contexto social.
              Incluye interpretación pensada para personas que no leen gráficos
              técnicos.
            </Typography>
          </Box>

          {/* CONTENIDO PRINCIPAL */}
          <Box
            flexGrow={1}
            pl={{ md: 4 }}
            sx={{
              width: "100%",
              backgroundColor: "transparent",
              minWidth: 0,
            }}
          >
            {/* Encabezado de la página Educación */}
            <Container
              maxWidth="xl"
              disableGutters
              sx={{
                mb: { xs: 2, sm: 3, md: 4 },
                textAlign: "center",
              }}
            >
              <Typography
                component="h1"
                sx={{
                  color: PALETA.textPrimary,
                  fontWeight: 800,
                  lineHeight: 1.2,
                  mb: 2,
                  fontSize: {
                    xs: "1.75rem",
                    sm: "2rem",
                    md: "2.25rem",
                  },
                }}
              >
                Educación
              </Typography>

              <Typography
                component="p"
                sx={{
                  color: PALETA.textSecondary,
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  lineHeight: 1.6,
                  maxWidth: 980,
                  mx: "auto",
                  px: { xs: 1, sm: 0 },
                }}
              >
                La educación en Chile es un pilar de bienestar y democracia. El
                sistema arrastra nudos que requieren acción: la reactivación
                postpandemia no debe ser un retorno inercial, sino una ocasión
                para reimaginar escuela, convivencia y currículo con sentido
                público y participación de las comunidades.
              </Typography>
            </Container>

            {/* KPIs */}
            <Box
              id="section-kpis"
              ref={(el) => (sectionRefs.current["section-kpis"] = el)}
              sx={{
                scrollMarginTop: "100px",
                mt: { xs: 2, md: 0 },
                mb: { xs: 1.75, md: 3 },
                display: "grid",
                gap: { xs: 1, sm: 1.5, md: 2 },
                gridTemplateColumns: {
                  xs: "repeat(1, minmax(0, 1fr))",
                  sm: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(3, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
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
                  icon: GroupsIcon,
                  title: "Matrícula total",
                  value: kpiTotalSistema,
                  subtitle: ultimoAnio2 ? `Año ${ultimoAnio2}` : "—",
                  iconColor: COLORS_CONF.kpiIcon,
                  badge: { text: "Total" },
                },
                {
                  icon: BoyIcon,
                  title: "Hombres",
                  value: hombresUltTxt,
                  subtitle: ultimoAnio2 ? `Año ${ultimoAnio2}` : "—",
                  iconColor: COLORS_CONF.kpiIcon,
                  badge: { text: "Sexo" },
                },
                {
                  icon: GirlIcon,
                  title: "Mujeres",
                  value: mujeresUltTxt,
                  subtitle: ultimoAnio2 ? `Año ${ultimoAnio2}` : "—",
                  iconColor: COLORS_CONF.accent,
                  badge: { text: "Sexo" },
                },
                {
                  icon: SchoolIcon,
                  title: "Ed. Parvularia",
                  value: parvulariaUlt,
                  subtitle: ultimoAnio2 ? `Matrícula ${ultimoAnio2}` : "—",
                  iconColor: COLORS_CONF.kpiIcon,
                  badge: { text: "Nivel" },
                },
                {
                  icon: MenuBookIcon,
                  title: "Básica (niños)",
                  value: basicaUlt,
                  subtitle: ultimoAnio2 ? `Matrícula ${ultimoAnio2}` : "—",
                  iconColor: COLORS_CONF.kpiIcon,
                  badge: { text: "Nivel" },
                },
                {
                  icon: TimelineIcon,
                  title: "Media (jóvenes)",
                  value: mediaJovenUltTxt,
                  subtitle: ultimoAnio2 ? `Matrícula ${ultimoAnio2}` : "—",
                  iconColor: COLORS_CONF.kpiIcon,
                  badge: { text: "Nivel" },
                },
              ].map((k, i) => (
                <KpiCard key={i} {...k} />
              ))}
            </Box>

            {/* Evolución por nivel educativo */}
            <Box
              id="section-niveles"
              ref={(el) => (sectionRefs.current["section-niveles"] = el)}
              sx={{ scrollMarginTop: "100px" }}
            >
              <SectionCard
                title="Evolución por nivel educativo (2018 → 2024)"
                description="Series históricas completas por nivel educativo, incluyendo jóvenes y adultos/as. Todas las líneas cubren desde 2018 hasta 2024."
              >
                {/* GRID 2 COLS CON GRAFICOS + COLUMNA TEXTO A LA DERECHA EN DESKTOP */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      lg: "1fr 320px",
                    },
                    columnGap: { xs: 0, lg: 3 },
                  }}
                >
                  {/* Columna Izquierda: todos los gráficos en bloques apaisados */}
                  <Box
                    sx={{
                      display: "grid",
                      gap: { xs: 2, md: 3 },
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "1fr 1fr",
                      },
                      alignItems: "start",
                    }}
                  >
                    {/* Parvularia */}
                    <EduCard title="Educación Parvularia" height={300}>
                      <EduLineSimple
                        data={parvulariaData}
                        serieName="educacion_parvularia"
                        legendLabel="Educación Parvularia"
                        color={colorParvularia}
                      />
                    </EduCard>

                    {/* Básica Niños */}
                    <EduCard title="Enseñanza Básica (niños)" height={300}>
                      <EduLineSimple
                        data={basicaNinosData}
                        serieName="basica_ninos"
                        legendLabel="Enseñanza Básica Niños"
                        color={colorBasica}
                      />
                    </EduCard>

                    {/* Básica Adultos */}
                    <EduCard title="Educación Básica Adultos" height={300}>
                      <EduLineSimple
                        data={basicaAdultosData}
                        serieName="basica_adultos"
                        legendLabel="Educación Básica Adultos"
                        color={colorBasicaAdultos}
                      />
                    </EduCard>

                    {/* Especial */}
                    <EduCard title="Educación Especial" height={300}>
                      <EduLineSimple
                        data={especialData}
                        serieName="educacion_especial"
                        legendLabel="Educación Especial"
                        color={colorEspecial}
                      />
                    </EduCard>

                    {/* Media (jóvenes) */}
                    <EduCard title="Educación Media (jóvenes)" height={300}>
                      <EduLineDouble
                        serieA={mediaHCJovenes}
                        serieB={mediaTPJovenes}
                        labelA="Media HC Jóvenes"
                        labelB="Media TP Jóvenes"
                        colorA={colorMediaHC}
                        colorB={colorMediaTP}
                      />
                    </EduCard>

                    {/* Media Adultos/as */}
                    <EduCard title="Educación Media Adultos/as" height={300}>
                      <EduLineDouble
                        serieA={mediaHCAdultos}
                        serieB={mediaTPAdultos}
                        labelA="Media HC Adultos/as"
                        labelB="Media TP Adultos/as"
                        colorA={colorMediaHCAdultos}
                        colorB={colorMediaTPAdultos}
                      />
                    </EduCard>
                  </Box>

                  {/* Columna Derecha: textos largos de interpretación */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      pt: { xs: 3, lg: 14 }, // <<--- BAJAMOS MÁS LOS TEXTOS
                      px: { xs: 0, lg: 0 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: PALETA.textPrimary,
                        fontSize: { xs: "0.95rem", md: "1rem" },
                        lineHeight: 1.4,
                        mb: 1,
                      }}
                    >
                      Financiamiento y sostenibilidad
                    </Typography>

                    <Typography
                      sx={{
                        color: PALETA.textSecondary,
                        fontSize: { xs: "0.9rem", md: "0.95rem" },
                        lineHeight: 1.55,
                        textAlign: "justify",
                        mb: 3,
                      }}
                    >
                      El financiamiento es parte del mismo giro: un Estado
                      moderno debe asignar recursos con eficiencia y justicia,
                      superar el endeudamiento como regla y sacar a la banca del
                      centro de la política educativa. La deuda por estudiar
                      afecta a los hogares y tensiona la sostenibilidad del
                      sistema; alivios como “Chao Dicom” fueron pasos útiles,
                      pero no sustituyen la solución estructural.
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: PALETA.textPrimary,
                        fontSize: { xs: "0.95rem", md: "1rem" },
                        lineHeight: 1.4,
                        mb: 1,
                      }}
                    >
                      Para qué sirven estos datos
                    </Typography>

                    <Typography
                      sx={{
                        color: PALETA.textSecondary,
                        fontSize: { xs: "0.9rem", md: "0.95rem" },
                        lineHeight: 1.55,
                        textAlign: "justify",
                      }}
                    >
                      Con ese horizonte, esta sección ofrece datos para mirar el
                      panorama completo y orientar acuerdos: educación como
                      derecho social, en equilibrio con la libertad de
                      enseñanza, puesta al servicio de un futuro más justo y
                      democrático. Explora los gráficos, compara series y
                      territorios, y descarga las bases para producir tus propios
                      análisis; si publicas o compartes resultados, cita siempre
                      la fuente y el período de los datos para sostener una
                      conversación educativa informada y útil para la toma de
                      decisiones.
                    </Typography>
                  </Box>
                </Box>
              </SectionCard>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
