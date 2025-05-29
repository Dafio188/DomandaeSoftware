CREATE TABLE utenti (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    cognome VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    ruolo VARCHAR(20) NOT NULL CHECK (ruolo IN ('cliente', 'fornitore', 'amministratore')),
    data_registrazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE richieste (
    id SERIAL PRIMARY KEY,
    titolo VARCHAR(100) NOT NULL,
    descrizione TEXT NOT NULL,
    cliente_id INTEGER REFERENCES utenti(id),
    stato VARCHAR(20) NOT NULL CHECK (stato IN ('aperta', 'in_lavorazione', 'completata', 'annullata')),
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE offerte (
    id SERIAL PRIMARY KEY,
    richiesta_id INTEGER REFERENCES richieste(id),
    fornitore_id INTEGER REFERENCES utenti(id),
    prezzo NUMERIC(10,2) NOT NULL,
    descrizione TEXT,
    stato VARCHAR(20) NOT NULL CHECK (stato IN ('inviata', 'accettata', 'rifiutata', 'annullata')),
    data_invio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messaggi (
    id SERIAL PRIMARY KEY,
    richiesta_id INTEGER REFERENCES richieste(id),
    mittente_id INTEGER REFERENCES utenti(id),
    destinatario_id INTEGER REFERENCES utenti(id),
    testo TEXT NOT NULL,
    data_invio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recensioni (
    id SERIAL PRIMARY KEY,
    richiesta_id INTEGER REFERENCES richieste(id),
    autore_id INTEGER REFERENCES utenti(id),
    destinatario_id INTEGER REFERENCES utenti(id),
    voto INTEGER CHECK (voto >= 1 AND voto <= 5),
    commento TEXT,
    data_recensione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transazioni (
    id SERIAL PRIMARY KEY,
    richiesta_id INTEGER REFERENCES richieste(id),
    importo NUMERIC(10,2) NOT NULL,
    stato VARCHAR(20) NOT NULL CHECK (stato IN ('in_attesa', 'completata', 'rimborsata')),
    data_transazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);