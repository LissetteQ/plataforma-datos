// backend/services/trabajoService.js


const fs = require("fs");
const path = require("path");

// ====================== FUENTES EN MEMORIA (mock) ======================
const TRABAJO_ANUAL = [
  { anio: 2018, ingreso_promedio: 620000, fuerza_laboral: 4180000, tasa_desempleo: 8.2 },
  { anio: 2019, ingreso_promedio: 640000, fuerza_laboral: 4360000, tasa_desempleo: 8.7 },
  { anio: 2020, ingreso_promedio: 585000, fuerza_laboral: 3980000, tasa_desempleo: 11.3 },
  { anio: 2021, ingreso_promedio: 610000, fuerza_laboral: 4220000, tasa_desempleo: 9.1 },
  { anio: 2022, ingreso_promedio: 655000, fuerza_laboral: 4300000, tasa_desempleo: 7.9 },
  { anio: 2023, ingreso_promedio: 670000, fuerza_laboral: 4239000, tasa_desempleo: 8.5 },
  { anio: 2024, ingreso_promedio: 690000, fuerza_laboral: 4250000, tasa_desempleo: 7.6 },
];

const TRABAJO_DATASET = [
  { anio: 2023, mes: 6, region: "Metropolitana", sexo: "Hombre", tramo_edad: "25-34", sector: "Servicios",  tasa_ocupacion: 65.4, tasa_desempleo: 8.2, ingreso_promedio: 720000, cotiza_prevision: 1, cotiza_salud: 1, jornada: "Completa" },
  { anio: 2023, mes: 6, region: "Metropolitana", sexo: "Mujer",  tramo_edad: "25-34", sector: "Servicios",  tasa_ocupacion: 55.1, tasa_desempleo: 9.3, ingreso_promedio: 650000, cotiza_prevision: 1, cotiza_salud: 1, jornada: "Completa" },
  { anio: 2023, mes: 6, region: "Biobío",       sexo: "Hombre",  tramo_edad: "35-44", sector: "Industria",  tasa_ocupacion: 68.2, tasa_desempleo: 7.5, ingreso_promedio: 710000, cotiza_prevision: 1, cotiza_salud: 1, jornada: "Completa" },
  { anio: 2023, mes: 6, region: "Biobío",       sexo: "Mujer",   tramo_edad: "35-44", sector: "Industria",  tasa_ocupacion: 52.3, tasa_desempleo: 10.1, ingreso_promedio: 590000, cotiza_prevision: 0, cotiza_salud: 1, jornada: "Parcial" },
  { anio: 2024, mes: 6, region: "Metropolitana", sexo: "Hombre",  tramo_edad: "25-34", sector: "Servicios",  tasa_ocupacion: 66.2, tasa_desempleo: 7.9, ingreso_promedio: 740000, cotiza_prevision: 1, cotiza_salud: 1, jornada: "Completa" },
  { anio: 2024, mes: 6, region: "Metropolitana", sexo: "Mujer",   tramo_edad: "25-34", sector: "Servicios",  tasa_ocupacion: 57.0, tasa_desempleo: 8.8, ingreso_promedio: 670000, cotiza_prevision: 1, cotiza_salud: 1, jornada: "Completa" },
  { anio: 2024, mes: 6, region: "Biobío",       sexo: "Hombre",  tramo_edad: "35-44", sector: "Industria",  tasa_ocupacion: 69.0, tasa_desempleo: 7.0, ingreso_promedio: 730000, cotiza_prevision: 1, cotiza_salud: 1, jornada: "Completa" },
  { anio: 2024, mes: 6, region: "Biobío",       sexo: "Mujer",   tramo_edad: "35-44", sector: "Industria",  tasa_ocupacion: 53.5, tasa_desempleo: 9.6, ingreso_promedio: 600000, cotiza_prevision: 0, cotiza_salud: 1, jornada: "Parcial" },
];

const TRABAJO_TASAS = [
  { periodo: "2023T2", sexo: "Nacional", td: 8.5, to: 56.3, tp: 61.5, tpl: 22.1, su1: 10.4, su2: 14.2, su3: 17.6, su4: 21.0, toi: 27.5, tosi: 18.2 },
  { periodo: "2023T2", sexo: "Hombre",   td: 7.9, to: 63.0, tp: 69.1, tpl: 21.0, su1:  9.8, su2: 13.6, su3: 16.8, su4: 20.2, toi: 25.0, tosi: 16.5 },
  { periodo: "2023T2", sexo: "Mujer",    td: 9.3, to: 50.1, tp: 54.7, tpl: 23.5, su1: 11.2, su2: 15.1, su3: 18.7, su4: 22.1, toi: 30.3, tosi: 20.1 },
  { periodo: "2024T2", sexo: "Nacional", td: 7.8, to: 57.4, tp: 62.8, tpl: 21.4, su1:  9.6, su2: 13.5, su3: 16.9, su4: 20.3, toi: 26.1, tosi: 17.4 },
  { periodo: "2024T2", sexo: "Hombre",   td: 7.0, to: 64.2, tp: 70.0, tpl: 20.6, su1:  8.9, su2: 12.7, su3: 16.0, su4: 19.4, toi: 24.0, tosi: 15.9 },
  { periodo: "2024T2", sexo: "Mujer",    td: 8.8, to: 51.3, tp: 55.8, tpl: 22.9, su1: 10.6, su2: 14.6, su3: 17.9, su4: 21.5, toi: 28.5, tosi: 19.0 },
];

const TRABAJO_PIRAMIDE = [
  { periodo: "2024T2", sexo: "Hombre", tramo_edad: "15-24", pet: 380000, fdt: 220000, oc: 200000, des: 20000, id: 15000, tpi: 18000, obe: 22000, ftp: 60000, fta: 295000, fft: 160000, oi: 60000, osi: 45000 },
  { periodo: "2024T2", sexo: "Hombre", tramo_edad: "25-34", pet: 520000, fdt: 420000, oc: 390000, des: 30000, id: 18000, tpi: 22000, obe: 26000, ftp: 40000, fta: 458000, fft: 100000, oi: 80000, osi: 60000 },
  { periodo: "2024T2", sexo: "Hombre", tramo_edad: "35-44", pet: 500000, fdt: 420000, oc: 395000, des: 25000, id: 14000, tpi: 15000, obe: 20000, ftp: 35000, fta: 469000, fft:  90000, oi: 70000, osi: 52000 },
  { periodo: "2024T2", sexo: "Hombre", tramo_edad: "45-54", pet: 480000, fdt: 390000, oc: 368000, des: 22000, id: 12000, tpi: 13000, obe: 16000, ftp: 34000, fta: 436000, fft:  90000, oi: 68000, osi: 50000 },
  { periodo: "2024T2", sexo: "Hombre", tramo_edad: "55-64", pet: 420000, fdt: 300000, oc: 277000, des: 23000, id: 11000, tpi: 12000, obe: 15000, ftp: 38000, fta: 349000, fft: 120000, oi: 62000, osi: 44000 },
  { periodo: "2024T2", sexo: "Mujer",  tramo_edad: "15-24", pet: 370000, fdt: 210000, oc: 186000, des: 24000, id: 17000, tpi: 21000, obe: 26000, ftp: 70000, fta: 297000, fft: 160000, oi: 68000, osi: 52000 },
  { periodo: "2024T2", sexo: "Mujer",  tramo_edad: "25-34", pet: 540000, fdt: 390000, oc: 356000, des: 34000, id: 21000, tpi: 26000, obe: 30000, ftp: 52000, fta: 463000, fft: 130000, oi: 86000, osi: 65000 },
  { periodo: "2024T2", sexo: "Mujer",  tramo_edad: "35-44", pet: 510000, fdt: 370000, oc: 336000, des: 34000, id: 19000, tpi: 23000, obe: 28000, ftp: 50000, fta: 439000, fft: 140000, oi: 74000, osi: 56000 },
  { periodo: "2024T2", sexo: "Mujer",  tramo_edad: "45-54", pet: 490000, fdt: 340000, oc: 309000, des: 31000, id: 17000, tpi: 20000, obe: 24000, ftp: 52000, fta: 409000, fft: 150000, oi: 72000, osi: 54000 },
  { periodo: "2024T2", sexo: "Mujer",  tramo_edad: "55-64", pet: 430000, fdt: 270000, oc: 241000, des: 29000, id: 16000, tpi: 18000, obe: 22000, ftp: 56000, fta: 341000, fft: 160000, oi: 70000, osi: 52000 },
];

// Helper
const ok = (rows) => ({ rows: Array.isArray(rows) ? rows : [] });

// ====================== SERVICIOS EXISTENTES ===========================
async function getAnual()       { return ok(TRABAJO_ANUAL); }
async function getDataset()     { return ok(TRABAJO_DATASET); }
async function getTasas(q = {}) {
  const { periodo, sexo } = q;
  const filt = TRABAJO_TASAS.filter(
    r => (!periodo || String(r.periodo) === String(periodo)) &&
         (!sexo    || String(r.sexo)    === String(sexo))
  );
  return ok(filt.length ? filt : TRABAJO_TASAS);
}
async function getPiramide(q = {}) {
  const { periodo } = q;
  const filt = TRABAJO_PIRAMIDE.filter(r => !periodo || String(r.periodo) === String(periodo));
  return ok(filt.length ? filt : TRABAJO_PIRAMIDE);
}

// ====================== NUEVO: ESI INGRESOS ============================
const ESI_CSV_PATH = path.join(__dirname, "..", "data", "trabajo_esi_ingresos.csv");
const _num = (v) => {
  if (v == null || v === "") return null;
  const t = String(v).trim().replace(/\./g, "").replace(/,/g, "");
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
};

function _leerESICsv() {
  if (!fs.existsSync(ESI_CSV_PATH)) return [];
  const raw = fs.readFileSync(ESI_CSV_PATH, "utf8").replace(/^\uFEFF/, "");
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const sep = lines[0].includes(";") ? ";" : ",";
  const header = lines[0].split(sep).map(h => h.trim().toLowerCase());
  const iAnio = header.indexOf("anio");
  const iTot = header.indexOf("total");
  const iHom = header.indexOf("hombres");
  const iMuj = header.indexOf("mujeres");
  if (iAnio < 0) return [];

  const out = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(sep);
    const anio = Number(parts[iAnio]);
    if (!Number.isFinite(anio)) continue;
    out.push({
      anio,
      total:   iTot >= 0 ? _num(parts[iTot]) : null,
      hombres: iHom >= 0 ? _num(parts[iHom]) : null,
      mujeres: iMuj >= 0 ? _num(parts[iMuj]) : null,
    });
  }
  return out.sort((a, b) => a.anio - b.anio);
}

function _esiDesdeDataset(anioDesde, anioHasta) {
  const acc = new Map(); // anio -> { Hombres:{s,c}, Mujeres:{s,c} }
  for (const r of TRABAJO_DATASET) {
    const a = Number(r.anio);
    if (anioDesde && a < Number(anioDesde)) continue;
    if (anioHasta && a > Number(anioHasta)) continue;
    const k = r.sexo === "Hombre" ? "Hombres" : "Mujeres";
    if (!acc.has(a)) acc.set(a, { Hombres: { s: 0, c: 0 }, Mujeres: { s: 0, c: 0 } });
    const slot = acc.get(a)[k];
    const v = Number(r.ingreso_promedio ?? 0);
    if (Number.isFinite(v)) { slot.s += v; slot.c += 1; }
  }
  return Array.from(acc.entries()).map(([anio, g]) => {
    const hombres = g.Hombres.c ? Math.round(g.Hombres.s / g.Hombres.c) : null;
    const mujeres = g.Mujeres.c ? Math.round(g.Mujeres.s / g.Mujeres.c) : null;
    const total = (hombres != null && mujeres != null)
      ? Math.round((hombres + mujeres) / 2)
      : (hombres ?? mujeres ?? null);
    return { anio, total, hombres, mujeres };
  }).sort((a, b) => a.anio - b.anio);
}

async function getESIIngresos({ anioDesde, anioHasta } = {}) {
  const csvRows = _leerESICsv().filter(r => {
    if (anioDesde && r.anio < Number(anioDesde)) return false;
    if (anioHasta && r.anio > Number(anioHasta)) return false;
    return true;
  });
  if (csvRows.length) return csvRows;          // 1) CSV (si existe)
  return _esiDesdeDataset(anioDesde, anioHasta); // 2) Fallback desde dataset
}

module.exports = {
  getAnual,
  getDataset,
  getTasas,
  getPiramide,
  getESIIngresos,
};
