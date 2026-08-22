import { useState, useEffect } from 'react';
import { UserProvider, useUser } from './contexts/UserContext';
import { BADGES } from './data/badges';
import HomePage from './components/HomePage';
import AuthScreen from './components/AuthScreen';
import Onboarding from './components/Onboarding';
import Nav, { View } from './components/Nav';
import LearningPath from './components/LearningPath';
import AlphabetModule from './components/AlphabetModule';
import FlashcardModule from './components/FlashcardModule';
import GrammarModule from './components/GrammarModule';
import ExerciseModule from './components/ExerciseModule';
import Settings from './components/Settings';
import StreakIgniteOverlay from './components/StreakIgniteOverlay';
import Changelog from './pages/Changelog';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

type Screen = 'home' | 'auth' | 'onboarding' | 'app';

function BadgeToast({ badgeId, onDismiss }: { badgeId: string; onDismiss: () => void }) {
  const badge = BADGES.find(b => b.id === badgeId);
  useEffect(() => {
    const t = setTimeout(onDismiss, 4500);
    return () => clearTimeout(t);
  }, [onDismiss]);
  if (!badge) return null;
  return (
    <div
      className="animate-badge-pop"
      style={{
        position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999,
        display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.25rem',
        background: 'white', border: `1.5px solid #E8E8E8`,
        borderRadius: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}
      role="status" aria-live="polite" aria-label={`Badge débloqué : ${badge.title}`}
    >
      <span style={{ fontSize: '1.75rem' }} aria-hidden="true">{badge.emoji}</span>
      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: badge.color, marginBottom: '2px', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Badge débloqué</div>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0A0A0A' }}>{badge.title}</div>
        <div style={{ fontSize: '0.78rem', color: '#737373' }}>{badge.description}</div>
      </div>
      <button onClick={onDismiss} style={{ marginLeft: '4px', background: 'none', border: 'none', color: '#A3A3A3', cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: '4px', alignSelf: 'flex-start' }} aria-label="Fermer">✕</button>
    </div>
  );
}

function AppShell() {
  const { state, dispatch, passwordRecovery, clearPasswordRecovery } = useUser();
  const [screen, setScreen] = useState<Screen>('home');
  const [view, setView]     = useState<View>('path');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  /* Route based on auth state — runs whenever isAuthenticated changes */
  useEffect(() => {
    if (state.isAuthenticated) {
      if (!state.onboardingComplete) {
        setScreen('onboarding');
      } else if (screen !== 'app') {
        setScreen('app');
      }
    } else if (screen === 'app' || screen === 'onboarding') {
      setScreen('home');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isAuthenticated, state.onboardingComplete]);

  function handleOnboardingComplete() {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
    setScreen('app');
  }

  /* ── Standalone, deep-linkable pages (independent of auth state) ── */
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/changelog') return <Changelog />;
  if (path === '/conditions-generales') return <Terms />;
  if (path === '/politique-de-confidentialite') return <Privacy />;

  /* ── Password recovery: takes over regardless of current screen ── */
  if (passwordRecovery) return <AuthScreen forceReset onResetDone={clearPasswordRecovery} />;

  /* ── Public screens ── */
  if (screen === 'home')
    return (
      <HomePage
        onStart={() => { setAuthMode('register'); setScreen('auth'); }}
        onLogin={() => { setAuthMode('login'); setScreen('auth'); }}
      />
    );

  if (screen === 'auth')
    return <AuthScreen initialMode={authMode} onBack={() => setScreen('home')} />;

  if (screen === 'onboarding')
    return <Onboarding onComplete={handleOnboardingComplete} />;

  /* ── App ── */
  const viewMap: Record<View, React.ReactNode> = {
    path:       <LearningPath onNavigate={setView} />,
    alphabet:   <AlphabetModule />,
    vocabulary: <FlashcardModule />,
    grammar:    <GrammarModule />,
    exercises:  <ExerciseModule />,
    settings:   <Settings />,
  };

  return (
    <div className="app-shell-outer">
      <a href="#main-content" className="sr-only"
        style={{ position: 'absolute', left: '-9999px' }}
        onFocus={e => { e.currentTarget.style.cssText = 'position:fixed;top:1rem;left:1rem;z-index:9999;padding:0.5rem 1rem;background:#0A0A0A;color:white;border-radius:8px;'; }}
        onBlur={e => { e.currentTarget.style.left = '-9999px'; }}
      >Aller au contenu</a>

      {/* Sidebar box — hidden on mobile via CSS */}
      <div className="app-nav-sidebar app-sidebar-box">
        <Nav current={view} onChange={setView} onHome={() => setScreen('home')} />
      </div>

      {/* Main content box */}
      <main id="main-content" className="app-main app-main-box">
        {viewMap[view]}
      </main>

      {/* Bottom nav — mobile only */}
      <Nav current={view} onChange={setView} onHome={() => setScreen('home')} mobile />

      {state.newBadge && (
        <BadgeToast badgeId={state.newBadge} onDismiss={() => dispatch({ type: 'CLEAR_NEW_BADGE' })} />
      )}

      {state.streakIgnited && (
        <StreakIgniteOverlay onDismiss={() => dispatch({ type: 'CLEAR_STREAK_IGNITED' })} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppShell />
    </UserProvider>
  );
}
