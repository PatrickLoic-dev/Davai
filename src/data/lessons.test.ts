import { describe, it, expect } from 'vitest';
import { LESSONS, isLessonComplete, lessonXpReward } from './lessons';

describe('lessons data', () => {
  it('has no duplicate lesson ids', () => {
    const ids = LESSONS.map(l => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has no duplicate sub-lesson ids across the whole app', () => {
    const ids = LESSONS.flatMap(l => l.subLessons.map(sl => sl.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every lesson has at least one sub-lesson', () => {
    for (const lesson of LESSONS) {
      expect(lesson.subLessons.length, `"${lesson.id}" has no sub-lessons`).toBeGreaterThan(0);
    }
  });

  it('every prerequisite points at a real lesson id', () => {
    const ids = new Set(LESSONS.map(l => l.id));
    for (const lesson of LESSONS) {
      for (const prereq of lesson.prerequisites) {
        expect(ids.has(prereq), `"${lesson.id}" lists unknown prerequisite "${prereq}"`).toBe(true);
      }
    }
  });

  it('every exercise id is unique within its sub-lesson', () => {
    for (const lesson of LESSONS) {
      for (const sub of lesson.subLessons) {
        const ids = sub.exercises.map(e => e.id);
        expect(new Set(ids).size, `duplicate exercise id in "${sub.id}"`).toBe(ids.length);
      }
    }
  });

  it('MCQ "correct" always indexes a real option', () => {
    for (const lesson of LESSONS) {
      for (const sub of lesson.subLessons) {
        for (const ex of sub.exercises) {
          if (ex.type !== 'mcq') continue;
          expect(ex.correct).toBeGreaterThanOrEqual(0);
          expect(ex.correct).toBeLessThan(ex.options.length);
        }
      }
    }
  });

  it('match exercises have unique left AND right values (matching UI relies on this)', () => {
    for (const lesson of LESSONS) {
      for (const sub of lesson.subLessons) {
        for (const ex of sub.exercises) {
          if (ex.type !== 'match') continue;
          const lefts = ex.pairs.map(p => p.left);
          const rights = ex.pairs.map(p => p.right);
          expect(new Set(lefts).size, `duplicate left value in "${ex.id}"`).toBe(lefts.length);
          expect(new Set(rights).size, `duplicate right value in "${ex.id}"`).toBe(rights.length);
          expect(ex.pairs.length).toBeGreaterThanOrEqual(2);
        }
      }
    }
  });

  it('isLessonComplete requires every sub-lesson, not just one', () => {
    const lesson = LESSONS[0];
    expect(lesson.subLessons.length).toBeGreaterThan(1);
    const onlyFirst = [lesson.subLessons[0].id];
    const all = lesson.subLessons.map(sl => sl.id);
    expect(isLessonComplete(lesson, onlyFirst)).toBe(false);
    expect(isLessonComplete(lesson, all)).toBe(true);
  });

  it('lessonXpReward sums each sub-lesson\'s maxScore * 2', () => {
    const lesson = LESSONS[0];
    const expected = lesson.subLessons.reduce((sum, sl) => sum + sl.maxScore * 2, 0);
    expect(lessonXpReward(lesson)).toBe(expected);
  });
});
