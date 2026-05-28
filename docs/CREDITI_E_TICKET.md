# Crediti & Ticket (SoftMatch)

## Scopo
I crediti sono ticket per regolare l’invio delle offerte e ridurre lo spam. Non sono un metodo di pagamento del progetto e non sostituiscono il deposito/bonifico del cliente.

## Chi usa i crediti
- Cliente: non usa crediti.
- Fornitore: usa crediti per inviare offerte.
- Admin/Staff: conferma ricariche e gestisce anomalie.

## Regola principale
- Inviare un’offerta costa `SOFTMATCH_OFFERTA_CREDIT_COST` (default 1).

## Come un fornitore richiede crediti (ricarica manuale)
1. Vai su `/crediti`
2. Seleziona un pacchetto
3. La piattaforma crea una richiesta ricarica con causale univoca
4. Il fornitore effettua bonifico verso l’IBAN SoftMatch usando la causale
5. (Consigliato) Carica la ricevuta bonifico nella ricarica
5. Admin verifica l’accredito e conferma la ricarica
6. I crediti vengono accreditati e tracciati su ledger (`CreditoMovimento`)

## Cosa NON fanno i crediti
- Non pagano il progetto
- Non sbloccano automaticamente la consegna
- Non sostituiscono la fee della piattaforma (+5% lato cliente in modalità default)

## Configurazioni
- Pacchetti crediti: `SOFTMATCH_CREDIT_PACKAGES` (es: `10:19.90,25:39.90,60:79.90`)
- IBAN piattaforma: `SOFTMATCH_PLATFORM_IBAN`
- Intestatario: `SOFTMATCH_PLATFORM_INTESTATARIO`
- Banca: `SOFTMATCH_PLATFORM_BANK_NAME`

## Operatività admin
- Admin può vedere e confermare ricariche in attesa nel pannello “Gestione Utenti”.
- La conferma accredita crediti e crea un movimento ledger.
