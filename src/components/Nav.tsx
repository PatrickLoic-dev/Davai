import { Map, BookOpen, Layers, BookText, PenLine, Settings, Flame, LogOut } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { AppLogo } from './Logo';

export type View = 'path' | 'alphabet' | 'vocabulary' | 'grammar' | 'exercises' | 'settings';

interface NavProps {
  current: View;
  onChange: (v: View) => void;
  onHome: () => void;
  mobile?: boolean;
}

const NAV_ITEMS: { id: View; label: string; Icon: React.ElementType }[] = [
  { id: 'path',       label: 'Parcours',    Icon: Map      },
  { id: 'alphabet',   label: 'Alphabet',    Icon: BookOpen },
  { id: 'vocabulary', label: 'Vocabulaire', Icon: Layers   },
  { id: 'grammar',    label: 'Leçons',      Icon: BookText },
  { id: 'exercises',  label: 'Exercices',   Icon: PenLine  },
];

function SidebarNav({ current, onChange, onHome }: NavProps) {
  const { state, signOut } = useUser();
  return (
    <nav
      style={{
        display: 'flex', flexDirection: 'column', height: '100%',
        width: '200px', flexShrink: 0,
      }}
      aria-label="Navigation principale"
    >
      {/* Logo */}
      <div style={{ padding: '1.1rem 1rem 0.9rem', borderBottom: '1px solid #F0F0F0' }}>
        <button onClick={onHome}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          aria-label="Accueil"
        >
          <AppLogo size={24} textSize="0.88rem" />
        </button>
      </div>

      {/* Nav items */}
      <ul style={{ listStyle: 'none', margin: 0, padding: '0.6rem 0.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }} role="list">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = current === id;
          return (
            <li key={id}>
              <button
                onClick={() => onChange(id)}
                aria-current={active ? 'page' : undefined}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '9px',
                  padding: '0.52rem 0.7rem', borderRadius: '8px',
                  background: active ? '#F0F0F0' : 'transparent',
                  border: 'none',
                  color: active ? '#0A0A0A' : '#8A8A8A',
                  fontSize: '0.84rem', fontWeight: active ? 600 : 400,
                  cursor: 'pointer', transition: 'background 0.12s, color 0.12s',
                  textAlign: 'left', fontFamily: 'var(--font-ui)',
                }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = '#F7F7F7'; (e.currentTarget as HTMLElement).style.color = '#0A0A0A'; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#8A8A8A'; } }}
              >
                <Icon size={14} aria-hidden="true" />
                {label}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Streak */}
      {state.streak > 0 && (
        <div style={{ padding: '0 0.5rem 0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.45rem 0.7rem', borderRadius: '8px', background: '#FFF7ED', border: '1px solid #FED7AA' }}>
            <Flame size={12} style={{ color: '#C2410C' }} aria-hidden="true" />
            <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#C2410C' }}>{state.streak}j</span>
          </div>
        </div>
      )}

      {/* Bottom */}
      <div style={{ padding: '0.5rem 0.5rem 0.75rem', borderTop: '1px solid #F0F0F0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <button
          onClick={() => onChange('settings')}
          aria-current={current === 'settings' ? 'page' : undefined}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '9px',
            padding: '0.52rem 0.7rem', borderRadius: '8px',
            background: current === 'settings' ? '#F0F0F0' : 'transparent',
            border: 'none',
            color: current === 'settings' ? '#0A0A0A' : '#8A8A8A',
            fontSize: '0.84rem', fontWeight: current === 'settings' ? 600 : 400,
            cursor: 'pointer', transition: 'background 0.12s',
            textAlign: 'left', fontFamily: 'var(--font-ui)',
          }}
          onMouseEnter={e => { if (current !== 'settings') { (e.currentTarget as HTMLElement).style.background = '#F7F7F7'; (e.currentTarget as HTMLElement).style.color = '#0A0A0A'; } }}
          onMouseLeave={e => { if (current !== 'settings') { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#8A8A8A'; } }}
        >
          <Settings size={14} aria-hidden="true" />
          Paramètres
        </button>

        {state.profile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.52rem 0.7rem', borderRadius: '8px', background: '#F7F7F7', marginTop: '2px' }}>
            {state.profile.avatar ? (
              <img
                src={state.profile.avatar}
                alt=""
                referrerPolicy="no-referrer"
                style={{ width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }}
              />
            ) : (
              <span
                style={{
                  width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#0A0A0A', color: 'white', fontSize: '0.78rem', fontWeight: 700,
                }}
                aria-hidden="true"
              >
                {state.profile.name.charAt(0).toUpperCase()}
              </span>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 600, color: '#0A0A0A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{state.profile.name}</div>
              <div style={{ fontSize: '0.66rem', color: '#A3A3A3', fontFamily: 'var(--font-mono)' }}>Niv. {state.level} · {state.xp} XP</div>
            </div>
            <button
              onClick={() => { void signOut(); }}
              style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#C0C0C0', display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'color 0.12s' }}
              aria-label="Se déconnecter"
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#0A0A0A'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#C0C0C0'}
            >
              <LogOut size={12} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function BottomNav({ current, onChange }: NavProps) {
  return (
    <nav
      className="app-nav-bottom"
      style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: 'white', borderTop: '1px solid #EBEBEB', display: 'flex', alignItems: 'stretch', height: '60px' }}
      aria-label="Navigation mobile"
    >
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const active = current === id;
        return (
          <button key={id} onClick={() => onChange(id)}
            aria-current={active ? 'page' : undefined}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer', color: active ? '#0A0A0A' : '#B0B0B0', transition: 'color 0.12s' }}
          >
            <Icon size={18} aria-hidden="true" />
            <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-ui)', fontWeight: active ? 600 : 400 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function Nav(props: NavProps) {
  if (props.mobile) return <BottomNav {...props} />;
  return <SidebarNav {...props} />;
}
