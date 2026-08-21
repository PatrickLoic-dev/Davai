import { useEffect, useRef, useState } from 'react';
import { ArrowRight, BookOpen, Layers, PenLine, Volume2, Zap, Star } from 'lucide-react';
import { AppLogo, BearMark } from './Logo';

const LIME = '#C8FF00';

interface Props {
  onStart: () => void;
  onLogin: () => void;
}

/* ── Section heading ── */
function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#0A0A0A', margin: '0 0 0.75rem', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
        {title}
      </h2>
      {sub && <p style={{ color: '#737373', fontSize: '1rem', margin: 0, maxWidth: '480px', marginInline: 'auto', lineHeight: 1.6 }}>{sub}</p>}
    </div>
  );
}

/* ── Topic card ── */
function TopicCard({ emoji, title, sub, color }: { emoji: string; title: string; sub: string; color: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? '#F7F7F5' : 'white', borderRadius: '16px',
        border: '1.5px solid #EBEBEB', padding: '1.5rem',
        cursor: 'default', transition: 'background 0.18s, transform 0.18s',
        transform: hov ? 'translateY(-3px)' : 'none',
      }}
    >
      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '0.9rem' }}>{emoji}</div>
      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0A0A0A', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>{title}</div>
      <div style={{ fontSize: '0.8rem', color: '#8A8A8A' }}>{sub}</div>
    </div>
  );
}

const TOPICS = [
  { emoji: '🔤', title: 'Alphabet cyrillique', sub: '33 lettres avec audio',        color: '#7C3AED' },
  { emoji: '💬', title: 'Vocabulaire',         sub: '40 mots, 5 thèmes',            color: '#D97706' },
  { emoji: '📖', title: 'Grammaire',           sub: 'Leçons progressives A1',       color: '#16A34A' },
  { emoji: '✏️', title: 'Exercices',           sub: 'QCM et textes à trous',        color: '#DC2626' },
  { emoji: '🔊', title: 'Prononciation',       sub: 'Audio natif pour chaque mot',  color: '#0891B2' },
  { emoji: '🏆', title: 'Gamification',        sub: 'XP, niveaux et badges',        color: '#C2410C' },
];

const METHODS = [
  { n: '01', title: 'Commencez par les bases', body: "L'alphabet cyrillique d'abord — chaque lettre avec sa prononciation audio.", Icon: Volume2 },
  { n: '02', title: 'Répétition espacée (SRS)', body: "Les flashcards s'adaptent à votre rythme pour ancrer le vocabulaire en mémoire.", Icon: Zap },
  { n: '03', title: 'Pratiquez et gagnez des XP', body: 'Exercices interactifs, badges déblocables et streak quotidien pour rester motivé.', Icon: Star },
];

export default function HomePage({ onStart, onLogin }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [navSolid, setNavSolid] = useState(false);

  /* Scroll-reveal observer */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onScroll = () => setNavSolid(container.scrollTop > 40);
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    containerRef.current?.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} style={{ height: '100%', overflowY: 'auto', background: '#FAFAF8', fontFamily: 'var(--font-ui)', color: '#0A0A0A' }}>

      {/* ── NAV ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: navSolid ? 'rgba(250,250,248,0.92)' : 'transparent',
        backdropFilter: navSolid ? 'blur(16px)' : 'none',
        borderBottom: navSolid ? '1px solid #EBEBEB' : 'none',
        transition: 'background 0.3s, border-color 0.3s',
        padding: '0 clamp(1.25rem, 5vw, 4rem)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}>
        <AppLogo size={26} textSize="0.92rem" />
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hp-links">
          {[['method', 'Méthode'], ['modules', 'Modules'], ['path', 'Parcours']].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)}
              style={{ background: 'none', border: 'none', color: '#5A5A5A', fontFamily: 'var(--font-ui)', fontSize: '0.87rem', fontWeight: 500, cursor: 'pointer', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#0A0A0A'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#5A5A5A'}
            >{label}</button>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={onLogin}
            style={{ background: 'none', border: '1.5px solid #D0D0D0', color: '#0A0A0A', padding: '0.45rem 1rem', borderRadius: '100px', fontFamily: 'var(--font-ui)', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', transition: 'border-color 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#0A0A0A'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#D0D0D0'}
          >Connexion</button>
          <button onClick={onStart}
            style={{ background: '#0A0A0A', color: 'white', border: 'none', padding: '0.45rem 1.1rem', borderRadius: '100px', fontFamily: 'var(--font-ui)', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.82'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
          >Commencer</button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ padding: 'clamp(3rem, 8vw, 6rem) clamp(1.25rem, 6vw, 4rem)', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', minHeight: '80vh' }}>

        {/* Left: text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2.6rem, 6vw, 4.2rem)', lineHeight: 1.08, letterSpacing: '-0.03em', margin: 0, color: '#0A0A0A' }}>
            Apprenez le<br />
            russe,<br />
            <span style={{ color: LIME, WebkitTextStroke: '1px #8AAA00' }}>davai&nbsp;!</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)', color: '#5A5A5A', lineHeight: 1.7, margin: 0, maxWidth: '420px' }}>
            Alphabet cyrillique, vocabulaire et grammaire — apprenez à votre rythme avec audio, répétition espacée et exercices interactifs.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={onStart}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0A0A0A', color: 'white', border: 'none', padding: '0.85rem 1.75rem', borderRadius: '100px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.82'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
            >
              Commencer gratuitement <ArrowRight size={16} />
            </button>
          </div>

          {/* Social proof row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            {[['33', 'lettres'], ['40+', 'mots'], ['10', 'badges']].map(([n, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: '#0A0A0A' }}>{n}</span>
                <span style={{ fontSize: '0.8rem', color: '#8A8A8A' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: illustration */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '420px' }}>
          {/* Lime blob */}
          <div style={{ position: 'absolute', width: '340px', height: '340px', borderRadius: '50%', background: LIME, opacity: 0.22, filter: 'blur(48px)', zIndex: 0 }} />
          <div style={{ position: 'absolute', width: '260px', height: '260px', borderRadius: '50%', background: LIME, zIndex: 0 }} />

          {/* Bear mascot */}
          <BearMark size={200} bodyColor="#0A0A0A" cutoutColor={LIME} style={{ position: 'relative', zIndex: 1 }} />

        </div>
      </section>

      {/* ── METHOD ── */}
      <section id="method" style={{ background: '#F4F4F0', padding: 'clamp(3rem, 7vw, 5rem) clamp(1.25rem, 6vw, 4rem)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="reveal">
            <SectionHead title="La méthode Davai" sub="Trois piliers pour apprendre le russe durablement, sans surcharge cognitive." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {METHODS.map(({ n, title, body, Icon }, i) => (
              <div key={n} className="reveal" style={{ animationDelay: `${i * 80}ms`, background: 'white', borderRadius: '20px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid #EBEBEB' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 600, color: '#B0B0B0', letterSpacing: '0.08em' }}>{n}</span>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${LIME}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} style={{ color: '#4A6A00' }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: '#0A0A0A', marginBottom: '0.5rem' }}>{title}</div>
                  <p style={{ fontSize: '0.88rem', color: '#6A6A6A', lineHeight: 1.65, margin: 0 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODULES ── */}
      <section id="modules" style={{ padding: 'clamp(3rem, 7vw, 5rem) clamp(1.25rem, 6vw, 4rem)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="reveal"><SectionHead title="6 modules complets" sub="De l'alphabet aux exercices — tout ce qu'il faut pour les bases du russe." /></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: '1rem' }}>
            {TOPICS.map((t, i) => (
              <div key={t.title} className="reveal" style={{ animationDelay: `${i * 60}ms` }}>
                <TopicCard {...t} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ── */}
      <section style={{ background: '#0A0A0A', padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 6vw, 4rem)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {[['33', 'Lettres de l\'alphabet'], ['40+', 'Mots essentiels'], ['5', 'Thèmes de vocab'], ['10', 'Badges à débloquer']].map(([n, l]) => (
            <div key={l} className="reveal">
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2.2rem, 5vw, 3rem)', color: LIME, lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PATH PREVIEW ── */}
      <section id="path" style={{ padding: 'clamp(3rem, 7vw, 5rem) clamp(1.25rem, 6vw, 4rem)', background: '#F4F4F0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="reveal"><SectionHead title="Parcours A1 structuré" sub="Progressez étape par étape — chaque module débloque le suivant." /></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))', gap: '0.875rem' }}>
            {[
              { step: '01', label: 'Alphabet', sub: 'Lettres et sons', done: true },
              { step: '02', label: 'Phonétique', sub: 'Lecture cyrillique', done: false },
              { step: '03', label: 'Grammaire', sub: 'Genre et pluriel', done: false },
              { step: '04', label: 'Vocabulaire', sub: 'Mots du quotidien', done: false },
              { step: '05', label: 'Chiffres', sub: '0 à 100', done: false },
              { step: '06', label: 'Phrases', sub: 'Se présenter', done: false },
            ].map(({ step, label, sub, done }, i) => (
              <div key={step} className="reveal" style={{ animationDelay: `${i * 60}ms`, background: 'white', borderRadius: '14px', padding: '1.25rem', border: `1.5px solid ${done ? LIME : '#EBEBEB'}`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#B0B0B0', letterSpacing: '0.08em' }}>{step}</span>
                  {done && <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#4A6A00', background: `${LIME}40`, borderRadius: '100px', padding: '2px 8px', fontFamily: 'var(--font-mono)' }}>FAIT</span>}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.92rem', color: '#0A0A0A' }}>{label}</div>
                <div style={{ fontSize: '0.76rem', color: '#8A8A8A' }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(3.5rem, 8vw, 6rem) clamp(1.25rem, 6vw, 4rem)', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <BearMark size={80} bodyColor="#0A0A0A" cutoutColor="#FAFAF8" />
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#0A0A0A', margin: '0 0 0.75rem', letterSpacing: '-0.02em', lineHeight: 1.12 }}>
              Prêt à vous lancer ?
            </h2>
            <p style={{ color: '#6A6A6A', fontSize: '1rem', lineHeight: 1.65, margin: 0 }}>
              Gratuit, sans inscription par carte bancaire.<br />Commencez en moins de 30 secondes.
            </p>
          </div>
          <button onClick={onStart}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0A0A0A', color: 'white', border: 'none', padding: '1rem 2.25rem', borderRadius: '100px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'opacity 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.82'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
          >
            Créer un compte gratuit <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #EBEBEB', padding: '1.75rem clamp(1.25rem, 6vw, 4rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: 'white' }}>
        <AppLogo size={22} textSize="0.82rem" />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#B0B0B0', letterSpacing: '0.06em' }}>© 2026 · Open-source · MIT</span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {[['method', 'Méthode'], ['modules', 'Modules'], ['path', 'Parcours']].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)}
              style={{ background: 'none', border: 'none', color: '#8A8A8A', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-ui)', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#0A0A0A'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#8A8A8A'}
            >{label}</button>
          ))}
        </div>
      </footer>

      {/* Mobile nav links hidden via CSS */}
      <style>{`
        @media (max-width: 767px) {
          .hp-links { display: none !important; }
        }
        @media (max-width: 900px) {
          section[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
