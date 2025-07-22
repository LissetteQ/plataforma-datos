import axios from 'axios';

export const getSeries = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/banco-central');
    return response.data;
  } catch (error) {
    console.error('Error al obtener serie del Banco Central:', error);
    throw error;
  }
};