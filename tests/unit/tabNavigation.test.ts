import { describe, expect, it } from 'vitest';
import { getNextTabIndex, TAB_IDS } from '../../src/lib/tabNavigation';

describe('getNextTabIndex', () => {
  const count = TAB_IDS.length;

  it('avance vers la droite avec ArrowRight', () => {
    expect(getNextTabIndex(0, 'ArrowRight', count)).toBe(1);
  });

  it('boucle sur le premier onglet après le dernier avec ArrowRight', () => {
    expect(getNextTabIndex(count - 1, 'ArrowRight', count)).toBe(0);
  });

  it('recule vers la gauche avec ArrowLeft', () => {
    expect(getNextTabIndex(1, 'ArrowLeft', count)).toBe(0);
  });

  it('boucle sur le dernier onglet avant le premier avec ArrowLeft', () => {
    expect(getNextTabIndex(0, 'ArrowLeft', count)).toBe(count - 1);
  });

  it('va au premier onglet avec Home', () => {
    expect(getNextTabIndex(2, 'Home', count)).toBe(0);
  });

  it('va au dernier onglet avec End', () => {
    expect(getNextTabIndex(0, 'End', count)).toBe(count - 1);
  });

  it('ignore les touches non gérées et renvoie le même index', () => {
    expect(getNextTabIndex(1, 'Enter', count)).toBe(1);
  });

  it("reste sur place quand il n'y a qu'un seul onglet", () => {
    expect(getNextTabIndex(0, 'ArrowRight', 1)).toBe(0);
  });
});

describe('TAB_IDS', () => {
  it('définit les quatre onglets du Pip-Boy', () => {
    expect(TAB_IDS).toEqual(['status', 'inv', 'data', 'map']);
  });
});
