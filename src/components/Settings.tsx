import { useUser } from '../contexts/UserContext';
import { BADGES } from '../data/badges';
import { Flame, BookOpen, Layers, Award, Star, Bell } from 'lucide-react';

export default function Settings() {
  const { state, dispatch } = useUser();
  const learnedCards = Object.values(state.srsState).filter(s => s === 'learned').length;

  const STATS = [
    { label: 'XP total',     value: state.xp,                       color: '#D97706', Icon: Star },
    { label: 'Niveau',       value: state.level,                    color: '#0A0A0A', Icon: Award },
    { label: 'Streak',       value: `${state.streak}j`,             color: '#EA580C', Icon: Flame },
    { label: 'Leçons',       value: state.completedLessons.length,  color: '#7C3AED', Icon: BookOpen },
    { label: 'Mots appris',  value: learnedCards,                   color: '#16A34A', Icon: Layers },
    { label: 'Badges',       value: state.unlockedBadges.length,    color: '#0A0A0A', Icon: Award },
  ];

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'var(--background)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 4vw, 2rem)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Page heading */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'var(--foreground)', margin: 0, letterSpacing: '-0.02em' }}>
            Paramètres
          </h2>
          {state.profile && (
            <p style={{ margin: '4px 0 0', color: 'var(--muted-foreground)', fontSize: '0.88rem' }}>
              {state.profile.email}
            </p>
          )}
        </div>

        {/* Profile card */}
        {state.profile && (
          <section aria-labelledby="profile-h">
            <SectionLabel id="profile-h">Profil</SectionLabel>
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700, color: 'white', flexShrink: 0 }} aria-hidden="true">
                {state.profile.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: 'var(--foreground)', fontSize: '1rem' }}>{state.profile.name}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{state.profile.email}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted-foreground)', letterSpacing: '0.04em' }}>NIVEAU</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--foreground)', lineHeight: 1 }}>{state.level}</div>
              </div>
            </div>
          </section>
        )}

        {/* Stats */}
        <section aria-labelledby="stats-h">
          <SectionLabel id="stats-h">Statistiques</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {STATS.map(({ label, value, color, Icon }) => (
              <div key={label} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <Icon size={14} style={{ color }} aria-hidden="true" />
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)', fontFamily: 'var(--font-ui)' }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Preferences */}
        <section aria-labelledby="notif-h">
          <SectionLabel id="notif-h">Préférences</SectionLabel>
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 1.25rem', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bell size={15} style={{ color: 'var(--muted-foreground)' }} aria-hidden="true" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--foreground)' }}>Rappels quotidiens</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', marginTop: '1px' }}>Maintenez votre streak</div>
                </div>
              </div>
              <button
                role="switch"
                aria-checked={state.notificationsEnabled}
                onClick={() => dispatch({ type: 'SET_NOTIFICATIONS', enabled: !state.notificationsEnabled })}
                style={{ width: '44px', height: '24px', borderRadius: '100px', border: 'none', background: state.notificationsEnabled ? '#0A0A0A' : '#E8E8E8', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' }}
                aria-label={`Rappels ${state.notificationsEnabled ? 'activés' : 'désactivés'}`}
              >
                <span style={{ position: 'absolute', top: '3px', left: state.notificationsEnabled ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section aria-labelledby="badges-h">
          <SectionLabel id="badges-h">Badges · {state.unlockedBadges.length}/{BADGES.length}</SectionLabel>
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            {BADGES.map((badge, i) => {
              const unlocked = state.unlockedBadges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '0.9rem 1.25rem',
                    borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                    background: unlocked ? `${badge.color}06` : 'transparent',
                    opacity: unlocked ? 1 : 0.45,
                    transition: 'opacity 0.15s',
                  }}
                  aria-label={`${badge.title} — ${unlocked ? 'débloqué' : 'verrouillé'}`}
                >
                  <span style={{ fontSize: '1.5rem', flexShrink: 0, filter: unlocked ? 'none' : 'grayscale(1)' }} aria-hidden="true">{badge.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: unlocked ? badge.color : 'var(--muted-foreground)' }}>
                      {badge.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '1px' }}>{badge.description}</div>
                  </div>
                  {unlocked && (
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: badge.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} aria-hidden="true">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Danger zone */}
        <section aria-labelledby="session-h" style={{ paddingBottom: '1rem' }}>
          <SectionLabel id="session-h" danger>Session</SectionLabel>
          <button
            onClick={() => dispatch({ type: 'LOGOUT' })}
            style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(220,38,38,0.25)', background: '#FEF2F2', color: 'var(--danger)', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'opacity 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.75'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
          >
            Se déconnecter
          </button>
        </section>

      </div>
    </div>
  );
}

function SectionLabel({ id, children, danger }: { id: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <h3 id={id} style={{
      fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.68rem',
      letterSpacing: '0.08em', textTransform: 'uppercase',
      color: danger ? 'var(--danger)' : 'var(--muted-foreground)',
      margin: '0 0 0.625rem',
    }}>
      {children}
    </h3>
  );
}
