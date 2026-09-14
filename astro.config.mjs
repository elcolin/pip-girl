// @ts-check
import { defineConfig } from 'astro/config';

// Les scripts sont toujours externalisés (jamais inlinés dans le HTML) pour
// rester compatibles avec la CSP stricte sans `unsafe-inline` (voir public/_headers).
export default defineConfig({
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
