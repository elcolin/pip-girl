# pip-girl

CV interactif façon Pip-Boy 3000 (Fallout) — site vitrine statique, écran
vert monochrome, effet CRT, navigation par onglets STATUS / INV / DATA /
MAP. Construit avec Astro + TypeScript, développé en TDD, hébergé
statiquement sur Cloudflare Pages.

Voir `CLAUDE.md` pour la vision détaillée du projet et les contraintes
techniques.

## Commandes

| Commande            | Action                                             |
| -------------------- | --------------------------------------------------- |
| `npm install`         | Installe les dépendances                             |
| `npm run dev`         | Serveur de dev Astro (`localhost:4321`)              |
| `npm run build`       | Build statique dans `dist/`                          |
| `npm run preview`     | Prévisualise le build de production                  |
| `npm run test`        | Vitest en mode watch                                 |
| `npm run test:ci`     | Vitest (run unique) + rapport de couverture           |
| `npm run test:e2e`    | Tests Playwright (build + preview via `webServer`)    |
| `npm run lint`        | ESLint + `astro check` (typecheck)                    |

## Structure

```
src/
  components/     # composants Astro (écran Pip-Boy, onglets, boot sequence…)
  lib/            # logique testée (parsing CV, machine à états boot, navigation onglets)
  data/           # contenu du CV en JSON (jamais codé en dur dans les composants)
  styles/         # thème Pip-Boy (custom properties, effets CRT)
  pages/          # routes Astro
tests/
  unit/           # Vitest
  e2e/            # Playwright
public/
  _headers        # headers de sécurité (Cloudflare Pages)
```

## Contenu du CV

Les données dans `src/data/*.json` sont actuellement des **placeholders
génériques** (nom, entreprises, email, liens). À remplacer par les
informations réelles, en concertation avec la personne concernée, avant
toute publication.

## Déploiement

Statique, pensé pour Cloudflare Pages : build command `npm run build`,
output directory `dist/`. Voir la section Hébergement de `CLAUDE.md`.
