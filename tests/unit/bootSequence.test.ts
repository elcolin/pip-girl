import { describe, expect, it } from 'vitest';
import { advanceBoot, createInitialBootState, skipBoot } from '../../src/lib/bootSequence';

const LINES = ['INITIALISATION...', 'CHARGEMENT DES MODULES...', 'PRÊT.'];

describe('createInitialBootState', () => {
  it('démarre sans ligne visible et non terminé', () => {
    const state = createInitialBootState();
    expect(state).toEqual({ visibleLines: [], lineIndex: 0, done: false });
  });
});

describe('advanceBoot', () => {
  it('révèle une ligne supplémentaire à chaque appel', () => {
    let state = createInitialBootState();
    state = advanceBoot(state, LINES);
    expect(state.visibleLines).toEqual(['INITIALISATION...']);
    expect(state.done).toBe(false);

    state = advanceBoot(state, LINES);
    expect(state.visibleLines).toEqual(['INITIALISATION...', 'CHARGEMENT DES MODULES...']);
    expect(state.done).toBe(false);
  });

  it('marque la séquence comme terminée après la dernière ligne', () => {
    let state = createInitialBootState();
    for (let i = 0; i < LINES.length; i += 1) {
      state = advanceBoot(state, LINES);
    }
    expect(state.visibleLines).toEqual(LINES);
    expect(state.done).toBe(true);
  });

  it("n'ajoute plus de ligne une fois terminé", () => {
    let state = createInitialBootState();
    for (let i = 0; i < LINES.length + 3; i += 1) {
      state = advanceBoot(state, LINES);
    }
    expect(state.visibleLines).toEqual(LINES);
    expect(state.done).toBe(true);
  });
});

describe('skipBoot', () => {
  it('révèle toutes les lignes immédiatement et termine la séquence', () => {
    const state = skipBoot(LINES);
    expect(state).toEqual({ visibleLines: LINES, lineIndex: LINES.length, done: true });
  });

  it('gère une liste de lignes vide', () => {
    const state = skipBoot([]);
    expect(state).toEqual({ visibleLines: [], lineIndex: 0, done: true });
  });
});
