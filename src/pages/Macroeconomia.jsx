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
  {
    titulo: "Tasa de Interés (TPM)",
    descripcion:
      "La Tasa de Política Monetaria (TPM) es definida por el Banco Central y orienta el costo del crédito en la economía. Es un instrumento clave de política monetaria.",
    series: [
      { id: "F022.TPM.TIN.D001.NO.Z.D", nombre: "TPM diaria" },
      { id: "F022.TPM.TIN.M001.NO.Z.M", nombre: "TPM mensual" },
    ],
  },
];

const Macroeconomia = () => {
  const secciones = bloques.map((bloque) => ({
    id: bloque.titulo.toLowerCase().replace(/\s/g, "-"),
    label: bloque.titulo,
  }));

  return (
    <Box p={{ xs: 2, md: 4 }}>
      {/* Título */}
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
        Indicadores Macroeconómicos de Chile
      </Typography>

      {/* Texto explicativo centrado y justificado */}
      <Typography
        variant="body1"
        sx={{
          mb: 4,
          color: 'text.secondary',
          maxWidth: '92%',
          mx: 'auto',
          textAlign: 'justify',
        }}
      >
        En esta sección se presentan los principales indicadores macroeconómicos de Chile a través de gráficos interactivos. Los datos son extraídos directamente desde el Banco Central de Chile y permiten analizar la evolución del Producto Interno Bruto (PIB), la actividad económica (IMACEC), la inflación (IPC), la deuda pública y el comercio exterior del país.
        <br /><br />
        Cada bloque temático incluye una breve descripción y diferentes series estadísticas que pueden visualizarse según su periodicidad y categoría. Esta visualización facilita la comprensión del desempeño económico nacional en distintas dimensiones y períodos.
      </Typography>

      {/* Menú de navegación interno en una sola fila con scroll horizontal */}
      <Box
        sx={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          bgcolor: "background.paper",
          mb: 3,
          px: 2,
          py: 1,
          borderBottom: "1px solid #ddd",
          display: "flex",
          flexWrap: "nowrap",
          alignItems: "center",
          gap: 3,
        }}
      >
        {secciones.map((sec) => (
          <a key={sec.id} href={`#${sec.id}`} style={{ textDecoration: "none" }}>
            <Typography
              variant="button"
              color="primary"
              sx={{
                whiteSpace: "nowrap",
                fontWeight: 500,
              }}
            >
              {sec.label}
            </Typography>
          </a>
        ))}
      </Box>

      {/* Bloques con gráficos */}
      {bloques.map((bloque) => (
        <Box
          id={bloque.titulo.toLowerCase().replace(/\s/g, "-")}
          key={bloque.titulo}
        >
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
