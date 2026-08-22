import { createContext, useContext, useReducer, useEffect, useRef, useState, ReactNode } from 'react';
import { BADGES, BadgeStats } from '../data/badges';
import { SRSState } from '../data/vocabulary';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
  onboardingComplete: boolean;
  streakIgnited: boolean;
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
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'CLEAR_STREAK_IGNITED' }
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

/**
 * The streak (and the calendar that visualizes it) only advances from real
 * learning activity — completing a lesson or reviewing a flashcard — never
 * from merely opening the app or logging in.
 */
function bumpStreak(state: UserState): Pick<UserState, 'streak' | 'lastActiveDate' | 'activeDates' | 'streakIgnited'> {
  const today = todayISO();
  if (state.lastActiveDate === today) {
    return { streak: state.streak, lastActiveDate: state.lastActiveDate, activeDates: state.activeDates, streakIgnited: state.streakIgnited };
  }
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const newStreak = state.lastActiveDate === yesterday ? state.streak + 1 : 1;
  return {
    streak: newStreak,
    lastActiveDate: today,
    activeDates: addActiveDate(state.activeDates, today),
    streakIgnited: newStreak === 1 && state.streak !== 1 ? true : state.streakIgnited,
  };
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
  onboardingComplete: false,
  streakIgnited: false,
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
      return { ...INITIAL_STATE, ...action.state, newBadge: null, streakIgnited: false };

    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        profile: action.profile,
      };

    case 'LOGOUT':
      return { ...INITIAL_STATE };

    case 'ADD_XP': {
      const newXP = state.xp + action.amount;
      const updated: UserState = {
        ...state,
        xp: newXP,
        level: xpToLevel(newXP),
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
      const updated: UserState = {
        ...state,
        ...bumpStreak(state),
        completedLessons: [...state.completedLessons, action.lessonId],
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
        ...bumpStreak(state),
        srsState: { ...state.srsState, [action.cardId]: next },
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

    case 'COMPLETE_ONBOARDING':
      return { ...state, onboardingComplete: true };

    case 'CLEAR_STREAK_IGNITED':
      return { ...state, streakIgnited: false };

    default:
      return state;
  }
}

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<Action>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  passwordRecovery: boolean;
  clearPasswordRecovery: () => void;
} | null>(null);

const STORAGE_KEY = 'russki-user-v2';
/** Legacy global flag, superseded by the per-user `onboardingComplete` field. */
const LEGACY_ONBOARDING_KEY = 'russki-onboarding-v1';

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const userIdRef = useRef<string | null>(null);
  const [passwordRecovery, setPasswordRecovery] = useState(false);

  /* Local cache — instant on load, and the only source of truth when
     Supabase isn't configured. */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as UserState;
        // One-time migration from the old global (non-account-scoped) flag.
        if (saved.onboardingComplete === undefined && localStorage.getItem(LEGACY_ONBOARDING_KEY) === '1') {
          saved.onboardingComplete = true;
        }
        dispatch({ type: 'HYDRATE', state: saved });
      }
      localStorage.removeItem(LEGACY_ONBOARDING_KEY);
    } catch {
      // ignore corrupt storage
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  /* Supabase session → remote progress. Runs once on mount, and again
     whenever auth state changes (login, logout, token refresh). */
  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    async function syncFromSession(session: import('@supabase/supabase-js').Session | null) {
      if (!session || !supabase) {
        userIdRef.current = null;
        return;
      }
      userIdRef.current = session.user.id;
      const meta = session.user.user_metadata ?? {};
      const profile: UserProfile = {
        name: (meta.name as string | undefined) ?? session.user.email!.split('@')[0],
        email: session.user.email!,
        avatar: (meta.avatar_url as string | undefined) ?? (meta.picture as string | undefined),
      };
      const { data, error } = await supabase
        .from('progress')
        .select('state')
        .eq('user_id', session.user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.error('Failed to load progress from Supabase', error);
      }
      if (data?.state) {
        dispatch({ type: 'HYDRATE', state: { ...(data.state as UserState), isAuthenticated: true, profile } });
      } else {
        dispatch({ type: 'LOGIN', profile });
      }
    }

    supabase.auth.getSession().then(({ data }) => syncFromSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        userIdRef.current = null;
        dispatch({ type: 'LOGOUT' });
      } else if (event === 'SIGNED_IN' && session) {
        syncFromSession(session);
      } else if (event === 'PASSWORD_RECOVERY') {
        setPasswordRecovery(true);
      }
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  /* Debounced upsert of the full progress blob whenever it changes. */
  useEffect(() => {
    if (!supabase || !state.isAuthenticated || !userIdRef.current) return;
    const client = supabase;
    const uid = userIdRef.current;
    const t = setTimeout(() => {
      client
        .from('progress')
        .upsert({ user_id: uid, state })
        .then(({ error }) => {
          if (error) console.error('Failed to sync progress to Supabase', error);
        });
    }, 800);
    return () => clearTimeout(t);
  }, [state]);

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    userIdRef.current = null;
    dispatch({ type: 'LOGOUT' });
  }

  /**
   * Erases this user's stored progress. The anon key used by the client
   * can't remove the auth.users row itself (that needs a service-role key
   * on a server) — full account deletion requires contacting the maintainer
   * until a proper backend endpoint exists.
   */
  async function deleteAccount() {
    if (supabase && userIdRef.current) {
      const { error } = await supabase.from('progress').delete().eq('user_id', userIdRef.current);
      if (error) console.error('Failed to delete progress', error);
    }
    localStorage.removeItem(STORAGE_KEY);
    await signOut();
  }

  return (
    <UserContext.Provider value={{ state, dispatch, signOut, deleteAccount, passwordRecovery, clearPasswordRecovery: () => setPasswordRecovery(false) }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}

export { isSupabaseConfigured };

export function xpForNextLevel(level: number): number {
  return level * 100;
}

export function xpProgress(xp: number): number {
  const level = xpToLevel(xp);
  const levelStart = (level - 1) * 100;
  const levelEnd = level * 100;
  return ((xp - levelStart) / (levelEnd - levelStart)) * 100;
}
