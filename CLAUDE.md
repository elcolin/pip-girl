# pip-girl — CV interactif façon Pip-Boy

## Concision

Réponses et code concis par défaut : va droit au but, pas de blabla ni de
récapitulatif de ce qui vient d'être fait sauf si demandé. Pas
d'abstraction, de config ou de fichier non demandés. Un commentaire
seulement quand le "pourquoi" n'est pas évident dans le code.

## Workflow git

- Ne jamais commit/push/merger sur `main` sans demande explicite ; passer
  par une branche pour toute modification substantielle.
- Messages de commit courts et descriptifs, à l'impératif.
- Ne jamais forcer un déploiement Cloudflare Pages manuellement : le
  déploiement passe par le push Git (voir section Hébergement).

## Conventions de nommage

- Composants Astro en PascalCase (`PipBoyScreen.astro`, `TabNav.astro`).
- Fonctions/variables TypeScript en camelCase, types/interfaces en
  PascalCase.
- Fichiers utilitaires et tests en camelCase (`bootSequence.ts`,
  `bootSequence.test.ts`).
- Un fichier = un rôle clair ; pas de fichier fourre-tout.

## Vision du projet

Un CV / site vitrine personnel qui reprend l'interface du **Pip-Boy 3000** de
Fallout 3 : écran vert monochrome, effet CRT (scanlines, léger flicker,
glow), police type terminal, et une navigation par onglets façon
STAT / INV / DATA / MAP réinterprétés en sections du CV (ex : `STATUS`
pour le profil, `INV` pour les compétences/stack, `DATA` pour
expériences/projets, `MAP` pour contact). Le ton doit rester crédible comme
CV professionnel malgré l'habillage rétro-futuriste — c'est un site vitrine
qui doit convaincre un recruteur, pas juste un gadget.

Contraintes non négociables du projet :
- **Hébergeable** facilement, en statique.
- **Sécurisé** par défaut (peu de surface d'attaque, headers stricts).
- **Développé en TDD** (tests avant code, sur toute la logique non triviale).
- Le langage/stack est libre — choix documentés ci-dessous, à respecter
  sauf décision explicite contraire de l'utilisatrice.

## Stack technique retenue

- **Astro 7** + **TypeScript** — génère du HTML statique par défaut, JS
  minimal côté client (islands architecture), idéal pour un CV : rapide,
  peu de JS = peu de surface d'attaque, bon score Lighthouse/SEO out of
  the box.
- **CSS natif** dans `src/styles/pipboy.css` (custom properties pour le
  thème Pip-Boy : vert, fond noir, glow/scanlines/flicker), avec
  `prefers-reduced-motion` respecté et contraste vérifié WCAG AA. Pas de
  framework CSS lourd.
- **Vitest** (+ `@vitest/coverage-v8`) pour la logique pure de
  `src/lib/{cvData,bootSequence,tabNavigation}.ts` (parsing des données du
  CV, machine à états du boot sequence, navigation entre onglets) : 26
  tests, 100% de couverture lignes/fonctions sur `src/lib`.
- **Playwright** pour les tests end-to-end (`tests/e2e/home.spec.ts`) :
  chargement de la page, navigation clic/clavier entre les onglets,
  cohérence ARIA des tabs, bouton "passer" du boot, liens de contact.
- **ESLint 9** (flat config, `eslint.config.js`) avec
  `@typescript-eslint` et `eslint-plugin-astro`, complété par
  `astro check` (typecheck) via `npm run lint`.
- **Données du CV en JSON** dans
  `src/data/{profile,skills,experience,contact}.json`, séparées de la
  présentation — jamais de contenu personnel codé en dur dans les
  composants. Ce sont pour l'instant des **données placeholder
  fictives**, à remplacer avant toute publication.

Ne pas introduire de backend / base de données / auth pour ce projet : un
CV vitrine n'en a pas besoin, et chaque composant serveur ajouté est de la
surface d'attaque en plus à justifier explicitly.

## Méthodologie TDD — obligatoire

Pour toute logique non purement présentationnelle (parsing des données du
CV, machine à états du boot sequence, gestion des onglets/routes,
utilitaires) :

1. Écrire le test en premier (Vitest, ou Playwright pour le comportement
   utilisateur observable) et le voir échouer.
2. Écrire le minimum de code pour le faire passer.
3. Refactorer une fois le test au vert, sans changer le comportement
   testé.

Le pur balisage/CSS statique sans logique n'a pas besoin de test unitaire,
mais toute page/section doit être couverte par au moins un test Playwright
de rendu (la page se charge, les sections attendues sont présentes,
accessibles au clavier).

Commandes attendues dans `package.json` (à créer/maintenir) :
- `npm run test` → Vitest en mode watch pour le dev
- `npm run test:ci` → Vitest run + coverage, non-interactif
- `npm run test:e2e` → Playwright
- `npm run dev`, `npm run build`, `npm run preview` → cycle Astro standard
- `npm run lint` → ESLint + typecheck (`astro check`)

Ne jamais considérer une fonctionnalité terminée sans que ses tests
passent en CI.

## Sécurité

- **Headers stricts** via le fichier `public/_headers` (format Cloudflare
  Pages) : au minimum
  - `Content-Security-Policy` restrictive (pas de `unsafe-inline` pour les
    scripts ; si besoin de styles inline pour l'effet CRT, préférer des
    classes CSS à des attributs `style` inline, ou whitelister via nonce/hash)
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY` (le site n'a pas vocation à être embarqué en
    iframe)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` restrictive (désactiver caméra/micro/géoloc etc.)
  - `Strict-Transport-Security` (HSTS)
- **Pas de secrets côté client** : aucune clé API, aucun webhook privé
  dans le code livré au navigateur. Un éventuel formulaire de contact doit
  passer par un service tiers (ex : Cloudflare Turnstile + Cloudflare
  Worker/Pages Function) plutôt que d'exposer une clé.
- **Dépendances** : garder la stack minimale, exécuter `npm audit`
  régulièrement, préférer peu de dépendances plutôt que beaucoup de petits
  paquets.
- **Pas d'exécution de contenu utilisateur** : si un easter egg façon
  "console" est ajouté, il doit être purement décoratif côté client
  (jamais de `eval`, jamais d'injection HTML non échappée).
- **CV/données personnelles** : garder les informations sensibles (email,
  téléphone) hors du dépôt public si besoin, ou acceptées consciemment
  comme publiques — vérifier avec l'utilisatrice avant publication finale.

## Hébergement — Cloudflare Pages

- Déploiement en statique sur **Cloudflare Pages**, build command
  `npm run build`, output directory `dist/`.
- Headers de sécurité définis dans `public/_headers` (voir section
  Sécurité) — Cloudflare Pages les applique automatiquement.
- HTTPS/TLS géré nativement par Cloudflare, à forcer (redirection HTTP →
  HTTPS activée dans les réglages du projet).
- Domaine personnalisé optionnel, à configurer plus tard si
  l'utilisatrice en fournit un.
- Prévoir un déploiement via Git (push sur `main` → build auto) plutôt que
  des déploiements manuels, pour garder une trace et éviter les
  divergences entre le dépôt et le site en ligne.

## Accessibilité

L'esthétique CRT/scanlines ne doit pas nuire à l'accessibilité :
- Respecter `prefers-reduced-motion` (désactiver/adoucir flicker et
  scanlines animées si l'utilisateur le demande).
- Contraste texte vert sur fond noir à vérifier (viser WCAG AA minimum
  malgré le monochrome).
- Navigation complète au clavier entre les onglets/sections.
- Contenu du CV consultable par un lecteur d'écran même si l'habillage
  visuel est stylisé (pas de texte uniquement en `canvas`/image).

## Structure du projet (à faire évoluer au fur et à mesure)

```
src/
  components/     # PipBoyScreen, TabNav, BootSequence
    sections/     # StatusSection, InvSection, DataSection, MapSection
  lib/            # logique testée : cvData, bootSequence, tabNavigation
  data/           # contenu du CV en JSON (profile, skills, experience, contact)
  styles/         # thème Pip-Boy (pipboy.css : custom properties, effets CRT)
  pages/          # routes Astro (index.astro)
tests/
  unit/           # Vitest (miroir de src/lib)
  e2e/            # Playwright (home.spec.ts)
public/
  _headers        # headers de sécurité Cloudflare Pages
  favicon.ico / favicon.svg  # placeholders du scaffold Astro, à remplacer
```

## Agents

Subagents disponibles dans `.claude/agents/`, maintenus par
`agent-generator` :

- **code-generator** — implémente une fonctionnalité/correctif sur le
  site (Astro/TypeScript) en TDD strict.
- **code-reviewer** — relit une diff/branche/PR (lecture seule),
  priorise correction > sécurité > TDD > style.
- **documentation-generator** — maintient `README.md` et les sections
  Stack/Architecture du `CLAUDE.md` à partir du code réel.
- **tech-architect** — analyse l'état du projet et propose prochaines
  étapes/roadmap, ne code pas.
- **agent-generator** — crée/modifie/nettoie les définitions d'agents et
  garde cette section à jour.

## Notes

- Choix de style validés avec l'utilisatrice : thème **Pip-Boy** (pas le
  terminal RobCo), hébergement **Cloudflare Pages**.
- Si une fonctionnalité sort de ce périmètre (auth, backend, base de
  données), en discuter avant de l'ajouter — le projet est pensé pour
  rester un site statique simple et sûr.
