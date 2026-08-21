import { useState, useEffect } from 'react';
import { ArrowRight, Globe, Film, Briefcase, Target, Zap, Flame, Trophy, Check } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface Props { onComplete: () => void; }

type Motivation = 'travel' | 'culture' | 'work' | 'challenge';
type DailyGoal  = 'casual' | 'intense' | 'champion';

const MOTIVATIONS: { id: Motivation; label: string; sub: string; Icon: React.ElementType }[] = [
  { id: 'travel',    label: 'Voyager',       sub: 'Communiquer avec les locaux',  Icon: Globe     },
  { id: 'culture',   label: 'Culture',       sub: 'Films, séries, musique',        Icon: Film      },
  { id: 'work',      label: 'Travail',       sub: 'Milieu professionnel',          Icon: Briefcase },
  { id: 'challenge', label: 'Défi personnel',sub: 'Repousser mes limites',         Icon: Target    },
];

const GOALS: { id: DailyGoal; label: string; time: string; xp: string; Icon: React.ElementType; desc: string; highlight?: boolean }[] = [
  { id: 'casual',   label: 'Casual',   time: '5 min / jour',  xp: '50 XP',  Icon: Zap,   desc: 'À mon rythme' },
  { id: 'intense',  label: 'Régulier', time: '15 min / jour', xp: '100 XP', Icon: Flame, desc: 'Recommandé', highlight: true },
  { id: 'champion', label: 'Intensif', time: '30 min / jour', xp: '200 XP', Icon: Trophy,desc: 'Pour les audacieux' },
];

const TOTAL = 3;

/* shared inline-style helpers */
const pill = (active: boolean): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', gap: '10px', padding: '1rem 1.25rem',
  border: `1.5px solid ${active ? '#0A0A0A' : '#E8E8E8'}`,
  borderRadius: '14px', background: active ? '#0A0A0A' : 'white',
  cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left', width: '100%',
});

export default function Onboarding({ onComplete }: Props) {
  const { state } = useUser();
  const firstName = state.profile?.name?.split(' ')[0] ?? 'Apprenant';

  const [step, setStep]             = useState(0);
  const [motivation, setMotivation] = useState<Motivation | null>(null);
  const [goal, setGoal]             = useState<DailyGoal>('intense');
  const [animIn, setAnimIn]         = useState(true);
  const [done, setDone]             = useState(false);

  function advance(next: number) {
    setAnimIn(false);
    setTimeout(() => { setStep(next); setAnimIn(true); }, 260);
  }

  useEffect(() => {
    if (done) { const t = setTimeout(onComplete, 1200); return () => clearTimeout(t); }
  }, [done, onComplete]);

  /* ── completion ── */
  if (done) {
    return (
      <div style={{ height: '100%', overflowY: 'auto', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="animate-bounce-in" style={{ textAlign: 'center', maxWidth: '360px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <Check size={32} color="white" strokeWidth={2.5} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2rem, 6vw, 3rem)', color: '#0A0A0A', margin: '0 0 0.75rem', lineHeight: 1.1 }}>
            Prêt,<br />{firstName} !
          </h2>
          <p style={{ color: '#737373', fontSize: '1rem', margin: 0 }}>Votre parcours commence maintenant…</p>
        </div>
      </div>
    );
  }

  const wrap: React.CSSProperties = {
    opacity: animIn ? 1 : 0,
    transform: animIn ? 'translateX(0)' : 'translateX(32px)',
    transition: 'opacity 0.25s ease, transform 0.25s ease',
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'white', display: 'flex', flexDirection: 'column' }}>

      {/* Progress bar */}
      <div style={{ height: '3px', background: '#F4F4F4', flexShrink: 0 }}>
        <div style={{ height: '100%', width: `${((step + 1) / TOTAL) * 100}%`, background: '#0A0A0A', transition: 'width 0.5s cubic-bezier(0.22, 1, 0.36, 1)' }} />
      </div>

      {/* Top bar */}
      <div style={{ padding: '1.25rem clamp(1.25rem, 5vw, 2.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E8E8E8', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-cyrillic)', fontWeight: 900, fontSize: '1rem', color: 'white' }}>Р</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', color: '#0A0A0A', letterSpacing: '-0.01em' }}>Russki+</span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#A3A3A3' }}>{step + 1} / {TOTAL}</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 2.5rem)' }}>
        <div style={{ width: '100%', maxWidth: '480px', ...wrap }}>

          {/* ── Step 0: Welcome + Motivation ── */}
          {step === 0 && (
            <>
              <div style={{ marginBottom: '2.5rem' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em', color: '#A3A3A3', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Étape 1 · Motivation</p>
                <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', color: '#0A0A0A', margin: '0 0 0.75rem', lineHeight: 1.15 }}>
                  Bonjour, {firstName} !<br />Pourquoi le russe ?
                </h1>
                <p style={{ color: '#737373', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>
                  Choisissez votre motivation principale. Cela nous aide à personnaliser votre parcours.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '2rem' }}>
                {MOTIVATIONS.map(({ id, label, sub, Icon }) => {
                  const sel = motivation === id;
                  return (
                    <button key={id} onClick={() => setMotivation(id)}
                      style={{ ...pill(sel), flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', position: 'relative' }}
                      aria-pressed={sel}
                    >
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: sel ? 'rgba(255,255,255,0.12)' : '#F4F4F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={18} color={sel ? 'white' : '#0A0A0A'} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: sel ? 'white' : '#0A0A0A', marginBottom: '2px' }}>{label}</div>
                        <div style={{ fontSize: '0.75rem', color: sel ? 'rgba(255,255,255,0.5)' : '#A3A3A3', lineHeight: 1.4 }}>{sub}</div>
                      </div>
                      {sel && (
                        <div style={{ position: 'absolute', top: '10px', right: '10px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={11} color="#0A0A0A" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <button onClick={() => advance(1)} disabled={!motivation}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: motivation ? '#0A0A0A' : '#E8E8E8', color: motivation ? 'white' : '#A3A3A3', border: 'none', padding: '0.9rem', borderRadius: '12px', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.95rem', cursor: motivation ? 'pointer' : 'not-allowed', transition: 'opacity 0.15s' }}
                onMouseEnter={e => { if (motivation) (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              >Continuer <ArrowRight size={16} /></button>
            </>
          )}

          {/* ── Step 1: Daily goal ── */}
          {step === 1 && (
            <>
              <div style={{ marginBottom: '2.5rem' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em', color: '#A3A3A3', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Étape 2 · Objectif quotidien</p>
                <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', color: '#0A0A0A', margin: '0 0 0.75rem', lineHeight: 1.15 }}>
                  Combien de temps<br />par jour ?
                </h1>
                <p style={{ color: '#737373', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>
                  Choisissez une durée réaliste. Vous pourrez la modifier plus tard.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
                {GOALS.map(({ id, label, time, xp, Icon, desc, highlight }) => {
                  const sel = goal === id;
                  return (
                    <button key={id} onClick={() => setGoal(id)}
                      style={{ ...pill(sel), position: 'relative' }}
                      aria-pressed={sel}
                    >
                      {highlight && (
                        <div style={{ position: 'absolute', top: '-1px', right: '14px', transform: 'translateY(-50%)', background: sel ? 'white' : '#0A0A0A', color: sel ? '#0A0A0A' : 'white', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', padding: '2px 8px', borderRadius: '100px', textTransform: 'uppercase' }}>Recommandé</div>
                      )}
                      <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: sel ? 'rgba(255,255,255,0.1)' : '#F4F4F4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={20} color={sel ? 'white' : '#0A0A0A'} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: sel ? 'white' : '#0A0A0A' }}>{label}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: sel ? 'rgba(255,255,255,0.45)' : '#A3A3A3' }}>{xp}</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: sel ? 'rgba(255,255,255,0.45)' : '#A3A3A3' }}>{time} · {desc}</div>
                      </div>
                      {sel && <Check size={16} color="white" strokeWidth={2.5} />}
                    </button>
                  );
                })}
              </div>

              <button onClick={() => advance(2)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#0A0A0A', color: 'white', border: 'none', padding: '0.9rem', borderRadius: '12px', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              >Continuer <ArrowRight size={16} /></button>
            </>
          )}

          {/* ── Step 2: Summary + Launch ── */}
          {step === 2 && (
            <>
              <div style={{ marginBottom: '2.5rem' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em', color: '#A3A3A3', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Étape 3 · Récapitulatif</p>
                <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', color: '#0A0A0A', margin: '0 0 0.75rem', lineHeight: 1.15 }}>
                  Tout est prêt.
                </h1>
                <p style={{ color: '#737373', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>
                  Votre programme A1 vous attend. Commencez par l'alphabet cyrillique — la base de tout.
                </p>
              </div>

              {/* Summary card */}
              <div style={{ background: '#F4F4F4', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    { label: 'Objectif', value: MOTIVATIONS.find(m => m.id === motivation)?.label ?? '—' },
                    { label: 'Intensité', value: GOALS.find(g => g.id === goal)?.time ?? '—' },
                    { label: 'Programme', value: '8 étapes A1' },
                    { label: 'Durée', value: '~8 semaines' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div style={{ fontSize: '0.7rem', color: '#A3A3A3', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', marginBottom: '3px', textTransform: 'uppercase' }}>{label}</div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0A0A0A' }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Big Cyrillic letter decorative */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontFamily: 'var(--font-cyrillic)', fontSize: '5rem', color: '#E8E8E8', lineHeight: 1, userSelect: 'none', animationName: 'float', animationDuration: '3s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', display: 'inline-block' }} aria-hidden="true">Г</div>
              </div>

              <button onClick={() => setDone(true)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#0A0A0A', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              >Commencer l'étape 1 <ArrowRight size={17} /></button>

              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#A3A3A3', margin: '1rem 0 0', fontFamily: 'var(--font-mono)' }}>
                0€ · Gratuit · Sans carte requise
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
