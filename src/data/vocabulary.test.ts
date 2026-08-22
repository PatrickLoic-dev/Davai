import { describe, it, expect } from 'vitest';
import { VOCAB_THEMES } from './vocabulary';

describe('vocabulary data', () => {
  it('has no duplicate card ids across themes (SRS state is keyed by id)', () => {
    const ids = VOCAB_THEMES.flatMap(t => t.cards.map(c => c.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every theme has at least one card', () => {
    for (const theme of VOCAB_THEMES) {
      expect(theme.cards.length).toBeGreaterThan(0);
    }
  });
});
