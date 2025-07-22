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

  return (
    <Box
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
              geographies.map((geo) => (
                <Geography
                  key={geo.properties.codigo_comuna}
                  geography={geo}
                  fill={getColorForComuna(geo.properties.codigo_comuna)}
                  stroke="#FFFFFF"
                  style={{
                    default: { outline: "none" },
                    hover: { stroke: "#666", outline: "none" },
                    pressed: { outline: "none" }
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </Paper>
    </Box>
  );
};

export default ChileMap;
