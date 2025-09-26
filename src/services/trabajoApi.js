// src/services/trabajoApi.js
import axios from "axios";

const API_BASE =
  (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim()) ||
  "http://localhost:5000/api";

const api = axios.create({ baseURL: API_BASE, timeout: 15000 });

const safe = async (fn) => {
  try { return await fn(); }
  catch (err) {
    console.error("[trabajoApi] Error:", err?.message || err);
    return { rows: [] };
  }
};

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
      serieId, startDate, endDate,
    });
    return data;
  });

/* ===== NUEVO: ESI Ingresos ===== */

const seriesFromDataset = (ds = []) => {
  const acc = new Map();
  ds.forEach((r) => {
    const a = Number(r.anio);
    if (!Number.isFinite(a)) return;
    const key = r.sexo === "Hombre" ? "Hombres" : "Mujeres";
    if (!acc.has(a)) acc.set(a, { Hombres: { s: 0, c: 0 }, Mujeres: { s: 0, c: 0 } });
    const slot = acc.get(a)[key];
    const v = Number(r.ingreso_promedio ?? 0);
    if (Number.isFinite(v)) { slot.s += v; slot.c += 1; }
  });
  return Array.from(acc.entries()).map(([anio, g]) => {
    const hombres = g.Hombres.c ? Math.round(g.Hombres.s / g.Hombres.c) : null;
    const mujeres = g.Mujeres.c ? Math.round(g.Mujeres.s / g.Mujeres.c) : null;
    const total = (hombres != null && mujeres != null)
      ? Math.round((hombres + mujeres) / 2)
      : (hombres ?? mujeres ?? null);
    return { anio, total, hombres, mujeres };
  }).sort((a, b) => a.anio - b.anio);
};

export const getESIIngresos = async (params = {}) =>
  safe(async () => {
    // 1) Intento principal
    try {
      const { data } = await api.get("/trabajo/esi/ingresos", { params });
      const rows = Array.isArray(data) ? data : (data?.rows ?? []);
      if (Array.isArray(rows) && rows.length) return rows;
    } catch (e) {
      console.warn("[getESIIngresos] endpoint ESI falló, usando fallback dataset");
    }
    // 2) Fallback: construir desde dataset del backend
    const ds = await getDataset();
    return seriesFromDataset(ds);
  });

export const getESIIngresosUltimo = async () => {
  const rows = await getESIIngresos();
  if (!Array.isArray(rows) || rows.length === 0) {
    return { anio: null, total: null, hombres: null, mujeres: null };
  }
  return rows.reduce((a, b) => (a.anio > b.anio ? a : b));
};
