import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Box } from "@mui/material";

export default function EduLineDouble({
  serieA,
  serieB,
  labelA,
  labelB,
  colorA,
  colorB,
}) {
  if (
    !serieA ||
    !serieB ||
    serieA.length === 0 ||
    serieB.length === 0
  ) {
    return (
      <Box
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

  const byYear = {};
  serieA.forEach((p) => {
    byYear[p.anio] = { anio: p.anio, A: p.valor };
  });
  serieB.forEach((p) => {
    if (!byYear[p.anio]) byYear[p.anio] = { anio: p.anio };
    byYear[p.anio].B = p.valor;
  });

  const data = Object.values(byYear).sort((a, b) => a.anio - b.anio);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
      >
        <Legend
          verticalAlign="top"
          align="left"
          wrapperStyle={{
            paddingBottom: "10px",
            fontSize: "13px",
          }}
          payload={[
            { id: "A", type: "circle", value: labelA, color: colorA },
            { id: "B", type: "circle", value: labelB, color: colorB },
          ]}
        />
        <XAxis dataKey="anio" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value) => value?.toLocaleString("es-CL")}
          labelFormatter={(label) => `Año ${label}`}
        />
        <Line
          type="monotone"
          dataKey="A"
          stroke={colorA}
          strokeWidth={2}
          dot={{ r: 3, strokeWidth: 1, fill: colorA }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="B"
          stroke={colorB}
          strokeWidth={2}
          dot={{ r: 3, strokeWidth: 1, fill: colorB }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}