import axios from "axios";

const API = "http://localhost:5000/api/educacion";

export async function fetchResumen() {
  const { data } = await axios.get(`${API}/matricula/resumen`);
  return data;
}

export async function fetchSeries() {
  const { data } = await axios.get(`${API}/series`);
  return data;
}

export async function fetchSexo() {
  const { data } = await axios.get(`${API}/sexo`);
  return data;
}
