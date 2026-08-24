import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { speakRussian } from '../utils/audio';

interface Props {
  /** The Russian text to display and speak. */
  text: string;
  /** Phonetic/translit hint shown in the bubble. */
  phonetic?: string;
  rate?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A word or letter with a dotted underline; hovering (or focusing, for
 * keyboard users) reveals a small bubble with the phonetic transcription
 * and a button to hear it. The bubble only exists on hover — it's not a
 * click-to-toggle, matching how a dictionary gloss behaves.
 */
export default function PhoneticHover({ text, phonetic, rate, className, style }: Props) {
  const [active, setActive] = useState(false);

  return (
    <span
      className={className}
      style={{
        position: 'relative', display: 'inline-block', cursor: 'help',
        borderBottom: '1.5px dotted currentColor', textUnderlineOffset: '3px',
        ...style,
      }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      tabIndex={0}
      role="button"
      aria-label={`${text}${phonetic ? `, prononcé ${phonetic}` : ''} — écouter`}
    >
      {text}
      {active && (
        <span
          role="tooltip"
          style={{
            position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: '7px',
            background: '#0A0A0A', color: 'white', padding: '5px 8px 5px 10px',
            borderRadius: '8px', whiteSpace: 'nowrap', zIndex: 60,
            boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
            animation: 'fade-in 0.12s ease',
          }}
        >
          {phonetic && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)' }}>
              {phonetic}
            </span>
          )}
          <button
            onClick={e => { e.stopPropagation(); speakRussian(text, rate); }}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
            aria-label={`Écouter ${text}`}
          >
            <Volume2 size={10} color="white" />
          </button>
          <span
            aria-hidden="true"
            style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #0A0A0A' }}
          />
        </span>
      )}
    </span>
  );
}
