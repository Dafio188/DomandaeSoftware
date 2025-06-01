# Giorno 3 - Generiamo una applicazione react con tema grafico e rotte di navigazione

## Obiettivi

- Generazione di una applicazione React con Vite e Typescript
- Studio delle funzionalità di base di React (useEffect useState)
- Installazione e configurazione dei plugin
- Trick specifici, prompt framework e cenni di vibecoding

# ******************************************\*\*******************************************

# MATTINA

# ******************************************\*\*******************************************

### Prompt:

> Spiegami come creare una app React con Vite passo passo, usando TypeScript.

# Istruzioni

npm create vite@latest react-demo -- --template react-ts
cd react-demo
npm i
npm run dev

# Struttura

nome-progetto/
├─ public/
├─ src/
│ ├─ App.tsx
│ ├─ main.tsx
│ └─ vite-env.d.ts
├─ index.html
├─ tsconfig.json
├─ vite.config.ts
├─ package.json

# ******************************************\*\*******************************************

### Prompt:

> Spiegami cosa sono useState e useEffect in React con esempi pratici, usando la nostra app.

# 🧠 useState – Stato nel componente

useState ti permette di salvare e aggiornare uno stato interno al componente, ad esempio:
un contatore, un valore di input, un booleano per mostrare/nascondere qualcosa

# Counter.tsx (con useState)

import { useState } from 'react'
import { Button, Typography } from '@mui/material'

export default function Contatore() {
const [conta, setConta] = useState(0);

    useEffect(() => {
        document.title = `Hai cliccato ${conta} volte`
    }, [conta]) // si aggiorna SOLO quando `conta` cambia

    return (
        <div>
        <Typography variant="h6">Hai cliccato {conta} volte</Typography>
        <Button variant="contained" onClick={() => setConta(conta + 1)}>
            Aumenta
        </Button>
        </div>
    )

}

# ******************************************\*\*******************************************

### Prompt:

> Installa react-router-dom. Spiegami come funziona il routing tra più pagine. Genera 2 pagine base e una barra di navigazione.

# 🚦 Cos'è react-router-dom?

È la libreria ufficiale per la navigazione in React. Ti permette di:

- definire URL diversi per ogni pagina (es. /home, /about)
- navigare tra le pagine senza ricaricare la pagina
- mostrare solo i componenti rilevanti in base all’URL

# Istruzioni

npm install react-router-dom
npm install --save-dev @types/react-router-dom (consigliato per typescript)

# Home.tsx

export default function Home() {
return <h2>🏠 Benvenuto nella Home</h2>
}

# About.tsx

export default function About() {
return <h2>ℹ️ Pagina Informazioni</h2>
}

# Navbar.tsx

import { Link } from 'react-router-dom'

export default function Navbar() {
return (
<nav>
<Link to="/">Home</Link>
<Link to="/about">About</Link>
</nav>
)
}

# App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Navbar from './components/Navbar'

export default function App() {
return (
<Router>
<Navbar />
<Routes>
<Route path="/" element={<Home />} />
<Route path="/about" element={<About />} />
</Routes>
</Router>
)
}

# ******************************************\*\*******************************************

### Prompt:

> Suggeriscimi una libreria UI moderna per migliorare l'estetica. Installa e configura MUI. Spiega cosa sono i plugin in React.

# 🎨 Libreria UI consigliata: MUI (Material UI)

MUI (Material UI) è una delle librerie UI più moderne, popolari e potenti per React.
È basata su Material Design di Google ed è:

✅ Moderna
✅ Super personalizzabile (con temi e styled components)
✅ Compatibile con TypeScript
✅ Ricca di componenti già pronti (bottoni, card, modali, tab, snackbar, ecc.)

# 🧩 Cosa sono i plugin in React?

In senso stretto, React non ha “plugin” nativi come ad esempio WordPress.
Ma nel mondo React, con “plugin” si intende:

# 🔹 Librerie esterne che aggiungono funzionalità a React:

react-router-dom → per gestire le rotte

# 🧑‍💻 Esempi di plugin

react-hook-form → per gestire i form
MUI → per i componenti grafici
i18next → per l’internazionalizzazione
react-query / tanstack query → per gestire API, cache e loading state
Sono tutte librerie (o “plugin”) che si integrano nel flusso React, rendendolo più potente.

# Istruzioni

npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material

# ******************************************\*\*******************************************

### Prompt:

> Come si crea un tema personalizzato per MUI (Material UI)? Scrivi un esempio e integralo nell'app.

# Theme.tsx

import { createTheme } from '@mui/material/styles'

const theme = createTheme({
palette: {
primary: {
main: '#1976d2',
},
secondary: {
main: '#9c27b0',
},
},
typography: {
fontFamily: 'Roboto, sans-serif',
},
})
export default theme;

# App.tsx

import { ThemeProvider } from '@mui/material/styles'
import { Container, Typography, Button } from '@mui/material'
import theme from './Theme'

function App() {
return (
<ThemeProvider theme={theme}>
<Container>
<Typography variant="h4" color="primary">Ciao dal tema MUI!</Typography>
<Button variant="contained" color="secondary">Un bel bottone</Button>
</Container>
</ThemeProvider>
)
}
export default App;

# ******************************************\*\*******************************************

### Prompt:

> Genera una pagina Hello World in React che mostri: titolo, paragrafo, pulsanti, card, colori e font dal tema MUI personalizzato.

# Theme.tsx

import { createTheme } from '@mui/material/styles'

const theme = createTheme({
palette: {
primary: {
main: '#1976d2', // blu
},
secondary: {
main: '#d32f2f', // rosso
},
background: {
default: '#f5f5f5',
paper: '#ffffff'
}
},
typography: {
fontFamily: 'Roboto, sans-serif',
h1: {
fontSize: '2.5rem',
fontWeight: 600
},
body1: {
fontSize: '1.2rem'
}
}
})

export default theme;

# App.tsx

import { ThemeProvider } from '@mui/material/styles'
import {
Container, Typography, Button, Card,
CardContent, CardActions
} from '@mui/material'
import theme from './Theme'

export default function App() {
return (
<ThemeProvider theme={theme}>
<Container maxWidth="sm">
<Typography variant="h1" color="primary" gutterBottom>
Hello World 🌍
</Typography>

        <Typography variant="body1" paragraph>
          Questa è una demo React + Vite + MUI, con tema personalizzato.
        </Typography>

        <Button variant="contained" color="primary" sx={{ mr: 2 }}>
          Bottone Primario
        </Button>

        <Button variant="outlined" color="secondary">
          Secondario
        </Button>

        <Card sx={{ marginTop: '2rem' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Card Esempio
            </Typography>
            <Typography variant="body2">
              Questo è un componente Card con stile dal tema MUI personalizzato.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">Azione 1</Button>
            <Button size="small" color="secondary">Azione 2</Button>
          </CardActions>
        </Card>
      </Container>
    </ThemeProvider>

)
}

# ******************************************\*\*******************************************

# POMERIGGIO

# ******************************************\*\*******************************************

# 🧠 Prompt IA per refactoring automatico in React

# 🔹 1. Refactoring generale

> Ottimizza questo componente React mantenendone il comportamento, migliorando leggibilità, separazione logica e uso di hook se necessario.

# 🔹 2. Estrai in componenti riutilizzabili

> Dividi questo file React in più componenti: ogni sezione visiva o logica separata dovrebbe diventare un componente riutilizzabile. Dammi un file per ciascuno.

# 🔹 3. Estrai logica in un hook personalizzato

> Estrai tutta la logica legata allo stato di questo componente React in un hook chiamato useQualcosa. Mantieni il codice TypeScript.

# 4. Migliora la struttura dei file

> Suggerisci una nuova organizzazione in cartelle e file per questo progetto React, separando componenti, hook, utils e stili.

# 🔹 5. Refactoring UI con MUI

> Sostituisci gli elementi HTML grezzi con componenti MUI equivalenti. Mantieni gli stessi contenuti e comportamento.

# 🔹 6. Refactoring per performance

> Analizza questo componente React. Ottimizzalo per performance evitando rendering inutili e usando useMemo, useCallback, React.memo dove opportuno.

# 🔹 7. Refactoring per accessibilità

> Migliora l’accessibilità di questo componente: aggiungi etichette ARIA, role, focus trap e colori leggibili.

# 💡 Pro tip: crea un prompt framework

> Agisci come un senior frontend developer.
> Analizza il seguente codice React. Suggerisci un refactoring completo con:

- separazione componenti
- logica in hook
- uso di librerie UI moderne
- eventuali miglioramenti accessibilità e performance
  Scrivi codice pulito, commentato, e con forte tipizzazione.

# 🧱 Struttura tipica di un Prompt Framework

🎭 Ruolo Definisce "chi" deve essere l’IA (es. “agisci come…” )
📝 Contesto Introduce il problema o la situazione
🎯 Obiettivo Cosa deve fare l’IA
📐 Formato Output Specifica il formato della risposta desiderata
🧪 Esempi (opzionale) Mostra un esempio (→ few-shot prompting)

# 🔥 Power trick

Scrivimi un prompt framework per generare (a voi sperimentare)...
