# Test info

- Name: Navbar Admin >> mostra navbar admin per amministratori
- Location: D:\sito\frontend\tests\navbar.spec.js:250:3

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('.admin-navbar')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('.admin-navbar')

    at D:\sito\frontend\tests\navbar.spec.js:253:31
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
- heading "Accedi" [level=2]
- text: Username
- textbox
- text: Password
- textbox
- button "Accedi"
- link "🔑 Password dimenticata?":
  - /url: /password-reset
- paragraph: Non hai un account? Registrati tramite l'amministratore.
```

# Test source

```ts
  153 |     
  154 |     const mobileMenu = page.locator('.mobile-menu-overlay.active');
  155 |     await expect(mobileMenu).toBeVisible();
  156 |     
  157 |     // Clicca sul backdrop (area fuori dal menu)
  158 |     await page.click('.mobile-menu-overlay', { position: { x: 10, y: 10 } });
  159 |     
  160 |     // Menu dovrebbe chiudersi
  161 |     await expect(mobileMenu).not.toBeVisible();
  162 |   });
  163 | });
  164 |
  165 | test.describe('Navbar con utente autenticato', () => {
  166 |   test.beforeEach(async ({ page }) => {
  167 |     // Mock dell'autenticazione
  168 |     await page.addInitScript(() => {
  169 |       localStorage.setItem('token', 'fake-jwt-token');
  170 |       localStorage.setItem('user', JSON.stringify({
  171 |         username: 'testuser',
  172 |         role: 'cliente'
  173 |       }));
  174 |     });
  175 |     
  176 |     await page.goto('/');
  177 |     await page.waitForSelector('.unified-navbar');
  178 |   });
  179 |
  180 |   test('mostra menu utente per utenti autenticati', async ({ page }) => {
  181 |     // Verifica presenza nome utente e ruolo
  182 |     await expect(page.locator('text=testuser')).toBeVisible();
  183 |     await expect(page.locator('text=cliente')).toBeVisible();
  184 |     
  185 |     // Verifica che i pulsanti Login/Registrati non siano visibili
  186 |     await expect(page.locator('text=Login')).not.toBeVisible();
  187 |     await expect(page.locator('text=Registrati')).not.toBeVisible();
  188 |   });
  189 |
  190 |   test('dropdown utente funziona correttamente', async ({ page }) => {
  191 |     // Clicca sul pulsante utente
  192 |     await page.click('.user-button');
  193 |     
  194 |     // Verifica che il dropdown sia visibile
  195 |     await expect(page.locator('text=Impostazioni')).toBeVisible();
  196 |     await expect(page.locator('text=Logout')).toBeVisible();
  197 |     
  198 |     // Test click fuori per chiudere
  199 |     await page.click('body', { position: { x: 100, y: 100 } });
  200 |     await expect(page.locator('text=Impostazioni')).not.toBeVisible();
  201 |   });
  202 |
  203 |   test('logout funziona correttamente', async ({ page }) => {
  204 |     // Apri dropdown utente
  205 |     await page.click('.user-button');
  206 |     
  207 |     // Clicca logout
  208 |     await page.click('text=Logout');
  209 |     
  210 |     // Verifica redirect a login o home
  211 |     await page.waitForURL(/\/(login|)$/);
  212 |     
  213 |     // Verifica che localStorage sia pulito
  214 |     const token = await page.evaluate(() => localStorage.getItem('token'));
  215 |     const user = await page.evaluate(() => localStorage.getItem('user'));
  216 |     
  217 |     expect(token).toBeNull();
  218 |     expect(user).toBeNull();
  219 |   });
  220 |
  221 |   test('mostra menu dashboard per utenti autenticati', async ({ page }) => {
  222 |     await expect(page.locator('text=Dashboard')).toBeVisible();
  223 |     await expect(page.locator('text=I Miei Progetti')).toBeVisible();
  224 |     
  225 |     // Test navigazione alla dashboard
  226 |     await page.click('text=Dashboard');
  227 |     await expect(page).toHaveURL('/dashboard');
  228 |   });
  229 |
  230 |   test('navigazione progetti funziona', async ({ page }) => {
  231 |     await page.click('text=I Miei Progetti');
  232 |     await expect(page).toHaveURL('/le-tue-idee');
  233 |   });
  234 | });
  235 |
  236 | test.describe('Navbar Admin', () => {
  237 |   test.beforeEach(async ({ page }) => {
  238 |     // Mock dell'autenticazione admin
  239 |     await page.addInitScript(() => {
  240 |       localStorage.setItem('token', 'fake-admin-token');
  241 |       localStorage.setItem('user', JSON.stringify({
  242 |         username: 'admin',
  243 |         role: 'admin'
  244 |       }));
  245 |     });
  246 |     
  247 |     await page.goto('/dashboard/admin');
  248 |   });
  249 |
  250 |   test('mostra navbar admin per amministratori', async ({ page }) => {
  251 |     // Verifica che sia mostrata la navbar admin
  252 |     const adminNavbar = page.locator('.admin-navbar');
> 253 |     await expect(adminNavbar).toBeVisible();
      |                               ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  254 |     
  255 |     // Verifica menu admin specifico
  256 |     await expect(page.locator('text=Gestione Utenti')).toBeVisible();
  257 |     await expect(page.locator('text=Gestione Progetti')).toBeVisible();
  258 |     await expect(page.locator('text=Statistiche')).toBeVisible();
  259 |   });
  260 |
  261 |   test('link "Torna al Sito" funziona', async ({ page }) => {
  262 |     await page.click('text=Torna al Sito');
  263 |     await expect(page).toHaveURL('/');
  264 |     
  265 |     // Dovrebbe mostrare la navbar normale
  266 |     const unifiedNavbar = page.locator('.unified-navbar');
  267 |     await expect(unifiedNavbar).toBeVisible();
  268 |   });
  269 | });
  270 |
  271 | test.describe('Responsive Design Cross-Browser', () => {
  272 |   const viewports = [
  273 |     { name: 'Desktop Large', width: 1920, height: 1080 },
  274 |     { name: 'Desktop Medium', width: 1366, height: 768 },
  275 |     { name: 'Tablet', width: 768, height: 1024 },
  276 |     { name: 'Mobile Large', width: 414, height: 896 },
  277 |     { name: 'Mobile Small', width: 375, height: 667 }
  278 |   ];
  279 |
  280 |   viewports.forEach(({ name, width, height }) => {
  281 |     test(`navbar è responsive su ${name} (${width}x${height})`, async ({ page }) => {
  282 |       await page.setViewportSize({ width, height });
  283 |       await page.goto('/');
  284 |       
  285 |       const navbar = page.locator('.unified-navbar');
  286 |       await expect(navbar).toBeVisible();
  287 |       
  288 |       // Verifica che la navbar non sia rotta
  289 |       const navbarBox = await navbar.boundingBox();
  290 |       expect(navbarBox.width).toBeLessThanOrEqual(width);
  291 |       
  292 |       // Su mobile, verifica che il toggle sia visibile
  293 |       if (width < 992) {
  294 |         const mobileToggle = page.locator('[aria-label="Toggle menu"]');
  295 |         await expect(mobileToggle).toBeVisible();
  296 |       } else {
  297 |         // Su desktop, verifica che il menu sia visibile
  298 |         const desktopMenu = page.locator('.navbar-nav');
  299 |         await expect(desktopMenu).toBeVisible();
  300 |       }
  301 |     });
  302 |   });
  303 | });
  304 |
  305 | test.describe('Performance e Accessibilità', () => {
  306 |   test('navbar ha attributi di accessibilità corretti', async ({ page }) => {
  307 |     await page.goto('/');
  308 |     
  309 |     const navbar = page.locator('.unified-navbar');
  310 |     
  311 |     // Verifica attributi ARIA
  312 |     await expect(navbar).toHaveAttribute('role', 'navigation');
  313 |     
  314 |     const mobileToggle = page.locator('[aria-label="Toggle menu"]');
  315 |     await expect(mobileToggle).toHaveAttribute('aria-expanded');
  316 |     
  317 |     // Test navigazione da tastiera
  318 |     await mobileToggle.focus();
  319 |     await page.keyboard.press('Enter');
  320 |     
  321 |     const mobileMenu = page.locator('.mobile-menu-overlay.active');
  322 |     await expect(mobileMenu).toBeVisible();
  323 |   });
  324 |
  325 |   test('navbar si carica rapidamente', async ({ page }) => {
  326 |     const startTime = Date.now();
  327 |     
  328 |     await page.goto('/');
  329 |     await page.waitForSelector('.unified-navbar');
  330 |     
  331 |     const loadTime = Date.now() - startTime;
  332 |     expect(loadTime).toBeLessThan(3000); // Caricamento entro 3 secondi
  333 |   });
  334 |
  335 |   test('animazioni sono fluide', async ({ page }) => {
  336 |     await page.goto('/');
  337 |     
  338 |     // Test animazione auto-hide
  339 |     await page.evaluate(() => window.scrollTo(0, 500));
  340 |     
  341 |     // Verifica che l'animazione sia completata entro un tempo ragionevole
  342 |     await page.waitForFunction(() => {
  343 |       const navbar = document.querySelector('.unified-navbar');
  344 |       return navbar.classList.contains('navbar-hidden');
  345 |     }, { timeout: 1000 });
  346 |   });
  347 | }); 
```