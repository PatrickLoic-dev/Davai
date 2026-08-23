import { describe, it, expect } from 'vitest';
import { userReducer, INITIAL_USER_STATE, type UserState } from './UserContext';

const profile = { name: 'Test', email: 'test@example.com' };

describe('userReducer', () => {
  it('ADD_XP increases xp and recomputes level', () => {
    const state = userReducer(INITIAL_USER_STATE, { type: 'ADD_XP', amount: 150 });
    expect(state.xp).toBe(150);
    expect(state.level).toBe(2); // 100 xp per level
  });

  it('LOGIN sets auth/profile but never touches the streak', () => {
    const state = userReducer(INITIAL_USER_STATE, { type: 'LOGIN', profile });
    expect(state.isAuthenticated).toBe(true);
    expect(state.profile).toEqual(profile);
    expect(state.streak).toBe(0);
    expect(state.lastActiveDate).toBeNull();
  });

  it('COMPLETE_LESSON starts a streak at 1 and marks the ignite flag', () => {
    const state = userReducer(INITIAL_USER_STATE, { type: 'COMPLETE_LESSON', lessonId: 'alphabet-intro' });
    expect(state.streak).toBe(1);
    expect(state.streakIgnited).toBe(true);
    expect(state.completedLessons).toContain('alphabet-intro');
    expect(state.activeDates).toHaveLength(1);
  });

  it('COMPLETE_LESSON is idempotent for an already-completed lesson', () => {
    const first = userReducer(INITIAL_USER_STATE, { type: 'COMPLETE_LESSON', lessonId: 'alphabet-intro' });
    const second = userReducer(first, { type: 'COMPLETE_LESSON', lessonId: 'alphabet-intro' });
    expect(second).toBe(first); // reducer returns the same reference, no XP/streak double-count
  });

  it('UPDATE_SRS also advances the streak (reviewing counts as activity)', () => {
    const state = userReducer(INITIAL_USER_STATE, { type: 'UPDATE_SRS', cardId: 'g1', rating: 'easy' });
    expect(state.srsState.g1).toBe('learned');
    expect(state.streak).toBe(1);
  });

  it('does not bump the streak twice for activity on the same day', () => {
    const once = userReducer(INITIAL_USER_STATE, { type: 'COMPLETE_LESSON', lessonId: 'a' });
    const twice = userReducer(once, { type: 'COMPLETE_LESSON', lessonId: 'b' });
    expect(twice.streak).toBe(1);
    expect(twice.streakIgnited).toBe(true); // still true from the first bump, not re-fired
  });

  it('extends the streak on consecutive-day activity, resets after a gap', () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const longAgo = '2000-01-01';

    const continuing: UserState = { ...INITIAL_USER_STATE, streak: 3, lastActiveDate: yesterday };
    const extended = userReducer(continuing, { type: 'COMPLETE_LESSON', lessonId: 'x' });
    expect(extended.streak).toBe(4);
    expect(extended.streakIgnited).toBe(false); // continuing a streak isn't "day 1"

    const stale: UserState = { ...INITIAL_USER_STATE, streak: 3, lastActiveDate: longAgo };
    const reset = userReducer(stale, { type: 'COMPLETE_LESSON', lessonId: 'x' });
    expect(reset.streak).toBe(1);
    expect(reset.streakIgnited).toBe(true); // broke and restarted → counts as a new day 1
  });

  it('HYDRATE never replays a pending streak-ignite animation', () => {
    const saved: UserState = { ...INITIAL_USER_STATE, streak: 1, streakIgnited: true };
    const state = userReducer(INITIAL_USER_STATE, { type: 'HYDRATE', state: saved });
    expect(state.streak).toBe(1);
    expect(state.streakIgnited).toBe(false);
  });

  it('COMPLETE_LESSON with silent:true (placement test) never touches the streak', () => {
    const state = userReducer(INITIAL_USER_STATE, { type: 'COMPLETE_LESSON', lessonId: 'alphabet-intro-1', silent: true });
    expect(state.completedLessons).toContain('alphabet-intro-1');
    expect(state.streak).toBe(0);
    expect(state.streakIgnited).toBe(false);
    expect(state.lastActiveDate).toBeNull();
  });

  it('LOGOUT resets everything back to the initial state', () => {
    const loggedIn = userReducer(INITIAL_USER_STATE, { type: 'LOGIN', profile });
    const after = userReducer(loggedIn, { type: 'LOGOUT' });
    expect(after).toEqual(INITIAL_USER_STATE);
  });
});
