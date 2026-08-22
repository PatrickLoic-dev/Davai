import { useState, useCallback, useEffect } from 'react';
import { Volume2, VolumeX, Play, RotateCcw, ChevronRight, X, Lightbulb } from 'lucide-react';
import { ALPHABET, ALPHABET_QUIZ_POOL, CyrillicLetter, CATEGORY_COLOR, CATEGORY_BG, CATEGORY_LABEL } from '../data/alphabet';
import { useUser } from '../contexts/UserContext';
import { speakRussian, isSpeechSupported, preloadVoices, hasAnyVoice } from '../utils/audio';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateOptions(correct: CyrillicLetter): string[] {
  const pool = ALPHABET_QUIZ_POOL.filter(l => l.upper !== correct.upper);
  const wrong = shuffle(pool).slice(0, 3).map(l => l.romanized);
  return shuffle([correct.romanized, ...wrong]);
}

interface QuizQuestion {
  letter: CyrillicLetter;
  options: string[];
  answered: boolean;
  selectedIdx: number | null;
  isCorrect: boolean | null;
}

function AudioButton({ text, rate = 0.78, size = 'md', label }: { text: string; rate?: number; size?: 'sm' | 'md'; label?: string }) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [voicesReady, setVoicesReady] = useState(hasAnyVoice());
  const supported = isSpeechSupported();

  useEffect(() => {
    if (!supported || voicesReady) return;
    preloadVoices().then(voices => setVoicesReady(voices.length > 0));
  }, [supported, voicesReady]);

  async function handlePlay(e: React.MouseEvent) {
    e.stopPropagation();
    if (!supported || !voicesReady) return;
    setPlaying(true);
    setFailed(false);
    const ok = await speakRussian(text, rate);
    setPlaying(false);
    if (!ok) {
      setFailed(true);
      setTimeout(() => setFailed(false), 1200);
    }
  }

  const iconSize = size === 'sm' ? 13 : 15;
  const btnSize = size === 'sm' ? '28px' : '34px';

  if (!supported || !voicesReady) {
    return (
      <button
        disabled
        className="rounded-full flex items-center justify-center opacity-30 cursor-not-allowed"
        style={{ width: btnSize, height: btnSize, background: 'var(--muted)' }}
        aria-label="Audio indisponible : aucune voix de synthèse installée sur cet appareil"
        title="Aucune voix TTS détectée — essayez Chrome/Edge, ou installez une voix dans les paramètres de votre système"
      >
        <VolumeX size={iconSize} style={{ color: 'var(--muted-foreground)' }} />
      </button>
    );
  }

  return (
    <button
      onClick={handlePlay}
      className={`rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${failed ? 'animate-shake' : ''}`}
      style={{
        width: btnSize,
        height: btnSize,
        background: failed ? 'rgba(220,38,38,0.12)' : playing ? 'var(--primary)' : 'var(--secondary)',
        border: `1.5px solid ${failed ? 'rgba(220,38,38,0.4)' : playing ? 'var(--primary)' : 'transparent'}`,
      }}
      aria-label={label ?? `Écouter : ${text}`}
      title={failed ? 'Lecture audio impossible' : label ?? `Écouter "${text}"`}
    >
      {failed
        ? <VolumeX size={iconSize} style={{ color: 'var(--danger)' }} />
        : <Volume2 size={iconSize} style={{ color: playing ? 'white' : 'var(--primary)' }} />}
    </button>
  );
}

export default function AlphabetModule() {
  const { dispatch } = useUser();
  const [mode, setMode] = useState<'browse' | 'quiz'>('browse');
  const [selected, setSelected] = useState<CyrillicLetter | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [quizQ, setQuizQ] = useState<QuizQuestion | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [quizPool, setQuizPool] = useState<CyrillicLetter[]>([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => { preloadVoices(); }, []);

  const filtered = filter === 'all' ? ALPHABET : ALPHABET.filter(l => l.category === filter);

  function startQuiz() {
    const pool = shuffle(ALPHABET_QUIZ_POOL);
    setQuizPool(pool);
    setQuizIdx(0);
    setQuizScore(0);
    setQuizTotal(0);
    setQuizDone(false);
    setMode('quiz');
    const first = pool[0];
    setQuizQ({ letter: first, options: generateOptions(first), answered: false, selectedIdx: null, isCorrect: null });
    speakRussian(first.upper);
  }

  const handleAnswer = useCallback((idx: number) => {
    if (!quizQ || quizQ.answered) return;
    const isCorrect = quizQ.options[idx] === quizQ.letter.romanized;
    const newTotal = quizTotal + 1;
    const newScore = isCorrect ? quizScore + 1 : quizScore;
    setQuizTotal(newTotal);
    setQuizScore(newScore);
    setQuizQ({ ...quizQ, answered: true, selectedIdx: idx, isCorrect });
    if (!isCorrect) { setShakeKey(k => k + 1); speakRussian(quizQ.letter.upper); }
    else dispatch({ type: 'ADD_XP', amount: 5 });
  }, [quizQ, quizScore, quizTotal, dispatch]);

  function nextQuestion() {
    const nextIdx = quizIdx + 1;
    if (nextIdx >= quizPool.length) {
      setQuizDone(true);
      const pct = Math.round((quizScore / quizTotal) * 100);
      dispatch({ type: 'SET_ALPHABET_QUIZ_BEST', score: pct });
      dispatch({ type: 'COMPLETE_LESSON', lessonId: 'alphabet-intro' });
      return;
    }
    setQuizIdx(nextIdx);
    const next = quizPool[nextIdx];
    setQuizQ({ letter: next, options: generateOptions(next), answered: false, selectedIdx: null, isCorrect: null });
    speakRussian(next.upper);
  }

  const FILTERS = [
    { id: 'all', label: 'Toutes (33)' },
    { id: 'vowel', label: 'Voyelles' },
    { id: 'consonant', label: 'Consonnes' },
    { id: 'semivowel', label: 'Semi-voyelles' },
    { id: 'sign', label: 'Signes' },
  ];

  // ── Quiz done screen ──
  if (mode === 'quiz' && quizDone) {
    const pct = Math.round((quizScore / quizTotal) * 100);
    return (
      <div className="flex flex-col items-center justify-center h-full gap-8 mod-pad animate-fade-in">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
          style={{ background: pct >= 80 ? 'rgba(5,150,105,0.12)' : 'rgba(67,56,202,0.1)' }}>
          {pct >= 80 ? '🏆' : '📚'}
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
            Quiz terminé !
          </h2>
          <p style={{ color: 'var(--muted-foreground)' }}>{quizScore} bonnes réponses sur {quizTotal}</p>
          <div className="text-5xl font-bold mt-2"
            style={{ fontFamily: 'var(--font-display)', color: pct >= 80 ? 'var(--success)' : pct >= 60 ? 'var(--gold)' : 'var(--primary)' }}
            aria-label={`Score ${pct} pourcent`}>
            {pct}%
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={startQuiz}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90"
            style={{ background: 'var(--primary)', color: 'white' }}>
            <RotateCcw size={16} /> Rejouer
          </button>
          <button onClick={() => setMode('browse')}
            className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90"
            style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  // ── Quiz session ──
  if (mode === 'quiz' && quizQ) {
    const progressPct = Math.round((quizIdx / quizPool.length) * 100);
    return (
      <div className="flex flex-col h-full mod-pad gap-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <button onClick={() => setMode('browse')}
            className="text-sm px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
            style={{ color: 'var(--muted-foreground)', background: 'var(--muted)' }}>
            ← Retour
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>
              {quizIdx + 1}/{quizPool.length}
            </span>
            <span className="text-sm font-bold" style={{ color: 'var(--success)' }}>✓ {quizScore}</span>
          </div>
        </div>

        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, background: 'var(--primary)' }} />
        </div>

        <div className="flex flex-col items-center justify-center flex-1 gap-8">
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Quelle est la romanisation de cette lettre ?</p>

          {/* Letter display with audio */}
          <div className="flex flex-col items-center gap-3">
            <div
              key={quizQ.letter.upper + shakeKey}
              className={`text-9xl font-bold leading-none ${!quizQ.answered ? '' : quizQ.isCorrect ? 'animate-bounce-in' : 'animate-shake'}`}
              style={{
                fontFamily: 'var(--font-cyrillic)',
                color: quizQ.answered
                  ? (quizQ.isCorrect ? 'var(--success)' : 'var(--primary)')
                  : 'var(--foreground)',
              }}
              aria-label={`Lettre ${quizQ.letter.name}`}
            >
              {quizQ.letter.upper}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>
                {quizQ.letter.lower} · {CATEGORY_LABEL[quizQ.letter.category]}
              </span>
              <AudioButton text={quizQ.letter.upper} rate={0.6} label={`Écouter la lettre ${quizQ.letter.name}`} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            {quizQ.options.map((opt, i) => {
              const isSelected = quizQ.selectedIdx === i;
              const isCorrectOpt = opt === quizQ.letter.romanized;
              let bg = 'var(--muted)';
              let border = 'transparent';
              let color = 'var(--foreground)';
              if (quizQ.answered) {
                if (isCorrectOpt) { bg = 'rgba(5,150,105,0.12)'; border = 'rgba(5,150,105,0.4)'; color = 'var(--success)'; }
                else if (isSelected) { bg = 'rgba(220,38,38,0.1)'; border = 'rgba(220,38,38,0.4)'; color = 'var(--danger)'; }
              }
              return (
                <button key={opt} onClick={() => handleAnswer(i)} disabled={quizQ.answered}
                  className="py-4 px-6 rounded-2xl font-bold text-xl transition-all duration-150 hover:scale-105 disabled:cursor-default"
                  style={{ background: bg, border: `1.5px solid ${border}`, color, fontFamily: 'var(--font-mono)' }}
                  aria-label={`Option : ${opt}`}>
                  {opt}
                  {quizQ.answered && isCorrectOpt && ' ✓'}
                  {quizQ.answered && isSelected && !isCorrectOpt && ' ✗'}
                </button>
              );
            })}
          </div>

          {quizQ.answered && (
            <div className="text-center animate-slide-up space-y-3 max-w-xs">
              {quizQ.letter.tip && (
                <div className="flex items-start gap-2 px-4 py-3 rounded-xl text-left"
                  style={{ background: 'rgba(67,56,202,0.06)', border: '1px solid rgba(67,56,202,0.15)' }}>
                  <Lightbulb size={15} style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }} />
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{quizQ.letter.tip}</p>
                </div>
              )}
              {quizQ.letter.example && (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm" style={{ color: 'var(--primary)' }}>
                    Ex: <strong style={{ fontFamily: 'var(--font-cyrillic)' }}>{quizQ.letter.example}</strong> = {quizQ.letter.translation}
                  </span>
                  <AudioButton text={quizQ.letter.example} size="sm" label={`Écouter l'exemple : ${quizQ.letter.example}`} />
                </div>
              )}
              <button onClick={nextQuestion} autoFocus
                className="flex items-center gap-2 mx-auto px-8 py-3 rounded-xl font-semibold transition-all hover:opacity-90"
                style={{ background: 'var(--primary)', color: 'white' }}>
                {quizIdx + 1 < quizPool.length ? 'Suivant' : 'Résultats'}
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Browse mode ──
  return (
    <div className="flex h-full overflow-hidden">
      {/* Letter grid */}
      <div className="flex flex-col flex-1 overflow-y-auto mod-pad gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', letterSpacing: '-0.01em' }}>
              Алфавит · L'alphabet cyrillique
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
              Cliquez sur une lettre · <Volume2 size={12} className="inline" /> pour écouter
            </p>
          </div>
          <button onClick={startQuiz}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'var(--primary)', color: 'white' }}>
            <Play size={14} /> Quiz
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap" role="group" aria-label="Filtrer par catégorie">
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: filter === f.id ? 'var(--primary)' : 'var(--muted)',
                color: filter === f.id ? 'white' : 'var(--muted-foreground)',
              }}
              aria-pressed={filter === f.id}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Category legend */}
        <div className="flex gap-4 flex-wrap text-xs">
          {(['vowel', 'consonant', 'semivowel', 'sign'] as const).map(cat => (
            <span key={cat} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: CATEGORY_COLOR[cat] }} aria-hidden="true" />
              <span style={{ color: 'var(--muted-foreground)' }}>{CATEGORY_LABEL[cat]}</span>
            </span>
          ))}
        </div>

        {/* Letter grid */}
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(76px, 1fr))' }}
          role="list" aria-label="Lettres de l'alphabet cyrillique">
          {filtered.map((letter, i) => {
            const isSelected = selected?.upper === letter.upper;
            const catColor = CATEGORY_COLOR[letter.category];
            const catBg = CATEGORY_BG[letter.category];
            return (
              <div
                key={letter.upper}
                className={`rounded-xl p-2 text-center transition-all duration-200 animate-letter cursor-pointer`}
                style={{
                  background: isSelected ? catBg : 'white',
                  border: `1.5px solid ${isSelected ? catColor : 'var(--border)'}`,
                  boxShadow: isSelected ? `0 0 16px ${catColor}25` : '0 1px 3px rgba(0,0,0,0.05)',
                  animationDelay: `${Math.min(i * 18, 400)}ms`,
                  opacity: 0,
                }}
                role="listitem"
              >
                <button
                  onClick={() => setSelected(isSelected ? null : letter)}
                  className="w-full"
                  aria-label={`${letter.name} — ${CATEGORY_LABEL[letter.category]}`}
                  aria-pressed={isSelected}
                >
                  <div
                    className="text-2xl font-bold leading-none mb-1 transition-all duration-200"
                    style={{
                      fontFamily: 'var(--font-cyrillic)',
                      color: isSelected ? catColor : 'var(--foreground)',
                      fontWeight: isSelected ? 900 : 700,
                      transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                    }}
                    aria-hidden="true"
                  >
                    {letter.upper}
                  </div>
                  <div className="text-xs" style={{ color: isSelected ? catColor : 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }} aria-hidden="true">
                    {letter.romanized}
                  </div>
                </button>
                {/* Audio button on each card */}
                <div className="flex justify-center mt-1.5">
                  <AudioButton text={letter.upper + ' ' + letter.lower} rate={0.55} size="sm"
                    label={`Écouter la lettre ${letter.name}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <>
          <div className="alpha-backdrop" onClick={() => setSelected(null)} aria-hidden="true" />
          <div
            className="alpha-detail animate-slide-up"
            aria-live="polite"
            aria-label={`Détails de la lettre ${selected.name}`}
          >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="text-7xl font-bold leading-none"
                style={{ fontFamily: 'var(--font-cyrillic)', color: CATEGORY_COLOR[selected.category] }}
                aria-hidden="true"
              >
                {selected.upper}
              </div>
              <AudioButton text={selected.upper} rate={0.5} label={`Écouter ${selected.name}`} />
            </div>
            <button onClick={() => setSelected(null)}
              className="p-1.5 rounded-lg transition-all hover:opacity-60"
              style={{ color: 'var(--muted-foreground)', background: 'var(--muted)' }}
              aria-label="Fermer">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-1">
            <div className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
              {selected.name}
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full inline-block font-semibold"
              style={{ background: CATEGORY_BG[selected.category], color: CATEGORY_COLOR[selected.category] }}
            >
              {CATEGORY_LABEL[selected.category]}
            </span>
          </div>

          {/* Uppercase / Lowercase */}
          <div className="flex gap-3">
            {[{ label: 'Majuscule', char: selected.upper }, { label: 'Minuscule', char: selected.lower }].map(({ label, char }) => (
              <div key={label} className="flex-1 rounded-xl p-3 text-center space-y-1" style={{ background: 'var(--background)' }}>
                <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
                <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-cyrillic)', color: 'var(--foreground)' }}>{char}</div>
                <div className="flex justify-center">
                  <AudioButton text={char} rate={0.5} size="sm" label={`Écouter ${label.toLowerCase()} : ${char}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Phonetics */}
          <div className="rounded-xl p-4 space-y-2.5" style={{ background: 'var(--background)' }}>
            {[
              { label: 'Prononciation (IPA)', value: selected.ipa, color: 'var(--primary)', speak: null },
              { label: 'Romanisation', value: selected.romanized, color: 'var(--gold)', speak: null },
              ...(selected.lookalike ? [{ label: 'Ressemble à (latin)', value: selected.lookalike, color: 'var(--violet)', speak: null }] : []),
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</span>
                <span className="font-bold text-sm" style={{ fontFamily: 'var(--font-mono)', color }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Example word */}
          {selected.example && (
            <div className="rounded-xl p-4 space-y-2" style={{ background: 'var(--background)' }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>Exemple</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold" style={{ fontFamily: 'var(--font-cyrillic)', color: 'var(--foreground)' }} lang="ru">
                    {selected.example}
                  </div>
                  <div className="flex gap-3 mt-1 text-xs">
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>{selected.exampleTranslit}</span>
                    <span style={{ color: 'var(--muted-foreground)' }}>· {selected.translation}</span>
                  </div>
                </div>
                <AudioButton text={selected.example} rate={0.72} label={`Écouter : ${selected.example}`} />
              </div>
            </div>
          )}

          {/* Syllables */}
          {selected.category !== 'sign' && (
            <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--background)' }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>Syllabes communes</div>
              <div className="flex flex-wrap gap-2">
                {['а', 'е', 'и', 'о', 'у'].map(vowel => {
                  const syllable = selected.category === 'vowel' ? selected.lower + 'н' : selected.lower + vowel;
                  if (selected.category === 'vowel' && vowel !== 'а') return null;
                  return (
                    <div key={vowel}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
                      style={{ background: 'white', border: '1px solid var(--border)' }}>
                      <span className="text-base font-bold" style={{ fontFamily: 'var(--font-cyrillic)', color: 'var(--foreground)' }} lang="ru">
                        {syllable}
                      </span>
                      <AudioButton text={syllable} rate={0.65} size="sm" label={`Écouter la syllabe ${syllable}`} />
                    </div>
                  );
                })}
                {selected.category === 'consonant' && ['ба', 'бе', 'би', 'бо', 'бу'].filter((_, i) => {
                  const c = selected.lower;
                  return [`${c}а`, `${c}е`, `${c}и`, `${c}о`, `${c}у`][i] !== undefined;
                }).length === 0 && null}
              </div>
            </div>
          )}

          {/* Tip */}
          {selected.tip && (
            <div className="rounded-xl p-4 flex gap-3"
              style={{ background: 'rgba(67,56,202,0.05)', border: '1px solid rgba(67,56,202,0.15)' }}>
              <Lightbulb size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                {selected.tip}
              </p>
            </div>
          )}
        </div>
        </>
      )}
    </div>
  );
}
