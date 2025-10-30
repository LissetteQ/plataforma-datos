// src/services/trabajoApi.js
import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000/api";
    
const api = axios.create({ baseURL: API_BASE, timeout: 15000 });

const safe = async (fn, fallback = []) => {
  try {
    return await fn();
  } catch (err) {
    console.error("[trabajoApi] Error:", err?.message || err);
    return fallback;
  }
};

/* ===== Datos ENE ===== */

export const getAnual = async () =>
  safe(async () => {
    const { data } = await api.get("/trabajo/anual");
    return data?.rows ?? [];
  });

export const getDataset = async () =>
  safe(async () => {
    const { data } = await api.get("/trabajo/dataset");
    return data?.rows ?? [];
  });

export const getTasas = async (params = {}) =>
  safe(async () => {
    const { data } = await api.get("/trabajo/tasas", { params });
    return data?.rows ?? [];
  });

export const getPiramide = async (params = {}) =>
  safe(async () => {
    const { data } = await api.get("/trabajo/piramide", { params });
    return data?.rows ?? [];
  });

export const getSerieBC = async ({ serieId, startDate = "", endDate = "" }) =>
  safe(async () => {
    const { data } = await api.post("/banco-central/serie", {
      serieId,
      startDate,
      endDate,
    });
    return data;
  });

/* ===== Helpers de ingresos (ESI) ===== */

// Calcula promedios H/M/Total por año desde el dataset crudo (fallback)
const seriesFromDataset = (ds = []) => {
  const acc = new Map();
  ds.forEach((r) => {
    const a = Number(r.anio);
    if (!Number.isFinite(a)) return;

    const sexo = String(r.sexo || "").trim();
    const v = Number(r.ingreso_promedio ?? NaN);
    if (!Number.isFinite(v)) return;

    if (!acc.has(a)) {
      acc.set(a, {
        Hombres: { s: 0, c: 0 },
        Mujeres: { s: 0, c: 0 },
      });
    }

    if (sexo === "Hombre") {
      acc.get(a).Hombres.s += v;
      acc.get(a).Hombres.c += 1;
    } else if (sexo === "Mujer") {
      acc.get(a).Mujeres.s += v;
      acc.get(a).Mujeres.c += 1;
    }
  });

  return Array.from(acc.entries())
    .map(([anio, g]) => {
      const hombres = g.Hombres.c ? Math.round(g.Hombres.s / g.Hombres.c) : null;
      const mujeres = g.Mujeres.c ? Math.round(g.Mujeres.s / g.Mujeres.c) : null;

      const total =
        hombres != null && mujeres != null
          ? Math.round((hombres + mujeres) / 2)
          : hombres ?? mujeres ?? null;

      return { anio, total, hombres, mujeres };
    })
    .sort((a, b) => a.anio - b.anio);
};

// IMPORTANTE: versión robusta
export const getESIIngresos = async (params = {}) => {
  // 1) Intentar backend oficial
  try {
    const { data } = await api.get("/trabajo/esi/ingresos", { params });

    // backend puede ser { rows: [...] } o directamente [...]
    const rowsFromBackend = Array.isArray(data) ? data : data?.rows ?? [];

    if (rowsFromBackend.length > 0) {
      return rowsFromBackend;
    }

    console.warn(
      "[getESIIngresos] Backend respondió pero sin filas, usando fallback dataset."
    );
  } catch (e) {
    console.warn(
      "[getESIIngresos] /trabajo/esi/ingresos no disponible, usando fallback dataset.",
      e?.message
    );
  }

  // 2) Fallback: calculado desde el dataset general
  const ds = await getDataset();
  return seriesFromDataset(ds);
};

// último año disponible para las tarjetas KPI
export const getESIIngresosUltimo = async () => {
  const rows = await getESIIngresos();
  if (!Array.isArray(rows) || rows.length === 0) {
    return { anio: null, total: null, hombres: null, mujeres: null };
  }
  return rows.reduce((a, b) => (a.anio > b.anio ? a : b));
};

// ✅ Export por defecto con variable nombrada (evita import/no-anonymous-default-export)
const trabajoApi = {
  getAnual,
  getDataset,
  getTasas,
  getPiramide,
  getSerieBC,
  getESIIngresos,
  getESIIngresosUltimo,
};

export default trabajoApi;
