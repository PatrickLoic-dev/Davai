import { useState } from 'react';
import { CEFRLevel } from '../data/lessons';
import { PLACEMENT_TEST, PlacementQuestion, computePlacementLevel } from '../data/placementTest';

interface Props {
  /** Restrict the test to a subset of questions (e.g. only levels at or
   * below the target when switching level from Settings). Defaults to the
   * full 30-question bank. */
  questions?: PlacementQuestion[];
  onComplete: (level: CEFRLevel) => void;
  onSkip?: () => void;
}

export default function LevelTest({ questions = PLACEMENT_TEST, onComplete, onSkip }: Props) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const q = questions[idx];

  function answer(i: number) {
    if (selected !== null) return;
    setSelected(i);
    const isCorrect = i === q.correct;
    const next = { ...answers, [q.id]: isCorrect };
    setAnswers(next);
    setTimeout(() => {
      if (idx + 1 < questions.length) {
        setIdx(v => v + 1);
        setSelected(null);
      } else {
        onComplete(computePlacementLevel(next));
      }
    }, 380);
  }

  const pct = Math.round((idx / questions.length) * 100);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#A3A3A3', fontFamily: 'var(--font-mono)' }}>
          Question {idx + 1}/{questions.length}
        </span>
        {onSkip && (
          <button
            onClick={onSkip}
            style={{ background: 'none', border: 'none', color: '#A3A3A3', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Passer, je débute (niveau A1)
          </button>
        )}
      </div>

      <div style={{ height: '3px', background: '#F4F4F4', borderRadius: '2px', marginBottom: '1.25rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#0A0A0A', transition: 'width 0.3s ease' }} />
      </div>

      <div style={{ background: '#F4F4F4', borderRadius: '16px', padding: '1.5rem' }}>
        <p style={{ fontWeight: 700, fontSize: '1rem', color: '#0A0A0A', margin: '0 0 1.1rem' }}>{q.question}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {q.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = i === q.correct;
            const showResult = selected !== null;
            let bg = 'white', border = '#E8E8E8', color = '#0A0A0A';
            if (showResult && isCorrect) { bg = 'rgba(34,197,94,0.12)'; border = 'rgba(34,197,94,0.4)'; color = '#16A34A'; }
            else if (showResult && isSelected) { bg = 'rgba(220,38,38,0.1)'; border = 'rgba(220,38,38,0.4)'; color = '#DC2626'; }
            return (
              <button
                key={i}
                onClick={() => answer(i)}
                disabled={showResult}
                style={{
                  textAlign: 'left', padding: '0.75rem 1rem', borderRadius: '10px',
                  border: `1.5px solid ${border}`, background: bg, color,
                  fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '0.88rem',
                  cursor: showResult ? 'default' : 'pointer', transition: 'all 0.15s',
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
