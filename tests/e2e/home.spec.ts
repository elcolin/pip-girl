import { expect, test } from '@playwright/test';

test.describe('Page d’accueil — CV Pip-Boy', () => {
  test('charge la page avec le bon titre et la langue française', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CV interactif Pip-Boy/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  });

  test('affiche les quatre onglets et la section Status par défaut', async ({ page }) => {
    await page.goto('/');

    const tabs = page.getByRole('tab');
    await expect(tabs).toHaveCount(4);
    await expect(page.getByRole('tab', { name: 'Status' })).toHaveAttribute('aria-selected', 'true');

    const statusPanel = page.locator('#panel-status');
    await expect(statusPanel).toBeVisible();
    await expect(statusPanel.getByRole('heading', { name: 'Status' })).toBeVisible();

    await expect(page.locator('#panel-inv')).toBeHidden();
    await expect(page.locator('#panel-data')).toBeHidden();
    await expect(page.locator('#panel-map')).toBeHidden();
  });

  test('la navigation par clic affiche le panneau correspondant', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('tab', { name: 'Data' }).click();

    await expect(page.getByRole('tab', { name: 'Data' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#panel-data')).toBeVisible();
    await expect(page.locator('#panel-status')).toBeHidden();
    await expect(
      page.locator('#panel-data').getByRole('heading', { name: /Data/ }),
    ).toBeVisible();
  });

  test('la navigation clavier (flèches) déplace le focus et l’onglet actif', async ({ page }) => {
    await page.goto('/');

    const statusTab = page.getByRole('tab', { name: 'Status' });
    const invTab = page.getByRole('tab', { name: 'Inv' });

    await statusTab.focus();
    await page.keyboard.press('ArrowRight');

    await expect(invTab).toBeFocused();
    await expect(invTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#panel-inv')).toBeVisible();

    await page.keyboard.press('ArrowLeft');
    await expect(statusTab).toBeFocused();
    await expect(statusTab).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('End');
    await expect(page.getByRole('tab', { name: 'Map' })).toBeFocused();
  });

  test('le bouton "passer" de la séquence de boot masque celle-ci immédiatement', async ({ page }) => {
    await page.goto('/');

    const skipButton = page.getByRole('button', { name: /Passer/ });
    await expect(skipButton).toBeVisible();
    await skipButton.click();

    await expect(page.locator('#boot-sequence')).toBeHidden();
  });

  test('accessibilité de base : structure ARIA tabs cohérente', async ({ page }) => {
    await page.goto('/');

    const tablist = page.getByRole('tablist');
    await expect(tablist).toBeVisible();

    const tabs = await page.getByRole('tab').all();
    for (const tab of tabs) {
      const controls = await tab.getAttribute('aria-controls');
      expect(controls).toBeTruthy();
      if (controls) {
        await expect(page.locator(`#${controls}`)).toHaveAttribute('role', 'tabpanel');
      }
    }
  });

  test('la section Map expose un lien mailto et des liens externes', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: 'Map' }).click();

    const mapPanel = page.locator('#panel-map');
    await expect(mapPanel.getByRole('link', { name: /contact@example\.invalid/ })).toHaveAttribute(
      'href',
      /^mailto:/,
    );
    await expect(mapPanel.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', /github\.com/);
  });
});
