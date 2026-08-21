import { useState, useMemo } from 'react';
import { LESSONS, Exercise, MCQExercise, FillExercise } from '../data/lessons';
import { useUser } from '../contexts/UserContext';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

type ExerciseSet = {
  lessonTitle: string;
  exercises: Exercise[];
};

export default function ExerciseModule() {
  const { dispatch } = useUser();
  const [mode, setMode] = useState<'select' | 'session' | 'done'>('select');
  const [selectedSet, setSelectedSet] = useState<ExerciseSet | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [fillValue, setFillValue] = useState('');
  const [fillSubmitted, setFillSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const exercises = useMemo<ExerciseSet[]>(() => [
    {
      lessonTitle: 'Mix aléatoire — toutes leçons',
      exercises: shuffle(LESSONS.flatMap(l => l.exercises)).slice(0, 10),
    },
    ...LESSONS.map(l => ({ lessonTitle: l.title, exercises: l.exercises })),
  ], []);

  function startSet(set: ExerciseSet) {
    setSelectedSet(set);
    setQIdx(0);
    setAnswered(null);
    setFillValue('');
    setFillSubmitted(false);
    setScore(0);
    setMode('session');
  }

  function handleMCQ(idx: number) {
    if (!selectedSet) return;
    const q = selectedSet.exercises[qIdx] as MCQExercise;
    if (answered !== null) return;
    const correct = idx === q.correct;
    setAnswered(idx);
    if (correct) { setScore(s => s + 1); dispatch({ type: 'ADD_XP', amount: 10 }); }
  }

  function handleFill(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSet) return;
    const q = selectedSet.exercises[qIdx] as FillExercise;
    const correct = fillValue.trim().toLowerCase() === q.correct.toLowerCase();
    setFillSubmitted(true);
    if (correct) { setScore(s => s + 1); dispatch({ type: 'ADD_XP', amount: 10 }); }
  }

  function next() {
    if (!selectedSet) return;
    if (qIdx + 1 >= selectedSet.exercises.length) {
      setMode('done');
    } else {
      setQIdx(q => q + 1);
      setAnswered(null);
      setFillValue('');
      setFillSubmitted(false);
    }
  }

  if (mode === 'select') {
    return (
      <div className="mod-pad overflow-y-auto h-full space-y-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
            Exercices · Упражнения
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            QCM et textes à trous pour ancrer vos connaissances
          </p>
        </div>

        <div className="space-y-3">
          {exercises.map((set, i) => {
            const mcqCount = set.exercises.filter(e => e.type === 'mcq').length;
            const fillCount = set.exercises.filter(e => e.type === 'fill').length;
            const isFirst = i === 0;
            return (
              <button
                key={i}
                onClick={() => startSet(set)}
                className={`w-full text-left flex items-center gap-5 p-5 rounded-2xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] animate-slide-up delay-${i * 50}`}
                style={{
                  background: isFirst ? 'rgba(232,41,76,0.1)' : 'var(--card)',
                  border: `1px solid ${isFirst ? 'rgba(232,41,76,0.3)' : 'var(--border)'}`,
                  opacity: 0,
                }}
                aria-label={`Série d'exercices : ${set.lessonTitle}`}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0"
                  style={{
                    background: isFirst ? 'var(--primary)' : 'var(--secondary)',
                    color: isFirst ? 'white' : 'var(--muted-foreground)',
                    fontFamily: 'var(--font-display)',
                  }}
                  aria-hidden="true"
                >
                  {isFirst ? '⚡' : '✏'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold" style={{ color: 'var(--foreground)' }}>{set.lessonTitle}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
                    {set.exercises.length} questions · {mcqCount} QCM · {fillCount} texte à trous
                  </div>
                </div>
                <span style={{ color: 'var(--muted-foreground)' }} aria-hidden="true">→</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (mode === 'done' && selectedSet) {
    const pct = Math.round((score / selectedSet.exercises.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center h-full gap-8 mod-pad animate-fade-in">
        <div className="text-6xl" aria-hidden="true">{pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : '💪'}</div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
            Série terminée !
          </h2>
          <p style={{ color: 'var(--muted-foreground)' }}>{score}/{selectedSet.exercises.length} bonnes réponses</p>
          <div className="text-5xl font-bold mt-2" style={{ fontFamily: 'var(--font-display)', color: pct >= 80 ? 'var(--success)' : pct >= 60 ? 'var(--gold)' : 'var(--primary)' }}>
            {pct}%
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => startSet(selectedSet)} className="px-6 py-3 rounded-xl font-semibold" style={{ background: 'var(--primary)', color: 'white' }}>
            Rejouer
          </button>
          <button onClick={() => setMode('select')} className="px-6 py-3 rounded-xl font-semibold" style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
            Choisir une autre série
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'session' && selectedSet) {
    const q = selectedSet.exercises[qIdx];
    const progressPct = Math.round((qIdx / selectedSet.exercises.length) * 100);

    return (
      <div className="flex flex-col h-full mod-pad gap-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <button onClick={() => setMode('select')} className="text-sm px-3 py-1.5 rounded-lg" style={{ color: 'var(--muted-foreground)', background: 'var(--muted)' }}>
            ← Retour
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm truncate max-w-40" style={{ color: 'var(--muted-foreground)' }}>{selectedSet.lessonTitle}</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>
              {qIdx + 1}/{selectedSet.exercises.length}
            </span>
            <span className="text-sm font-bold" style={{ color: 'var(--success)' }}>✓ {score}</span>
          </div>
        </div>

        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%`, background: 'var(--gold)' }} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-8 max-w-lg mx-auto w-full">
          <div className="w-full rounded-2xl p-6 space-y-2" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="text-xs font-semibold" style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>
              {q.type === 'mcq' ? 'QCM' : 'Texte à trous'}
            </div>
            <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>{q.question}</p>
          </div>

          {q.type === 'mcq' && (
            <div className="w-full space-y-2">
              {q.options.map((opt, i) => {
                const isSelected = answered === i;
                const isCorrect = i === q.correct;
                let bg = 'var(--secondary)';
                let border = 'var(--border)';
                let color = 'var(--foreground)';
                if (answered !== null) {
                  if (isCorrect) { bg = 'rgba(34,197,94,0.15)'; border = 'rgba(34,197,94,0.4)'; color = 'var(--success)'; }
                  else if (isSelected) { bg = 'rgba(232,41,76,0.15)'; border = 'rgba(232,41,76,0.4)'; color = 'var(--primary)'; }
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleMCQ(i)}
                    disabled={answered !== null}
                    className={`w-full text-left px-5 py-4 rounded-xl transition-all ${answered === null ? 'hover:scale-[1.01]' : ''} ${answered !== null && isSelected && !isCorrect ? 'animate-shake' : ''}`}
                    style={{ background: bg, border: `1px solid ${border}`, color }}
                    aria-label={`Option ${i + 1} : ${opt}`}
                  >
                    <span className="font-semibold mr-3" style={{ opacity: 0.5 }}>{String.fromCharCode(65 + i)}.</span>
                    {opt}
                    {answered !== null && isCorrect && ' ✓'}
                    {answered !== null && isSelected && !isCorrect && ' ✗'}
                  </button>
                );
              })}
            </div>
          )}

          {q.type === 'fill' && (
            <form onSubmit={handleFill} className="w-full space-y-4">
              {q.hint && (
                <div className="text-sm px-3 py-2 rounded-lg" style={{ background: 'rgba(0,212,184,0.08)', color: 'var(--accent)' }}>
                  💡 {q.hint}
                </div>
              )}
              <input
                type="text"
                value={fillValue}
                onChange={e => setFillValue(e.target.value)}
                disabled={fillSubmitted}
                placeholder="Votre réponse..."
                className="w-full px-5 py-4 rounded-xl text-lg outline-none"
                style={{
                  background: fillSubmitted
                    ? fillValue.trim().toLowerCase() === q.correct.toLowerCase() ? 'rgba(34,197,94,0.15)' : 'rgba(232,41,76,0.15)'
                    : 'var(--secondary)',
                  border: `1px solid ${fillSubmitted ? (fillValue.trim().toLowerCase() === q.correct.toLowerCase() ? 'rgba(34,197,94,0.4)' : 'rgba(232,41,76,0.4)') : 'var(--border)'}`,
                  color: 'var(--foreground)',
                  fontFamily: 'var(--font-display)',
                }}
                aria-label="Entrez votre réponse"
              />
              {fillSubmitted && fillValue.trim().toLowerCase() !== q.correct.toLowerCase() && (
                <div className="text-sm" style={{ color: 'var(--success)' }}>
                  ✓ <strong style={{ fontFamily: 'var(--font-display)' }}>{q.correct}</strong>
                </div>
              )}
              {!fillSubmitted && (
                <button type="submit" className="w-full py-3 rounded-xl font-semibold" style={{ background: 'var(--primary)', color: 'white' }}>
                  Valider
                </button>
              )}
            </form>
          )}

          {((q.type === 'mcq' && answered !== null) || (q.type === 'fill' && fillSubmitted)) && (
            <div className="w-full space-y-3 animate-slide-up">
              {q.explanation && (
                <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--secondary-foreground)' }}>
                  <span style={{ color: 'var(--violet)' }}>💬 </span>{q.explanation}
                </div>
              )}
              <button onClick={next} className="w-full py-3 rounded-xl font-semibold" style={{ background: 'var(--primary)', color: 'white' }} autoFocus>
                {qIdx + 1 < selectedSet.exercises.length ? 'Suivant →' : 'Voir les résultats'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
