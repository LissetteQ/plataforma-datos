import { Box, Typography } from "@mui/material";
import BloqueEconomico from "../components/BloqueEconomico";

const bloques = [
  {
    titulo: "Producto Interno Bruto (PIB)",
    descripcion:
      "El PIB mide el valor total de los bienes y servicios producidos en el país. Su evolución muestra el crecimiento o contracción de la economía.",
    series: [
      { id: "F032.PIB.FLU.R.CLP.2018.Z.Z.1.M", nombre: "PIB real 2018" },
      { id: "F032.PIB.FLU.N.CLP.EP18.Z.Z.0.T", nombre: "PIB nominal" },
      { id: "F032.PIB.PP.Z.USD.2018.Z.Z.0.A", nombre: "PIB per cápita USD" },
    ],
  },
  {
    titulo: "Índice Mensual de Actividad Económica (IMACEC)",
    descripcion:
      "El IMACEC refleja la evolución mensual de la actividad económica chilena. Es un buen anticipo del comportamiento del PIB.",
    series: [
      { id: "F032.IMC.IND.Z.Z.EP18.Z.Z.1.M", nombre: "Imacec desestacionalizado" },
      { id: "F032.IMC.IND.Z.Z.EP18.Z.Z.0.M", nombre: "Imacec serie empalmada" },
    ],
  },
  {
    titulo: "Índice de Precios al Consumidor (IPC)",
    descripcion:
      "El IPC mide la variación de los precios de bienes y servicios. Es el principal indicador de inflación en el país.",
    series: [
      { id: "F074.IPC.V12.Z.EP23.C.M", nombre: "IPC Variación Anual" },
      { id: "G073.IPCSV.V12.2023.M", nombre: "IPC Anual sin volátiles" },
      { id: "G073.IPCV.V12.2023.M", nombre: "IPC Anual volátiles" },
    ],
  },
  {
    titulo: "Deuda Pública",
    descripcion:
      "Este indicador muestra el nivel de endeudamiento del Estado y sus instituciones, en relación al tamaño de la economía.",
    series: [
      { id: "F051.D7.PPB.C.Z.Z.T", nombre: "Deuda bruta Gobierno Central" },
      { id: "F051.E7.PPB.H.Z.Z.T", nombre: "Deuda bruta Banco Central" },
    ],
  },
  {
    titulo: "Inserción Internacional",
    descripcion:
      "Agrupa indicadores relacionados con el comercio exterior de Chile: exportaciones, importaciones y balanza comercial.",
    series: [
      { id: "F068.B1.FLU.Z.0.C.N.Z.Z.Z.Z.6.3.T", nombre: "Exportaciones FOB" },
      { id: "F068.B1.FLU.Z.0.M.N.0.Z.Z.Z.6.3.T", nombre: "Importaciones CIF" },
      { id: "F068.B1.VAR.T0.0.S.N.Z.Z.Z.Z.6.0.M", nombre: "Balanza Comercial Mensual" },
    ],
  },
];

const Macroeconomia = () => {
  const secciones = bloques.map((bloque) => ({
    id: bloque.titulo.toLowerCase().replace(/\s/g, "-"),
    label: bloque.titulo,
  }));

  return (
    <Box p={3}>
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          bgcolor: "background.paper",
          mb: 2,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          p: 1,
          borderBottom: "1px solid #ddd",
        }}
      >
        {secciones.map((sec) => (
          <a key={sec.id} href={`#${sec.id}`} style={{ textDecoration: "none" }}>
            <Typography variant="button" color="primary" sx={{ mr: 2 }}>
              {sec.label}
            </Typography>
          </a>
        ))}
      </Box>

      <Typography variant="h4" gutterBottom>
        Indicadores Macroeconómicos de Chile
      </Typography>

      {bloques.map((bloque) => (
        <Box id={bloque.titulo.toLowerCase().replace(/\s/g, "-")}
             key={bloque.titulo}>
          <BloqueEconomico
            titulo={bloque.titulo}
            descripcion={bloque.descripcion}
            series={bloque.series}
          />
        </Box>
      ))}
    </Box>
  );
};

export default Macroeconomia;