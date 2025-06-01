import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Pulisci localStorage prima di ogni test
    await page.addInitScript(() => {
      localStorage.clear();
    });
  });

  test('flusso completo: guest → login → dashboard → logout', async ({ page }) => {
    // 1. Inizia come guest
    await page.goto('/');
    
    // Verifica stato guest
    await expect(page.locator('text=Login')).toBeVisible();
    await expect(page.locator('text=Registrati')).toBeVisible();
    
    // 2. Vai alla pagina di login
    await page.click('text=Login');
    await expect(page).toHaveURL('/login');
    
    // 3. Simula login (assumendo che esista un form di login)
    // Nota: Questo dipende dall'implementazione del form di login
    await page.fill('[name="username"]', 'cliente_test');
    await page.fill('[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // 4. Verifica redirect alla dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // 5. Verifica che la navbar mostri l'utente autenticato
    await expect(page.locator('text=cliente_test')).toBeVisible();
    await expect(page.locator('text=cliente')).toBeVisible();
    
    // 6. Verifica che i pulsanti Login/Registrati non siano più visibili
    await expect(page.locator('text=Login')).not.toBeVisible();
    await expect(page.locator('text=Registrati')).not.toBeVisible();
    
    // 7. Verifica menu dashboard
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=I Miei Progetti')).toBeVisible();
    
    // 8. Test logout
    await page.click('.user-button');
    await page.click('text=Logout');
    
    // 9. Verifica redirect a login
    await expect(page).toHaveURL('/login');
    
    // 10. Torna alla home e verifica stato guest
    await page.goto('/');
    await expect(page.locator('text=Login')).toBeVisible();
    await expect(page.locator('text=Registrati')).toBeVisible();
  });

  test('accesso diretto a pagina protetta senza autenticazione', async ({ page }) => {
    // Prova ad accedere direttamente alla dashboard
    await page.goto('/dashboard');
    
    // Dovrebbe essere reindirizzato al login
    await expect(page).toHaveURL('/login');
  });

  test('persistenza autenticazione dopo refresh', async ({ page }) => {
    // Simula utente già autenticato
    await page.addInitScript(() => {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        username: 'cliente_test',
        role: 'cliente'
      }));
    });
    
    await page.goto('/');
    
    // Verifica che l'utente sia ancora autenticato
    await expect(page.locator('text=cliente_test')).toBeVisible();
    
    // Refresh della pagina
    await page.reload();
    
    // Verifica che l'autenticazione persista
    await expect(page.locator('text=cliente_test')).toBeVisible();
  });

  test('navigazione tra pagine con utente autenticato', async ({ page }) => {
    // Simula utente autenticato
    await page.addInitScript(() => {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        username: 'cliente_test',
        role: 'cliente'
      }));
    });
    
    await page.goto('/');
    
    // Test navigazione a dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=cliente_test')).toBeVisible();
    
    // Test navigazione a progetti
    await page.click('text=I Miei Progetti');
    await expect(page).toHaveURL('/le-tue-idee');
    await expect(page.locator('text=cliente_test')).toBeVisible();
    
    // Test ritorno alla home
    await page.click('text=Home');
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=cliente_test')).toBeVisible();
  });
});

test.describe('Role-based Access', () => {
  test('cliente può accedere alle sue pagine', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        username: 'cliente_test',
        role: 'cliente'
      }));
    });
    
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/dashboard');
    
    // Verifica menu specifico per cliente
    await expect(page.locator('text=I Miei Progetti')).toBeVisible();
  });

  test('fornitore può accedere alle sue pagine', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        username: 'fornitore_test',
        role: 'fornitore'
      }));
    });
    
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/dashboard');
    
    // Verifica che il ruolo sia mostrato correttamente
    await expect(page.locator('text=fornitore')).toBeVisible();
  });

  test('admin può accedere all\'area amministrativa', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        username: 'admin_test',
        role: 'admin'
      }));
    });
    
    await page.goto('/dashboard/admin');
    
    // Verifica che sia mostrata la navbar admin
    const adminNavbar = page.locator('.admin-navbar');
    await expect(adminNavbar).toBeVisible();
    
    // Verifica menu admin
    await expect(page.locator('text=Gestione Utenti')).toBeVisible();
    await expect(page.locator('text=Gestione Progetti')).toBeVisible();
  });
});

test.describe('Session Management', () => {
  test('logout pulisce correttamente la sessione', async ({ page }) => {
    // Simula utente autenticato
    await page.addInitScript(() => {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        username: 'cliente_test',
        role: 'cliente'
      }));
    });
    
    await page.goto('/');
    
    // Verifica autenticazione
    await expect(page.locator('text=cliente_test')).toBeVisible();
    
    // Logout
    await page.click('.user-button');
    await page.click('text=Logout');
    
    // Verifica che localStorage sia pulito
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const user = await page.evaluate(() => localStorage.getItem('user'));
    
    expect(token).toBeNull();
    expect(user).toBeNull();
  });

  test('token scaduto reindirizza al login', async ({ page }) => {
    // Simula token scaduto
    await page.addInitScript(() => {
      localStorage.setItem('token', 'expired-token');
      localStorage.setItem('user', JSON.stringify({
        username: 'cliente_test',
        role: 'cliente'
      }));
    });
    
    // Mock della risposta API per token scaduto
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Token expired' })
      });
    });
    
    await page.goto('/dashboard');
    
    // Dovrebbe essere reindirizzato al login
    await expect(page).toHaveURL('/login');
  });
});

test.describe('Error Handling', () => {
  test('gestisce errori di login correttamente', async ({ page }) => {
    await page.goto('/login');
    
    // Mock di errore di login
    await page.route('**/api/auth/login', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid credentials' })
      });
    });
    
    // Prova login con credenziali errate
    await page.fill('[name="username"]', 'wrong_user');
    await page.fill('[name="password"]', 'wrong_password');
    await page.click('button[type="submit"]');
    
    // Verifica che rimanga sulla pagina di login
    await expect(page).toHaveURL('/login');
    
    // Verifica messaggio di errore (se implementato)
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('gestisce errori di rete durante autenticazione', async ({ page }) => {
    await page.goto('/login');
    
    // Mock di errore di rete
    await page.route('**/api/auth/login', route => {
      route.abort('failed');
    });
    
    await page.fill('[name="username"]', 'cliente_test');
    await page.fill('[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Verifica gestione errore di rete
    await expect(page).toHaveURL('/login');
  });
}); 