import { describe, it, expect } from 'vitest';
import { BADGES, type BadgeStats } from './badges';

const baseStats: BadgeStats = {
  completedLessons: [],
  totalXP: 0,
  streak: 0,
  alphabetQuizScore: 0,
  learnedCards: 0,
  lessonsToday: 0,
};

function find(id: string) {
  const badge = BADGES.find(b => b.id === id);
  if (!badge) throw new Error(`Badge "${id}" not found — was it renamed?`);
  return badge;
}

describe('badge conditions', () => {
  it('every badge has a unique id', () => {
    const ids = BADGES.map(b => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('first-step unlocks only once a lesson is completed', () => {
    expect(find('first-step').condition(baseStats)).toBe(false);
    expect(find('first-step').condition({ ...baseStats, completedLessons: ['alphabet-intro'] })).toBe(true);
  });

  it('streak-3 and streak-7 respect their thresholds', () => {
    expect(find('streak-3').condition({ ...baseStats, streak: 2 })).toBe(false);
    expect(find('streak-3').condition({ ...baseStats, streak: 3 })).toBe(true);
    expect(find('streak-7').condition({ ...baseStats, streak: 6 })).toBe(false);
    expect(find('streak-7').condition({ ...baseStats, streak: 7 })).toBe(true);
  });

  it('xp-100 and xp-500 respect their thresholds', () => {
    expect(find('xp-100').condition({ ...baseStats, totalXP: 99 })).toBe(false);
    expect(find('xp-100').condition({ ...baseStats, totalXP: 100 })).toBe(true);
    expect(find('xp-500').condition({ ...baseStats, totalXP: 499 })).toBe(false);
    expect(find('xp-500').condition({ ...baseStats, totalXP: 500 })).toBe(true);
  });

  it('flashcard-master requires 20 learned cards', () => {
    expect(find('flashcard-master').condition({ ...baseStats, learnedCards: 19 })).toBe(false);
    expect(find('flashcard-master').condition({ ...baseStats, learnedCards: 20 })).toBe(true);
  });
});
