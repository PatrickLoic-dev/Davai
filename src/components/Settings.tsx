import { useUser } from '../contexts/UserContext';
import { BADGES } from '../data/badges';

export default function Settings() {
  const { state, dispatch } = useUser();
  const learnedCards = Object.values(state.srsState).filter(s => s === 'learned').length;

  return (
    <div className="mod-pad overflow-y-auto h-full space-y-8" style={{ maxWidth: '42rem' }}>
      <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
        Paramètres
      </h2>

      {/* Profile */}
      {state.profile && (
        <section className="space-y-3" aria-labelledby="profile-h">
          <h3 id="profile-h" className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>Profil</h3>
          <div className="rounded-2xl p-5 flex items-center gap-4 card-shadow" style={{ background: 'white', border: '1px solid var(--border)' }}>
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0"
              style={{ background: 'var(--primary)' }}
              aria-hidden="true"
            >
              {state.profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-bold" style={{ color: 'var(--foreground)' }}>{state.profile.name}</div>
              <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{state.profile.email}</div>
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="space-y-3" aria-labelledby="stats-h">
        <h3 id="stats-h" className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>Statistiques</h3>
        <div className="stats-grid">
          {[
            { label: 'XP total', value: state.xp, color: '#F59E0B' },
            { label: 'Niveau', value: state.level, color: 'var(--primary)' },
            { label: 'Streak', value: `${state.streak}🔥`, color: '#F59E0B' },
            { label: 'Leçons', value: state.completedLessons.length, color: 'var(--violet)' },
            { label: 'Mots appris', value: learnedCards, color: 'var(--success)' },
            { label: 'Badges', value: state.unlockedBadges.length, color: 'var(--primary)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-2xl p-4 text-center card-shadow" style={{ background: 'white', border: '1px solid var(--border)' }}>
              <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color }}>{value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="space-y-3" aria-labelledby="notif-h">
        <h3 id="notif-h" className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>Préférences</h3>
        <div className="rounded-2xl overflow-hidden card-shadow" style={{ border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between p-5" style={{ background: 'white' }}>
            <div>
              <div className="font-medium" style={{ color: 'var(--foreground)' }}>Rappels quotidiens</div>
              <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Maintenez votre streak grâce aux notifications</div>
            </div>
            <button
              role="switch"
              aria-checked={state.notificationsEnabled}
              onClick={() => dispatch({ type: 'SET_NOTIFICATIONS', enabled: !state.notificationsEnabled })}
              className="relative w-11 h-6 rounded-full transition-all duration-300"
              style={{ background: state.notificationsEnabled ? 'var(--primary)' : 'var(--muted)' }}
              aria-label={`Rappels ${state.notificationsEnabled ? 'activés' : 'désactivés'}`}
            >
              <span
                className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm"
                style={{ left: state.notificationsEnabled ? '23px' : '4px' }}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-3" aria-labelledby="badges-h">
        <h3 id="badges-h" className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
          Badges · {state.unlockedBadges.length}/{BADGES.length}
        </h3>
        <div className="space-y-2">
          {BADGES.map((badge) => {
            const unlocked = state.unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className="flex items-center gap-4 p-4 rounded-2xl"
                style={{
                  background: unlocked ? `${badge.color}08` : 'var(--muted)',
                  border: `1px solid ${unlocked ? `${badge.color}25` : 'transparent'}`,
                  opacity: unlocked ? 1 : 0.55,
                }}
                aria-label={`Badge "${badge.title}". ${unlocked ? 'Débloqué.' : 'Verrouillé.'} ${badge.description}`}
              >
                <span className="text-2xl shrink-0" aria-hidden="true" style={{ filter: unlocked ? 'none' : 'grayscale(1)' }}>
                  {badge.emoji}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-semibold" style={{ color: unlocked ? badge.color : 'var(--muted-foreground)' }}>
                    {badge.title} {unlocked && '✓'}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{badge.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Session */}
      <section className="space-y-3" aria-labelledby="session-h">
        <h3 id="session-h" className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>Session</h3>
        <button
          onClick={() => dispatch({ type: 'LOGOUT' })}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-80"
          style={{ background: '#FEF2F2', color: 'var(--danger)', border: '1px solid rgba(220,38,38,0.2)' }}
        >
          Se déconnecter
        </button>
      </section>
    </div>
  );
}
