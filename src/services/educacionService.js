import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}/educacion`
    : "http://localhost:5000/api/educacion";

export async function fetchResumen() {
  const { data } = await axios.get(`${API_BASE}/matricula/resumen`);
  return data;
}

export async function fetchSeries() {
  const { data } = await axios.get(`${API_BASE}/series`);
  return data;
}

export async function fetchSexo() {
  const { data } = await axios.get(`${API_BASE}/sexo`);
  return data;
}
