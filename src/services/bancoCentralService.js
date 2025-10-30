import axios from "axios";

// ✅ Usa variable de entorno en producción, localhost solo si no existe
const API_BASE_URL =
  process.env.REACT_APP_API_URL
  ? `https://${window.location.hostname}:5000/api/banco-central`
    // ? `${process.env.REACT_APP_API_URL}/banco-central`
    : "http://localhost:5000/api/banco-central";

export const bancoCentralService = {
  getSerie: async (serieId, startDate, endDate) => {
    try {
      console.log("hola", process.env.SITE_NAME);
      debugger;
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