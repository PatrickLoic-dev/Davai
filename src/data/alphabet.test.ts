import { describe, it, expect } from 'vitest';
import { ALPHABET, ALPHABET_QUIZ_POOL } from './alphabet';

describe('alphabet data', () => {
  it('has exactly the 33 letters of the Russian alphabet', () => {
    expect(ALPHABET).toHaveLength(33);
  });

  it('has no duplicate uppercase letters', () => {
    const uppers = ALPHABET.map(l => l.upper);
    expect(new Set(uppers).size).toBe(uppers.length);
  });

  it('excludes the two signs (ъ, ь) from the pronunciation quiz pool', () => {
    expect(ALPHABET_QUIZ_POOL.some(l => l.category === 'sign')).toBe(false);
    expect(ALPHABET_QUIZ_POOL.length).toBe(ALPHABET.length - 2);
  });
});
