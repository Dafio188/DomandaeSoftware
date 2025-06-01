# Test info

- Name: Role-based Access >> admin può accedere all'area amministrativa
- Location: D:\sito\frontend\tests\auth-flow.spec.js:149:3

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('.admin-navbar')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('.admin-navbar')

    at D:\sito\frontend\tests\auth-flow.spec.js:162:31
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
   62 |     await expect(page).toHaveURL('/login');
   63 |   });
   64 |
   65 |   test('persistenza autenticazione dopo refresh', async ({ page }) => {
   66 |     // Simula utente già autenticato
   67 |     await page.addInitScript(() => {
   68 |       localStorage.setItem('token', 'fake-jwt-token');
   69 |       localStorage.setItem('user', JSON.stringify({
   70 |         username: 'cliente_test',
   71 |         role: 'cliente'
   72 |       }));
   73 |     });
   74 |     
   75 |     await page.goto('/');
   76 |     
   77 |     // Verifica che l'utente sia ancora autenticato
   78 |     await expect(page.locator('text=cliente_test')).toBeVisible();
   79 |     
   80 |     // Refresh della pagina
   81 |     await page.reload();
   82 |     
   83 |     // Verifica che l'autenticazione persista
   84 |     await expect(page.locator('text=cliente_test')).toBeVisible();
   85 |   });
   86 |
   87 |   test('navigazione tra pagine con utente autenticato', async ({ page }) => {
   88 |     // Simula utente autenticato
   89 |     await page.addInitScript(() => {
   90 |       localStorage.setItem('token', 'fake-jwt-token');
   91 |       localStorage.setItem('user', JSON.stringify({
   92 |         username: 'cliente_test',
   93 |         role: 'cliente'
   94 |       }));
   95 |     });
   96 |     
   97 |     await page.goto('/');
   98 |     
   99 |     // Test navigazione a dashboard
  100 |     await page.click('text=Dashboard');
  101 |     await expect(page).toHaveURL('/dashboard');
  102 |     await expect(page.locator('text=cliente_test')).toBeVisible();
  103 |     
  104 |     // Test navigazione a progetti
  105 |     await page.click('text=I Miei Progetti');
  106 |     await expect(page).toHaveURL('/le-tue-idee');
  107 |     await expect(page.locator('text=cliente_test')).toBeVisible();
  108 |     
  109 |     // Test ritorno alla home
  110 |     await page.click('text=Home');
  111 |     await expect(page).toHaveURL('/');
  112 |     await expect(page.locator('text=cliente_test')).toBeVisible();
  113 |   });
  114 | });
  115 |
  116 | test.describe('Role-based Access', () => {
  117 |   test('cliente può accedere alle sue pagine', async ({ page }) => {
  118 |     await page.addInitScript(() => {
  119 |       localStorage.setItem('token', 'fake-jwt-token');
  120 |       localStorage.setItem('user', JSON.stringify({
  121 |         username: 'cliente_test',
  122 |         role: 'cliente'
  123 |       }));
  124 |     });
  125 |     
  126 |     await page.goto('/dashboard');
  127 |     await expect(page).toHaveURL('/dashboard');
  128 |     
  129 |     // Verifica menu specifico per cliente
  130 |     await expect(page.locator('text=I Miei Progetti')).toBeVisible();
  131 |   });
  132 |
  133 |   test('fornitore può accedere alle sue pagine', async ({ page }) => {
  134 |     await page.addInitScript(() => {
  135 |       localStorage.setItem('token', 'fake-jwt-token');
  136 |       localStorage.setItem('user', JSON.stringify({
  137 |         username: 'fornitore_test',
  138 |         role: 'fornitore'
  139 |       }));
  140 |     });
  141 |     
  142 |     await page.goto('/dashboard');
  143 |     await expect(page).toHaveURL('/dashboard');
  144 |     
  145 |     // Verifica che il ruolo sia mostrato correttamente
  146 |     await expect(page.locator('text=fornitore')).toBeVisible();
  147 |   });
  148 |
  149 |   test('admin può accedere all\'area amministrativa', async ({ page }) => {
  150 |     await page.addInitScript(() => {
  151 |       localStorage.setItem('token', 'fake-jwt-token');
  152 |       localStorage.setItem('user', JSON.stringify({
  153 |         username: 'admin_test',
  154 |         role: 'admin'
  155 |       }));
  156 |     });
  157 |     
  158 |     await page.goto('/dashboard/admin');
  159 |     
  160 |     // Verifica che sia mostrata la navbar admin
  161 |     const adminNavbar = page.locator('.admin-navbar');
> 162 |     await expect(adminNavbar).toBeVisible();
      |                               ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  163 |     
  164 |     // Verifica menu admin
  165 |     await expect(page.locator('text=Gestione Utenti')).toBeVisible();
  166 |     await expect(page.locator('text=Gestione Progetti')).toBeVisible();
  167 |   });
  168 | });
  169 |
  170 | test.describe('Session Management', () => {
  171 |   test('logout pulisce correttamente la sessione', async ({ page }) => {
  172 |     // Simula utente autenticato
  173 |     await page.addInitScript(() => {
  174 |       localStorage.setItem('token', 'fake-jwt-token');
  175 |       localStorage.setItem('user', JSON.stringify({
  176 |         username: 'cliente_test',
  177 |         role: 'cliente'
  178 |       }));
  179 |     });
  180 |     
  181 |     await page.goto('/');
  182 |     
  183 |     // Verifica autenticazione
  184 |     await expect(page.locator('text=cliente_test')).toBeVisible();
  185 |     
  186 |     // Logout
  187 |     await page.click('.user-button');
  188 |     await page.click('text=Logout');
  189 |     
  190 |     // Verifica che localStorage sia pulito
  191 |     const token = await page.evaluate(() => localStorage.getItem('token'));
  192 |     const user = await page.evaluate(() => localStorage.getItem('user'));
  193 |     
  194 |     expect(token).toBeNull();
  195 |     expect(user).toBeNull();
  196 |   });
  197 |
  198 |   test('token scaduto reindirizza al login', async ({ page }) => {
  199 |     // Simula token scaduto
  200 |     await page.addInitScript(() => {
  201 |       localStorage.setItem('token', 'expired-token');
  202 |       localStorage.setItem('user', JSON.stringify({
  203 |         username: 'cliente_test',
  204 |         role: 'cliente'
  205 |       }));
  206 |     });
  207 |     
  208 |     // Mock della risposta API per token scaduto
  209 |     await page.route('**/api/**', route => {
  210 |       route.fulfill({
  211 |         status: 401,
  212 |         contentType: 'application/json',
  213 |         body: JSON.stringify({ error: 'Token expired' })
  214 |       });
  215 |     });
  216 |     
  217 |     await page.goto('/dashboard');
  218 |     
  219 |     // Dovrebbe essere reindirizzato al login
  220 |     await expect(page).toHaveURL('/login');
  221 |   });
  222 | });
  223 |
  224 | test.describe('Error Handling', () => {
  225 |   test('gestisce errori di login correttamente', async ({ page }) => {
  226 |     await page.goto('/login');
  227 |     
  228 |     // Mock di errore di login
  229 |     await page.route('**/api/auth/login', route => {
  230 |       route.fulfill({
  231 |         status: 401,
  232 |         contentType: 'application/json',
  233 |         body: JSON.stringify({ error: 'Invalid credentials' })
  234 |       });
  235 |     });
  236 |     
  237 |     // Prova login con credenziali errate
  238 |     await page.fill('[name="username"]', 'wrong_user');
  239 |     await page.fill('[name="password"]', 'wrong_password');
  240 |     await page.click('button[type="submit"]');
  241 |     
  242 |     // Verifica che rimanga sulla pagina di login
  243 |     await expect(page).toHaveURL('/login');
  244 |     
  245 |     // Verifica messaggio di errore (se implementato)
  246 |     await expect(page.locator('text=Invalid credentials')).toBeVisible();
  247 |   });
  248 |
  249 |   test('gestisce errori di rete durante autenticazione', async ({ page }) => {
  250 |     await page.goto('/login');
  251 |     
  252 |     // Mock di errore di rete
  253 |     await page.route('**/api/auth/login', route => {
  254 |       route.abort('failed');
  255 |     });
  256 |     
  257 |     await page.fill('[name="username"]', 'cliente_test');
  258 |     await page.fill('[name="password"]', 'admin123');
  259 |     await page.click('button[type="submit"]');
  260 |     
  261 |     // Verifica gestione errore di rete
  262 |     await expect(page).toHaveURL('/login');
```