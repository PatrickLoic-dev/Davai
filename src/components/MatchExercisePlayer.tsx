import { useMemo, useState, useEffect } from 'react';
import { MatchExercise } from '../data/lessons';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface Props {
  exercise: MatchExercise;
  onDone: (allCorrectFirstTry: boolean) => void;
}

export default function MatchExercisePlayer({ exercise, onDone }: Props) {
  const rightItems = useMemo(() => shuffle(exercise.pairs.map(p => p.right)), [exercise]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [wrong, setWrong] = useState<{ left: string; right: string } | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = exercise.pairs.length;
  const matchedCount = Object.keys(matched).length;

  useEffect(() => {
    if (matchedCount === total && !finished) {
      setFinished(true);
      const t = setTimeout(() => onDone(mistakes === 0), 550);
      return () => clearTimeout(t);
    }
  }, [matchedCount, total, finished, mistakes, onDone]);

  function pickLeft(left: string) {
    if (matched[left]) return;
    setSelectedLeft(prev => (prev === left ? null : left));
  }

  function pickRight(right: string) {
    if (!selectedLeft || Object.values(matched).includes(right)) return;
    const pair = exercise.pairs.find(p => p.left === selectedLeft);
    if (pair && pair.right === right) {
      setMatched(m => ({ ...m, [selectedLeft]: right }));
      setSelectedLeft(null);
    } else {
      setMistakes(m => m + 1);
      setWrong({ left: selectedLeft, right });
      setTimeout(() => setWrong(null), 420);
      setSelectedLeft(null);
    }
  }

  return (
    <div>
      <p style={{ marginBottom: '1.25rem', textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--foreground)' }}>
        {exercise.question}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {exercise.pairs.map(p => {
            const isMatched = !!matched[p.left];
            const isSelected = selectedLeft === p.left;
            const isWrong = wrong?.left === p.left;
            return (
              <button
                key={p.left}
                onClick={() => pickLeft(p.left)}
                disabled={isMatched}
                className={isWrong ? 'animate-shake' : undefined}
                style={{
                  padding: '0.7rem 0.9rem', borderRadius: '10px', textAlign: 'left',
                  fontFamily: 'var(--font-cyrillic)', fontSize: '0.95rem', fontWeight: 600,
                  cursor: isMatched ? 'default' : 'pointer',
                  border: `1.5px solid ${isMatched ? 'rgba(34,197,94,0.4)' : isSelected ? 'var(--primary)' : isWrong ? 'rgba(220,38,38,0.5)' : 'var(--border)'}`,
                  background: isMatched ? 'rgba(34,197,94,0.1)' : isSelected ? 'rgba(67,56,202,0.08)' : isWrong ? 'rgba(220,38,38,0.08)' : 'white',
                  color: isMatched ? 'var(--success)' : 'var(--foreground)',
                  opacity: isMatched ? 0.75 : 1,
                  transition: 'all 0.15s',
                }}
              >
                {p.left}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {rightItems.map(right => {
            const isMatched = Object.values(matched).includes(right);
            const isWrong = wrong?.right === right;
            return (
              <button
                key={right}
                onClick={() => pickRight(right)}
                disabled={isMatched}
                className={isWrong ? 'animate-shake' : undefined}
                style={{
                  padding: '0.7rem 0.9rem', borderRadius: '10px', textAlign: 'left',
                  fontSize: '0.88rem', fontWeight: 600,
                  cursor: isMatched ? 'default' : selectedLeft ? 'pointer' : 'default',
                  border: `1.5px solid ${isMatched ? 'rgba(34,197,94,0.4)' : isWrong ? 'rgba(220,38,38,0.5)' : 'var(--border)'}`,
                  background: isMatched ? 'rgba(34,197,94,0.1)' : isWrong ? 'rgba(220,38,38,0.08)' : 'var(--secondary)',
                  color: isMatched ? 'var(--success)' : 'var(--foreground)',
                  opacity: isMatched ? 0.75 : selectedLeft ? 1 : 0.7,
                  transition: 'all 0.15s',
                }}
              >
                {right}
              </button>
            );
          })}
        </div>
      </div>

      <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>
        {matchedCount}/{total} associées{mistakes > 0 ? ` · ${mistakes} erreur${mistakes > 1 ? 's' : ''}` : ''}
      </p>
    </div>
  );
}
