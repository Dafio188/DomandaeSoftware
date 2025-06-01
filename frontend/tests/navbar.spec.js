import { test, expect } from '@playwright/test';

test.describe('Navbar Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Aspetta che la navbar sia caricata
    await page.waitForSelector('.unified-navbar');
  });

  test('navbar è visibile sulla homepage', async ({ page }) => {
    const navbar = page.locator('.unified-navbar');
    await expect(navbar).toBeVisible();
    
    // Verifica che abbia la classe transparent sulla homepage
    await expect(navbar).toHaveClass(/navbar-transparent/);
  });

  test('logo TechnoBridge è presente e cliccabile', async ({ page }) => {
    const logo = page.locator('img[alt="TechnoBridge"]');
    await expect(logo).toBeVisible();
    
    // Test click sul logo - dovrebbe rimanere sulla home
    await logo.click();
    await expect(page).toHaveURL('/');
  });

  test('tutti i link di navigazione sono presenti per utenti non autenticati', async ({ page }) => {
    // Verifica presenza link principali
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=Chi Siamo')).toBeVisible();
    await expect(page.locator('text=Scopo del Sito')).toBeVisible();
    await expect(page.locator('text=FAQ & Supporto')).toBeVisible();
    await expect(page.locator('text=Contatti')).toBeVisible();
    await expect(page.locator('text=Prodotti')).toBeVisible();
  });

  test('pulsanti Login e Registrati sono presenti e funzionanti', async ({ page }) => {
    await expect(page.locator('text=Login')).toBeVisible();
    await expect(page.locator('text=Registrati')).toBeVisible();
    
    // Test click su Login
    await page.click('text=Login');
    await expect(page).toHaveURL('/login');
    
    // Torna alla home
    await page.goto('/');
    
    // Test click su Registrati
    await page.click('text=Registrati');
    await expect(page).toHaveURL('/registrazione');
  });

  test('navigazione tra le pagine funziona correttamente', async ({ page }) => {
    // Test navigazione a Chi Siamo
    await page.click('text=Chi Siamo');
    await expect(page).toHaveURL('/chi-siamo');
    
    // Verifica che la navbar cambi stile (non più transparent)
    const navbar = page.locator('.unified-navbar');
    await expect(navbar).toHaveClass(/navbar-solid/);
    
    // Test navigazione a Contatti
    await page.click('text=Contatti');
    await expect(page).toHaveURL('/contatti');
    
    // Test navigazione a Prodotti
    await page.click('text=Prodotti');
    await expect(page).toHaveURL('/prodotti');
    
    // Test ritorno alla home
    await page.click('text=Home');
    await expect(page).toHaveURL('/');
    
    // Verifica che torni transparent
    await expect(navbar).toHaveClass(/navbar-transparent/);
  });

  test('auto-hide funziona correttamente', async ({ page }) => {
    const navbar = page.locator('.unified-navbar');
    
    // Inizialmente visibile
    await expect(navbar).not.toHaveClass(/navbar-hidden/);
    
    // Scrolla verso il basso
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300); // Aspetta animazione
    
    // Dovrebbe essere nascosta
    await expect(navbar).toHaveClass(/navbar-hidden/);
    
    // Scrolla verso l'alto
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300); // Aspetta animazione
    
    // Dovrebbe essere visibile di nuovo
    await expect(navbar).not.toHaveClass(/navbar-hidden/);
  });
});

test.describe('Mobile Navbar', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone size

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.unified-navbar');
  });

  test('menu mobile toggle è visibile su mobile', async ({ page }) => {
    const mobileToggle = page.locator('[aria-label="Toggle menu"]');
    await expect(mobileToggle).toBeVisible();
    
    // Menu desktop dovrebbe essere nascosto
    const desktopMenu = page.locator('.navbar-nav');
    await expect(desktopMenu).not.toBeVisible();
  });

  test('menu mobile si apre e chiude correttamente', async ({ page }) => {
    const mobileToggle = page.locator('[aria-label="Toggle menu"]');
    
    // Apri menu mobile
    await mobileToggle.click();
    
    const mobileMenu = page.locator('.mobile-menu-overlay.active');
    await expect(mobileMenu).toBeVisible();
    
    // Verifica che i link siano visibili nel menu mobile
    await expect(page.locator('.mobile-nav-link:has-text("Home")')).toBeVisible();
    await expect(page.locator('.mobile-nav-link:has-text("Chi Siamo")')).toBeVisible();
    
    // Chiudi menu mobile cliccando di nuovo sul toggle
    await mobileToggle.click();
    await expect(mobileMenu).not.toBeVisible();
  });

  test('navigazione mobile funziona correttamente', async ({ page }) => {
    // Apri menu mobile
    await page.click('[aria-label="Toggle menu"]');
    
    // Clicca su un link nel menu mobile
    await page.click('.mobile-nav-link:has-text("Chi Siamo")');
    
    // Verifica navigazione
    await expect(page).toHaveURL('/chi-siamo');
    
    // Verifica che il menu si sia chiuso automaticamente
    const mobileMenu = page.locator('.mobile-menu-overlay.active');
    await expect(mobileMenu).not.toBeVisible();
  });

  test('menu mobile si chiude cliccando sul backdrop', async ({ page }) => {
    // Apri menu mobile
    await page.click('[aria-label="Toggle menu"]');
    
    const mobileMenu = page.locator('.mobile-menu-overlay.active');
    await expect(mobileMenu).toBeVisible();
    
    // Clicca sul backdrop (area fuori dal menu)
    await page.click('.mobile-menu-overlay', { position: { x: 10, y: 10 } });
    
    // Menu dovrebbe chiudersi
    await expect(mobileMenu).not.toBeVisible();
  });
});

test.describe('Navbar con utente autenticato', () => {
  test.beforeEach(async ({ page }) => {
    // Mock dell'autenticazione
    await page.addInitScript(() => {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('user', JSON.stringify({
        username: 'testuser',
        role: 'cliente'
      }));
    });
    
    await page.goto('/');
    await page.waitForSelector('.unified-navbar');
  });

  test('mostra menu utente per utenti autenticati', async ({ page }) => {
    // Verifica presenza nome utente e ruolo
    await expect(page.locator('text=testuser')).toBeVisible();
    await expect(page.locator('text=cliente')).toBeVisible();
    
    // Verifica che i pulsanti Login/Registrati non siano visibili
    await expect(page.locator('text=Login')).not.toBeVisible();
    await expect(page.locator('text=Registrati')).not.toBeVisible();
  });

  test('dropdown utente funziona correttamente', async ({ page }) => {
    // Clicca sul pulsante utente
    await page.click('.user-button');
    
    // Verifica che il dropdown sia visibile
    await expect(page.locator('text=Impostazioni')).toBeVisible();
    await expect(page.locator('text=Logout')).toBeVisible();
    
    // Test click fuori per chiudere
    await page.click('body', { position: { x: 100, y: 100 } });
    await expect(page.locator('text=Impostazioni')).not.toBeVisible();
  });

  test('logout funziona correttamente', async ({ page }) => {
    // Apri dropdown utente
    await page.click('.user-button');
    
    // Clicca logout
    await page.click('text=Logout');
    
    // Verifica redirect a login o home
    await page.waitForURL(/\/(login|)$/);
    
    // Verifica che localStorage sia pulito
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const user = await page.evaluate(() => localStorage.getItem('user'));
    
    expect(token).toBeNull();
    expect(user).toBeNull();
  });

  test('mostra menu dashboard per utenti autenticati', async ({ page }) => {
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=I Miei Progetti')).toBeVisible();
    
    // Test navigazione alla dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL('/dashboard');
  });

  test('navigazione progetti funziona', async ({ page }) => {
    await page.click('text=I Miei Progetti');
    await expect(page).toHaveURL('/le-tue-idee');
  });
});

test.describe('Navbar Admin', () => {
  test.beforeEach(async ({ page }) => {
    // Mock dell'autenticazione admin
    await page.addInitScript(() => {
      localStorage.setItem('token', 'fake-admin-token');
      localStorage.setItem('user', JSON.stringify({
        username: 'admin',
        role: 'admin'
      }));
    });
    
    await page.goto('/dashboard/admin');
  });

  test('mostra navbar admin per amministratori', async ({ page }) => {
    // Verifica che sia mostrata la navbar admin
    const adminNavbar = page.locator('.admin-navbar');
    await expect(adminNavbar).toBeVisible();
    
    // Verifica menu admin specifico
    await expect(page.locator('text=Gestione Utenti')).toBeVisible();
    await expect(page.locator('text=Gestione Progetti')).toBeVisible();
    await expect(page.locator('text=Statistiche')).toBeVisible();
  });

  test('link "Torna al Sito" funziona', async ({ page }) => {
    await page.click('text=Torna al Sito');
    await expect(page).toHaveURL('/');
    
    // Dovrebbe mostrare la navbar normale
    const unifiedNavbar = page.locator('.unified-navbar');
    await expect(unifiedNavbar).toBeVisible();
  });
});

test.describe('Responsive Design Cross-Browser', () => {
  const viewports = [
    { name: 'Desktop Large', width: 1920, height: 1080 },
    { name: 'Desktop Medium', width: 1366, height: 768 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile Large', width: 414, height: 896 },
    { name: 'Mobile Small', width: 375, height: 667 }
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`navbar è responsive su ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      
      const navbar = page.locator('.unified-navbar');
      await expect(navbar).toBeVisible();
      
      // Verifica che la navbar non sia rotta
      const navbarBox = await navbar.boundingBox();
      expect(navbarBox.width).toBeLessThanOrEqual(width);
      
      // Su mobile, verifica che il toggle sia visibile
      if (width < 992) {
        const mobileToggle = page.locator('[aria-label="Toggle menu"]');
        await expect(mobileToggle).toBeVisible();
      } else {
        // Su desktop, verifica che il menu sia visibile
        const desktopMenu = page.locator('.navbar-nav');
        await expect(desktopMenu).toBeVisible();
      }
    });
  });
});

test.describe('Performance e Accessibilità', () => {
  test('navbar ha attributi di accessibilità corretti', async ({ page }) => {
    await page.goto('/');
    
    const navbar = page.locator('.unified-navbar');
    
    // Verifica attributi ARIA
    await expect(navbar).toHaveAttribute('role', 'navigation');
    
    const mobileToggle = page.locator('[aria-label="Toggle menu"]');
    await expect(mobileToggle).toHaveAttribute('aria-expanded');
    
    // Test navigazione da tastiera
    await mobileToggle.focus();
    await page.keyboard.press('Enter');
    
    const mobileMenu = page.locator('.mobile-menu-overlay.active');
    await expect(mobileMenu).toBeVisible();
  });

  test('navbar si carica rapidamente', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForSelector('.unified-navbar');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // Caricamento entro 3 secondi
  });

  test('animazioni sono fluide', async ({ page }) => {
    await page.goto('/');
    
    // Test animazione auto-hide
    await page.evaluate(() => window.scrollTo(0, 500));
    
    // Verifica che l'animazione sia completata entro un tempo ragionevole
    await page.waitForFunction(() => {
      const navbar = document.querySelector('.unified-navbar');
      return navbar.classList.contains('navbar-hidden');
    }, { timeout: 1000 });
  });
}); 