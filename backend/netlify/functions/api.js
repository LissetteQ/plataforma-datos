// backend/netlify/functions/api.js
const path = require("path");
require("dotenv").config({ path: path.join(process.cwd(), ".env") });

const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const axios = require("axios");

// ====== Servicios (tus módulos) ======
const trabajo = require("../../services/trabajoService");
const salud = require("../../services/saludService");
const educacion = require("../../services/educacionService");

const app = express();
app.use(cors());
app.use(express.json());

// ---------- Health ----------
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ===================================================================
// ==============   BANCO CENTRAL (alias /serie)   ====================
// ===================================================================
app.post("/api/banco-central/obtenerSerie", async (req, res) => {
  const { USER_BC, PASS_BC } = process.env;
  const { serieId, startDate, endDate } = req.body || {};

  if (!USER_BC || !PASS_BC) {
    return res.status(500).json({ error: "Faltan USER_BC / PASS_BC" });
  }

  const url = `https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx?user=${USER_BC}&pass=${PASS_BC}&function=GetSeries&timeseries=${serieId}&firstdate=${startDate}&lastdate=${endDate}`;
  try {
    const r = await axios.get(url);
    res.json(r.data);
  } catch (e) {
    console.error("❌ Banco Central:", e.message);
    res.status(500).json({ error: "No se pudo obtener datos del Banco Central" });
  }
});

app.post("/api/banco-central/serie", async (req, res) => {
  const { USER_BC, PASS_BC } = process.env;
  const { serieId, startDate, endDate } = req.body || {};

  if (!USER_BC || !PASS_BC) {
    return res.status(500).json({ error: "Faltan USER_BC / PASS_BC" });
  }

  const url = `https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx?user=${USER_BC}&pass=${PASS_BC}&function=GetSeries&timeseries=${serieId}&firstdate=${startDate}&lastdate=${endDate}`;
  try {
    const r = await axios.get(url);
    res.json(r.data);
  } catch (e) {
    console.error("❌ Banco Central (alias /serie):", e.message);
    res.status(500).json({ error: "No se pudo obtener datos del Banco Central (alias /serie)" });
  }
});

// ===================================================================
// =======================   TRABAJO   ================================
// ===================================================================
app.get("/api/trabajo/anual", async (_req, res) => {
  try {
    const data = await trabajo.getAnual();
    res.json(data);
  } catch (e) {
    console.error("❌ /trabajo/anual:", e);
    res.status(500).json({ error: "No se pudo obtener los datos anuales" });
  }
});

app.get("/api/trabajo/dataset", async (req, res) => {
  try {
    const data = await trabajo.getDataset(req.query);
    res.json(data);
  } catch (e) {
    console.error("❌ /trabajo/dataset:", e);
    res.status(500).json({ error: "No se pudo obtener el dataset" });
  }
});

app.get("/api/trabajo/tasas", async (req, res) => {
  try {
    const data = await trabajo.getTasas(req.query);
    res.json(data);
  } catch (e) {
    console.error("❌ /trabajo/tasas:", e);
    res.status(500).json({ error: "No se pudieron obtener las tasas" });
  }
});

app.get("/api/trabajo/piramide", async (req, res) => {
  try {
    const data = await trabajo.getPiramide(req.query);
    res.json(data);
  } catch (e) {
    console.error("❌ /trabajo/piramide:", e);
    res.status(500).json({ error: "No se pudo obtener la pirámide" });
  }
});

app.get("/api/trabajo/esi/ingresos", async (req, res) => {
  try {
    const rows = await trabajo.getESIIngresos({
      anioDesde: req.query.anioDesde ? Number(req.query.anioDesde) : undefined,
      anioHasta: req.query.anioHasta ? Number(req.query.anioHasta) : undefined,
    });
    res.json({ rows });
  } catch (e) {
    console.error("❌ /trabajo/esi/ingresos:", e);
    res.status(500).json({ error: "No se pudo obtener ESI ingresos" });
  }
});

app.get("/api/trabajo/meta", async (_req, res) => {
  try {
    const meta = await trabajo.getMeta();
    res.json({ ok: true, meta });
  } catch (e) {
    console.error("❌ /trabajo/meta:", e);
    res.status(500).json({ ok: false, error: "No se pudo leer meta" });
  }
});

// ===================================================================
// ========================   SALUD   =================================
// ===================================================================
app.get("/api/salud/beneficiarios", async (_req, res) => {
  try {
    const rows = await salud.getBeneficiarios();
    res.json({ rows });
  } catch (e) {
    console.error("❌ /salud/beneficiarios:", e);
    res.status(500).json({ error: "No se pudo obtener beneficiarios" });
  }
});

app.get("/api/salud/tipo", async (req, res) => {
  try {
    const data = await salud.getTipoBeneficiario({ year: req.query.year });
    res.json(data);
  } catch (e) {
    console.error("❌ /salud/tipo:", e);
    res.status(500).json({ error: "No se pudo obtener tipo de beneficiario" });
  }
});

app.get("/api/salud/sexo", async (req, res) => {
  try {
    const data = await salud.getSexo({ year: req.query.year });
    res.json(data);
  } catch (e) {
    console.error("❌ /salud/sexo:", e);
    res.status(500).json({ error: "No se pudo obtener distribución por sexo" });
  }
});

app.get("/api/salud/indicadores/:key", async (req, res) => {
  try {
    const rows = await salud.getIndicador(req.params.key);
    res.json({ rows });
  } catch (e) {
    console.error("❌ /salud/indicadores:", e);
    res.status(500).json({ error: "No se pudo obtener el indicador" });
  }
});

app.get("/api/salud/edad", async (req, res) => {
  try {
    const data = await salud.getEdad({ year: req.query.year });
    res.json(data);
  } catch (e) {
    console.error("❌ /salud/edad:", e);
    res.status(500).json({ error: "No se pudo obtener edad" });
  }
});

app.get("/api/salud/vigencia", async (req, res) => {
  try {
    const data = await salud.getVigencia({ year: req.query.year });
    res.json(data);
  } catch (e) {
    console.error("❌ /salud/vigencia:", e);
    res.status(500).json({ error: "No se pudo obtener vigencia" });
  }
});

app.get("/api/salud/region", async (req, res) => {
  try {
    const data = await salud.getRegion({ year: req.query.year });
    res.json(data);
  } catch (e) {
    console.error("❌ /salud/region:", e);
    res.status(500).json({ error: "No se pudo obtener región" });
  }
});

// ===================================================================
// =====================   EDUCACIÓN   ================================
// ===================================================================
app.get("/api/educacion/matricula/resumen", async (_req, res) => {
  try {
    const data = await educacion.getMatriculaResumen();
    res.json(data);
  } catch (e) {
    console.error("❌ /educacion/matricula/resumen:", e);
    res.status(500).json({ error: "No se pudo obtener el resumen" });
  }
});

app.get("/api/educacion/series", async (_req, res) => {
  try {
    const data = await educacion.getSeriesEducacion();
    res.json(data);
  } catch (e) {
    console.error("❌ /educacion/series:", e);
    res.status(500).json({ error: "No se pudo obtener las series" });
  }
});

app.get("/api/educacion/sexo", async (_req, res) => {
  try {
    const data = await educacion.getMatriculaSexo();
    res.json(data);
  } catch (e) {
    console.error("❌ /educacion/sexo:", e);
    res.status(500).json({ error: "No se pudo obtener la información por sexo" });
  }
});

// Export Netlify handler
module.exports.handler = serverless(app);