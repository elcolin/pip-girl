/** Identifiants des onglets du Pip-Boy, dans leur ordre d'affichage. */
export const TAB_IDS = ['status', 'inv', 'data', 'map'] as const;

export type TabId = (typeof TAB_IDS)[number];

/**
 * Calcule l'index de l'onglet à activer suite à une touche clavier,
 * selon le pattern ARIA "tabs" (flèches, Home, End, avec bouclage).
 */
export function getNextTabIndex(currentIndex: number, key: string, tabCount: number): number {
  switch (key) {
    case 'ArrowRight':
      return (currentIndex + 1) % tabCount;
    case 'ArrowLeft':
      return (currentIndex - 1 + tabCount) % tabCount;
    case 'Home':
      return 0;
    case 'End':
      return tabCount - 1;
    default:
      return currentIndex;
  }
}
