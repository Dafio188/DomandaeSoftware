# Offerta / Preventivo Annuale SoftMatch (infrastruttura produzione)

## Riepilogo servizi (Opzione A: separazione app/DB/storage)
- Server applicativo: VPS Aruba (Docker + Nginx + app)
- Database gestito: DBaaS (MySQL)
- Object Storage S3 (ricevute PDF/immagini + eventuali backup)

## Canone annuo (IVA esclusa)
- VPS Aruba PRO O2A4 (2 vCPU / 4 GB / 80 GB): **234,00 € / anno**
- DBaaS MySQL (piano base 10,95 € / mese): **131,40 € / anno**
- Object Storage (pay‑per‑use): **a consumo**

### Stima Object Storage (pay‑per‑use)
- Storage: ~**2,45 € / anno ogni 10 GB**
- Traffico uscita: **0,50 € ogni 10 GB**

Esempi d’uso (ricevute + download):
- Basso (2 GB, 10 GB egress): **~1,0 € / anno**
- Medio (10 GB, 50 GB egress): **~7,0 € / anno**
- Alto (50 GB, 200 GB egress): **~22,25 € / anno**

## Totali indicativi (annui, IVA esclusa)
- Config base (O2A4) + DBAA MySQL + Object Storage basso: **~366 € / anno**
- Config base (O2A4) + DBAA MySQL + Object Storage medio: **~372 € / anno**
- Config base (O2A4) + DBAA MySQL + Object Storage alto: **~388 € / anno**

## Variante “più tranquilla” (O4A8)
- VPS Aruba PRO O4A8 (4 vCPU / 8 GB / 120 GB): **364,00 € / anno**
- DBaaS MySQL: **131,40 € / anno**
- Object Storage (come sopra, a consumo)

Totali indicativi:
- O4A8 + DB + Storage basso: **~496 € / anno**
- O4A8 + DB + Storage medio: **~502 € / anno**
- O4A8 + DB + Storage alto: **~518 € / anno**

## Note operative
- Dominio: già acquistato (softmatch.it)
- DNS: app.softmatch.it (frontend), api.softmatch.it (backend)
- Sicurezza: HTTPS obbligatorio, CORS/ALLOWED_HOSTS, mascheramento contatti pre‑pagamento
- File ricevute: bucket privato con link firmati; retention e lifecycle abilitabili
- DB: backup automatici DBaaS + eventuali dump mensili su Object Storage

## Considerazioni
- Pay‑per‑use è ideale in fase iniziale: si paga solo ciò che si usa
- Aggiornamento preventivo al crescere dei volumi (ricevute e traffico) o alla necessità di risorse VPS maggiori

