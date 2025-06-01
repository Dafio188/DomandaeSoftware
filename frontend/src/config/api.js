// Configurazione API per sviluppo locale
const isDevelopment = import.meta.env.MODE === 'development';

// FORZA BACKEND LOCALE per sviluppo
export const API_BASE_URL = 'http://localhost:8001';  // Sempre backend locale Docker

// Base path per le API
export const API_BASE = `${API_BASE_URL}/api/`;

console.log('🔧 API Configuration:');
console.log('- Environment:', import.meta.env.MODE);
console.log('- API Base URL:', API_BASE_URL);
console.log('- API Base:', API_BASE);

// Configurazione axios predefinita
export const apiConfig = {
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}; 