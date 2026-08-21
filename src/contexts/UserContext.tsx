import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { BADGES, BadgeStats } from '../data/badges';
import { SRSState } from '../data/vocabulary';

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

export interface UserState {
  isAuthenticated: boolean;
  profile: UserProfile | null;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  activeDates: string[]; // ISO date strings for streak calendar
  completedLessons: string[];
  unlockedBadges: string[];
  srsState: Record<string, SRSState>;
  alphabetQuizBest: number;
  interfaceLang: 'fr' | 'en';
  notificationsEnabled: boolean;
  newBadge: string | null;
}

type Action =
  | { type: 'LOGIN'; profile: UserProfile }
  | { type: 'LOGOUT' }
  | { type: 'ADD_XP'; amount: number }
  | { type: 'COMPLETE_LESSON'; lessonId: string }
  | { type: 'UPDATE_SRS'; cardId: string; rating: 'hard' | 'ok' | 'easy' }
  | { type: 'SET_ALPHABET_QUIZ_BEST'; score: number }
  | { type: 'UNLOCK_BADGE'; badgeId: string }
  | { type: 'CLEAR_NEW_BADGE' }
  | { type: 'SET_NOTIFICATIONS'; enabled: boolean }
  | { type: 'TICK_STREAK' }
  | { type: 'HYDRATE'; state: UserState };

function xpToLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function addActiveDate(dates: string[], date: string): string[] {
  return dates.includes(date) ? dates : [...dates, date];
}

const INITIAL_STATE: UserState = {
  isAuthenticated: false,
  profile: null,
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: null,
  activeDates: [],
  completedLessons: [],
  unlockedBadges: [],
  srsState: {},
  alphabetQuizBest: 0,
  interfaceLang: 'fr',
  notificationsEnabled: true,
  newBadge: null,
};

function buildBadgeStats(state: UserState): BadgeStats {
  const learnedCards = Object.values(state.srsState).filter(s => s === 'learned').length;
  return {
    completedLessons: state.completedLessons,
    totalXP: state.xp,
    streak: state.streak,
    alphabetQuizScore: state.alphabetQuizBest,
    learnedCards,
    lessonsToday: 0,
  };
}

function checkNewBadges(state: UserState): string | null {
  const stats = buildBadgeStats(state);
  for (const badge of BADGES) {
    if (!state.unlockedBadges.includes(badge.id) && badge.condition(stats)) {
      return badge.id;
    }
  }
  return null;
}

function reducer(state: UserState, action: Action): UserState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...INITIAL_STATE, ...action.state, newBadge: null };

    case 'LOGIN': {
      const today = todayISO();
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const streakContinues = state.lastActiveDate === today || state.lastActiveDate === yesterday;
      const newStreak = state.lastActiveDate === today ? state.streak : streakContinues ? state.streak + 1 : 1;
      return {
        ...state,
        isAuthenticated: true,
        profile: action.profile,
        streak: newStreak,
        lastActiveDate: today,
        activeDates: addActiveDate(state.activeDates, today),
      };
    }

    case 'LOGOUT':
      return { ...INITIAL_STATE };

    case 'ADD_XP': {
      const today = todayISO();
      const newXP = state.xp + action.amount;
      const updated: UserState = {
        ...state,
        xp: newXP,
        level: xpToLevel(newXP),
        lastActiveDate: today,
        activeDates: addActiveDate(state.activeDates, today),
      };
      const newBadge = checkNewBadges(updated);
      return {
        ...updated,
        unlockedBadges: newBadge ? [...updated.unlockedBadges, newBadge] : updated.unlockedBadges,
        newBadge,
      };
    }

    case 'COMPLETE_LESSON': {
      if (state.completedLessons.includes(action.lessonId)) return state;
      const today = todayISO();
      const updated: UserState = {
        ...state,
        completedLessons: [...state.completedLessons, action.lessonId],
        activeDates: addActiveDate(state.activeDates, today),
      };
      const newBadge = checkNewBadges(updated);
      return {
        ...updated,
        unlockedBadges: newBadge ? [...updated.unlockedBadges, newBadge] : updated.unlockedBadges,
        newBadge,
      };
    }

    case 'UPDATE_SRS': {
      const current = state.srsState[action.cardId] ?? 'new';
      let next: SRSState = current;
      if (action.rating === 'easy') next = 'learned';
      else if (action.rating === 'ok') next = 'learning';
      else if (action.rating === 'hard') next = current === 'learned' ? 'learning' : 'new';
      const updated: UserState = {
        ...state,
        srsState: { ...state.srsState, [action.cardId]: next },
        activeDates: addActiveDate(state.activeDates, todayISO()),
      };
      const newBadge = checkNewBadges(updated);
      return {
        ...updated,
        unlockedBadges: newBadge ? [...updated.unlockedBadges, newBadge] : updated.unlockedBadges,
        newBadge,
      };
    }

    case 'SET_ALPHABET_QUIZ_BEST':
      return { ...state, alphabetQuizBest: Math.max(state.alphabetQuizBest, action.score) };

    case 'UNLOCK_BADGE':
      if (state.unlockedBadges.includes(action.badgeId)) return state;
      return { ...state, unlockedBadges: [...state.unlockedBadges, action.badgeId], newBadge: action.badgeId };

    case 'CLEAR_NEW_BADGE':
      return { ...state, newBadge: null };

    case 'SET_NOTIFICATIONS':
      return { ...state, notificationsEnabled: action.enabled };

    case 'TICK_STREAK': {
      const today = todayISO();
      if (state.lastActiveDate === today) return state;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = state.lastActiveDate === yesterday ? state.streak + 1 : 1;
      return {
        ...state,
        streak: newStreak,
        lastActiveDate: today,
        activeDates: addActiveDate(state.activeDates, today),
      };
    }

    default:
      return state;
  }
}

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

const STORAGE_KEY = 'russki-user-v2';

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as UserState;
        dispatch({ type: 'HYDRATE', state: saved });
      }
    } catch {
      // ignore corrupt storage
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}

export function xpForNextLevel(level: number): number {
  return level * 100;
}

export function xpProgress(xp: number): number {
  const level = xpToLevel(xp);
  const levelStart = (level - 1) * 100;
  const levelEnd = level * 100;
  return ((xp - levelStart) / (levelEnd - levelStart)) * 100;
}
