// src/utils/AxiosConfig.js
import axios from 'axios';

// Crear una instancia de Axios
const api = axios.create({
  baseURL: 'http://localhost:5000', // Cambia esto a la URL base de tu backend
  withCredentials: true, // Para permitir el envío de cookies si es necesario
});

// Configuración del interceptor para incluir el `accessToken` en el encabezado
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
