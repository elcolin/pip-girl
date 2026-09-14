export interface BootState {
  visibleLines: string[];
  lineIndex: number;
  done: boolean;
}

export function createInitialBootState(): BootState {
  return { visibleLines: [], lineIndex: 0, done: false };
}

/** Révèle une ligne supplémentaire de la séquence de boot. Idempotent une fois terminé. */
export function advanceBoot(state: BootState, lines: string[]): BootState {
  if (state.done) return state;

  const lineIndex = state.lineIndex + 1;
  return {
    visibleLines: lines.slice(0, lineIndex),
    lineIndex,
    done: lineIndex >= lines.length,
  };
}

/** Révèle toutes les lignes d'un coup (skip, ou respect de prefers-reduced-motion). */
export function skipBoot(lines: string[]): BootState {
  return { visibleLines: [...lines], lineIndex: lines.length, done: true };
}
