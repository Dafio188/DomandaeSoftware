import { test, expect } from '@playwright/test';

test.describe('Basic Navbar Tests', () => {
  test('navbar è presente sulla homepage', async ({ page }) => {
    await page.goto('/');
    
    // Aspetta che la pagina sia caricata
    await page.waitForLoadState('networkidle');
    
    // Verifica che la navbar sia presente
    const navbar = page.locator('nav, .navbar, .unified-navbar');
    await expect(navbar.first()).toBeVisible();
  });

  test('logo è presente e visibile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Cerca il logo in vari modi
    const logo = page.locator('img[alt*="TechnoBridge"], img[alt*="logo"], .navbar-brand img');
    await expect(logo.first()).toBeVisible();
  });

  test('menu di navigazione è presente', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verifica che ci siano link di navigazione
    const navLinks = page.locator('a[href], .nav-link');
    await expect(navLinks.first()).toBeVisible();
    
    // Conta i link (dovrebbero essere almeno 3)
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(2);
  });

  test('la pagina si carica senza errori', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error));
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verifica che non ci siano errori JavaScript
    expect(errors).toHaveLength(0);
  });

  test('responsive: menu mobile su viewport piccolo', async ({ page }) => {
    // Imposta viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Cerca il toggle del menu mobile
    const mobileToggle = page.locator('button[aria-label*="menu"], .navbar-toggler, [aria-label*="Toggle"]');
    
    if (await mobileToggle.count() > 0) {
      await expect(mobileToggle.first()).toBeVisible();
    }
  });
}); 