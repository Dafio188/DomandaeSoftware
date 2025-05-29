// Configurazione API automatica per sviluppo e produzione
const isDevelopment = import.meta.env.MODE === 'development';

// URL del backend in base all'ambiente
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:8001'  // Sviluppo locale
  : import.meta.env.VITE_API_URL || 'https://domanda-backend-production.railway.app'; // Produzione

// Base path per le API
export const API_BASE = `${API_BASE_URL}/api/`;

// Configurazione axios predefinita
export const apiConfig = {
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}; 