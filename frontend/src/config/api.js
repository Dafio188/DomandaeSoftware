export const API_BASE_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:8088');


// Base path per le API
export const API_BASE = `${API_BASE_URL}/api/`;

console.log('🔧 API Configuration:');
console.log('- Environment:', import.meta.env.MODE);
console.log('- VITE_API_URL:', import.meta.env.VITE_API_URL);
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
