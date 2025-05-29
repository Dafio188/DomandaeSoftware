# 🎯 Domanda & Software

**Piattaforma completa per connettere clienti e fornitori di software** - Una soluzione moderna per la richiesta, sviluppo e fornitura di software personalizzato.

## 🌟 Caratteristiche Principali

### 👥 **Per i Clienti**
- 📝 **Creazione richieste** dettagliate con budget e specifiche
- 🔍 **Ricerca fornitori** qualificati nel marketplace
- 💰 **Marketplace prodotti** software pronti all'uso
- 📊 **Dashboard gestione** progetti e comunicazioni
- ⭐ **Sistema recensioni** e valutazioni

### 🔧 **Per i Fornitori**
- 💼 **Dashboard professionale** per gestire offerte e progetti
- 🎯 **Richieste in evidenza** con filtri avanzati
- 📋 **Sistema offerte** con modal interattivo
- 🛒 **Marketplace prodotti** per vendere software pronti
- 📈 **Analytics** guadagni e statistiche performance

### 🏢 **Funzionalità Business**
- 🤝 **Matching intelligente** clienti-fornitori
- 💳 **Sistema pagamenti** integrato
- 📞 **Chat/Messaggi** in tempo reale
- 🔐 **Autenticazione** sicura con JWT
- 📱 **Design responsive** mobile-first

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

### ✅ **Core Business**
- [x] Registrazione e autenticazione utenti
- [x] Dashboard clienti e fornitori
- [x] Sistema richieste software con categorie
- [x] Offerte fornitori con modal interattivo
- [x] Gestione progetti e stati avanzamento
- [x] Marketplace prodotti software pronti

### ✅ **UX/UI**
- [x] Design responsive mobile-first
- [x] Animazioni e hover effects
- [x] Modal e form validazione
- [x] Navigazione intuitiva
- [x] Feedback utente in tempo reale

### ✅ **Technical**
- [x] API REST complete
- [x] Autenticazione JWT
- [x] File upload (immagini)
- [x] Search e filtri avanzati
- [x] Pagination automatica

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