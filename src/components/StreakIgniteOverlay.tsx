import { useEffect, useState } from 'react';

interface Props {
  onDismiss: () => void;
}

/* Material "whatshot" flame silhouette (viewBox 0 0 24 24) — reused at
   different scales/colors to build a layered, licking-flame illusion. */
const FLAME_D =
  'M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z';

const EMBERS = [
  { x: 8, delay: 0.9, dur: 1.9, size: 3.2 },
  { x: 13, delay: 1.35, dur: 2.2, size: 2.4 },
  { x: 16.5, delay: 1.1, dur: 1.7, size: 2.8 },
  { x: 5.5, delay: 1.6, dur: 2.4, size: 2 },
  { x: 11, delay: 2.0, dur: 1.8, size: 2.6 },
];

export default function StreakIgniteOverlay({ onDismiss }: Props) {
  const [closing, setClosing] = useState(false);

  function close() {
    if (closing) return;
    setClosing(true);
    setTimeout(onDismiss, 420);
  }

  useEffect(() => {
    const t = setTimeout(close, 3600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      onClick={close}
      role="dialog"
      aria-label="Nouvelle série commencée"
      aria-live="polite"
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #1a0800 0%, #0A0A0A 70%)',
        cursor: 'pointer',
        opacity: closing ? 0 : 1,
        transition: 'opacity 0.4s ease',
      }}
    >
      <div style={{ position: 'relative', width: 'min(70vw, 320px)', aspectRatio: '24 / 30', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>

        {/* Pulsing glow behind the flame */}
        <div
          className="streak-glow"
          style={{
            position: 'absolute', bottom: '4%', left: '50%', transform: 'translateX(-50%)',
            width: '140%', height: '85%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,140,0,0.55) 0%, rgba(255,80,0,0.25) 45%, transparent 72%)',
            filter: 'blur(18px)',
          }}
        />

        {/* Rising embers */}
        <svg viewBox="0 0 24 30" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }} aria-hidden="true">
          {EMBERS.map((e, i) => (
            <circle
              key={i}
              className="streak-ember"
              cx={e.x} cy={20} r={e.size / 2}
              fill={i % 2 === 0 ? '#FFC24D' : '#FF7A1A'}
              style={{ animationDelay: `${e.delay}s`, animationDuration: `${e.dur}s` }}
            />
          ))}
        </svg>

        {/* Flame — outer / mid / inner / core, layered for depth */}
        <svg
          viewBox="0 0 24 24"
          className="streak-flame-wrap"
          style={{ position: 'relative', width: '78%', transformOrigin: 'bottom center' }}
          aria-hidden="true"
        >
          <path d={FLAME_D} className="streak-flame-layer streak-flame-outer" fill="#C4270A" transform="translate(-1.4,0.6) scale(1.08)" />
          <path d={FLAME_D} className="streak-flame-layer streak-flame-mid" fill="#FF6A00" transform="translate(0.6,1) scale(0.92)" />
          <path d={FLAME_D} className="streak-flame-layer streak-flame-inner" fill="#FFB300" transform="translate(0.2,3.2) scale(0.62)" />
          <ellipse className="streak-flame-core" cx="12" cy="17.5" rx="2.1" ry="3.4" fill="#FFF3C4" />
        </svg>
      </div>

      <div
        className="streak-text"
        style={{ textAlign: 'center', marginTop: '1.75rem', padding: '0 1.5rem' }}
      >
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.9rem, 6vw, 2.6rem)', color: 'white', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          Jour 1 🔥
        </div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', margin: 0 }}>
          Ta série commence — reviens demain pour l'entretenir !
        </p>
        <button
          onClick={e => { e.stopPropagation(); close(); }}
          style={{
            marginTop: '1.75rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            color: 'white', padding: '0.65rem 1.6rem', borderRadius: '100px',
            fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer',
          }}
        >
          Continuer
        </button>
      </div>

      <style>{`
        @keyframes streak-ignite-scale {
          0%   { transform: scaleY(0.05) scaleX(0.6); opacity: 0; }
          55%  { transform: scaleY(1.15) scaleX(1.05); opacity: 1; }
          75%  { transform: scaleY(0.92) scaleX(0.98); }
          100% { transform: scaleY(1) scaleX(1); opacity: 1; }
        }
        .streak-flame-wrap {
          animation: streak-ignite-scale 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes flicker-outer {
          0%, 100% { transform: translate(-1.4px,0.6px) scale(1.08) skewX(0deg); }
          30%      { transform: translate(-1.8px,0.4px) scale(1.1) skewX(-1.5deg); }
          60%      { transform: translate(-1px,0.7px) scale(1.05) skewX(1.5deg); }
        }
        @keyframes flicker-mid {
          0%, 100% { transform: translate(0.6px,1px) scale(0.92) skewX(0deg); }
          35%      { transform: translate(1.1px,0.7px) scale(0.96) skewX(2deg); }
          70%      { transform: translate(0.2px,1.2px) scale(0.89) skewX(-2deg); }
        }
        @keyframes flicker-inner {
          0%, 100% { transform: translate(0.2px,3.2px) scale(0.62) skewX(0deg); }
          40%      { transform: translate(0.6px,3px) scale(0.66) skewX(-2.5deg); }
          75%      { transform: translate(-0.2px,3.4px) scale(0.58) skewX(2.5deg); }
        }
        .streak-flame-outer { animation: flicker-outer 0.9s ease-in-out infinite 0.65s; transform-origin: bottom center; }
        .streak-flame-mid   { animation: flicker-mid 0.75s ease-in-out infinite 0.65s; transform-origin: bottom center; }
        .streak-flame-inner { animation: flicker-inner 0.6s ease-in-out infinite 0.65s; transform-origin: bottom center; }

        @keyframes core-pulse {
          0%, 100% { opacity: 0.85; transform: scaleY(1); }
          50%      { opacity: 1; transform: scaleY(1.12); }
        }
        .streak-flame-core { animation: core-pulse 0.5s ease-in-out infinite 0.65s; transform-origin: bottom center; }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.75; transform: translateX(-50%) scale(1); }
          50%      { opacity: 1; transform: translateX(-50%) scale(1.08); }
        }
        .streak-glow { animation: glow-pulse 1.4s ease-in-out infinite 0.5s; opacity: 0; }

        @keyframes ember-rise {
          0%   { transform: translateY(0) scale(1); opacity: 0; }
          15%  { opacity: 1; }
          100% { transform: translateY(-26px) scale(0.3); opacity: 0; }
        }
        .streak-ember { animation: ember-rise 2s ease-out infinite; opacity: 0; }

        @keyframes streak-text-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .streak-text { animation: streak-text-in 0.5s ease 0.55s both; }
      `}</style>
    </div>
  );
}
