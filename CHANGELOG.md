# Changelog

Tutte le modifiche importanti a questo progetto saranno documentate in questo file.

## [2025-06-04] - Fix Errore 401 API

### 🔧 Risolto
- **Errore 401 Unauthorized**: Risolto problema con chiamate API che fallivano con errore 401
- **Configurazione URL API**: Implementata configurazione dinamica per ambienti diversi

### ➕ Aggiunto
- `frontend/Dockerfile.production`: Nuovo Dockerfile per build di produzione
- Configurazione API dinamica basata su variabile d'ambiente `VITE_API_URL`
- Supporto per URL di produzione vs sviluppo automatico

### 🔄 Modificato
- `frontend/src/config/api.js`: Aggiunta logica per gestire URL dinamici
- Configurazione build per passare correttamente le variabili d'ambiente

### 📝 Dettagli Tecnici
- Frontend ora utilizza `https://jwgamebibble.it` quando `VITE_API_URL` è impostato
- Fallback automatico a `http://localhost:8001` per sviluppo locale
- Build di produzione ottimizzata con variabili d'ambiente corrette

### 🎯 Risultato
- Le chiamate API in produzione ora funzionano correttamente
- Mantenuta compatibilità per sviluppo locale
- Deploy automatico migliorato per ambienti di produzione 