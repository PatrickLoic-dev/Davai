import { useUser, xpProgress } from '../contexts/UserContext';
import { BADGES } from '../data/badges';
import { LESSONS } from '../data/lessons';
import { View } from './Nav';

interface Props {
  onNavigate: (v: View) => void;
}

const MODULE_CARDS = [
  {
    id: 'alphabet' as View,
    title: 'Alphabet cyrillique',
    titleRu: 'Алфавит',
    description: '33 lettres, 4 catégories, quiz interactif',
    emoji: 'А Б В',
    color: 'var(--primary)',
    bg: 'rgba(232,41,76,0.1)',
    border: 'rgba(232,41,76,0.2)',
  },
  {
    id: 'vocabulary' as View,
    title: 'Vocabulaire',
    titleRu: 'Словарь',
    description: '5 thèmes · flashcards SRS',
    emoji: '📖',
    color: 'var(--accent)',
    bg: 'rgba(0,212,184,0.1)',
    border: 'rgba(0,212,184,0.2)',
  },
  {
    id: 'grammar' as View,
    title: 'Grammaire',
    titleRu: 'Грамматика',
    description: 'Genres, cas, verbes au présent',
    emoji: '📐',
    color: 'var(--violet)',
    bg: 'rgba(124,58,237,0.1)',
    border: 'rgba(124,58,237,0.2)',
  },
  {
    id: 'exercises' as View,
    title: 'Exercices',
    titleRu: 'Упражнения',
    description: 'QCM, textes à trous, associations',
    emoji: '✏️',
    color: 'var(--gold)',
    bg: 'rgba(255,184,0,0.1)',
    border: 'rgba(255,184,0,0.2)',
  },
];

export default function Dashboard({ onNavigate }: Props) {
  const { state } = useUser();
  const progress = xpProgress(state.xp);
  const completedCount = state.completedLessons.length;
  const totalLessons = LESSONS.length;
  const overallProgress = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  const unlockedBadges = BADGES.filter(b => state.unlockedBadges.includes(b.id));
  const lockedBadges = BADGES.filter(b => !state.unlockedBadges.includes(b.id));

  const learnedCards = Object.values(state.srsState).filter(s => s === 'learned').length;

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ padding: '32px 40px' }}>

      {/* Header greeting */}
      <div className="mb-8 animate-slide-up">
        <div className="flex items-end gap-3 mb-1">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
            Здравствуйте{state.profile ? `, ${state.profile.name}` : ''} !
          </h1>
          {state.streak > 0 && (
            <span
              className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold mb-0.5"
              style={{ background: 'rgba(255,107,53,0.15)', color: '#FF6B35' }}
              aria-label={`${state.streak} jours de streak`}
            >
              <span className="animate-fire inline-block" aria-hidden="true">🔥</span>
              {state.streak} jour{state.streak !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <p style={{ color: 'var(--muted-foreground)' }}>
          {completedCount === 0
            ? 'Prêt·e à commencer ? Choisissez un module ci-dessous.'
            : `${completedCount} leçon${completedCount > 1 ? 's' : ''} terminée${completedCount > 1 ? 's' : ''} · continuez comme ça !`}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'XP total', value: state.xp, suffix: ' pts', color: 'var(--gold)', delay: 'delay-0' },
          { label: 'Niveau', value: state.level, suffix: '', color: 'var(--accent)', delay: 'delay-50' },
          { label: 'Mots appris', value: learnedCards, suffix: '', color: 'var(--violet)', delay: 'delay-100' },
          { label: 'Progression A1', value: overallProgress, suffix: '%', color: 'var(--primary)', delay: 'delay-150' },
        ].map(({ label, value, suffix, color, delay }) => (
          <div
            key={label}
            className={`rounded-2xl p-5 space-y-2 animate-slide-up ${delay}`}
            style={{ background: 'var(--card)', border: '1px solid var(--border)', opacity: 0 }}
          >
            <div className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
            <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color }}>
              {value}{suffix}
            </div>
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div
        className="mb-8 p-5 rounded-2xl space-y-3 animate-slide-up delay-200"
        style={{ background: 'var(--card)', border: '1px solid var(--border)', opacity: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Parcours A1</span>
            <span className="text-xs ml-2" style={{ color: 'var(--muted-foreground)' }}>{completedCount}/{totalLessons} leçons</span>
          </div>
          <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{overallProgress}%</span>
        </div>
        <div
          className="h-3 rounded-full overflow-hidden"
          style={{ background: 'var(--muted)' }}
          role="progressbar"
          aria-valuenow={overallProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progression globale du parcours A1"
        >
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${overallProgress}%`,
              background: 'linear-gradient(90deg, var(--accent), var(--violet))',
            }}
          />
        </div>

        <div className="flex gap-2 flex-wrap pt-1">
          {LESSONS.map((lesson) => {
            const done = state.completedLessons.includes(lesson.id);
            return (
              <div
                key={lesson.id}
                className="text-xs px-2 py-1 rounded-lg font-medium"
                style={{
                  background: done ? 'rgba(34,197,94,0.15)' : 'var(--muted)',
                  color: done ? 'var(--success)' : 'var(--muted-foreground)',
                  border: `1px solid ${done ? 'rgba(34,197,94,0.3)' : 'transparent'}`,
                }}
                aria-label={`${lesson.title} : ${done ? 'terminé' : 'à faire'}`}
              >
                {done ? '✓ ' : ''}{lesson.title}
              </div>
            );
          })}
        </div>
      </div>

      {/* XP level progress */}
      <div
        className="mb-8 p-5 rounded-2xl space-y-2 animate-slide-up delay-250"
        style={{ background: 'var(--card)', border: '1px solid var(--border)', opacity: 0 }}
      >
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Niveau {state.level} → {state.level + 1}</span>
          <span className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>{state.xp % 100}/100 XP</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
          <div
            className="h-full rounded-full xp-shimmer transition-all duration-700"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${Math.round(progress)}% de progression vers le niveau ${state.level + 1}`}
          />
        </div>
      </div>

      {/* Module cards */}
      <h2 className="text-lg font-bold mb-4 animate-slide-up delay-300" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)', opacity: 0 }}>
        Modules
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {MODULE_CARDS.map((mod, i) => (
          <button
            key={mod.id}
            onClick={() => onNavigate(mod.id)}
            className={`text-left rounded-2xl p-6 space-y-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-slide-up delay-${(i + 3) * 100}`}
            style={{
              background: mod.bg,
              border: `1px solid ${mod.border}`,
              opacity: 0,
            }}
            aria-label={`Aller au module ${mod.title}`}
          >
            <div className="text-3xl" aria-hidden="true" style={{ fontFamily: mod.id === 'alphabet' ? 'var(--font-display)' : 'inherit', color: mod.color, fontSize: mod.id === 'alphabet' ? '1.5rem' : '2rem' }}>
              {mod.emoji}
            </div>
            <div>
              <div className="font-bold text-base" style={{ color: mod.color, fontFamily: 'var(--font-display)' }}>{mod.title}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{mod.titleRu}</div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--secondary-foreground)' }}>{mod.description}</p>
          </button>
        ))}
      </div>

      {/* Badges */}
      <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>
        Badges
        <span className="ml-2 text-sm font-normal" style={{ color: 'var(--muted-foreground)' }}>
          {unlockedBadges.length}/{BADGES.length} débloqués
        </span>
      </h2>
      <div className="grid grid-cols-5 gap-3 mb-8">
        {BADGES.map((badge) => {
          const unlocked = state.unlockedBadges.includes(badge.id);
          return (
            <div
              key={badge.id}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl text-center"
              style={{
                background: unlocked ? `${badge.color}18` : 'var(--muted)',
                border: `1px solid ${unlocked ? `${badge.color}40` : 'transparent'}`,
                opacity: unlocked ? 1 : 0.45,
              }}
              title={`${badge.title} — ${badge.description}`}
              aria-label={`Badge "${badge.title}" : ${badge.description}. ${unlocked ? 'Débloqué !' : 'Verrouillé.'}`}
            >
              <span className="text-2xl" aria-hidden="true" style={{ filter: unlocked ? 'none' : 'grayscale(1)' }}>{badge.emoji}</span>
              <span className="text-xs font-semibold leading-tight" style={{ color: unlocked ? badge.color : 'var(--muted-foreground)' }}>
                {badge.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Recent activity placeholder */}
      {completedCount === 0 && (
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: 'var(--card)', border: '1px dashed var(--border)' }}
        >
          <div className="text-4xl mb-3" aria-hidden="true">📚</div>
          <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Aucune leçon terminée pour l'instant</p>
          <p className="text-sm mt-1 mb-4" style={{ color: 'var(--muted-foreground)' }}>Commencez par l'alphabet cyrillique !</p>
          <button
            onClick={() => onNavigate('alphabet')}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
            style={{ background: 'var(--primary)', color: 'white' }}
          >
            Commencer l'alphabet →
          </button>
        </div>
      )}
    </div>
  );
}
