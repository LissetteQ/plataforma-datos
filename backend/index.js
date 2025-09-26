// backend/index.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

// Servicios (datos mock + ESI desde CSV/fallback)
const {
  getAnual,
  getDataset,
  getTasas,
  getPiramide,
  getESIIngresos,
} = require("./services/trabajoService");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ----------------------- Healthcheck -----------------------
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ----------------------- Banco Central (original + alias) -----------------------
app.post("/api/banco-central/obtenerSerie", async (req, res) => {
  const { USER_BC, PASS_BC } = process.env;
  const { serieId, startDate, endDate } = req.body;

  const url = `https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx?user=${USER_BC}&pass=${PASS_BC}&function=GetSeries&timeseries=${serieId}&firstdate=${startDate}&lastdate=${endDate}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error al obtener datos:", error.message);
    res.status(500).json({ error: "No se pudo obtener datos del Banco Central" });
  }
});

app.post("/api/banco-central/serie", async (req, res) => {
  const { USER_BC, PASS_BC } = process.env;
  const { serieId, startDate, endDate } = req.body;

  const url = `https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx?user=${USER_BC}&pass=${PASS_BC}&function=GetSeries&timeseries=${serieId}&firstdate=${startDate}&lastdate=${endDate}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error al obtener datos (alias /serie):", error.message);
    res.status(500).json({ error: "No se pudo obtener datos del Banco Central (alias /serie)" });
  }
});

// ----------------------- Trabajo -----------------------
app.get("/api/trabajo/anual", async (_req, res) => {
  try {
    const data = await getAnual(); // -> { rows: [...] }
    res.json(data);
  } catch (e) {
    console.error("❌ /trabajo/anual:", e);
    res.status(500).json({ error: "No se pudo obtener los datos anuales de trabajo" });
  }
});

app.get("/api/trabajo/dataset", async (_req, res) => {
  try {
    const data = await getDataset();
    res.json(data);
  } catch (e) {
    console.error("❌ /trabajo/dataset:", e);
    res.status(500).json({ error: "No se pudo obtener el dataset de trabajo" });
  }
});

app.get("/api/trabajo/tasas", async (req, res) => {
  try {
    const { periodo, sexo } = req.query;
    const data = await getTasas({ periodo, sexo });
    res.json(data);
  } catch (e) {
    console.error("❌ /trabajo/tasas:", e);
    res.status(500).json({ error: "No se pudieron obtener las tasas" });
  }
});

app.get("/api/trabajo/piramide", async (req, res) => {
  try {
    const { periodo } = req.query;
    const data = await getPiramide({ periodo });
    res.json(data);
  } catch (e) {
    console.error("❌ /trabajo/piramide:", e);
    res.status(500).json({ error: "No se pudo obtener la pirámide" });
  }
});

// ----------------------- NUEVO: ESI Ingresos -----------------------
// Devuelve { rows: [{ anio, total, hombres, mujeres }, ...] }
app.get("/api/trabajo/esi/ingresos", async (req, res) => {
  try {
    const { anioDesde, anioHasta } = req.query;
    const rows = await getESIIngresos({
      anioDesde: anioDesde ? Number(anioDesde) : undefined,
      anioHasta: anioHasta ? Number(anioHasta) : undefined,
    });
    res.json({ rows });
  } catch (e) {
    console.error("❌ /trabajo/esi/ingresos:", e);
    res.status(500).json({ error: "No se pudo obtener ESI ingresos" });
  }
});

// ----------------------- Server -----------------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor Backend escuchando en http://localhost:${PORT}`);
});
