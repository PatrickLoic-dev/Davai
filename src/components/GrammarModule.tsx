import { useState } from 'react';
import { LESSONS, Lesson, SubLesson, isLessonComplete, lessonXpReward, CEFR_LEVELS } from '../data/lessons';
import { useUser } from '../contexts/UserContext';
import MatchExercisePlayer from './MatchExercisePlayer';
import PhoneticHover from './PhoneticHover';

const ALL_LESSONS = LESSONS;

const MODULE_LABELS: Record<string, string> = {
  alphabet: 'Alphabet',
  phonetics: 'Phonétique',
  pronunciation: 'Prononciation',
  grammar: 'Grammaire',
  vocabulary: 'Vocabulaire',
  numbers: 'Chiffres',
};

const MODULE_COLORS: Record<string, string> = {
  alphabet: 'var(--primary)',
  phonetics: 'var(--accent)',
  pronunciation: 'var(--gold)',
  grammar: 'var(--violet)',
  vocabulary: 'var(--gold)',
  numbers: 'var(--success)',
};

/* ── Sub-lesson content, broken into small digestible steps ── */
function SubLessonView({ lesson, subLesson, onBack, onStartExercises }: {
  lesson: Lesson; subLesson: SubLesson; onBack: () => void; onStartExercises: () => void;
}) {
  const { state } = useUser();
  const isDone = state.completedLessons.includes(subLesson.id);
  const [step, setStep] = useState(0);

  // Step 0 = intro, 1..N = one section each, last = "ready" summary.
  const totalSteps = subLesson.sections.length + 2;
  const isIntro = step === 0;
  const isReady = step === totalSteps - 1;
  const section = !isIntro && !isReady ? subLesson.sections[step - 1] : null;

  function next() { setStep(s => Math.min(s + 1, totalSteps - 1)); }
  function prev() { setStep(s => Math.max(s - 1, 0)); }

  return (
    <div className="flex flex-col h-full overflow-y-auto mod-pad gap-5 animate-fade-in">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={onBack}
          className="text-sm px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
          style={{ color: 'var(--muted-foreground)', background: 'var(--muted)' }}
        >
          ← {lesson.title}
        </button>
        <div
          className="text-xs px-2 py-0.5 rounded-full font-semibold"
          style={{ background: 'rgba(0,212,184,0.15)', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
        >
          Noté sur {subLesson.maxScore}
        </div>
        {isDone && (
          <div className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)' }}>
            ✓ Terminé
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
          {subLesson.title}
        </h2>
      </div>

      {/* Step dots */}
      <div className="flex items-center gap-1.5" role="tablist" aria-label="Étapes de la sous-leçon">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            role="tab"
            aria-selected={i === step}
            style={{
              height: '4px', flex: 1, borderRadius: '2px',
              background: i <= step ? 'var(--primary)' : 'var(--muted)',
              transition: 'background 0.2s',
            }}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1" key={step}>
        {isIntro && (
          <div
            className="p-5 rounded-2xl animate-slide-up"
            style={{ background: 'rgba(0,212,184,0.08)', border: '1px solid rgba(0,212,184,0.2)' }}
          >
            <p style={{ color: 'var(--secondary-foreground)' }}>{subLesson.intro}</p>
          </div>
        )}

        {section && (
          <div className="space-y-4 animate-slide-up">
            <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
              {section.heading}
            </h3>
            <p className="leading-relaxed" style={{ color: 'var(--secondary-foreground)' }}>{section.body}</p>

            {section.examples && (
              <div className="space-y-2">
                {section.examples.map((ex, j) => (
                  <div key={j} className="grammar-example">
                    <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }} lang="ru">
                      <PhoneticHover text={ex.ru} phonetic={ex.translit} rate={0.72} />
                    </span>
                    <span className="text-sm" style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>
                      {ex.translit}
                    </span>
                    <span style={{ color: 'var(--secondary-foreground)' }}>{ex.fr}</span>
                  </div>
                ))}
              </div>
            )}

            {section.table && (
              <div className="rounded-xl overflow-x-auto" style={{ border: '1px solid var(--border)' }}>
                <table className="w-full text-sm" role="table">
                  <thead>
                    <tr style={{ background: 'var(--secondary)' }}>
                      {section.table.headers.map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--muted-foreground)' }} scope="col">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row, ri) => (
                      <tr key={ri} style={{ background: ri % 2 === 0 ? 'var(--card)' : 'var(--secondary)', borderTop: '1px solid var(--border)' }}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-4 py-3" style={{ color: ci === 0 ? 'var(--foreground)' : 'var(--secondary-foreground)', fontFamily: ci === 0 ? 'var(--font-display)' : 'inherit' }}>
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
        )}

        {isReady && (
          <div className="flex flex-col items-center text-center gap-3 py-6 animate-slide-up">
            <span className="text-4xl" aria-hidden="true">✅</span>
            <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
              Prêt·e pour l'évaluation
            </h3>
            <p style={{ color: 'var(--muted-foreground)', maxWidth: '380px' }}>
              {subLesson.exercises.length} questions, notées sur {subLesson.maxScore}. Vous pouvez revenir en arrière pour relire une étape.
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="sticky bottom-0 pt-4 pb-2 flex gap-3" style={{ background: 'var(--background)' }}>
        {step > 0 && (
          <button
            onClick={prev}
            className="px-5 py-4 rounded-2xl font-semibold transition-all hover:opacity-80"
            style={{ background: 'var(--muted)', color: 'var(--foreground)' }}
            aria-label="Étape précédente"
          >
            ←
          </button>
        )}
        {!isReady ? (
          <button
            onClick={next}
            className="flex-1 py-4 rounded-2xl font-bold text-lg transition-all hover:opacity-90 active:scale-[0.99]"
            style={{ background: 'var(--primary)', color: 'white', fontFamily: 'var(--font-display)' }}
          >
            Continuer →
          </button>
        ) : (
          <button
            onClick={onStartExercises}
            className="flex-1 py-4 rounded-2xl font-bold text-lg transition-all hover:opacity-90 active:scale-[0.99]"
            style={{ background: 'var(--primary)', color: 'white', fontFamily: 'var(--font-display)' }}
          >
            {isDone ? 'Repasser l\'évaluation' : `Passer l'évaluation`}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Lesson: list of its sub-lessons ── */
function LessonView({ lesson, onBack, onSelectSubLesson }: {
  lesson: Lesson; onBack: () => void; onSelectSubLesson: (sl: SubLesson) => void;
}) {
  const { state } = useUser();
  const color = MODULE_COLORS[lesson.module] ?? 'var(--accent)';

  return (
    <div className="flex flex-col h-full overflow-y-auto mod-pad gap-6 animate-fade-in">
      <button
        onClick={onBack}
        className="text-sm px-3 py-1.5 rounded-lg transition-all hover:opacity-80 self-start"
        style={{ color: 'var(--muted-foreground)', background: 'var(--muted)' }}
      >
        ← Leçons
      </button>

      <div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>{lesson.title}</h2>
        <div className="text-sm mt-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--muted-foreground)' }}>{lesson.titleRu}</div>
      </div>

      <div className="relative">
        <div aria-hidden="true" style={{ position: 'absolute', left: '37px', top: '20px', bottom: '20px', width: '2px', background: 'var(--border)' }} />
        <div className="space-y-3 relative">
        {lesson.subLessons.map((sl, i) => {
          const done = state.completedLessons.includes(sl.id);
          const prevDone = i === 0 || state.completedLessons.includes(lesson.subLessons[i - 1].id);
          const locked = !prevDone;

          return (
            <button
              key={sl.id}
              onClick={() => !locked && onSelectSubLesson(sl)}
              disabled={locked}
              className={`w-full text-left flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${!locked ? 'hover:scale-[1.01]' : 'cursor-not-allowed'}`}
              style={{
                background: done ? `${color}12` : locked ? 'var(--muted)' : 'var(--card)',
                border: `1px solid ${done ? `${color}30` : locked ? 'transparent' : 'var(--border)'}`,
                opacity: locked ? 0.5 : 1,
              }}
              aria-label={`Sous-leçon ${sl.title}${locked ? ' (verrouillée)' : done ? ' (terminée)' : ''}`}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                style={{
                  background: done ? color : locked ? 'var(--muted-foreground)' : `${color}20`,
                  color: done ? 'white' : locked ? 'var(--background)' : color,
                  fontFamily: 'var(--font-display)',
                }}
                aria-hidden="true"
              >
                {done ? '✓' : locked ? '🔒' : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm" style={{ color: done ? color : locked ? 'var(--muted-foreground)' : 'var(--foreground)' }}>
                  {sl.title}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
                  Noté sur {sl.maxScore} · {sl.exercises.length} questions
                </div>
              </div>
              {!locked && <span style={{ color: 'var(--muted-foreground)' }} aria-hidden="true">→</span>}
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
}

const LEVEL_LABELS: Record<string, string> = {
  A1: 'Débutant', A2: 'Élémentaire', B1: 'Intermédiaire',
  B2: 'Intermédiaire+', C1: 'Avancé', C2: 'Maîtrise',
};

export default function GrammarModule() {
  const { state } = useUser();
  const [activeLevel, setActiveLevel] = useState<string>(state.cefrLevel);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedSub, setSelectedSub] = useState<SubLesson | null>(null);
  const [exerciseSub, setExerciseSub] = useState<SubLesson | null>(null);

  if (selectedLesson && exerciseSub) {
    return (
      <ExerciseInline
        subLesson={exerciseSub}
        onBack={() => setExerciseSub(null)}
        onDone={() => setExerciseSub(null)}
      />
    );
  }

  if (selectedLesson && selectedSub) {
    return (
      <SubLessonView
        lesson={selectedLesson}
        subLesson={selectedSub}
        onBack={() => setSelectedSub(null)}
        onStartExercises={() => setExerciseSub(selectedSub)}
      />
    );
  }

  if (selectedLesson) {
    return (
      <LessonView
        lesson={selectedLesson}
        onBack={() => setSelectedLesson(null)}
        onSelectSubLesson={(sl) => setSelectedSub(sl)}
      />
    );
  }

  const levelLessons = ALL_LESSONS.filter(l => l.level === activeLevel);

  return (
    <div className="mod-pad overflow-y-auto h-full space-y-6">
      <div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
          Leçons
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          {levelLessons.filter(l => isLessonComplete(l, state.completedLessons)).length}/{levelLessons.length} leçons terminées · Niveau {activeLevel}
        </p>
      </div>

      {/* Level tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Niveau CECR">
        {CEFR_LEVELS.map(lvl => {
          const hasContent = ALL_LESSONS.some(l => l.level === lvl);
          const active = activeLevel === lvl;
          return (
            <button
              key={lvl}
              role="tab"
              aria-selected={active}
              disabled={!hasContent}
              onClick={() => setActiveLevel(lvl)}
              className="shrink-0 px-3.5 py-2 rounded-xl text-sm font-bold transition-all"
              style={{
                fontFamily: 'var(--font-display)',
                background: active ? 'var(--primary)' : hasContent ? 'var(--card)' : 'var(--muted)',
                color: active ? 'white' : hasContent ? 'var(--foreground)' : 'var(--muted-foreground)',
                border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                opacity: hasContent ? 1 : 0.5,
                cursor: hasContent ? 'pointer' : 'not-allowed',
              }}
              title={hasContent ? LEVEL_LABELS[lvl] : `${LEVEL_LABELS[lvl]} — bientôt disponible`}
            >
              {lvl}
            </button>
          );
        })}
      </div>

      {levelLessons.length === 0 && (
        <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--muted)', border: '1px dashed var(--border)' }}>
          <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Contenu {activeLevel} à venir</p>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>On y travaille — reviens bientôt !</p>
        </div>
      )}

      <div className="relative">
        <div aria-hidden="true" style={{ position: 'absolute', left: '39px', top: '20px', bottom: '20px', width: '2px', background: 'var(--border)' }} />
        <div className="space-y-3 relative">
        {levelLessons.map((lesson, i) => {
          const done = isLessonComplete(lesson, state.completedLessons);
          const doneSubCount = lesson.subLessons.filter(sl => state.completedLessons.includes(sl.id)).length;
          const prereqsDone = lesson.prerequisites.every(p => {
            const prereqLesson = ALL_LESSONS.find(l => l.id === p);
            return prereqLesson ? isLessonComplete(prereqLesson, state.completedLessons) : true;
          });
          const locked = !prereqsDone;
          const color = MODULE_COLORS[lesson.module] ?? 'var(--accent)';

          return (
            <button
              key={lesson.id}
              onClick={() => !locked && setSelectedLesson(lesson)}
              disabled={locked}
              className={`w-full text-left flex items-center gap-5 p-5 rounded-2xl transition-all duration-200 animate-slide-up delay-${i * 50} ${!locked ? 'hover:scale-[1.01]' : 'cursor-not-allowed'}`}
              style={{
                background: done ? `${color}12` : locked ? 'var(--muted)' : 'var(--card)',
                border: `1px solid ${done ? `${color}30` : locked ? 'transparent' : 'var(--border)'}`,
                opacity: locked ? 0.5 : 1,
              }}
              aria-label={`Leçon ${lesson.title}${locked ? ' (verrouillée)' : done ? ' (terminée)' : ''}`}
            >
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
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold" style={{ color: done ? color : locked ? 'var(--muted-foreground)' : 'var(--foreground)' }}>
                    {lesson.title}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ background: `${color}20`, color }}>
                    {MODULE_LABELS[lesson.module]}
                  </span>
                </div>
                <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
                  {lesson.titleRu} · {doneSubCount}/{lesson.subLessons.length} sous-leçons
                </div>
              </div>

              <div className="text-sm font-bold shrink-0" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>
                +{lessonXpReward(lesson)} XP
              </div>

              {!locked && !done && (
                <span style={{ color: 'var(--muted-foreground)' }} aria-hidden="true">→</span>
              )}
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
}

/* ── Graded evaluation for a single sub-lesson, scored out of maxScore ── */
function ExerciseInline({ subLesson, onBack, onDone }: { subLesson: SubLesson; onBack: () => void; onDone: () => void }) {
  const { dispatch } = useUser();
  const [qIdx, setQIdx] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [fillValue, setFillValue] = useState('');
  const [fillSubmitted, setFillSubmitted] = useState(false);
  const [matchResult, setMatchResult] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const questions = subLesson.exercises;
  const q = questions[qIdx];
  const points = Math.round(subLesson.maxScore / questions.length);

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
      const passed = score / questions.length >= 0.5;
      if (passed) {
        dispatch({ type: 'COMPLETE_LESSON', lessonId: subLesson.id });
        dispatch({ type: 'ADD_XP', amount: subLesson.maxScore });
      }
    } else {
      setQIdx(q => q + 1);
      setAnswered(null);
      setFillValue('');
      setFillSubmitted(false);
      setMatchResult(null);
    }
  }

  if (done) {
    const gradedScore = Math.round((score / questions.length) * subLesson.maxScore);
    const passed = score / questions.length >= 0.5;
    return (
      <div className="flex flex-col items-center justify-center h-full gap-8 mod-pad animate-fade-in">
        <div className="text-6xl" aria-hidden="true">{passed ? (gradedScore === subLesson.maxScore ? '🏆' : '🎉') : '📚'}</div>
        <div className="text-center">
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
            {passed ? 'Évaluation réussie !' : 'Pas encore validé'}
          </h2>
          <p className="mt-2 text-4xl font-bold" style={{ fontFamily: 'var(--font-display)', color: passed ? 'var(--success)' : 'var(--primary)' }}>
            {gradedScore}/{subLesson.maxScore}
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>{score}/{questions.length} bonnes réponses</p>
          {passed
            ? <p className="text-sm mt-2" style={{ color: 'var(--gold)' }}>+{subLesson.maxScore} XP gagné !</p>
            : <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>Il faut au moins la moitié des points pour valider — retentez votre chance !</p>}
        </div>
        <div className="flex gap-3">
          <button onClick={onDone} className="px-6 py-3 rounded-xl font-semibold" style={{ background: 'var(--primary)', color: 'white' }}>
            Retour
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
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>
          {qIdx + 1}/{questions.length} · {score * points}/{subLesson.maxScore} pts
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%`, background: 'var(--violet)' }} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 max-w-lg mx-auto w-full">
        <div className="w-full rounded-2xl p-6 space-y-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="text-xs font-semibold" style={{ color: 'var(--violet)', fontFamily: 'var(--font-mono)' }}>
            {q.type === 'mcq' ? 'QCM' : q.type === 'fill' ? 'Texte à trous' : 'Association'} · {points} pts
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
              <button type="submit" className="w-full py-3 rounded-xl font-semibold" style={{ background: 'var(--primary)', color: 'white' }}>
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
