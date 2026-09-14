import { describe, expect, it } from 'vitest';
import {
  formatPeriod,
  getSkillLevelLabel,
  sortExperienceByDateDesc,
  type ExperienceEntry,
} from '../../src/lib/cvData';

describe('formatPeriod', () => {
  it('formate une période avec date de début et de fin', () => {
    expect(formatPeriod('2019-09', '2022-05')).toBe('2019 — 2022');
  });

  it('affiche "présent" quand la date de fin est nulle', () => {
    expect(formatPeriod('2022-06', null)).toBe('2022 — présent');
  });

  it('affiche une seule année quand début et fin sont la même année', () => {
    expect(formatPeriod('2026-09', '2026-11')).toBe('2026');
  });
});

describe('getSkillLevelLabel', () => {
  it.each([
    [1, 'Novice'],
    [2, 'Débutant'],
    [3, 'Intermédiaire'],
    [4, 'Confirmé'],
    [5, 'Expert'],
  ])('associe le niveau %i au libellé "%s"', (level, label) => {
    expect(getSkillLevelLabel(level)).toBe(label);
  });

  it('rejette un niveau hors de la plage 1-5', () => {
    expect(() => getSkillLevelLabel(0)).toThrow();
    expect(() => getSkillLevelLabel(6)).toThrow();
  });
});

describe('sortExperienceByDateDesc', () => {
  const entries: ExperienceEntry[] = [
    {
      id: 'a',
      role: 'A',
      organization: 'Org A',
      start: '2019-09',
      end: '2022-05',
      location: '',
      description: '',
      highlights: [],
      tech: [],
    },
    {
      id: 'b',
      role: 'B',
      organization: 'Org B',
      start: '2022-06',
      end: null,
      location: '',
      description: '',
      highlights: [],
      tech: [],
    },
    {
      id: 'c',
      role: 'C',
      organization: 'Org C',
      start: '2018-01',
      end: '2019-08',
      location: '',
      description: '',
      highlights: [],
      tech: [],
    },
  ];

  it('trie les expériences de la plus récente à la plus ancienne', () => {
    const sorted = sortExperienceByDateDesc(entries);
    expect(sorted.map((entry) => entry.id)).toEqual(['b', 'a', 'c']);
  });

  it("ne modifie pas le tableau d'origine", () => {
    const original = [...entries];
    sortExperienceByDateDesc(entries);
    expect(entries).toEqual(original);
  });
});
