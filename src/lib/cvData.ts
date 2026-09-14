export interface ExperienceEntry {
  id: string;
  role: string;
  organization: string;
  /** Format "YYYY-MM" */
  start: string;
  /** Format "YYYY-MM", ou null si en cours */
  end: string | null;
  location: string;
  description: string;
  highlights: string[];
  tech: string[];
}

const SKILL_LEVEL_LABELS: Record<number, string> = {
  1: 'Novice',
  2: 'Débutant',
  3: 'Intermédiaire',
  4: 'Confirmé',
  5: 'Expert',
};

function yearOf(isoMonth: string): string {
  return isoMonth.slice(0, 4);
}

/** Formate une période "YYYY-MM" → "YYYY-MM" en libellé d'années lisible. */
export function formatPeriod(start: string, end: string | null): string {
  const startYear = yearOf(start);
  if (end === null) return `${startYear} — présent`;

  const endYear = yearOf(end);
  return startYear === endYear ? startYear : `${startYear} — ${endYear}`;
}

/** Traduit un niveau de compétence (1-5) en libellé accessible. */
export function getSkillLevelLabel(level: number): string {
  const label = SKILL_LEVEL_LABELS[level];
  if (!label) {
    throw new RangeError(`Niveau de compétence invalide : ${level} (attendu 1-5)`);
  }
  return label;
}

/** Trie les expériences de la plus récente à la plus ancienne, sans muter l'entrée. */
export function sortExperienceByDateDesc(entries: ExperienceEntry[]): ExperienceEntry[] {
  return [...entries].sort((a, b) => (a.start < b.start ? 1 : a.start > b.start ? -1 : 0));
}
