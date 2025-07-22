require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api/banco-central", async (req, res) => {
  const { USER_BC, PASS_BC, SERIE_ID, FIRST_DATE, LAST_DATE } = process.env;

  const url = `https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx?user=${USER_BC}&pass=${PASS_BC}&function=GetSeries&timeseries=${SERIE_ID}&firstdate=${FIRST_DATE}&lastdate=${LAST_DATE}`;

  try {
    const response = await axios.get(url);
    console.log("Respuesta de Banco Central:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error al obtener datos del Banco Central:", error.message);
    res.status(500).json({ error: "Error al obtener datos del Banco Central" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});