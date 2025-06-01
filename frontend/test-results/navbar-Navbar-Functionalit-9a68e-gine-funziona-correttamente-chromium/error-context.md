# Test info

- Name: Navbar Functionality >> navigazione tra le pagine funziona correttamente
- Location: D:\sito\frontend\tests\navbar.spec.js:53:3

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveClass(expected)

Locator: locator('.unified-navbar')
Expected pattern: /navbar-solid/
Received string:  "unified-navbar"
Call log:
  - expect.toHaveClass with timeout 5000ms
  - waiting for locator('.unified-navbar')
    9 × locator resolved to <nav class="unified-navbar">…</nav>
      - unexpected value "unified-navbar"

    at D:\sito\frontend\tests\navbar.spec.js:60:26
```

# Page snapshot

```yaml
- navigation:
  - link "TechnoBridge":
    - /url: /
    - img "TechnoBridge"
  - link "Home":
    - /url: /
    - img
    - text: Home
  - link "Chi Siamo":
    - /url: /chi-siamo
    - img
    - text: Chi Siamo
  - link "Scopo del Sito":
    - /url: /scopo-del-sito
    - img
    - text: Scopo del Sito
  - link "FAQ & Supporto":
    - /url: /faq
    - img
    - text: FAQ & Supporto
  - link "Contatti":
    - /url: /contatti
    - img
    - text: Contatti
  - link "Prodotti":
    - /url: /prodotti-pronti
    - img
    - text: Prodotti
  - link "Login":
    - /url: /login
    - img
    - text: Login
  - link "Registrati":
    - /url: /register
    - img
    - text: Registrati
- heading "Chi Siamo" [level=1]:
  - text: Chi Siamo
  - img
- paragraph:
  - text: Siamo una piattaforma innovativa che connette
  - strong: clienti
  - text: con
  - strong: sviluppatori professionali
  - text: per realizzare progetti software su misura, garantendo sicurezza, qualità e trasparenza in ogni fase.
- img
- text: Sicurezza Garantita
- img
- text: Community Verificata
- img
- text: Pagamenti Protetti
- img
- heading "La Nostra Missione" [level=5]
- paragraph: Democratizzare l'accesso allo sviluppo software di qualità
- heading "La Nostra Storia" [level=2]:
  - img
  - text: La Nostra Storia
- paragraph: Come è nata l'idea di Domanda & Software
- heading "La Nostra Storia" [level=3]
- paragraph: Domanda & Software nasce dall'esperienza diretta dei problemi che affliggono il mondo dello sviluppo software freelance. Troppi progetti falliscono per mancanza di fiducia, comunicazione inadeguata e assenza di garanzie.
- heading "67%" [level=4]
- text: Progetti falliti per mancanza di fiducia
- heading "43%" [level=4]
- text: Sviluppatori sottopagati
- heading "La Nostra Soluzione" [level=4]
- paragraph:
  - text: Abbiamo creato una piattaforma che mette al centro la
  - strong: fiducia
  - text: ", la"
  - strong: trasparenza
  - text: e la
  - strong: sicurezza
  - text: . Ogni progetto è supervisionato, ogni pagamento è garantito, ogni comunicazione è protetta.
- heading "94%" [level=4]
- text: Progetti completati con successo
- heading "4.8/5" [level=4]
- text: Soddisfazione media clienti
- img
- heading "Innovazione Continua" [level=4]
- heading "I Nostri Valori" [level=2]:
  - img
  - text: I Nostri Valori
- paragraph: I principi che guidano ogni nostra decisione
- img
- heading "Sicurezza Prima di Tutto" [level=5]
- paragraph: Ogni transazione è protetta, ogni comunicazione è supervisionata, ogni progetto è garantito. La sicurezza non è un'opzione, è la base.
- img
- heading "Trasparenza Totale" [level=5]
- paragraph: "Nessun costo nascosto, nessuna sorpresa. Tutto è chiaro fin dall'inizio: prezzi, tempi, commissioni e garanzie."
- img
- heading "Comunità di Qualità" [level=5]
- paragraph: Solo professionisti verificati e clienti seri. Costruiamo una comunità basata sulla competenza e sul rispetto reciproco.
- heading "Come Lavoriamo" [level=2]:
  - img
  - text: Come Lavoriamo
- paragraph: Il nostro approccio unico per garantire il successo
- text: "1"
- img
- heading "Verifica Rigorosa" [level=6]
- paragraph: "Ogni sviluppatore viene verificato: competenze, portfolio, identità e referenze professionali."
- text: "2"
- img
- heading "Matching Intelligente" [level=6]
- paragraph: Algoritmi avanzati abbinano progetti e sviluppatori in base a competenze e compatibilità.
- text: "3"
- img
- heading "Supervisione Attiva" [level=6]
- paragraph: Ogni progetto è monitorato da admin esperti che intervengono in caso di problemi.
- text: "4"
- img
- heading "Garanzia Totale" [level=6]
- paragraph: Pagamenti protetti, qualità garantita, soddisfazione assicurata o rimborso.
- img
- heading "Privacy e Sicurezza" [level=3]
- paragraph: La vostra privacy è sacra per noi
- img
- heading "Crittografia End-to-End" [level=6]
- paragraph: Tutte le comunicazioni sono crittografate con standard militari. Nessuno può intercettare i vostri messaggi.
- img
- heading "Dati Protetti GDPR" [level=6]
- paragraph: Conformità totale al GDPR europeo. I vostri dati sono al sicuro e utilizzati solo per i servizi richiesti.
- img
- heading "Pagamenti Sicuri" [level=6]
- paragraph: Integrazione con i migliori gateway di pagamento mondiali. Le vostre carte sono sempre protette.
- img
- heading "Identità Verificata" [level=6]
- paragraph: Processo di verifica dell'identità per tutti gli utenti. Solo persone reali nella nostra piattaforma.
- img
- strong: "Impegno per la Privacy:"
- text: Non vendiamo mai i vostri dati a terzi. Non inviamo spam. Non tracciamo le vostre attività al di fuori della piattaforma. La vostra fiducia è il nostro bene più prezioso.
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Navbar Functionality', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     await page.goto('/');
   6 |     // Aspetta che la navbar sia caricata
   7 |     await page.waitForSelector('.unified-navbar');
   8 |   });
   9 |
   10 |   test('navbar è visibile sulla homepage', async ({ page }) => {
   11 |     const navbar = page.locator('.unified-navbar');
   12 |     await expect(navbar).toBeVisible();
   13 |     
   14 |     // Verifica che abbia la classe transparent sulla homepage
   15 |     await expect(navbar).toHaveClass(/navbar-transparent/);
   16 |   });
   17 |
   18 |   test('logo TechnoBridge è presente e cliccabile', async ({ page }) => {
   19 |     const logo = page.locator('img[alt="TechnoBridge"]');
   20 |     await expect(logo).toBeVisible();
   21 |     
   22 |     // Test click sul logo - dovrebbe rimanere sulla home
   23 |     await logo.click();
   24 |     await expect(page).toHaveURL('/');
   25 |   });
   26 |
   27 |   test('tutti i link di navigazione sono presenti per utenti non autenticati', async ({ page }) => {
   28 |     // Verifica presenza link principali
   29 |     await expect(page.locator('text=Home')).toBeVisible();
   30 |     await expect(page.locator('text=Chi Siamo')).toBeVisible();
   31 |     await expect(page.locator('text=Scopo del Sito')).toBeVisible();
   32 |     await expect(page.locator('text=FAQ & Supporto')).toBeVisible();
   33 |     await expect(page.locator('text=Contatti')).toBeVisible();
   34 |     await expect(page.locator('text=Prodotti')).toBeVisible();
   35 |   });
   36 |
   37 |   test('pulsanti Login e Registrati sono presenti e funzionanti', async ({ page }) => {
   38 |     await expect(page.locator('text=Login')).toBeVisible();
   39 |     await expect(page.locator('text=Registrati')).toBeVisible();
   40 |     
   41 |     // Test click su Login
   42 |     await page.click('text=Login');
   43 |     await expect(page).toHaveURL('/login');
   44 |     
   45 |     // Torna alla home
   46 |     await page.goto('/');
   47 |     
   48 |     // Test click su Registrati
   49 |     await page.click('text=Registrati');
   50 |     await expect(page).toHaveURL('/registrazione');
   51 |   });
   52 |
   53 |   test('navigazione tra le pagine funziona correttamente', async ({ page }) => {
   54 |     // Test navigazione a Chi Siamo
   55 |     await page.click('text=Chi Siamo');
   56 |     await expect(page).toHaveURL('/chi-siamo');
   57 |     
   58 |     // Verifica che la navbar cambi stile (non più transparent)
   59 |     const navbar = page.locator('.unified-navbar');
>  60 |     await expect(navbar).toHaveClass(/navbar-solid/);
      |                          ^ Error: Timed out 5000ms waiting for expect(locator).toHaveClass(expected)
   61 |     
   62 |     // Test navigazione a Contatti
   63 |     await page.click('text=Contatti');
   64 |     await expect(page).toHaveURL('/contatti');
   65 |     
   66 |     // Test navigazione a Prodotti
   67 |     await page.click('text=Prodotti');
   68 |     await expect(page).toHaveURL('/prodotti');
   69 |     
   70 |     // Test ritorno alla home
   71 |     await page.click('text=Home');
   72 |     await expect(page).toHaveURL('/');
   73 |     
   74 |     // Verifica che torni transparent
   75 |     await expect(navbar).toHaveClass(/navbar-transparent/);
   76 |   });
   77 |
   78 |   test('auto-hide funziona correttamente', async ({ page }) => {
   79 |     const navbar = page.locator('.unified-navbar');
   80 |     
   81 |     // Inizialmente visibile
   82 |     await expect(navbar).not.toHaveClass(/navbar-hidden/);
   83 |     
   84 |     // Scrolla verso il basso
   85 |     await page.evaluate(() => window.scrollTo(0, 500));
   86 |     await page.waitForTimeout(300); // Aspetta animazione
   87 |     
   88 |     // Dovrebbe essere nascosta
   89 |     await expect(navbar).toHaveClass(/navbar-hidden/);
   90 |     
   91 |     // Scrolla verso l'alto
   92 |     await page.evaluate(() => window.scrollTo(0, 0));
   93 |     await page.waitForTimeout(300); // Aspetta animazione
   94 |     
   95 |     // Dovrebbe essere visibile di nuovo
   96 |     await expect(navbar).not.toHaveClass(/navbar-hidden/);
   97 |   });
   98 | });
   99 |
  100 | test.describe('Mobile Navbar', () => {
  101 |   test.use({ viewport: { width: 375, height: 667 } }); // iPhone size
  102 |
  103 |   test.beforeEach(async ({ page }) => {
  104 |     await page.goto('/');
  105 |     await page.waitForSelector('.unified-navbar');
  106 |   });
  107 |
  108 |   test('menu mobile toggle è visibile su mobile', async ({ page }) => {
  109 |     const mobileToggle = page.locator('[aria-label="Toggle menu"]');
  110 |     await expect(mobileToggle).toBeVisible();
  111 |     
  112 |     // Menu desktop dovrebbe essere nascosto
  113 |     const desktopMenu = page.locator('.navbar-nav');
  114 |     await expect(desktopMenu).not.toBeVisible();
  115 |   });
  116 |
  117 |   test('menu mobile si apre e chiude correttamente', async ({ page }) => {
  118 |     const mobileToggle = page.locator('[aria-label="Toggle menu"]');
  119 |     
  120 |     // Apri menu mobile
  121 |     await mobileToggle.click();
  122 |     
  123 |     const mobileMenu = page.locator('.mobile-menu-overlay.active');
  124 |     await expect(mobileMenu).toBeVisible();
  125 |     
  126 |     // Verifica che i link siano visibili nel menu mobile
  127 |     await expect(page.locator('.mobile-nav-link:has-text("Home")')).toBeVisible();
  128 |     await expect(page.locator('.mobile-nav-link:has-text("Chi Siamo")')).toBeVisible();
  129 |     
  130 |     // Chiudi menu mobile cliccando di nuovo sul toggle
  131 |     await mobileToggle.click();
  132 |     await expect(mobileMenu).not.toBeVisible();
  133 |   });
  134 |
  135 |   test('navigazione mobile funziona correttamente', async ({ page }) => {
  136 |     // Apri menu mobile
  137 |     await page.click('[aria-label="Toggle menu"]');
  138 |     
  139 |     // Clicca su un link nel menu mobile
  140 |     await page.click('.mobile-nav-link:has-text("Chi Siamo")');
  141 |     
  142 |     // Verifica navigazione
  143 |     await expect(page).toHaveURL('/chi-siamo');
  144 |     
  145 |     // Verifica che il menu si sia chiuso automaticamente
  146 |     const mobileMenu = page.locator('.mobile-menu-overlay.active');
  147 |     await expect(mobileMenu).not.toBeVisible();
  148 |   });
  149 |
  150 |   test('menu mobile si chiude cliccando sul backdrop', async ({ page }) => {
  151 |     // Apri menu mobile
  152 |     await page.click('[aria-label="Toggle menu"]');
  153 |     
  154 |     const mobileMenu = page.locator('.mobile-menu-overlay.active');
  155 |     await expect(mobileMenu).toBeVisible();
  156 |     
  157 |     // Clicca sul backdrop (area fuori dal menu)
  158 |     await page.click('.mobile-menu-overlay', { position: { x: 10, y: 10 } });
  159 |     
  160 |     // Menu dovrebbe chiudersi
```