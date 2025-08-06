// backend/index.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Ruta para obtener una sola serie desde el Banco Central
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

// Servidor activo
app.listen(PORT, () => {
  console.log(`🚀 Servidor Backend escuchando en http://localhost:${PORT}`);
});