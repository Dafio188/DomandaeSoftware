# 🧪 Test Suite - Domanda & Software

Questa cartella contiene tutti i test automatici per l'applicazione frontend.

## 📋 Struttura Test

### **🔧 Unit Tests** (`src/__tests__/`)
Test per componenti individuali usando Jest + React Testing Library

### **🌐 E2E Tests** (`tests/`)
Test end-to-end usando Playwright per simulare interazioni utente complete

## 🚀 Come Eseguire i Test

### **Unit Tests**
```bash
# Esegui tutti i test unitari
npm test

# Esegui in modalità watch (ricarica automatica)
npm run test:watch

# Esegui con coverage report
npm run test:coverage
```

### **E2E Tests**
```bash
# Esegui tutti i test E2E
npm run test:e2e

# Esegui con interfaccia grafica
npm run test:e2e:ui

# Esegui in modalità headed (browser visibile)
npm run test:e2e:headed
```

## 📁 Test Implementati

### **1. UnifiedNavbar Tests**
**File**: `src/__tests__/UnifiedNavbar.test.jsx`

**Copertura**:
- ✅ Rendering base della navbar
- ✅ Visualizzazione logo e link di navigazione
- ✅ Pulsanti Login/Registrati per utenti non autenticati
- ✅ Menu utente per utenti autenticati
- ✅ Funzionalità dropdown utente (click, chiusura, logout)
- ✅ Menu mobile (toggle, apertura/chiusura)
- ✅ Auto-hide su scroll
- ✅ Varianti navbar (transparent, solid, dashboard)

### **2. Navbar E2E Tests**
**File**: `tests/navbar.spec.js`

**Copertura**:
- ✅ Visibilità navbar su tutte le pagine
- ✅ Funzionalità logo e navigazione
- ✅ Auto-hide su scroll
- ✅ Menu mobile responsive
- ✅ Dropdown utente per utenti autenticati
- ✅ Test cross-browser (Chrome, Firefox, Safari)
- ✅ Test responsive (Desktop, Tablet, Mobile)

### **3. Authentication Flow Tests**
**File**: `tests/auth-flow.spec.js`

**Copertura**:
- ✅ Flusso completo: Guest → Login → Dashboard → Logout
- ✅ Accesso a pagine protette
- ✅ Persistenza autenticazione dopo refresh
- ✅ Role-based access (Cliente, Fornitore, Admin)
- ✅ Session management e cleanup
- ✅ Gestione errori di autenticazione
- ✅ Token scaduti e redirect

## 🎯 Test Scenarios Prioritari

### **Critical User Journeys**
1. **Guest Navigation**: Homepage → Pagine pubbliche → Login
2. **User Authentication**: Login → Dashboard → Logout
3. **Navbar Functionality**: Auto-hide, dropdown, mobile menu
4. **Responsive Design**: Desktop, tablet, mobile viewports
5. **Role Access**: Cliente, fornitore, admin permissions

### **Edge Cases**
- Token scaduti
- Errori di rete
- Accesso diretto a pagine protette
- Refresh durante sessione
- Logout e cleanup sessione

## 🔧 Configurazione

### **Jest Config** (`jest.config.js`)
- Environment: jsdom
- Setup: `src/setupTests.js`
- Coverage threshold: 70%
- Mock per CSS e file statici

### **Playwright Config** (`playwright.config.js`)
- Multi-browser: Chrome, Firefox, Safari
- Mobile testing: iPhone, Android
- Auto-start dev server
- Screenshot e video su failure
- Trace recording

## 📊 Coverage Goals

### **Unit Tests**
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### **E2E Tests**
- **Critical paths**: 100%
- **User journeys**: 100%
- **Cross-browser**: Chrome, Firefox, Safari
- **Responsive**: Desktop, Tablet, Mobile

## 🐛 Debugging

### **Unit Tests**
```bash
# Debug specifico test
npm test -- --testNamePattern="navbar rendering"

# Debug con verbose output
npm test -- --verbose

# Debug con watch mode
npm run test:watch
```

### **E2E Tests**
```bash
# Debug con browser visibile
npm run test:e2e:headed

# Debug con UI interattiva
npm run test:e2e:ui

# Debug specifico test
npx playwright test navbar.spec.js
```

## 📈 Continuous Integration

I test sono configurati per essere eseguiti automaticamente su:
- **Pull Requests**
- **Push su main branch**
- **Deploy in produzione**

### **CI Pipeline**
1. Install dependencies
2. Run unit tests with coverage
3. Start dev server
4. Run E2E tests
5. Generate reports
6. Upload artifacts

## 🔄 Aggiungere Nuovi Test

### **Unit Test**
1. Crea file in `src/__tests__/ComponentName.test.jsx`
2. Importa componente e utilities
3. Scrivi test cases con describe/test
4. Mock dependencies se necessario

### **E2E Test**
1. Crea file in `tests/feature-name.spec.js`
2. Importa Playwright utilities
3. Scrivi test scenarios con describe/test
4. Usa page object pattern per riusabilità

## 📚 Best Practices

### **Unit Tests**
- Test comportamento, non implementazione
- Mock external dependencies
- Use descriptive test names
- Group related tests with describe
- Test edge cases and error states

### **E2E Tests**
- Test critical user journeys
- Use stable selectors (data-testid)
- Keep tests independent
- Clean up state between tests
- Test across different viewports

## 🎨 Mock Strategy

### **API Calls**
- Mock axios requests in unit tests
- Use Playwright route mocking for E2E
- Simulate different response scenarios

### **Browser APIs**
- localStorage, sessionStorage
- window.matchMedia (responsive)
- IntersectionObserver
- scrollTo, scrollBy

### **External Dependencies**
- React Router (useNavigate, useLocation)
- Auth Context
- File uploads
- Image loading 