import { useState } from 'react';
import { LESSONS, Lesson } from '../data/lessons';
import { useUser } from '../contexts/UserContext';
import MatchExercisePlayer from './MatchExercisePlayer';

const GRAMMAR_LESSONS = LESSONS.filter(l => l.module === 'grammar');
const ALL_LESSONS = LESSONS;

interface LessonViewProps {
  lesson: Lesson;
  onBack: () => void;
  onStartExercises: (lesson: Lesson) => void;
}

function LessonView({ lesson, onBack, onStartExercises }: LessonViewProps) {
  const { state } = useUser();
  const isDone = state.completedLessons.includes(lesson.id);

  return (
    <div className="flex flex-col h-full overflow-y-auto mod-pad gap-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-sm px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
          style={{ color: 'var(--muted-foreground)', background: 'var(--muted)' }}
        >
          ← Retour
        </button>
        <div
          className="text-xs px-2 py-0.5 rounded-full font-semibold"
          style={{ background: 'rgba(0,212,184,0.15)', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
        >
          +{lesson.xpReward} XP
        </div>
        {isDone && (
          <div className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)' }}>
            ✓ Terminé
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
          {lesson.title}
        </h2>
        <div className="text-sm mt-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--muted-foreground)' }}>
          {lesson.titleRu}
        </div>
      </div>

      <div
        className="p-5 rounded-2xl"
        style={{ background: 'rgba(0,212,184,0.08)', border: '1px solid rgba(0,212,184,0.2)' }}
      >
        <p style={{ color: 'var(--secondary-foreground)' }}>{lesson.intro}</p>
      </div>

      {lesson.sections.map((section, i) => (
        <div key={i} className="space-y-4">
          <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
            {section.heading}
          </h3>
          <p className="leading-relaxed" style={{ color: 'var(--secondary-foreground)' }}>{section.body}</p>

          {section.examples && (
            <div className="space-y-2">
              {section.examples.map((ex, j) => (
                <div key={j} className="grammar-example">
                  <span
                    className="text-xl font-bold"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
                    lang="ru"
                  >
                    {ex.ru}
                  </span>
                  <span
                    className="text-sm"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}
                  >
                    {ex.translit}
                  </span>
                  <span style={{ color: 'var(--secondary-foreground)' }}>{ex.fr}</span>
                </div>
              ))}
            </div>
          )}

          {section.table && (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr style={{ background: 'var(--secondary)' }}>
                    {section.table.headers.map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left font-semibold"
                        style={{ color: 'var(--muted-foreground)' }}
                        scope="col"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row, ri) => (
                    <tr
                      key={ri}
                      style={{
                        background: ri % 2 === 0 ? 'var(--card)' : 'var(--secondary)',
                        borderTop: '1px solid var(--border)',
                      }}
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className="px-4 py-3"
                          style={{
                            color: ci === 0 ? 'var(--foreground)' : 'var(--secondary-foreground)',
                            fontFamily: ci === 0 ? 'var(--font-display)' : 'inherit',
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      <div className="sticky bottom-0 pt-4 pb-2" style={{ background: 'var(--background)' }}>
        <button
          onClick={() => onStartExercises(lesson)}
          className="w-full py-4 rounded-2xl font-bold text-lg transition-all hover:opacity-90 active:scale-[0.99]"
          style={{ background: 'var(--primary)', color: 'white', fontFamily: 'var(--font-display)' }}
        >
          Pratiquer avec les exercices → {lesson.exercises.length} questions
        </button>
      </div>
    </div>
  );
}

export default function GrammarModule() {
  const { state } = useUser();
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [exerciseLesson, setExerciseLesson] = useState<Lesson | null>(null);

  if (exerciseLesson) {
    return (
      <ExerciseInline
        lesson={exerciseLesson}
        onBack={() => setExerciseLesson(null)}
        onDone={() => { setExerciseLesson(null); setSelected(null); }}
      />
    );
  }

  if (selected) {
    return (
      <LessonView
        lesson={selected}
        onBack={() => setSelected(null)}
        onStartExercises={(l) => { setExerciseLesson(l); }}
      />
    );
  }

  const MODULE_LABELS: Record<string, string> = {
    alphabet: 'Alphabet',
    phonetics: 'Phonétique',
    grammar: 'Grammaire',
    vocabulary: 'Vocabulaire',
    numbers: 'Chiffres',
  };

  const MODULE_COLORS: Record<string, string> = {
    alphabet: 'var(--primary)',
    phonetics: 'var(--accent)',
    grammar: 'var(--violet)',
    vocabulary: 'var(--gold)',
    numbers: 'var(--success)',
  };

  return (
    <div className="mod-pad overflow-y-auto h-full space-y-6">
      <div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
          Leçons · Parcours A1
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          {state.completedLessons.length}/{ALL_LESSONS.length} leçons terminées
        </p>
      </div>

      <div className="space-y-3">
        {ALL_LESSONS.map((lesson, i) => {
          const done = state.completedLessons.includes(lesson.id);
          const prereqsDone = lesson.prerequisites.every(p => state.completedLessons.includes(p));
          const locked = !prereqsDone;
          const color = MODULE_COLORS[lesson.module] ?? 'var(--accent)';

          return (
            <button
              key={lesson.id}
              onClick={() => !locked && setSelected(lesson)}
              disabled={locked}
              className={`w-full text-left flex items-center gap-5 p-5 rounded-2xl transition-all duration-200 animate-slide-up delay-${i * 50} ${!locked ? 'hover:scale-[1.01]' : 'cursor-not-allowed'}`}
              style={{
                background: done ? `${color}12` : locked ? 'var(--muted)' : 'var(--card)',
                border: `1px solid ${done ? `${color}30` : locked ? 'transparent' : 'var(--border)'}`,
                opacity: locked ? 0.5 : 1,
              }}
              aria-label={`Leçon ${lesson.title}${locked ? ' (verrouillée)' : done ? ' (terminée)' : ''}`}
            >
              {/* Step indicator */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                style={{
                  background: done ? color : locked ? 'var(--muted-foreground)' : `${color}20`,
                  color: done ? 'white' : locked ? 'var(--background)' : color,
                  fontFamily: 'var(--font-display)',
                }}
                aria-hidden="true"
              >
                {done ? '✓' : locked ? '🔒' : lesson.order}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: done ? color : locked ? 'var(--muted-foreground)' : 'var(--foreground)' }}>
                    {lesson.title}
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-semibold"
                    style={{ background: `${MODULE_COLORS[lesson.module]}20`, color: MODULE_COLORS[lesson.module] }}
                  >
                    {MODULE_LABELS[lesson.module]}
                  </span>
                </div>
                <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
                  {lesson.titleRu} · {lesson.exercises.length} exercices
                </div>
              </div>

              <div className="text-sm font-bold shrink-0" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>
                +{lesson.xpReward} XP
              </div>

              {!locked && !done && (
                <span style={{ color: 'var(--muted-foreground)' }} aria-hidden="true">→</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Inline exercise runner used from Grammar view */
function ExerciseInline({ lesson, onBack, onDone }: { lesson: Lesson; onBack: () => void; onDone: () => void }) {
  const { dispatch } = useUser();
  const [qIdx, setQIdx] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [fillValue, setFillValue] = useState('');
  const [fillSubmitted, setFillSubmitted] = useState(false);
  const [matchResult, setMatchResult] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const questions = lesson.exercises;
  const q = questions[qIdx];

  function handleMCQ(idx: number) {
    if (q.type !== 'mcq') return;
    if (answered !== null) return;
    const correct = idx === q.correct;
    setAnswered(idx);
    if (correct) { setScore(s => s + 1); dispatch({ type: 'ADD_XP', amount: 10 }); }
    else setShakeKey(k => k + 1);
  }

  function handleMatch(correct: boolean) {
    setMatchResult(correct);
    if (correct) { setScore(s => s + 1); dispatch({ type: 'ADD_XP', amount: 10 }); }
  }

  function handleFill(e: React.FormEvent) {
    e.preventDefault();
    if (q.type !== 'fill') return;
    const correct = fillValue.trim().toLowerCase() === q.correct.toLowerCase();
    setFillSubmitted(true);
    if (correct) { setScore(s => s + 1); dispatch({ type: 'ADD_XP', amount: 10 }); }
    else setShakeKey(k => k + 1);
  }

  function next() {
    if (qIdx + 1 >= questions.length) {
      setDone(true);
      dispatch({ type: 'COMPLETE_LESSON', lessonId: lesson.id });
      dispatch({ type: 'ADD_XP', amount: lesson.xpReward });
    } else {
      setQIdx(q => q + 1);
      setAnswered(null);
      setFillValue('');
      setFillSubmitted(false);
      setMatchResult(null);
    }
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center h-full gap-8 mod-pad animate-fade-in">
        <div className="text-6xl" aria-hidden="true">{pct >= 80 ? '🏆' : '📚'}</div>
        <div className="text-center">
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>Leçon terminée !</h2>
          <p className="mt-1" style={{ color: 'var(--muted-foreground)' }}>{score}/{questions.length} · {pct}%</p>
          <p className="text-sm mt-2" style={{ color: 'var(--gold)' }}>+{lesson.xpReward} XP gagné !</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onDone} className="px-6 py-3 rounded-xl font-semibold" style={{ background: 'var(--primary)', color: 'white' }}>
            Retour aux leçons
          </button>
          <button onClick={onBack} className="px-6 py-3 rounded-xl font-semibold" style={{ background: 'var(--secondary)', color: 'var(--foreground)' }}>
            Revoir la leçon
          </button>
        </div>
      </div>
    );
  }

  const progressPct = Math.round((qIdx / questions.length) * 100);

  return (
    <div className="flex flex-col h-full mod-pad gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm px-3 py-1.5 rounded-lg" style={{ color: 'var(--muted-foreground)', background: 'var(--muted)' }}>← Leçon</button>
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>{qIdx + 1}/{questions.length} · ✓ {score}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%`, background: 'var(--violet)' }} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 max-w-lg mx-auto w-full">
        <div className="w-full rounded-2xl p-6 space-y-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="text-xs font-semibold" style={{ color: 'var(--violet)', fontFamily: 'var(--font-mono)' }}>
            {q.type === 'mcq' ? 'QCM' : q.type === 'fill' ? 'Texte à trous' : 'Association'}
          </div>
          {q.type !== 'match' && (
            <p className="text-lg font-semibold leading-snug" style={{ color: 'var(--foreground)' }}>{q.question}</p>
          )}
        </div>

        {q.type === 'match' && (
          <div className="w-full">
            <MatchExercisePlayer key={q.id} exercise={q} onDone={handleMatch} />
          </div>
        )}

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
                  className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-150 ${answered === null ? 'hover:scale-[1.01]' : ''} ${isSelected && !isCorrect ? 'animate-shake' : isSelected && isCorrect ? 'animate-bounce-in' : ''}`}
                  style={{ background: bg, border: `1px solid ${border}`, color }}
                  aria-label={`Option ${i + 1} : ${opt}${answered !== null ? (isCorrect ? ', correcte' : isSelected ? ', incorrecte' : '') : ''}`}
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
                💡 Indice : {q.hint}
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
                  ? fillValue.trim().toLowerCase() === q.correct.toLowerCase()
                    ? 'rgba(34,197,94,0.15)' : 'rgba(232,41,76,0.15)'
                  : 'var(--secondary)',
                border: `1px solid ${fillSubmitted ? (fillValue.trim().toLowerCase() === q.correct.toLowerCase() ? 'rgba(34,197,94,0.4)' : 'rgba(232,41,76,0.4)') : 'var(--border)'}`,
                color: 'var(--foreground)',
                fontFamily: 'var(--font-display)',
              }}
              aria-label="Entrez votre réponse"
            />
            {fillSubmitted && fillValue.trim().toLowerCase() !== q.correct.toLowerCase() && (
              <div className="text-sm" style={{ color: 'var(--success)' }}>
                Réponse correcte : <strong style={{ fontFamily: 'var(--font-display)' }}>{q.correct}</strong>
              </div>
            )}
            {!fillSubmitted && (
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold"
                style={{ background: 'var(--primary)', color: 'white' }}
              >
                Valider
              </button>
            )}
          </form>
        )}

        {((q.type === 'mcq' && answered !== null) || (q.type === 'fill' && fillSubmitted) || (q.type === 'match' && matchResult !== null)) && (
          <div className="w-full space-y-3 animate-slide-up">
            {q.explanation && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--secondary-foreground)' }}>
                <span style={{ color: 'var(--violet)' }}>Explication : </span>{q.explanation}
              </div>
            )}
            <button
              onClick={next}
              className="w-full py-3 rounded-xl font-semibold transition-all hover:opacity-90"
              style={{ background: 'var(--primary)', color: 'white' }}
              autoFocus
            >
              {qIdx + 1 < questions.length ? 'Question suivante →' : 'Voir les résultats'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
