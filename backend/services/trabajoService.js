// backend/services/trabajoService.js
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

// ====== RUTA CORRECTA A TUS CSV ======
// Estaban en backend/data/trabajo, pero __dirname aquí es backend/services.
// Por eso subimos un nivel con "..".
const DATA_DIR =
  process.env.DATA_DIR || path.join(__dirname, "..", "data", "trabajo");

const PATHS = {
  anual:
    process.env.TRABAJO_ANUAL_CSV ||
    path.join(DATA_DIR, "trabajo_anual.csv"),
  dataset:
    process.env.TRABAJO_DATASET_CSV ||
    path.join(DATA_DIR, "trabajo_dataset.csv"),
  piramide:
    process.env.TRABAJO_PIRAMIDE_CSV ||
    path.join(DATA_DIR, "trabajo_piramide.csv"),
  tasas:
    process.env.TRABAJO_TASAS_CSV ||
    path.join(DATA_DIR, "trabajo_tasas.csv"),
  esi:
    process.env.TRABAJO_ESI_INGRESOS_CSV ||
    path.join(DATA_DIR, "trabajo_esi_ingresos.csv"),
};

// ====== util: detectar separador ; o , ======
function detectSeparator(headerLine) {
  if (!headerLine) return ",";
  return headerLine.includes(";") ? ";" : ",";
}

function createParser(sep) {
  return parse({
    columns: (h) => h.map((x) => String(x || "").trim().toLowerCase()),
    bom: true,
    delimiter: sep,
    relax_column_count: true,
    skip_empty_lines: true,
    trim: true,
  });
}

async function readCsvFlexible(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ CSV no encontrado: ${filePath}`);
    return [];
  }
  const first = fs.readFileSync(filePath, "utf8");
  const headerLine = (first.split(/\r?\n/)[0] || "").replace(/^\uFEFF/, "");
  const sep = detectSeparator(headerLine);

  return new Promise((resolve, reject) => {
    const out = [];
    fs.createReadStream(filePath, { encoding: "utf8" })
      .pipe(createParser(sep))
      .on("data", (row) => out.push(row))
      .on("end", () => resolve(out))
      .on("error", reject);
  });
}

const toNum = (v) => {
  if (v == null || v === "") return null;
  const s = String(v).trim().replace(/\./g, "").replace(/,/g, ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

// ====== CACHE simple por mtime ======
const cache = new Map(); // key -> { mtimeMs, data }
async function loadWithCache(key, filePath, mapFn) {
  const stat = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
  const mtimeMs = stat ? stat.mtimeMs : 0;
  const hit = cache.get(key);
  if (hit && hit.mtimeMs === mtimeMs) return hit.data;

  const raw = await readCsvFlexible(filePath);
  const data = (mapFn ? mapFn(raw) : raw) || [];
  cache.set(key, { mtimeMs, data });
  return data;
}

// ====== SERVICIOS ======

// /trabajo/anual  -> { rows: [...] }
async function getAnual() {
  const rows = await loadWithCache("anual", PATHS.anual, (raw) =>
    raw
      .map((r) => ({
        anio: Number(r.anio),
        ingreso_promedio: toNum(r.ingreso_promedio),
        fuerza_laboral: toNum(r.fuerza_laboral),
        tasa_desempleo: toNum(r.tasa_desempleo),
      }))
      .filter((r) => r.anio >= 2018 && r.anio <= 2024)
      .sort((a, b) => a.anio - b.anio)
  );
  return { rows };
}

// /trabajo/dataset -> { rows: [...] }
async function getDataset() {
  if (!fs.existsSync(PATHS.dataset)) return { rows: [] };
  const rows = await loadWithCache("dataset", PATHS.dataset, (raw) => raw);
  return { rows };
}

// /trabajo/tasas -> { rows: [...] }
async function getTasas(q = {}) {
  const { periodo, sexo } = q;
  const rows = await loadWithCache("tasas", PATHS.tasas, (raw) =>
    raw.map((r) => ({
      periodo: String(r.periodo),
      sexo: String(r.sexo),
      td: toNum(r.td),
      to: toNum(r.to),
      tp: toNum(r.tp),
      tpl: toNum(r.tpl),
      su1: toNum(r.su1),
      su2: toNum(r.su2),
      su3: toNum(r.su3),
      su4: toNum(r.su4),
      toi: toNum(r.toi),
      tosi: toNum(r.tosi),
    }))
  );
  const filt = rows.filter(
    (r) =>
      (!periodo || String(r.periodo) === String(periodo)) &&
      (!sexo || String(r.sexo).toLowerCase() === String(sexo).toLowerCase())
  );
  return { rows: filt.length ? filt : rows };
}

// /trabajo/piramide -> { rows: [...] }
async function getPiramide(q = {}) {
  const { periodo } = q;
  const rows = await loadWithCache("piramide", PATHS.piramide, (raw) =>
    raw.map((r) => ({
      periodo: String(r.periodo),
      sexo: String(r.sexo),
      tramo_edad: String(r.tramo_edad),
      pet: toNum(r.pet),
      fdt: toNum(r.fdt),
      oc: toNum(r.oc),
      des: toNum(r.des),
      id: toNum(r.id),
      tpi: toNum(r.tpi),
      obe: toNum(r.obe),
      ftp: toNum(r.ftp),
      fta: toNum(r.fta),
      fft: toNum(r.fft),
      oi: toNum(r.oi),
      osi: toNum(r.osi),
    }))
  );
  const result = periodo ? rows.filter((r) => String(r.periodo) === String(periodo)) : rows;
  return { rows: result };
}

// /trabajo/esi/ingresos -> array de objetos (front acepta {rows} o array)
async function getESIIngresos({ anioDesde, anioHasta } = {}) {
  const rows = await loadWithCache("esi", PATHS.esi, (raw) =>
    raw
      .map((r) => ({
        anio: Number(r.anio),
        total: toNum(r.total),
        hombres: toNum(r.hombres),
        mujeres: toNum(r.mujeres),
      }))
      .filter((r) => r.anio >= 2018 && r.anio <= 2024)
      .sort((a, b) => a.anio - b.anio)
  );
  return rows.filter((r) => {
    if (anioDesde && r.anio < Number(anioDesde)) return false;
    if (anioHasta && r.anio > Number(anioHasta)) return false;
    return true;
  });
}

module.exports = {
  getAnual,
  getDataset,
  getTasas,
  getPiramide,
  getESIIngresos,
  PATHS,
};