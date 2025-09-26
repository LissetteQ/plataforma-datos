// src/components/ESIIngresosKPIs.jsx
import React, { useEffect, useState } from "react";
import { Grid, Paper, Box, Typography } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import { getESIIngresosUltimo } from "../services/trabajoApi";

const fmt = (n) =>
  n == null ? "—" : Number(Math.round(n)).toLocaleString("es-CL", { maximumFractionDigits: 0 });

export default function ESIIngresosKPIs() {
  const [last, setLast] = useState({ anio: null, total: null, hombres: null, mujeres: null });

  useEffect(() => {
    getESIIngresosUltimo().then(setLast);
  }, []);

  const items = [
    { icon: PaidIcon,  color: "#0b4582", title: "Ingreso medio (ESI)",     value: `$${fmt(last.total)}`,   subtitle: last.anio ? `Año ${last.anio}` : "Cargando…" },
    { icon: ManIcon,   color: "#1565c0", title: "Ingreso medio — Hombres", value: `$${fmt(last.hombres)}`, subtitle: last.anio ? `Año ${last.anio}` : "Cargando…" },
    { icon: WomanIcon, color: "#c2185b", title: "Ingreso medio — Mujeres", value: `$${fmt(last.mujeres)}`, subtitle: last.anio ? `Año ${last.anio}` : "Cargando…" },
  ];

  return (
    <Grid container spacing={3} justifyContent="center">
      {items.map((item, i) => (
        <Grid key={i} item xs={12} sm={6} md={4}>
          <Paper elevation={2} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1, borderRadius: 2, minHeight: 110 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <item.icon sx={{ color: item.color, fontSize: 24 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{item.title}</Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{item.value}</Typography>
            <Typography variant="body2" color="text.secondary">{item.subtitle}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
