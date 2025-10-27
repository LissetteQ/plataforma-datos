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

export default function EduLineSimple({ data, serieName, color, legendLabel }) {
  if (!data || data.length === 0) {
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

  const formattedData = data.map((d) => ({
    anio: d.anio,
    valor: d.valor,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={formattedData}
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
            {
              id: serieName,
              type: "circle",
              value: legendLabel,
              color,
            },
          ]}
        />
        <XAxis dataKey="anio" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value) => value.toLocaleString("es-CL")}
          labelFormatter={(label) => `Año ${label}`}
        />
        <Line
          type="monotone"
          dataKey="valor"
          stroke={color}
          strokeWidth={2}
          dot={{ r: 3, strokeWidth: 1, fill: color }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}