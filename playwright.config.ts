import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
  },
  webServer: {
    command: 'npm run preview -- --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    // Astro détecte les environnements d'agents IA et lance `preview` en
    // arrière-plan par défaut, ce qui casse l'attente de démarrage de
    // Playwright : on force le mode premier plan.
    env: { ASTRO_PREVIEW_BACKGROUND: 'false' },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
