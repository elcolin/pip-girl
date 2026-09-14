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
  components/     # PipBoyScreen, TabNav, BootSequence
    sections/     # StatusSection, InvSection, DataSection, MapSection
  lib/            # logique testée (cvData, bootSequence, tabNavigation)
  data/           # contenu du CV en JSON (jamais codé en dur dans les composants)
  styles/         # thème Pip-Boy (pipboy.css : custom properties, effets CRT)
  pages/          # routes Astro
tests/
  unit/           # Vitest — 26 tests, 100% couverture lignes/fonctions sur src/lib
  e2e/            # Playwright (navigation clavier, ARIA, contenu, boot)
public/
  _headers        # headers de sécurité (CSP, HSTS, X-Frame-Options DENY…)
  favicon.ico / favicon.svg  # encore le favicon par défaut du scaffold Astro (placeholder)
```

## Contenu du CV

Les données dans `src/data/{profile,skills,experience,contact}.json` sont
actuellement des **placeholders entièrement fictifs** (nom, entreprises,
email, liens). À remplacer par les informations réelles, en concertation
avec la personne concernée, avant toute publication.

## Favicon

Le favicon (`public/favicon.ico`, `public/favicon.svg`) est encore celui
généré par défaut par le scaffold Astro — à remplacer par une icône propre
au thème Pip-Boy avant publication.

## Déploiement

Statique, pensé pour Cloudflare Pages : build command `npm run build`,
output directory `dist/`. Voir la section Hébergement de `CLAUDE.md`.
