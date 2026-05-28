# Checklist Pre-Deploy (SoftMatch)

## Percorsi utente (Frontend)
- [ ] Registrazione / Login / Logout
- [ ] Cliente: pubblicazione richiesta + dettaglio + mascheramento contatti
- [ ] Fornitore: lista richieste + invio offerta (ticket) + blocco crediti insufficienti
- [ ] Fornitore: pagina Crediti (pacchetti, richiesta ricarica, upload ricevuta, storico)
- [ ] Progetto: fasi bozza → consegna → pagamento → payout (deposito cliente + ricevute + conferme)
- [ ] Admin: dashboard + utenti + progetti + contabilità + audit
- [ ] Admin: export CSV bonifici fornitori

## API & Permessi (Backend)
- [ ] JWT: access/refresh, rotate, blacklist
- [ ] Ruoli: cliente/fornitore/admin con protezioni su endpoint
- [ ] Admin users: lista, patch stato/ruolo/crediti
- [ ] Crediti: ledger movimenti + ricariche + conferma admin + upload ricevuta
- [ ] Progetti: upload ricevuta deposito cliente (solo cliente/admin)
- [ ] Progetti: upload ricevuta payout (solo admin) + visibile al fornitore
- [ ] Contestazioni: apertura (cliente/fornitore) + risoluzione admin
- [ ] Audit: endpoint + pagina UI

## Finanza (Manual Mode)
- [ ] Deposito cliente: coordinate + causale + upload ricevuta + spunta pagamento cliente
- [ ] Verifica admin: spunta pagamento admin solo dopo accredito reale
- [ ] Payout: upload ricevuta bonifico + spunta bonifico inviato (admin)
- [ ] Chiusura: conferma ricezione payout (fornitore) e transazione completata
- [ ] Margine: contabilità admin (commissioni) coerente con fee mode

## Sicurezza & Privacy
- [ ] CORS: solo `https://app.softmatch.it` in produzione
- [ ] ALLOWED_HOSTS: solo domini previsti in produzione
- [ ] HTTPS: redirect e header sicurezza in produzione
- [ ] Privacy ricevute: visibilità corretta (cliente/admin vs fornitore/admin)
- [ ] Anti-scavalco: mascheramento contatti su richiesta/offerta e chat pre-pagamento

## Deploy prep (Docker)
- [ ] docker-compose produzione pronto (app+api)
- [ ] Nginx production (app/api + static/media + upload limit)
- [ ] env file esempio senza segreti

