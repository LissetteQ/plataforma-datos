// src/services/saludService.js
import axios from "axios";

/*
Cómo resolvemos la URL base:
- Si existe process.env.REACT_APP_API_BASE_URL lo usamos (por ejemplo en build).
- Si en index.html seteas window.__API_BASE_URL__ = "https://tu-backend" también lo tomamos.
- Si nada de lo anterior existe, usamos http://localhost:5000.
*/
const API =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.REACT_APP_API_BASE_URL) ||
  (typeof window !== "undefined" && window.__API_BASE_URL__) ||
  "http://localhost:5000";

// ===================== ENDPOINTS =========================

// /api/salud/beneficiarios
// -> { rows: [{ anio, fonasa, isapre }, ...] }
export async function obtenerBeneficiarios() {
  const { data } = await axios.get(`${API}/api/salud/beneficiarios`);
  return data.rows;
}

// /api/salud/tipo?year=2024
// -> { year, rows:[ { sistema:'FONASA', Titular:..., Carga:...}, ... ] }
export async function obtenerTipo(year) {
  const { data } = await axios.get(`${API}/api/salud/tipo`, {
    params: { year },
  });
  return data;
}

// /api/salud/sexo?year=2024
// -> { year, fonasa:[{name,value}..], isapre:[...] }
export async function obtenerSexo(year) {
  const { data } = await axios.get(`${API}/api/salud/sexo`, {
    params: { year },
  });
  return data;
}

// /api/salud/indicadores/:key
// Keys esperadas:
//   publico_privado_pib
//   salud_total_pib
//   per_capita_constante
//   per_capita_corriente
//   per_capita_ppa
//
// Devuelve [{ anio, publico?, privado?, valor? }, ...]
export async function obtenerIndicador(key) {
  const { data } = await axios.get(`${API}/api/salud/indicadores/${key}`);
  return data.rows;
}

// /api/salud/edad?year=YYYY
export async function obtenerEdad(year) {
  const { data } = await axios.get(`${API}/api/salud/edad`, {
    params: { year },
  });
  return data; // { ok, year, rows } | { ok:false, message }
}

// /api/salud/vigencia?year=YYYY
export async function obtenerVigencia(year) {
  const { data } = await axios.get(`${API}/api/salud/vigencia`, {
    params: { year },
  });
  return data;
}

// /api/salud/region?year=YYYY
export async function obtenerRegion(year) {
  const { data } = await axios.get(`${API}/api/salud/region`, {
    params: { year },
  });
  return data;
}

// Utilidad para formato miles en las tarjetas KPI
export const formatMiles = (v) =>
  typeof v === "number" ? v.toLocaleString("es-CL") : v;