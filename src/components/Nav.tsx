import { Map, BookOpen, Layers, BookText, PenLine, Settings, Flame, LogOut } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

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
  const { state, dispatch } = useUser();
  return (
    <nav
      style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '200px', flexShrink: 0, background: 'white', borderRight: '1px solid #E8E8E8', padding: '0' }}
      aria-label="Navigation principale"
    >
      {/* Logo */}
      <div style={{ padding: '1.25rem 1rem 1rem', borderBottom: '1px solid #E8E8E8' }}>
        <button onClick={onHome}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '100%' }}
          aria-label="Accueil"
        >
          <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-cyrillic)', fontSize: '0.95rem', color: 'white', flexShrink: 0 }}>Р</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.88rem', color: '#0A0A0A', letterSpacing: '-0.01em' }}>Russki+</span>
        </button>
      </div>

      {/* Nav items */}
      <ul style={{ listStyle: 'none', margin: 0, padding: '0.75rem 0.625rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }} role="list">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = current === id;
          return (
            <li key={id}>
              <button
                onClick={() => onChange(id)}
                aria-current={active ? 'page' : undefined}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '0.55rem 0.75rem', borderRadius: '8px', background: active ? '#F4F4F4' : 'transparent', border: 'none', color: active ? '#0A0A0A' : '#737373', fontSize: '0.85rem', fontWeight: active ? 600 : 400, cursor: 'pointer', transition: 'background 0.12s, color 0.12s', textAlign: 'left', fontFamily: 'var(--font-ui)' }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = '#F9F9F9'; (e.currentTarget as HTMLElement).style.color = '#0A0A0A'; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#737373'; } }}
              >
                <Icon size={15} aria-hidden="true" />
                {label}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Streak badge */}
      {state.streak > 0 && (
        <div style={{ padding: '0 0.625rem 0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.5rem 0.75rem', borderRadius: '8px', background: '#FFF7ED', border: '1px solid #FED7AA' }}>
            <Flame size={13} style={{ color: '#C2410C' }} aria-hidden="true" />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#C2410C' }}>{state.streak}j de suite</span>
          </div>
        </div>
      )}

      {/* Bottom */}
      <div style={{ padding: '0.5rem 0.625rem 1rem', borderTop: '1px solid #E8E8E8', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <button
          onClick={() => onChange('settings')}
          aria-current={current === 'settings' ? 'page' : undefined}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '0.55rem 0.75rem', borderRadius: '8px', background: current === 'settings' ? '#F4F4F4' : 'transparent', border: 'none', color: current === 'settings' ? '#0A0A0A' : '#737373', fontSize: '0.85rem', fontWeight: current === 'settings' ? 600 : 400, cursor: 'pointer', transition: 'background 0.12s', textAlign: 'left', fontFamily: 'var(--font-ui)' }}
          onMouseEnter={e => { if (current !== 'settings') { (e.currentTarget as HTMLElement).style.background = '#F9F9F9'; (e.currentTarget as HTMLElement).style.color = '#0A0A0A'; } }}
          onMouseLeave={e => { if (current !== 'settings') { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#737373'; } }}
        >
          <Settings size={15} aria-hidden="true" />
          Paramètres
        </button>

        {state.profile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.55rem 0.75rem', borderRadius: '8px', background: '#F9F9F9', marginTop: '2px' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'white', flexShrink: 0 }} aria-hidden="true">
              {state.profile.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0A0A0A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{state.profile.name}</div>
              <div style={{ fontSize: '0.68rem', color: '#A3A3A3', fontFamily: 'var(--font-mono)' }}>Niv. {state.level} · {state.xp} XP</div>
            </div>
            <button onClick={() => dispatch({ type: 'LOGOUT' })} style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#A3A3A3', display: 'flex', alignItems: 'center', transition: 'color 0.12s', flexShrink: 0 }} aria-label="Se déconnecter"
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#0A0A0A'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#A3A3A3'}
            >
              <LogOut size={13} />
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
      style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: 'white', borderTop: '1px solid #E8E8E8', display: 'flex', alignItems: 'stretch', height: '60px' }}
      aria-label="Navigation mobile"
    >
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const active = current === id;
        return (
          <button key={id} onClick={() => onChange(id)}
            aria-current={active ? 'page' : undefined}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer', color: active ? '#0A0A0A' : '#A3A3A3', transition: 'color 0.12s' }}
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
