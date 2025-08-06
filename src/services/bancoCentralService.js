// src/services/bancoCentralService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/banco-central";

export const bancoCentralService = {
  getSerie: async (serieId, startDate, endDate) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/obtenerSerie`, {
        serieId,
        startDate,
        endDate,
      });
      return res.data;
    } catch (err) {
      console.error("Error en getSerie:", err);
      throw err;
    }
  },
};