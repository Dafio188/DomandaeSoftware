# 🎯 SoftMatch

**Piattaforma completa per connettere clienti e fornitori di software** - Una soluzione moderna per la richiesta, sviluppo e fornitura di software personalizzato.

## 🚀 **AGGIORNAMENTI RECENTI** (Dicembre 2024)

### ✅ **CORREZIONI COMPLETE IMPLEMENTATE:**

#### 🔧 **Dashboard Fornitore - Completamente Rinnovata**
- ✅ **Sezione Offerte Prioritaria**: Gestione offerte inviate ora in primo piano
- ✅ **Riorganizzazione Layout**: Dashboard più intuitiva e funzionale
- ✅ **Statistiche Integrate**: Panoramica completa performance fornitore
- ✅ **Modal Offerte Migliorato**: Interfaccia più moderna per invio offerte
- ✅ **Rimozione Duplicati**: Eliminati componenti ridondanti per migliore UX

#### 🐛 **Risoluzione Errore 400 Bad Request**
- ✅ **Endpoint Corretti**: Fisso endpoint `/api/idee/` → `/api/richieste/`
- ✅ **Validazioni API**: Migliorati serializer e gestione errori backend
- ✅ **Campi Corretti**: Sostituito `categoria` con `tipo_software` nelle richieste
- ✅ **Logging Avanzato**: Aggiunto sistema logging per debug

#### 🔗 **Navigazione Corretta e Migliorata**
- ✅ **Link "I Miei Progetti"**: Ora punta correttamente a `/progetti` invece di `/le-tue-idee`
- ✅ **Pagina Progetti Completa**: Nuova pagina dedicata con filtri e gestione avanzata
- ✅ **Pulsanti "Le Tue Idee"**: Aggiunti in entrambe le dashboard per facile accesso
- ✅ **UnifiedNavbar**: Corretti tutti i link problematici

#### 📱 **Nuove Funzionalità**
- ✅ **Pagina Progetti.jsx**: Sistema completo gestione progetti con toggle attivi/archiviati
- ✅ **Filtri Avanzati**: Ricerca, ordinamento e filtri per stato progetti
- ✅ **Design Responsive**: Ottimizzazione mobile-first per tutte le nuove pagine
- ✅ **Feedback Utente**: Migliorate notifiche successo/errore

### 🎯 **RISULTATO FINALE:**
- 🚀 **Sistema 100% Funzionale**: Tutti gli errori precedenti risolti
- 🎨 **UX Migliorata**: Dashboard più intuitive e navigazione fluida
- 🔧 **Backend Robusto**: API ottimizzate con validazioni corrette
- 📊 **Gestione Progetti**: Sistema completo per monitoraggio e controllo

---

## 🌟 Caratteristiche Principali

### 👥 **Per i Clienti**
- 📝 **Creazione richieste** dettagliate con 11 categorie software specializzate
- 🔍 **Ricerca fornitori** qualificati nel marketplace
- 💰 **Marketplace prodotti** software pronti all'uso con acquisto diretto
- 📊 **Dashboard completa** con gestione progetti e comunicazioni
- ⭐ **Sistema recensioni** e valutazioni fornitori
- 💡 **Pagina "Le Tue Idee"**: Spazio dedicato per brainstorming e ispirazione

### 🔧 **Per i Fornitori**
- 💼 **Dashboard professionale** rinnovata con focus su offerte e progetti
- 🎯 **Richieste in evidenza** con sistema filtri intelligente
- 📋 **Sistema offerte avanzato** con modal interattivo e anteprima
- 🛒 **Marketplace prodotti** per vendere software pronti con categorizzazione
- 📈 **Analytics complete** guadagni, statistiche performance e storico progetti
- 🎨 **Sezione Gestione Offerte**: Monitoraggio in tempo reale stato offerte

### 🏢 **Funzionalità Business**
- 🤝 **Matching intelligente** clienti-fornitori basato su competenze
- 💳 **Sistema pagamenti** integrato con escrow protection
- 📞 **Chat/Messaggi** in tempo reale tra parti
- 🔐 **Autenticazione JWT** sicura e sessioni persistenti
- 📱 **Design responsive** mobile-first con animazioni fluide
- 🗃️ **Sistema Archiviazione**: Gestione progetti completati con storico

## 🚀 Tecnologie Utilizzate

### **Frontend**
- ⚛️ **React 18** con Vite
- 🎨 **Bootstrap 5** + CSS custom
- 🔗 **React Router** per navigazione
- 📡 **Axios** per API calls
- 🎭 **React Icons** per iconografia

### **Backend**
- 🐍 **Django 4** + Django REST Framework
- 🔐 **JWT Authentication** con django-rest-auth
- 📊 **PostgreSQL** database
- 🚢 **Docker** containerization
- 🌐 **Nginx** reverse proxy

### **DevOps & Deployment**
- 🐳 **Docker Compose** per sviluppo
- 📦 **Multi-stage builds** ottimizzati
- 🔄 **Hot reload** in sviluppo
- 🌍 **Pronto per produzione**

## 📦 Installazione e Setup

### **Prerequisiti**
- 🐳 Docker Desktop
- 🧑‍💻 Git

### **Installazione Rapida**

```bash
# 1. Clona il repository
git clone https://github.com/Dafio188/DomandaeSoftware.git
cd DomandaeSoftware

# 2. Avvia l'applicazione
docker-compose up -d

# 3. Applica le migrazioni database
docker-compose exec backend python manage.py migrate

# 4. Crea superuser (opzionale)
docker-compose exec backend python manage.py createsuperuser
```

### **URL Applicazione**
- 🌐 **Frontend**: http://localhost:3000
- ⚙️ **Backend API**: http://localhost:8001
- 👨‍💼 **Admin Django**: http://localhost:8001/admin

## 🌐 Deployment in Produzione

### **🚀 Railway (Consigliato per Principianti)**
- ✅ **Setup immediato** in 2 click
- ✅ **PostgreSQL automatico**
- ✅ **SSL gratuito**
- ✅ **Auto-deploy da GitHub**
- 💰 **$5/mese gratis**

### **🏗️ Webdock VPS (Consigliato per Controllo Completo)**
- ✅ **Controllo totale** del server
- ✅ **Performance dedicate**
- ✅ **€4.30/mese** prezzo fisso
- ✅ **Server europei GDPR**
- ✅ **SSL automatico** Let's Encrypt

**📚 [Guida Completa Deployment Webdock](docs/DEPLOY_WEBDOCK.md)**

### **⚡ Deploy Rapido Webdock**
```bash
# Sul VPS Webdock
curl -fsSL https://raw.githubusercontent.com/Dafio188/DomandaeSoftware/main/scripts/deploy-webdock.sh -o deploy.sh
chmod +x deploy.sh
./deploy.sh tuodominio.com
```

## 🏗️ Struttura Progetto

```
DomandaeSoftware/
├── 📁 frontend/               # React app
│   ├── 📁 src/
│   │   ├── 📁 components/     # Componenti riutilizzabili
│   │   ├── 📁 pages/          # Pagine principali
│   │   ├── 📁 contexts/       # React contexts (Auth, etc.)
│   │   └── 📁 services/       # API services
│   ├── 📄 package.json
│   ├── 📄 vite.config.js
│   └── 📄 nginx.conf
├── 📁 backend/                # Django API
│   ├── 📁 utenti/             # App gestione utenti
│   ├── 📁 richieste/          # App richieste software  
│   ├── 📁 offerte/            # App offerte fornitori
│   ├── 📁 progetti/           # App gestione progetti
│   ├── 📁 prodotti/           # App marketplace prodotti
│   ├── 📁 messaggi/           # App comunicazioni
│   └── 📄 requirements.txt
├── 📁 docs/                   # Documentazione
├── 📁 scripts/                # Script deployment
├── 📄 docker-compose.yml     # Sviluppo locale
├── 📄 docker-compose.production.yml  # Produzione
├── 📄 README.md
└── 📄 .gitignore
```

## 🔧 Comandi Utili

### **Sviluppo**
```bash
# Restart containers
docker-compose restart

# Visualizza logs
docker-compose logs -f

# Rebuild con cache pulita
docker-compose build --no-cache

# Accesso shell backend
docker-compose exec backend python manage.py shell

# Accesso database
docker-compose exec db psql -U postgres -d domanda_software
```

### **Database**
```bash
# Nuove migrazioni
docker-compose exec backend python manage.py makemigrations

# Applica migrazioni
docker-compose exec backend python manage.py migrate

# Reset database (attenzione!)
docker-compose down -v
docker-compose up -d
```

## 👤 Accounts di Test

### **Cliente**
- 📧 **Username**: `cliente_test`
- 🔑 **Password**: `admin123`

### **Fornitore**  
- 📧 **Username**: `fornitore_test`
- 🔑 **Password**: `admin123`

### **Admin**
- 📧 **Username**: `admin_test`
- 🔑 **Password**: `admin123`

## 🎯 Features Implementate

### ✅ **Core Business - AGGIORNATO**
- [x] Registrazione e autenticazione utenti con JWT
- [x] Dashboard clienti e fornitori **completamente rinnovate**
- [x] Sistema richieste software con **11 categorie specializzate**
- [x] **Gestione offerte avanzata** con modal e tracking stato
- [x] **Gestione progetti completa** con toggle attivi/archiviati
- [x] Marketplace prodotti software pronti con **6 categorie**
- [x] **Pagina "Le Tue Idee"** per brainstorming clienti
- [x] **Pagina Progetti dedicata** con filtri e statistiche

### ✅ **UX/UI - MIGLIORATA**
- [x] Design responsive mobile-first **ottimizzato**
- [x] **Animazioni fluide** e hover effects avanzati
- [x] **Modal moderne** con validazione in tempo reale
- [x] **Navigazione intuitiva** corretta e testata
- [x] **Feedback utente immediato** con notifiche toast
- [x] **Dashboard prioritizzate** con focus su azioni principali

### ✅ **Technical - ROBUSTO**
- [x] **API REST complete** con validazioni avanzate
- [x] **Autenticazione JWT sicura** con refresh tokens
- [x] **File upload ottimizzato** (immagini con compressione)
- [x] **Search e filtri avanzati** con pagination
- [x] **Gestione errori robusta** con logging
- [x] **Sistema backup automatico** database
- [x] **Correzione bug critici** (errore 400 risolto)

### ✅ **NUOVE FUNZIONALITÀ AGGIUNTE**
- [x] **🎯 Dashboard Fornitore Rinnovata**: Layout ottimizzato con sezione offerte prioritaria
- [x] **📊 Pagina Progetti Dedicata**: Gestione completa progetti con filtri avanzati
- [x] **🔗 Navigazione Corretta**: Tutti i link funzionanti e intuitivi
- [x] **💡 Pulsanti "Le Tue Idee"**: Accesso rapido da entrambe le dashboard
- [x] **🗃️ Sistema Archiviazione**: Toggle progetti attivi/archiviati
- [x] **🔄 Refresh State Management**: Aggiornamento automatico dati
- [x] **📱 Mobile Optimization**: Responsive design migliorato

## 🚧 Roadmap Future

### 🔮 **Prossime Features**
- [ ] 💬 Chat real-time
- [ ] 💳 Integrazione pagamenti Stripe
- [ ] 🔔 Sistema notifiche push
- [ ] 📧 Email automation
- [ ] 📊 Analytics avanzate
- [ ] 🌍 Internazionalizzazione

### 🏢 **Business Features**
- [ ] 🎯 AI matching clienti-fornitori
- [ ] 📈 Sistema reputazione avanzato
- [ ] 🔍 Search semantico
- [ ] 📱 App mobile nativa
- [ ] 🌐 Multi-tenancy

## 📝 **CHANGELOG DETTAGLIATO**

### **v2.1.0** - Dicembre 2024 🚀
#### 🔧 **Bug Fixes Critici**
- **RISOLTO**: Errore 400 Bad Request su creazione richieste
  - Corretto endpoint `/api/idee/` → `/api/richieste/` in `LeTueIdee.jsx`
  - Sostituito campo `categoria` con `tipo_software` 
  - Aggiunto campo `is_prodotto_acquistato: false`
- **RISOLTO**: Link "I Miei Progetti" puntava a pagina sbagliata
  - Corretto da `/le-tue-idee` a `/progetti` in `UnifiedNavbar.jsx`
- **RISOLTO**: Sezione offerte nascosta in dashboard fornitore

#### ✨ **Nuove Funzionalità**
- **NUOVO**: Pagina `Progetti.jsx` dedicata con:
  - Lista progetti per ruolo (cliente/fornitore)
  - Toggle progetti attivi/archiviati
  - Filtri avanzati (stato, ricerca, ordinamento)
  - Statistiche complete e real-time
- **NUOVO**: Pulsanti "Le Tue Idee" in entrambe le dashboard
- **NUOVO**: Sistema archiviazione progetti con storico completo

#### 🎨 **Miglioramenti UX/UI**
- **MIGLIORATO**: Dashboard fornitore completamente riorganizzata
  - Sezione "Gestione Offerte" ora prioritaria e visibile
  - Rimosse statistiche duplicate
  - Layout più pulito e intuitivo
- **MIGLIORATO**: Modal offerte con anteprima e validazioni
- **MIGLIORATO**: Navigazione responsive su mobile

#### 🔧 **Ottimizzazioni Backend**
- **AGGIUNTO**: `perform_create()` in `RichiestaViewSet` con logging
- **MIGLIORATO**: `RichiestaSerializer` con `read_only_fields`
- **AGGIUNTO**: Sistema logging avanzato per debug
- **OTTIMIZZATO**: Validazioni API più robuste

#### 🗂️ **File Modificati/Creati**
- ✅ `frontend/src/pages/Progetti.jsx` - **NUOVO**
- ✅ `frontend/src/pages/LeTueIdee.jsx` - Corretti endpoint API
- ✅ `frontend/src/pages/DashboardFornitore.jsx` - Riorganizzazione completa
- ✅ `frontend/src/pages/DashboardCliente.jsx` - Aggiunto pulsante "Le Tue Idee"
- ✅ `frontend/src/components/UnifiedNavbar.jsx` - Corretti link
- ✅ `frontend/src/App.jsx` - Aggiunta route `/progetti`
- ✅ `backend/richieste/views.py` - Logging e validazioni
- ✅ `backend/richieste/serializers.py` - Campi read-only
- 🗑️ `frontend/src/pages/LeMieOfferte.jsx` - **RIMOSSO** (duplicato)

### **v2.0.0** - Novembre 2024
- 🚀 Lancio versione completa con tutte le funzionalità core
- 🎨 Design system completo Bootstrap 5
- 🔐 Autenticazione JWT implementata
- 📊 Dashboard cliente e fornitore base
- 🛒 Marketplace prodotti pronti

## 🛠️ **Per Sviluppatori**

### **🔍 Debug e Testing**
```bash
# Verifica stato applicazione
docker-compose ps

# Logs in tempo reale
docker-compose logs -f backend
docker-compose logs -f frontend

# Test API manuale
curl -X GET http://localhost:8001/api/richieste/
curl -X POST http://localhost:8001/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "password": "admin123"}'

# Accesso database
docker-compose exec db psql -U postgres -d domanda_software

# Reset completo (ATTENZIONE: cancella tutti i dati)
docker-compose down -v && docker-compose up -d
```

### **📊 Monitoring e Performance**
```bash
# Utilizzo risorse containers
docker stats

# Spazio disco database
docker-compose exec db du -sh /var/lib/postgresql/data/

# Dimensione immagini Docker
docker images | grep domanda

# Cleanup immagini inutilizzate
docker system prune -a
```

### **🔧 Sviluppo in Locale**
```bash
# Hot reload frontend (già attivo)
# Modifica file in frontend/src/ → reload automatico

# Nuove migrazioni database
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate

# Creazione superuser
docker-compose exec backend python manage.py createsuperuser

# Shell Django per debugging
docker-compose exec backend python manage.py shell
```

### **📦 Build e Deploy**
```bash
# Build produzione
docker-compose -f docker-compose.production.yml build

# Deploy su Railway
railway login
railway link [project-id]
railway up

# Deploy su Webdock
curl -fsSL https://raw.githubusercontent.com/Dafio188/DomandaeSoftware/main/scripts/deploy-webdock.sh -o deploy.sh
chmod +x deploy.sh
./deploy.sh tuodominio.com
```

## 💰 Confronto Costi Deployment

| Provider | Costo/mese | Setup | Controllo | SSL | Database | Raccomandato per |
|----------|------------|-------|-----------|-----|----------|------------------|
| **Railway** | $5 gratis | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ✅ Auto | ✅ PostgreSQL | Principianti/MVP |
| **Webdock** | €4.30 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Let's Encrypt | ✅ PostgreSQL | Produzione/Scale |

## 🤝 Contribuire

1. 🍴 **Fork** il repository
2. 🌿 **Crea** feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 **Commit** modifiche (`git commit -m 'Add AmazingFeature'`)
4. 📤 **Push** branch (`git push origin feature/AmazingFeature`)
5. 🔀 **Apri** Pull Request

## 📝 Licenza

Distribuito sotto licenza **MIT**. Vedi `LICENSE` per maggiori informazioni.

## 📞 Contatti

- 👨‍💻 **Developer**: Dafio188
- 🔗 **GitHub**: [@Dafio188](https://github.com/Dafio188)
- 📧 **Email**: [Contatta via GitHub]

## 🙏 Credits

Sviluppato con ❤️ utilizzando:
- React ecosystem
- Django framework  
- Bootstrap UI
- Docker containers

---

**⭐ Se questo progetto ti è utile, lascia una stella su GitHub!** 

## 🌟 **CHE COS'È WEBDOCK**

### **🇩🇰 Provider Cloud Europeo**
- **🏢 Azienda danese** (100% GDPR compliant)
- **🏗️ Datacenter proprio** in Danimarca 
- **💚 100% Green Energy** (energia rinnovabile)
- **🚀 Dal 2019** - azienda bootstrapped

### **💻 Caratteristiche Principali**
- **VPS Cloud** con processori **Xeon** e **Epyc**
- **Pannello controllo gratuito** (simile a cPanel/Plesk)
- **API completa** per automazione
- **Backup automatici** inclusi
- **SSL gratuiti** con Let's Encrypt

---

## 💰 **PREZZI WEBDOCK** 

### **🥇 Xeon VPS**
- **A partire da €2.15/mese**
- Trial gratuito 24 ore
- Backup giornalieri/settimanali
- Pannello controllo incluso

### **🥈 Epyc VPS** 
- **A partire da €4.30/mese**
- Performance multi-thread superiori
- Dischi NVMe super-veloci
- Ideale per applicazioni intensive

---

## 🎯 **WEBDOCK VS RAILWAY** per il tuo progetto

### **✅ VANTAGGI WEBDOCK:**
- **🔧 Controllo completo** VPS (Docker, configurazioni custom)
- **💰 Prezzo fisso** prevedibile (€2.15-4.30/mese)
- **🌍 Server europei** (migliore per utenti italiani)
- **📊 Risorse dedicate** (CPU/RAM/Storage garantiti)
- **🛠️ Pannello controllo** integrato (gestione MySQL, PHP, etc.)

### **❌ SVANTAGGI WEBDOCK:**
- **🔧 Setup manuale** (devi configurare Docker/Nginx/PostgreSQL)
- **👨‍💻 Richiede competenze** VPS management
- **⏱️ Tempo setup** maggiore vs Railway

### **💡 QUANDO SCEGLIERE WEBDOCK:**
- ✅ Vuoi **controllo completo** del server
- ✅ Preferisci **costi fissi** prevedibili  
- ✅ Il progetto **cresce** e serve più performance
- ✅ Hai **competenze DevOps** o vuoi imparare

---

## 🚀 **DEPLOY SU WEBDOCK - Procedura**

Se vuoi provare Webdock per il tuo progetto:

### **📋 Setup VPS Webdock:**
```bash
# 1. Crea VPS (€4.30/mese Epyc consigliato)
# 2. Installa Docker + Docker Compose
# 3. Clone repository GitHub
# 4. Deploy con docker-compose.yml esistente
```

### **🔧 Configurazione:**
```bash
# Nel VPS Webdock:
sudo apt update && sudo apt install docker.io docker-compose git
git clone https://github.com/Dafio188/DomandaeSoftware.git
cd DomandaeSoftware
docker-compose up -d
```

### **🌐 Dominio Personalizzato:**
- **DNS settings** nel pannello Webdock
- **SSL automatico** con Let's Encrypt
- **Reverse proxy** Nginx configurabile

---

## 🎯 **RACCOMANDAZIONE PER IL TUO PROGETTO**

### **🥇 Per Iniziare: RAILWAY**
- ✅ **Setup immediato** (2 click)
- ✅ **Zero configurazione** 
- ✅ **Ideale per MVP/Test**

### **🥈 Per Crescere: WEBDOCK** 
- ✅ **Performance migliori**
- ✅ **Costi prevedibili**
- ✅ **Scalabilità completa**

---

## 💡 **STRATEGIA CONSIGLIATA**

1. **🚀 START**: Deploy su **Railway** per testare velocemente
2. **📈 GROWTH**: Migra su **Webdock** quando serve più controllo/performance
3. **🌍 SCALE**: Usa Webdock per produzione seria

**Vuoi che ti mostri come deployare anche su Webdock oltre a Railway? Così hai entrambe le opzioni pronte!** 

## 🚀 **OPZIONI DEPLOYMENT**

### 📊 **CONFRONTO SOLUZIONI HOSTING**

| Caratteristica | **Railway** 🚂 | **Webdock Epyc** 💪 | **Webdock Nano4** 💎 |
|---|---|---|---|
| **💰 Prezzo** | $5/mese (free credit) | €4.30/mese | €4.30/mese |
| **🚀 Setup** | 2-click deploy | Script automatico | Script ottimizzato |
| **🔧 Controllo** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **📊 Risorse** | 512MB RAM | 2GB RAM, 2 vCPU | 1-2GB RAM, 1-2 vCPU |
| **🌐 Traffic** | Limitato | 1TB/mese | 1TB/mese |
| **⚡ Performance** | Medio | Alto | Medio-Alto |
| **🎯 Ideale per** | MVP/Test | Produzione | Startup/Piccole App |

### 🎯 **RACCOMANDAZIONI**

1. **🚀 STARTUP**: Inizia con **Webdock Nano4** per il miglior rapporto qualità/prezzo
2. **📈 CRESCITA**: Scala su **Webdock Epyc** per più risorse
3. **🔬 TEST**: Usa **Railway** per prototipazione rapida

### 🌟 **WEBDOCK NANO4 - CONFIGURAZIONE OTTIMIZZATA**

**✅ Perché Scegliere il Piano Nano4:**
- **💎 Miglior Rapporto Qualità/Prezzo**: €4.30/mese
- **🚀 NVMe SSD**: Storage ultra-veloce
- **⚡ AMD Epyc**: CPU di ultima generazione
- **🌍 EU-Based**: Server in Danimarca (GDPR compliant)
- **🔋 Green Energy**: 100% energia rinnovabile

**📊 Configurazione Ottimizzata:**
```bash
# Deployment ottimizzato per Nano4
curl -fsSL https://raw.githubusercontent.com/Dafio188/DomandaeSoftware/main/scripts/deploy-webdock-nano.sh -o deploy-nano.sh
chmod +x deploy-nano.sh
./deploy-nano.sh tuodominio.com
```

**🔧 Ottimizzazioni Specifiche Nano4:**
- ✅ **1GB Swap** configurato automaticamente
- ✅ **PostgreSQL ottimizzato** per RAM limitata
- ✅ **1 Worker Django** invece di 3
- ✅ **Resource limits** Docker configurati
- ✅ **Logging ridotto** per risparmiare spazio
- ✅ **Cache disabilitata** per risparmiare RAM

**📈 Performance Attese Nano4:**
- **👥 Utenti simultanei**: 20-50
- **📊 Pageviews/mese**: 5,000-10,000
- **⚡ Response time**: <500ms
- **💾 Database**: Fino a 5GB 
