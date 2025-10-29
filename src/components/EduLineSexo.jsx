import React, { useId } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Box, Typography } from "@mui/material";

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

export default function EduLineSexo({ data }) {
  const baseId = useId();
  const titleId = `edu-line-sexo-title-${baseId}`;
  const capId = `edu-line-sexo-cap-${baseId}`;

  const noData = !data || !Array.isArray(data) || data.length === 0;

  if (noData) {
    return (
      <Box
        role="status"
        aria-live="polite"
        sx={{
          width: "100%",
          height: "100%",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: 14,
          color: "#555",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        No hay datos disponibles
      </Box>
    );
  }

  // [{anio, genero:[{sexo,matricula}, ...]}] -> [{anio, Hombre, Mujer, SinInfo}]
  const formatted = data.map((row) => {
    const out = { anio: row.anio, Hombre: 0, Mujer: 0, SinInfo: 0 };
    (row.genero || []).forEach((g) => {
      if (g.sexo === "Hombre") out.Hombre = g.matricula;
      else if (g.sexo === "Mujer") out.Mujer = g.matricula;
      else out.SinInfo = g.matricula;
    });
    return out;
  });

  return (
    <Box
      component="figure"
      aria-labelledby={titleId}
      aria-describedby={capId}
      sx={{ m: 0, width: "100%", height: "100%" }}
    >
      {/* Título accesible del gráfico (no visible) */}
      <Typography id={titleId} component="h3" sx={srOnly}>
        Matrícula por sexo y año: comparación Hombre, Mujer y Sin información
      </Typography>

      <ResponsiveContainer
        width="100%"
        height="100%"
        role="img"
        aria-label="Gráfico de líneas que compara matrícula por sexo a lo largo de los años."
        aria-describedby={capId}
      >
        <LineChart data={formatted} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
          <Legend
            verticalAlign="top"
            align="left"
            wrapperStyle={{ paddingBottom: "10px", fontSize: "13px" }}
          />
          <XAxis dataKey="anio" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value, name) => [
              Number(value).toLocaleString("es-CL"),
              name === "SinInfo" ? "Sin información" : name,
            ]}
            labelFormatter={(label) => `Año ${label}`}
          />
          <Line
            type="monotone"
            dataKey="Hombre"
            stroke="#1976d2"
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 1, fill: "#1976d2" }}
            activeDot={{ r: 5 }}
            name="Hombre"
          />
          <Line
            type="monotone"
            dataKey="Mujer"
            stroke="#6a1b9a"
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 1, fill: "#6a1b9a" }}
            activeDot={{ r: 5 }}
            name="Mujer"
          />
          <Line
            type="monotone"
            dataKey="SinInfo"
            stroke="#999999"
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 1, fill: "#999999" }}
            activeDot={{ r: 5 }}
            name="Sin información"
          />
        </LineChart>
      </ResponsiveContainer>

      <figcaption id={capId}>
        <Typography
          component="span"
          sx={{
            mt: 1,
            display: "inline-block",
            fontSize: { xs: "0.8rem", md: "0.85rem" },
            color: "#5A5D63",
            textAlign: "center",
          }}
        >
          Evolución anual de la matrícula por sexo. Incluye categoría “Sin información”.
        </Typography>
      </figcaption>
    </Box>
  );
}
