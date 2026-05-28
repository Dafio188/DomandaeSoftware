# Deploy produzione (Aruba domain + hosting remoto) — Stack consigliato

## Obiettivo
Pubblicare la piattaforma in modo stabile e sicuro, mantenendo i dati in area EU/Italia e separando correttamente:
- applicazione (backend)
- database
- file ricevute (PDF/immagini)

## Scelta consigliata (Aruba Cloud “managed + storage”)
1) Backend Django su VPS/Cloud Server Aruba (con Docker)
2) PostgreSQL su Aruba Cloud DBaaS (managed, backup/patch)
3) File ricevute su Aruba Cloud Object Storage (S3 compatible)
4) Frontend su Nginx (stessa VPS) oppure su hosting statico/CDN

Riferimenti servizi Aruba:
- Cloud Object Storage S3 compatible: https://www.arubacloud.com/cloud-storage/cloud-object-storage
- Cloud DBaaS (PostgreSQL): https://kb.arubacloud.com/en/database/cloud-dbaas/cloud-dbaas-service/database-as-a-service.aspx

## Perché è la soluzione migliore “manual mode”
- Sicurezza: DB e file non stanno sul disco della VPS (riduce rischio e semplifica backup).
- Scalabilità: puoi aumentare risorse VPS senza toccare DB/storage.
- Operatività: ricevute e bonifici restano tracciabili e scaricabili in modo controllato.
- Conformità: data center EU e vendor italiano (utile per GDPR e gestione amministrativa).

## Architettura (alto livello)
- Browser → https://app.tuodominio.it (frontend)
- Frontend → https://api.tuodominio.it (backend REST)
- Backend → DBaaS PostgreSQL
- Backend → Object Storage (media/receipts)

## DNS con dominio Aruba (due modalità)
### A) Semplice (senza proxy)
- `app.tuodominio.it` → record A verso IP VPS
- `api.tuodominio.it` → record A verso IP VPS
Sul server gestisci entrambi con Nginx (virtual hosts).

### B) Consigliata (con Cloudflare come WAF/CDN)
- Cambi i nameserver del dominio Aruba verso Cloudflare
- Cloudflare gestisce SSL/WAF/rate limiting
- Origin: la VPS Aruba

## Requisiti produzione (backend)
- Eseguire Django con Gunicorn/Uvicorn dietro Nginx (no runserver).
- `DEBUG=False`
- `ALLOWED_HOSTS` stretti
- CORS: solo il dominio frontend
- HTTPS forzato + HSTS
- Secret in env, mai in repo

## Gestione file ricevute (media)
In produzione evita `MEDIA_ROOT` su disco.
Usa S3 (Object Storage Aruba, compatibile S3).

Checklist:
- bucket privato
- credenziali storage in secret manager/env
- link firmati o accesso controllato (mai directory pubbliche)

## Database
Usa DBaaS PostgreSQL:
- utenti e permessi dedicati
- backup automatici
- connessione solo dalla rete necessaria (se possibile)

## CI/CD (minimo)
- Build frontend → artifact statico
- Build backend Docker → push registry → deploy su VPS
- Migrate database in deploy (comando controllato)

## Variabili ambiente minime
- `DJANGO_SECRET_KEY`
- `DEBUG=0`
- `ALLOWED_HOSTS=api.tuodominio.it`
- `CORS_ALLOWED_ORIGINS=https://app.tuodominio.it`
- `DATABASE_URL=postgres://...` (DBaaS)
- `SOFTMATCH_PLATFORM_IBAN`, `SOFTMATCH_PLATFORM_INTESTATARIO`, `SOFTMATCH_PLATFORM_BANK_NAME`
- `SOFTMATCH_CREDIT_PACKAGES`
- S3/Object Storage:
  - endpoint, access key, secret key, bucket, region

