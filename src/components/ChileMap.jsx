import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import comunas from '../Data/comunas.geojson';
import gruposEconomicosMock from '../mocks/gruposEconomicosMock';

const coloresCategoria = {
  "E": "#8B0000",     // Muy bajo
  "D": "#FF0000",     // Bajo
  "C3": "#FFB400",    // Medio bajo
  "C2": "#FFE066",    // Medio alto
  "C1": "#75B5FF",    // Alto
  "AB": "#003399"     // Muy alto
};

const srOnly = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

const ChileMap = ({ selectedCategories = [] }) => {
  const getCategoriaForComuna = (codigo) => {
    const match = gruposEconomicosMock.find(c => c.codigo_comuna === codigo);
    return match ? match.grupo : null;
  };

  const getColorForComuna = (codigo) => {
    const categoria = getCategoriaForComuna(codigo);
    if (!categoria) return '#EEEEEE';
    if (selectedCategories.length && !selectedCategories.includes(categoria)) return '#EEEEEE';
    return coloresCategoria[categoria] || '#CCCCCC';
  };

  const titleId = "mapa-grupos-title";
  const legendId = "mapa-grupos-legend";

  return (
    <Box
      component="section"
      role="region"
      aria-labelledby={titleId}
      sx={{
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 2,
        backgroundColor: '#fff',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Título accesible (sr-only) para la región */}
      <Typography id={titleId} component="h2" sx={srOnly}>
        Distribución de grupos económicos en la Región Metropolitana
      </Typography>

      {/* Encabezado visual */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          textAlign: 'center',
          fontWeight: 600,
          textTransform: 'uppercase',
        }}
      >
        Distribución Grupos Económicos RM
      </Typography>

      {/* Leyenda textual (no visible), referenciada por aria-describedby */}
      <Box id={legendId} sx={srOnly}>
        Leyenda de colores por grupo económico: 
        AB (Muy alto) azul oscuro, C1 (Alto) celeste, C2 (Medio alto) amarillo claro,
        C3 (Medio bajo) ámbar, D (Bajo) rojo, E (Muy bajo) rojo oscuro.
        Comunas sin datos o filtradas se muestran en gris.
      </Box>

      <Paper
        sx={{
          overflow: 'auto',
          p: 1,
          width: '100%',
          maxWidth: '800px',
          height: 'auto',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          component="figure"
          role="img"
          aria-describedby={legendId}
          aria-label="Mapa de la Región Metropolitana con comunas coloreadas según grupo económico"
          sx={{ m: 0, width: '100%' }}
        >
          <ComposableMap
            projection="geoMercator"
            width={500}
            height={700}
            projectionConfig={{
              scale: 800,
              center: [-71, -35]
            }}
            style={{ width: '100%', height: 'auto' }}
          >
            <Geographies geography={comunas}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const codigo = geo.properties.codigo_comuna;
                  const nombre = geo.properties.nombre || geo.properties.NOM_COM || "Comuna";
                  const categoria = getCategoriaForComuna(codigo);
                  const color = getColorForComuna(codigo);

                  const filtrada =
                    selectedCategories.length > 0 &&
                    categoria &&
                    !selectedCategories.includes(categoria);

                  const etiquetaCategoria = categoria
                    ? (
                        categoria === "AB" ? "Muy alto" :
                        categoria === "C1" ? "Alto" :
                        categoria === "C2" ? "Medio alto" :
                        categoria === "C3" ? "Medio bajo" :
                        categoria === "D"  ? "Bajo" :
                        categoria === "E"  ? "Muy bajo" :
                        "Sin categoría"
                      )
                    : "Sin datos";

                  return (
                    <Geography
                      key={codigo}
                      geography={geo}
                      fill={color}
                      stroke="#FFFFFF"
                      style={{
                        default: { outline: "none" },
                        hover: { stroke: "#666", outline: "none" },
                        pressed: { outline: "none" }
                      }}
                      tabIndex={0}
                      aria-label={`${nombre}: ${etiquetaCategoria}`}
                      aria-hidden={filtrada ? "true" : undefined}
                      title={`${nombre}: ${etiquetaCategoria}`}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>

          {/* Pie del mapa (visible) */}
          <figcaption>
            <Typography
              component="span"
              sx={{
                mt: 1,
                display: 'inline-block',
                fontSize: { xs: '0.8rem', md: '0.85rem' },
                color: '#6B7280',
                textAlign: 'center',
              }}
            >
              Fuente: agrupación mock de grupos económicos por comuna (ejemplo).
            </Typography>
          </figcaption>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChileMap;
