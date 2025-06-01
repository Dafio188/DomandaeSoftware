#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const NAVBAR_CSS_PATH = path.join(__dirname, 'src', 'components', 'UnifiedNavbar.css');
const BACKUP_ORIGINAL = path.join(__dirname, 'src', 'components', 'UnifiedNavbar_original.css');
const VERSION_2 = path.join(__dirname, 'src', 'components', 'UnifiedNavbar_v2.css');
const VERSION_3 = path.join(__dirname, 'src', 'components', 'UnifiedNavbar_v3.css');
const VERSION_4 = path.join(__dirname, 'src', 'components', 'UnifiedNavbar_v4.css');

function switchNavbarStyle(version) {
  try {
    // Backup dell'originale se non esiste
    if (!fs.existsSync(BACKUP_ORIGINAL)) {
      fs.copyFileSync(NAVBAR_CSS_PATH, BACKUP_ORIGINAL);
      console.log('✅ Backup originale creato');
    }

    let sourceFile;
    let versionName;

    switch(version) {
      case '1':
      case 'original':
        sourceFile = BACKUP_ORIGINAL;
        versionName = 'Originale (Incremento Moderato)';
        break;
      case '2':
      case 'significant':
        sourceFile = VERSION_2;
        versionName = 'Incremento Significativo';
        break;
      case '3':
      case 'modern':
        sourceFile = VERSION_3;
        versionName = 'Stile Moderno Equilibrato';
        break;
      case '4':
      case 'responsive':
      case 'large':
        sourceFile = VERSION_4;
        versionName = 'Ottimizzata per Grandi Schermi';
        break;
      default:
        console.log('❌ Versione non valida. Usa: 1, 2, 3, 4 oppure original, significant, modern, large');
        return;
    }

    if (!fs.existsSync(sourceFile)) {
      console.log(`❌ File ${sourceFile} non trovato`);
      return;
    }

    // Copia il file scelto
    fs.copyFileSync(sourceFile, NAVBAR_CSS_PATH);
    console.log(`🎨 Navbar cambiata a: ${versionName}`);
    console.log('🔄 Ricarica il browser per vedere i cambiamenti');

  } catch (error) {
    console.error('❌ Errore:', error.message);
  }
}

// Gestione argomenti da linea di comando
const version = process.argv[2];

if (!version) {
  console.log(`
🎨 SWITCH NAVBAR STYLE

Uso: node switch-navbar-style.cjs [versione]

Versioni disponibili:
  1 | original     - Incremento Proporzionale Moderato
  2 | significant  - Incremento Significativo  
  3 | modern       - Stile Moderno Equilibrato
  4 | large        - Ottimizzata per Grandi Schermi (CONSIGLIATA per 27")

Esempi:
  node switch-navbar-style.cjs 1
  node switch-navbar-style.cjs modern
  node switch-navbar-style.cjs 4        # Per monitor 27"
  node switch-navbar-style.cjs large     # Alias per versione 4
`);
} else {
  switchNavbarStyle(version);
} 