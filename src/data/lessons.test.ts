import { describe, it, expect } from 'vitest';
import { LESSONS } from './lessons';

describe('lessons data', () => {
  it('has no duplicate lesson ids', () => {
    const ids = LESSONS.map(l => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every prerequisite points at a real lesson id', () => {
    const ids = new Set(LESSONS.map(l => l.id));
    for (const lesson of LESSONS) {
      for (const prereq of lesson.prerequisites) {
        expect(ids.has(prereq), `"${lesson.id}" lists unknown prerequisite "${prereq}"`).toBe(true);
      }
    }
  });

  it('every exercise id is unique within its lesson', () => {
    for (const lesson of LESSONS) {
      const ids = lesson.exercises.map(e => e.id);
      expect(new Set(ids).size, `duplicate exercise id in "${lesson.id}"`).toBe(ids.length);
    }
  });

  it('MCQ "correct" always indexes a real option', () => {
    for (const lesson of LESSONS) {
      for (const ex of lesson.exercises) {
        if (ex.type !== 'mcq') continue;
        expect(ex.correct).toBeGreaterThanOrEqual(0);
        expect(ex.correct).toBeLessThan(ex.options.length);
      }
    }
  });

  it('match exercises have unique left AND right values (matching UI relies on this)', () => {
    for (const lesson of LESSONS) {
      for (const ex of lesson.exercises) {
        if (ex.type !== 'match') continue;
        const lefts = ex.pairs.map(p => p.left);
        const rights = ex.pairs.map(p => p.right);
        expect(new Set(lefts).size, `duplicate left value in "${ex.id}"`).toBe(lefts.length);
        expect(new Set(rights).size, `duplicate right value in "${ex.id}"`).toBe(rights.length);
        expect(ex.pairs.length).toBeGreaterThanOrEqual(2);
      }
    }
  });
});
