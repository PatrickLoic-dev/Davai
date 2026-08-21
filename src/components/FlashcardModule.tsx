import { useState, useCallback, useEffect } from 'react';
import { Volume2, VolumeX, RotateCcw, ChevronRight, ThumbsDown, ThumbsUp, Zap } from 'lucide-react';
import { VOCAB_THEMES, VocabCard, VocabTheme } from '../data/vocabulary';
import { useUser } from '../contexts/UserContext';
import { speakRussian, preloadVoices, hasAnyVoice } from '../utils/audio';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

type Rating = 'hard' | 'ok' | 'easy';

interface SessionCard {
  card: VocabCard;
  flipped: boolean;
  rated: boolean;
}

function SpeakButton({ text, size = 16 }: { text: string; size?: number }) {
  const [active, setActive] = useState(false);
  const [voicesReady, setVoicesReady] = useState(hasAnyVoice());

  useEffect(() => {
    if (voicesReady) return;
    preloadVoices().then(voices => setVoicesReady(voices.length > 0));
  }, [voicesReady]);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!voicesReady) return;
    setActive(true);
    speakRussian(text, 0.75);
    setTimeout(() => setActive(false), 1000);
  }

  if (!voicesReady) {
    return (
      <button
        disabled
        className="rounded-full flex items-center justify-center opacity-30 cursor-not-allowed"
        style={{ width: size + 18, height: size + 18, background: 'var(--secondary)', flexShrink: 0 }}
        aria-label="Audio indisponible : aucune voix de synthèse installée sur cet appareil"
        title="Aucune voix TTS détectée — essayez Chrome/Edge, ou installez une voix dans les paramètres de votre système"
      >
        <VolumeX size={size} style={{ color: 'var(--muted-foreground)' }} />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      style={{
        width: size + 18, height: size + 18,
        background: active ? 'var(--primary)' : 'var(--secondary)',
        border: `1.5px solid ${active ? 'var(--primary)' : 'transparent'}`,
        flexShrink: 0,
      }}
      aria-label={`Écouter : ${text}`}
    >
      <Volume2 size={size} style={{ color: active ? 'white' : 'var(--primary)' }} />
    </button>
  );
}

export default function FlashcardModule() {
  const { state, dispatch } = useUser();
  const [selectedTheme, setSelectedTheme] = useState<VocabTheme | null>(null);
  const [session, setSession] = useState<SessionCard[]>([]);
  const [idx, setIdx] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);
  const [stats, setStats] = useState({ hard: 0, ok: 0, easy: 0 });

  useEffect(() => { preloadVoices(); }, []);

  function startSession(theme: VocabTheme) {
    setSelectedTheme(theme);
    setSession(shuffle(theme.cards).map(card => ({ card, flipped: false, rated: false })));
    setIdx(0);
    setSessionDone(false);
    setStats({ hard: 0, ok: 0, easy: 0 });
  }

  function flipCard() {
    if (!session[idx] || session[idx].rated) return;
    const card = session[idx].card;
    if (!session[idx].flipped) speakRussian(card.russian, 0.75);
    setSession(prev => prev.map((s, i) => i === idx ? { ...s, flipped: !s.flipped } : s));
  }

  const rate = useCallback((rating: Rating) => {
    const current = session[idx];
    if (!current || current.rated) return;
    dispatch({ type: 'UPDATE_SRS', cardId: current.card.id, rating });
    if (rating === 'easy') dispatch({ type: 'ADD_XP', amount: 10 });
    else if (rating === 'ok') dispatch({ type: 'ADD_XP', amount: 5 });
    setStats(prev => ({ ...prev, [rating]: prev[rating] + 1 }));
    setSession(prev => prev.map((s, i) => i === idx ? { ...s, rated: true } : s));
    setTimeout(() => {
      if (idx + 1 >= session.length) {
        setSessionDone(true);
        dispatch({ type: 'COMPLETE_LESSON', lessonId: 'vocabulary-' + (selectedTheme?.id ?? '') });
      } else {
        setIdx(idx + 1);
      }
    }, 350);
  }, [session, idx, dispatch, selectedTheme]);

  const getSRSLabel = (cardId: string) => {
    const s = state.srsState[cardId];
    if (!s || s === 'new') return null;
    if (s === 'learning') return { label: 'En cours', color: 'var(--gold)' };
    return { label: 'Appris', color: 'var(--success)' };
  };

  // ── Theme selection ──
  if (!selectedTheme) {
    const learnedByTheme = (theme: VocabTheme) =>
      theme.cards.filter(c => state.srsState[c.id] === 'learned').length;

    return (
      <div className="mod-pad space-y-6 overflow-y-auto h-full">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', letterSpacing: '-0.01em' }}>
            Vocabulaire · Словарь
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Flashcards SRS avec audio — choisissez un thème
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {VOCAB_THEMES.map((theme, i) => {
            const learned = learnedByTheme(theme);
            const total = theme.cards.length;
            const pct = Math.round((learned / total) * 100);
            return (
              <button
                key={theme.id}
                onClick={() => startSession(theme)}
                className={`text-left rounded-2xl p-6 space-y-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-slide-up delay-${i * 75} card-shadow`}
                style={{ background: 'white', border: `1.5px solid ${theme.color}25`, opacity: 0 }}
                aria-label={`Thème ${theme.title} : ${learned}/${total} mots appris`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: theme.bgColor }}>
                    {theme.emoji}
                  </div>
                  {pct > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: `${theme.color}15`, color: theme.color }}>
                      {pct}%
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-bold" style={{ color: theme.color, fontFamily: 'var(--font-display)' }}>{theme.title}</div>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{theme.titleRu}</div>
                </div>
                <div>
                  <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--muted)' }}
                    role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: theme.color }} />
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{learned}/{total} appris</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* SRS overview */}
        <div className="rounded-2xl p-5 card-shadow" style={{ background: 'white', border: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Progression SRS globale</h3>
          <div className="flex gap-4 text-sm">
            {[
              { label: 'Nouveau', key: 'new', color: 'var(--muted-foreground)' },
              { label: 'En cours', key: 'learning', color: 'var(--gold)' },
              { label: 'Appris', key: 'learned', color: 'var(--success)' },
            ].map(({ label, key, color }) => {
              const allCards = VOCAB_THEMES.flatMap(t => t.cards);
              const count = key === 'new'
                ? allCards.filter(c => !state.srsState[c.id]).length
                : Object.values(state.srsState).filter(s => s === key).length;
              return (
                <div key={key} className="flex-1 rounded-xl p-3 text-center" style={{ background: 'var(--background)' }}>
                  <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color }}>{count}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Session done ──
  if (sessionDone) {
    const total = session.length;
    return (
      <div className="flex flex-col items-center justify-center h-full gap-8 mod-pad animate-fade-in">
        <div className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: stats.easy > total * 0.7 ? 'rgba(5,150,105,0.1)' : 'rgba(67,56,202,0.08)' }}>
          <span className="text-4xl">{stats.easy > total * 0.7 ? '🌟' : '👍'}</span>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
            Session terminée !
          </h2>
          <p style={{ color: 'var(--muted-foreground)' }}>{total} cartes · {selectedTheme.title}</p>
        </div>
        <div className="flex gap-4">
          {[
            { label: 'Difficile', value: stats.hard, color: 'var(--danger)' },
            { label: 'Moyen', value: stats.ok, color: 'var(--gold)' },
            { label: 'Facile', value: stats.easy, color: 'var(--success)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center px-6 py-4 rounded-2xl card-shadow" style={{ background: 'white', border: '1px solid var(--border)' }}>
              <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color }}>{value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => startSession(selectedTheme)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90"
            style={{ background: 'var(--primary)', color: 'white' }}>
            <RotateCcw size={15} /> Rejouer
          </button>
          <button onClick={() => setSelectedTheme(null)}
            className="px-6 py-3 rounded-xl font-semibold"
            style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>
            Changer de thème
          </button>
        </div>
      </div>
    );
  }

  // ── Card session ──
  const current = session[idx];
  const srs = getSRSLabel(current.card.id);
  const progressPct = Math.round((idx / session.length) * 100);

  return (
    <div className="flex flex-col h-full mod-pad gap-5 items-center">
      <div className="w-full flex items-center justify-between">
        <button onClick={() => setSelectedTheme(null)}
          className="text-sm px-3 py-1.5 rounded-lg"
          style={{ color: 'var(--muted-foreground)', background: 'var(--muted)' }}>
          ← Thèmes
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold" style={{ color: selectedTheme.color }}>{selectedTheme.title}</span>
          <span className="text-sm" style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>
            {idx + 1}/{session.length}
          </span>
        </div>
      </div>

      <div className="w-full max-w-md h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%`, background: selectedTheme.color }} />
      </div>

      {/* Card */}
      <div
        className="perspective-1200 w-full max-w-md cursor-pointer"
        style={{ height: '280px' }}
        onClick={flipCard}
        role="button"
        aria-label={current.flipped
          ? `Traduction : ${current.card.french}. Cliquez pour revenir au recto.`
          : `Mot russe : ${current.card.russian}. Cliquez pour voir la traduction.`}
      >
        <div
          className={`transform-3d flip-transition relative w-full h-full`}
          style={{ transform: current.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* Front */}
          <div
            className="backface-hidden absolute inset-0 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 card-shadow"
            style={{ background: 'white', border: `2px solid ${selectedTheme.color}20` }}
          >
            {srs && (
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold absolute top-4 right-4"
                style={{ background: `${srs.color}15`, color: srs.color }}>
                {srs.label}
              </span>
            )}
            <div className="text-6xl font-bold text-center leading-tight"
              style={{ fontFamily: 'var(--font-cyrillic)', color: 'var(--foreground)' }} lang="ru">
              {current.card.russian}
            </div>
            {current.card.gender && (
              <span className="text-xs px-2 py-0.5 rounded font-mono"
                style={{
                  background: current.card.gender === 'м' ? 'rgba(67,56,202,0.1)'
                    : current.card.gender === 'ж' ? 'rgba(220,38,38,0.1)' : 'rgba(245,158,11,0.1)',
                  color: current.card.gender === 'м' ? 'var(--primary)'
                    : current.card.gender === 'ж' ? 'var(--danger)' : 'var(--gold)',
                }}>
                {current.card.gender === 'м' ? 'masculin' : current.card.gender === 'ж' ? 'féminin' : 'neutre'}
              </span>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>
                {current.card.ipa}
              </span>
              <SpeakButton text={current.card.russian} size={14} />
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Cliquez pour révéler →</div>
          </div>

          {/* Back */}
          <div
            className="backface-hidden rotate-y-180 absolute inset-0 rounded-3xl p-8 flex flex-col items-center justify-center gap-4"
            style={{ background: `${selectedTheme.color}08`, border: `2px solid ${selectedTheme.color}30` }}
          >
            <div className="text-4xl font-bold text-center"
              style={{ fontFamily: 'var(--font-display)', color: selectedTheme.color }}>
              {current.card.french}
            </div>
            {current.card.exampleRu && (
              <div className="text-center space-y-1 mt-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm" style={{ fontFamily: 'var(--font-cyrillic)', color: 'var(--foreground)' }} lang="ru">
                    {current.card.exampleRu}
                  </span>
                  <SpeakButton text={current.card.exampleRu} size={13} />
                </div>
                <div className="text-xs italic" style={{ color: 'var(--muted-foreground)' }}>
                  {current.card.exampleFr}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rating buttons */}
      {current.flipped && !current.rated && (
        <div className="flex gap-3 w-full max-w-md animate-slide-up">
          {[
            { rating: 'hard' as Rating, label: 'Difficile', sub: 'À revoir', color: '#DC2626', bg: '#FEF2F2', Icon: ThumbsDown },
            { rating: 'ok' as Rating, label: 'Moyen', sub: '+5 XP', color: '#D97706', bg: '#FFFBEB', Icon: ChevronRight },
            { rating: 'easy' as Rating, label: 'Facile', sub: '+10 XP', color: '#059669', bg: '#ECFDF5', Icon: Zap },
          ].map(({ rating, label, sub, color, bg, Icon }) => (
            <button
              key={rating}
              onClick={() => rate(rating)}
              className="flex-1 py-3 px-2 rounded-2xl text-center transition-all duration-150 hover:scale-105 active:scale-95 flex flex-col items-center gap-1"
              style={{ background: bg, border: `1.5px solid ${color}25`, color }}
              aria-label={`Évaluer comme : ${label}`}
            >
              <Icon size={16} />
              <div className="font-bold text-sm">{label}</div>
              <div className="text-xs opacity-70">{sub}</div>
            </button>
          ))}
        </div>
      )}

      {current.rated && (
        <p className="text-sm animate-fade-in" style={{ color: 'var(--muted-foreground)' }}>
          Passage à la carte suivante…
        </p>
      )}

      {!current.flipped && (
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          Mémorisez ce mot, puis cliquez pour révéler la traduction
        </p>
      )}
    </div>
  );
}
