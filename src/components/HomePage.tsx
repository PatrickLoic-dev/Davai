import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight, BookOpen, Layers, BookText, PenLine, Trophy, Zap, Volume2, ChevronRight } from 'lucide-react';

interface Props {
  onStart: () => void;
  onLogin: () => void;
}

const FLOATERS = [
  { l: 'А', x: 7,  y: 10, s: 8,  o: 0.055, d: 9  },
  { l: 'Б', x: 87, y: 7,  s: 6,  o: 0.04,  d: 11 },
  { l: 'В', x: 14, y: 72, s: 7,  o: 0.05,  d: 8  },
  { l: 'Г', x: 75, y: 80, s: 9,  o: 0.038, d: 13 },
  { l: 'Д', x: 48, y: 4,  s: 5,  o: 0.035, d: 15 },
  { l: 'Е', x: 93, y: 52, s: 7,  o: 0.045, d: 10 },
  { l: 'Ж', x: 2,  y: 42, s: 6,  o: 0.04,  d: 12 },
  { l: 'З', x: 62, y: 88, s: 5,  o: 0.03,  d: 7  },
  { l: 'И', x: 33, y: 18, s: 4,  o: 0.04,  d: 14 },
  { l: 'К', x: 80, y: 28, s: 6,  o: 0.05,  d: 9  },
  { l: 'Л', x: 22, y: 86, s: 8,  o: 0.032, d: 11 },
  { l: 'М', x: 55, y: 62, s: 5,  o: 0.042, d: 8  },
];

const TICKER_ITEMS = [
  '12 000+ apprenants',
  '★ 4.9 / 5',
  '33 lettres',
  '100% gratuit',
  'A1 certifiable',
  'Audio natif',
  'Flashcards SRS',
  'Gamifié',
];

const FEATURES = [
  { n: '01', title: 'Alphabet Cyrillique', sub: '33 lettres. Sons réels. Quiz interactif. Maîtrisez le Cyrillique en une semaine.', Icon: BookOpen, color: '#4338CA' },
  { n: '02', title: 'Audio Natif', sub: "Chaque lettre, syllabe et mot prononcé. Votre oreille s'entraîne dès le premier jour.", Icon: Volume2, color: '#C8FF00' },
  { n: '03', title: 'Vocabulaire SRS', sub: '40 mots essentiels sur 5 thèmes. La répétition espacée maximise votre rétention.', Icon: Layers, color: '#7C3AED' },
  { n: '04', title: 'Grammaire A1', sub: 'Genres, cas, conjugaisons. Chaque règle expliquée avec des exemples en contexte.', Icon: BookText, color: '#F59E0B' },
  { n: '05', title: 'Exercices Ciblés', sub: 'QCM et textes à trous. Feedback immédiat. Chaque erreur devient une leçon.', Icon: PenLine, color: '#059669' },
  { n: '06', title: 'Gamification', sub: 'XP, niveaux, séries et 10 badges. Apprendre ne devrait jamais être ennuyeux.', Icon: Trophy, color: '#EF4444' },
];

const PATH_STEPS = [
  { n: 1, title: 'Alphabet',   sub: '33 lettres', color: '#4338CA', active: true },
  { n: 2, title: 'Phonétique', sub: 'Sons clés',  color: '#7C3AED', active: false },
  { n: 3, title: 'Salutations',sub: 'Vocabulaire',color: '#059669', active: false },
  { n: 4, title: 'Chiffres',   sub: '0 à 20',     color: '#F59E0B', active: false },
  { n: 5, title: 'Genres',     sub: 'Grammaire',  color: '#DC2626', active: false },
  { n: 6, title: 'Cas',        sub: 'Nominatif',  color: '#0891B2', active: false },
  { n: 7, title: 'Verbes',     sub: 'Présent',    color: '#7C3AED', active: false },
  { n: 8, title: 'Évaluation', sub: 'Test A1',    color: '#4338CA', active: false },
];

function useReveal(delay = 0) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => el.classList.add('visible'), delay);
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

export default function HomePage({ onStart, onLogin }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [navSolid, setNavSolid] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  const methodRef  = useReveal() as React.RefObject<HTMLElement>;
  const featuresRef = useReveal(100) as React.RefObject<HTMLElement>;
  const pathRef    = useReveal(50)  as React.RefObject<HTMLElement>;
  const ctaRef     = useReveal()    as React.RefObject<HTMLElement>;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const fn = () => setNavSolid(el.scrollTop > 60);
    el.addEventListener('scroll', fn, { passive: true });
    return () => el.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  /* shared transition helper */
  const show = (extra = 0) => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.65s ${extra}s ease, transform 0.65s ${extra}s ease`,
  });

  return (
    <div ref={containerRef} style={{ height: '100%', overflowY: 'auto', background: '#08080F', color: '#F0F0F0' }}>

      {/* ── STICKY NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        padding: '0 clamp(1.25rem, 5vw, 4rem)', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: navSolid ? 'rgba(8,8,15,0.92)' : 'transparent',
        backdropFilter: navSolid ? 'blur(20px)' : 'none',
        borderBottom: navSolid ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'background 0.3s, backdrop-filter 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#C8FF00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sport)', fontWeight: 900, fontSize: '1.15rem', color: '#08080F' }}>Р</div>
          <span style={{ fontFamily: 'var(--font-sport)', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.04em', color: 'white' }}>RUSSKI<span style={{ color: '#C8FF00' }}>+</span></span>
        </div>

        {/* Desktop links — hidden on mobile */}
        <div className="hp-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {[['method', 'Méthode'], ['features', 'Fonctionnalités'], ['path', 'Parcours']].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-ui)', fontSize: '0.87rem', fontWeight: 500, cursor: 'pointer', transition: 'color 0.18s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'white'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}
            >{label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={onLogin} className="hp-login"
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-ui)', fontSize: '0.87rem', cursor: 'pointer', transition: 'color 0.18s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'white'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}
          >Se connecter</button>
          <button onClick={onStart}
            style={{ background: '#C8FF00', color: '#08080F', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '100px', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.87rem', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 22px rgba(200,255,0,0.35)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
          >Commencer</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight: '100dvh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(5rem, 10vw, 8rem) clamp(1.25rem, 5vw, 4rem) 4rem', overflow: 'hidden', marginTop: '-64px' }}>

        {/* Orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true">
          <div style={{ position: 'absolute', width: 'clamp(380px, 50vw, 680px)', height: 'clamp(380px, 50vw, 680px)', borderRadius: '50%', bottom: '-15%', left: '-8%', background: 'radial-gradient(circle, rgba(200,255,0,0.13) 0%, transparent 65%)' }} />
          <div style={{ position: 'absolute', width: 'clamp(320px, 44vw, 580px)', height: 'clamp(320px, 44vw, 580px)', borderRadius: '50%', top: '-10%', right: '-6%', background: 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 65%)' }} />
          <div style={{ position: 'absolute', inset: 0, opacity: 0.025, backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        </div>

        {/* Floating Cyrillic */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true">
          {FLOATERS.map(({ l, x, y, s, o, d }, i) => (
            <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, fontSize: `${s}rem`, opacity: o, color: 'white', fontFamily: 'var(--font-cyrillic)', animationName: 'drift', animationDuration: `${d}s`, animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDirection: 'alternate', animationDelay: `${i * 0.6}s`, userSelect: 'none' }}>{l}</div>
          ))}
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '920px', width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '100px', background: 'rgba(200,255,0,0.08)', border: '1px solid rgba(200,255,0,0.2)', marginBottom: '2.25rem', ...show(0) }}>
            <Zap size={12} color="#C8FF00" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.14em', color: '#C8FF00', textTransform: 'uppercase' }}>Entraînement Linguistique · A1</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-sport)', fontWeight: 900, fontSize: 'clamp(3.8rem, 12vw, 10.5rem)', lineHeight: 0.9, letterSpacing: '-0.01em', textTransform: 'uppercase', margin: '0 0 1.5rem', ...show(0.1) }}>
            <span style={{ display: 'block', color: 'white' }}>PARLEZ</span>
            <span style={{ display: 'block', color: '#C8FF00' }}>RUSSE.</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 2.5rem', ...show(0.2) }}>
            33 lettres. 40 mots essentiels. 8 étapes progressives.
            La méthode d'apprentissage la plus complète pour débutants — 100% gratuite.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', ...show(0.3) }}>
            <button onClick={onStart}
              className="neon-pulse"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#C8FF00', color: '#08080F', border: 'none', padding: '0.9rem 2.1rem', borderRadius: '100px', fontFamily: 'var(--font-sport)', fontWeight: 800, fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer', transition: 'transform 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
            >Commencer gratuitement <ArrowRight size={16} /></button>
            <button onClick={onLogin}
              style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '0.9rem 1.75rem', borderRadius: '100px', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 'clamp(0.87rem, 2vw, 0.95rem)', cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.09)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'}
            >J'ai déjà un compte</button>
          </div>

          <div style={{ display: 'flex', gap: 'clamp(1.5rem, 4vw, 3rem)', justifyContent: 'center', marginTop: '3.5rem', flexWrap: 'wrap', ...show(0.45) }}>
            {[['12 000+', 'Apprenants'], ['4.9★', 'Note'], ['100%', 'Gratuit']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-sport)', fontWeight: 900, fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', color: 'white' }}>{v}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', opacity: heroVisible ? 1 : 0, transition: 'opacity 1s 1.1s ease' }}>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, rgba(200,255,0,0.45))', animationName: 'float', animationDuration: '2s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }} />
          Défiler
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(200,255,0,0.03)', overflow: 'hidden', height: '48px', display: 'flex', alignItems: 'center' }}>
        <div className="animate-ticker" style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', willChange: 'transform' }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ fontFamily: 'var(--font-sport)', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', paddingLeft: '2.5rem' }}>{item}</span>
              <span style={{ color: '#C8FF00', fontSize: '0.45rem' }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── METHOD ── */}
      <section id="method" ref={methodRef as React.RefObject<HTMLDivElement>} className="reveal" style={{ padding: 'clamp(5rem, 10vw, 8rem) clamp(1.25rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.16em', color: '#C8FF00', textTransform: 'uppercase', marginBottom: '1rem' }}>— La méthode</div>
            <h2 style={{ fontFamily: 'var(--font-sport)', fontWeight: 900, fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', lineHeight: 0.93, textTransform: 'uppercase', color: 'white', margin: 0 }}>
              APPRENDRE<br /><span style={{ color: 'rgba(255,255,255,0.22)' }}>COMME UN</span> <span style={{ color: '#C8FF00' }}>PRO.</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.06)', borderRadius: '18px', overflow: 'hidden' }}>
            {[
              { n: '01', title: 'Progressif', body: 'Chaque étape se déverrouille quand la précédente est maîtrisée. Pas de saut, pas de lacune.' },
              { n: '02', title: 'Répétition Espacée', body: "L'algorithme SRS revoit les mots au bon moment. Votre mémoire à long terme est activée." },
              { n: '03', title: 'Immersif', body: 'Audio, écriture, lecture, exercices. Toutes les compétences travaillées en parallèle.' },
            ].map(({ n, title, body }) => (
              <div key={n} style={{ background: '#0E0E1A', padding: 'clamp(1.75rem, 3vw, 2.5rem)', position: 'relative', overflow: 'hidden', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#141428'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#0E0E1A'}>
                <div style={{ fontFamily: 'var(--font-sport)', fontWeight: 900, fontSize: '4.5rem', color: 'rgba(200,255,0,0.06)', position: 'absolute', top: '0.5rem', right: '1rem', lineHeight: 1, userSelect: 'none' }}>{n}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.13em', color: '#C8FF00', textTransform: 'uppercase', marginBottom: '0.7rem' }}>{n}</div>
                <h3 style={{ fontFamily: 'var(--font-sport)', fontWeight: 800, fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)', textTransform: 'uppercase', color: 'white', margin: '0 0 0.65rem', letterSpacing: '0.01em' }}>{title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.42)', lineHeight: 1.68, fontSize: '0.88rem', margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" ref={featuresRef as React.RefObject<HTMLDivElement>} className="reveal" style={{ padding: 'clamp(3rem, 8vw, 6rem) clamp(1.25rem, 5vw, 4rem)', background: '#08080F' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.16em', color: '#C8FF00', textTransform: 'uppercase', marginBottom: '1rem' }}>— Fonctionnalités</div>
            <h2 style={{ fontFamily: 'var(--font-sport)', fontWeight: 900, fontSize: 'clamp(2.5rem, 5vw, 4.8rem)', lineHeight: 0.93, textTransform: 'uppercase', color: 'white', margin: 0 }}>
              TOUT CE DONT<br />VOUS AVEZ BESOIN.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 290px), 1fr))', gap: '1px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', overflow: 'hidden' }}>
            {FEATURES.map(({ n, title, sub, Icon, color }) => (
              <div key={n} style={{ background: '#0E0E1A', padding: 'clamp(1.5rem, 2.5vw, 2rem)', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'background 0.22s', cursor: 'default' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#141428'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#0E0E1A'}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}22` }}>
                    <Icon size={20} color={color === '#C8FF00' ? '#9aCC00' : color} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.18)' }}>{n}</span>
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-sport)', fontWeight: 800, fontSize: 'clamp(1rem, 2vw, 1.1rem)', textTransform: 'uppercase', color: 'white', margin: '0 0 0.4rem', letterSpacing: '0.025em' }}>{title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.38)', lineHeight: 1.62, fontSize: '0.84rem', margin: 0 }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PATH PREVIEW ── */}
      <section id="path" ref={pathRef as React.RefObject<HTMLDivElement>} className="reveal" style={{ padding: 'clamp(5rem, 10vw, 8rem) clamp(1.25rem, 5vw, 4rem)', background: '#0B0B15' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.16em', color: '#C8FF00', textTransform: 'uppercase', marginBottom: '1rem' }}>— Parcours A1</div>
            <h2 style={{ fontFamily: 'var(--font-sport)', fontWeight: 900, fontSize: 'clamp(2.5rem, 5vw, 4.8rem)', lineHeight: 0.93, textTransform: 'uppercase', color: 'white', margin: '0 0 1rem' }}>
              8 ÉTAPES.<br />1 OBJECTIF.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.38)', maxWidth: '420px', lineHeight: 1.68, fontSize: '0.92rem' }}>
              Chaque module se déverrouille après le précédent. Pas de raccourci — juste la progression.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 230px), 1fr))', gap: '10px' }}>
            {PATH_STEPS.map(({ n, title, sub, color, active }, i) => (
              <div key={n} style={{ background: '#111120', borderRadius: '14px', padding: '1.25rem 1.4rem', border: active ? `1px solid ${color}40` : '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '0.9rem', opacity: active ? 1 : 0.45 + i * 0.045, transition: 'opacity 0.2s, background 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#161628'; (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#111120'; (e.currentTarget as HTMLElement).style.opacity = String(active ? 1 : 0.45 + i * 0.045); }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0, background: active ? color : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sport)', fontWeight: 800, fontSize: '0.82rem', color: active ? '#08080F' : 'rgba(255,255,255,0.25)', border: active ? 'none' : '1px solid rgba(255,255,255,0.06)' }}>{n}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-sport)', fontWeight: 700, fontSize: '0.92rem', textTransform: 'uppercase', letterSpacing: '0.03em', color: 'white' }}>{title}</div>
                  <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{sub}</div>
                </div>
                {active && <ChevronRight size={13} color={color} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section ref={ctaRef as React.RefObject<HTMLDivElement>} className="reveal" style={{ padding: 'clamp(6rem, 12vw, 10rem) clamp(1.25rem, 5vw, 4rem)', background: '#C8FF00', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.06 }} aria-hidden="true">
          {'РУССКИЙ'.split('').map((l, i) => (
            <span key={i} style={{ position: 'absolute', fontFamily: 'var(--font-cyrillic)', fontSize: 'clamp(5rem, 10vw, 11rem)', left: `${i * 15}%`, top: '50%', transform: 'translateY(-50%)', color: 'black', userSelect: 'none' }}>{l}</span>
          ))}
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.16em', color: 'rgba(8,8,15,0.45)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>— Gratuit · Aucune carte requise</div>
          <h2 style={{ fontFamily: 'var(--font-sport)', fontWeight: 900, fontSize: 'clamp(3rem, 8vw, 7.5rem)', lineHeight: 0.9, textTransform: 'uppercase', color: '#08080F', margin: '0 0 2rem' }}>
            PRÊT À<br />COMMENCER ?
          </h2>
          <p style={{ color: 'rgba(8,8,15,0.52)', fontSize: 'clamp(0.95rem, 2vw, 1.12rem)', maxWidth: '400px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Rejoignez 12 000 apprenants et maîtrisez les bases du russe en 8 semaines.
          </p>
          <button onClick={onStart}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#08080F', color: '#C8FF00', border: 'none', padding: '1rem 2.5rem', borderRadius: '100px', fontFamily: 'var(--font-sport)', fontWeight: 800, fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.22)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
          >Commencer maintenant <ArrowRight size={18} /></button>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            {['★★★★★  4.9 / 5', '0 € · Toujours gratuit', 'A1 certifiable'].map(t => (
              <span key={t} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'rgba(8,8,15,0.45)', fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '2rem clamp(1.25rem, 5vw, 4rem)', background: '#08080F', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: '#C8FF00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sport)', fontWeight: 900, fontSize: '0.95rem', color: '#08080F' }}>Р</div>
          <span style={{ fontFamily: 'var(--font-sport)', fontWeight: 800, fontSize: '0.88rem', color: 'rgba(255,255,255,0.3)' }}>RUSSKI+</span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em' }}>© 2026 · Open-source · MIT</span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {[['method', 'Méthode'], ['features', 'Fonctionnalités'], ['path', 'Parcours']].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)}
              style={{ background: 'none', border: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.28)', cursor: 'pointer', transition: 'color 0.18s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.28)'}
            >{label}</button>
          ))}
        </div>
      </footer>

      {/* Mobile responsive overrides */}
      <style>{`
        @media (max-width: 767px) {
          .hp-links { display: none !important; }
          .hp-login { display: none !important; }
        }
      `}</style>
    </div>
  );
}
