Prompt per l'IA: Generazione del Piano di Sviluppo Dettagliato per il Portale "Domanda & Software" con React e Bootstrap

Obiettivo Primario: Generare un piano di sviluppo dettagliato e sequenziale per la creazione del portale web "Domanda & Software", focalizzandosi sulle fasi di programmazione, la struttura dei dati, l'architettura del progetto e l'organizzazione dei file necessari, utilizzando React per il frontend e Bootstrap per la grafica.

Contesto del Progetto: Creazione di una piattaforma web che connette utenti con necessità di software a fornitori di servizi di sviluppo. Il sito web includerà funzionalità per la pubblicazione di richieste, la gestione di offerte, la comunicazione tra utenti, un sistema di valutazione e recensioni, dashboard utente differenziate (cliente, fornitore, amministratore) e un sistema di garanzia delle transazioni gestito dall'amministratore con un meccanismo di indennizzo.

Vincoli e Tecnologie Predefinite:

Database: PostgreSQL
Linguaggio Back-end: Python
Framework Back-end (da definire): (es. Django REST Framework, Flask-RESTx)
Front-end: React
Libreria UI: Bootstrap
Output Richiesto (Struttura del Piano di Sviluppo):

L'IA dovrebbe generare un piano di sviluppo organizzato in fasi logiche, fornendo per ciascuna fase i seguenti dettagli:

Nome della Fase: Una denominazione chiara della fase di sviluppo.
Obiettivo della Fase: Una breve descrizione dello scopo principale di questa fase.
Sotto-attività Principali: Un elenco puntato delle attività specifiche da completare all'interno di questa fase.
Struttura dei Dati (Database - PostgreSQL):
Elenco delle tabelle necessarie (con nomi chiari e descrittivi).
Per ogni tabella, specificare i campi (nome, tipo di dato, eventuali vincoli come chiave primaria, chiave esterna, NOT NULL, UNIQUE).
Descrizione delle relazioni tra le tabelle.
Architettura del Progetto (Back-end - Python):
Organizzazione delle cartelle e dei file del progetto back-end.
Descrizione dei principali moduli o componenti (es. autenticazione, gestione utenti, gestione richieste, gestione offerte, API).
Flusso di interazione tra i moduli.
Architettura del Progetto (Front-end - React con Bootstrap):
Organizzazione delle cartelle e dei file del progetto front-end (componenti, pagine, stili, gestione dello stato - es. con Context API o Redux).
Struttura di routing (libreria React Router).
Modalità di interazione con le API del back-end (es. libreria Axios o Fetch).
Utilizzo dei componenti Bootstrap (struttura a griglie, form, bottoni, navigazione, ecc.).
Gestione dello stato dei componenti React.
File Essenziali: Elenco dei file chiave da creare in ciascuna fase (es. modelli di database, file di configurazione back-end, definizioni delle API, componenti React, fogli di stile personalizzati, file di routing front-end).
Progressione delle Fasi di Sviluppo (Ordine Suggerito):

Definizione e Modellazione del Database (PostgreSQL): (Come descritto nel punto 4 dell'Output Richiesto)
Sviluppo del Back-end (Python):
Implementazione dell'autenticazione e gestione degli utenti.
Creazione delle API RESTful per la gestione di richieste e offerte.
Implementazione del sistema di messaggistica (API).
Implementazione del sistema di valutazione e recensioni (API).
Implementazione della logica del sistema di garanzia e indennizzo (API).
Creazione delle API per la dashboard amministrativa.
Sviluppo del Front-end (React con Bootstrap):
Setup del progetto React (es. con Create React App).
Installazione e configurazione di Bootstrap.
Creazione dei componenti UI riutilizzabili utilizzando React e stilizzandoli con Bootstrap e CSS personalizzato.
Implementazione del sistema di routing con React Router.
Creazione delle interfacce utente per clienti, fornitori e amministratori (componenti React che interagiscono con le API del back-end).
Gestione dello stato dell'applicazione React.
Integrazione e Test:
Integrazione completa del front-end React con le API del back-end Python.
Test approfonditi di tutte le funzionalità del sito (usabilità, funzionalità, sicurezza, responsività).
Correzione di eventuali bug.
Deployment:
Preparazione e distribuzione del back-end Python e del front-end React su un server web.
Tono e Formato: L'output dovrebbe essere strutturato in modo chiaro e logico, utilizzando un linguaggio tecnico preciso ma comprensibile. L'IA dovrebbe utilizzare elenchi puntati e sezioni ben definite per facilitare la lettura e l'implementazione.

1. Struttura del Progetto
Backend: Python 3.11+, Django 4.x, Django REST Framework, PostgreSQL, JWT Auth
Frontend: React 18+, Bootstrap 5, React Router 6, Axios, Context API
Deployment: Pronto per essere deployato su servizi come Heroku, Vercel, Render, ecc.
2. Creazione della Struttura delle Cartelle
/backend
    /config         # Configurazione progetto Django
    /utenti         # Gestione utenti e autenticazione
    /richieste      # Gestione richieste dei clienti
    /offerte        # Gestione offerte dei fornitori
    /progetti       # Gestione progetti e avanzamento
    /transazioni    # Gestione pagamenti e commissioni
    /messaggi       # Sistema di messaggistica
    /recensioni     # Sistema di recensioni
    /admin          # Dashboard amministrativa
    /tests          # Test automatici
    manage.py
3. Procedura Dettagliata
3.1. Backend
Setup ambiente virtuale e installazione dipendenze
Creazione progetto Django e app principali
Definizione modelli (models.py)
Serializzazione dati (serializers.py)
Creazione API RESTful (views.py, urls.py)
Autenticazione JWT
Gestione pagamenti e commissioni
Test automatici
Configurazione CORS per frontend
3.2. Frontend
Setup progetto React
Installazione Bootstrap, React Router, Axios
Struttura cartelle e componenti
Routing e pagine principali
Componenti UI accattivanti e responsive
Gestione stato globale (Context API)
Chiamate API e gestione autenticazione
Messaggistica, dashboard, recensioni
Responsive design e accessibilità
Test e ottimizzazione

# backend/Dockerfile
FROM python:3.12

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONUNBUFFERED=1

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]

# frontend/Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Serve statici con nginx
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

version: '3.9'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: domanda_software
      POSTGRES_USER: domanda
      POSTGRES_PASSWORD: domanda_pw
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  backend:
    build: ./backend
    command: gunicorn config.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - ./backend:/app
    environment:
      - DEBUG=0
      - DJANGO_SECRET_KEY=supersecretkey
      - DJANGO_ALLOWED_HOSTS=*
      - DB_NAME=domanda_software
      - DB_USER=domanda
      - DB_PASSWORD=domanda_pw
      - DB_HOST=db
      - DB_PORT=5432
    depends_on:
      - db
    ports:
      - "8000:8000"

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data:

