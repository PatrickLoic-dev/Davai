import { useState } from 'react';
import {
  BookOpen, Mic, MessageSquare, Hash, Ruler, Columns2,
  MessageCircle, Target, CheckCircle, Lock, ChevronRight,
  Flame, Trophy, BookMarked, Layers,
} from 'lucide-react';
import { useUser, xpProgress } from '../contexts/UserContext';
import { LESSONS } from '../data/lessons';
import { BADGES } from '../data/badges';
import { View } from './Nav';
import StreakCalendar from './StreakCalendar';

interface Props { onNavigate: (v: View) => void; }

interface PathStep {
  id: string; step: number; title: string; titleRu: string;
  subtitle: string; Icon: React.ElementType; lessonId: string | null;
  view: View; color: string; xp: number;
}

const PATH: PathStep[] = [
  { id: 'step-alphabet',   step: 1, title: "L'Alphabet Cyrillique", titleRu: 'Алфавит',      subtitle: '33 lettres · Quiz de reconnaissance',           Icon: BookOpen,      lessonId: 'alphabet-intro',    view: 'alphabet',   color: '#4338CA', xp: 50 },
  { id: 'step-phonetics',  step: 2, title: 'Sons spéciaux',         titleRu: 'Фонетика',      subtitle: 'Ы, Ъ, Ь · Prononciation authentique',           Icon: Mic,           lessonId: 'phonetics-special', view: 'grammar',    color: '#7C3AED', xp: 60 },
  { id: 'step-greetings',  step: 3, title: 'Salutations',           titleRu: 'Приветствия',   subtitle: 'Vocabulaire de base · Flashcards SRS',           Icon: MessageSquare, lessonId: null,                view: 'vocabulary', color: '#059669', xp: 40 },
  { id: 'step-numbers',    step: 4, title: 'Chiffres 0–100',        titleRu: 'Числа',         subtitle: "Nombres · Règles d'accord",                      Icon: Hash,          lessonId: 'numbers-cardinal',  view: 'grammar',    color: '#D97706', xp: 60 },
  { id: 'step-gender',     step: 5, title: 'Genres grammaticaux',   titleRu: 'Род',           subtitle: 'Masculin · Féminin · Neutre',                    Icon: Ruler,         lessonId: 'grammar-gender',    view: 'grammar',    color: '#DC2626', xp: 70 },
  { id: 'step-cases',      step: 6, title: 'Nominatif & Accusatif', titleRu: 'Падежи',        subtitle: 'Deux cas essentiels · Exemples en contexte',     Icon: Columns2,      lessonId: 'grammar-cases',     view: 'grammar',    color: '#0891B2', xp: 80 },
  { id: 'step-verbs',      step: 7, title: 'Verbes au présent',     titleRu: 'Глаголы',       subtitle: 'Conjugaisons 1 & 2 · читать, говорить',          Icon: MessageCircle, lessonId: 'grammar-verbs',     view: 'grammar',    color: '#7C3AED', xp: 90 },
  { id: 'step-eval',       step: 8, title: 'Évaluation A1',         titleRu: 'Тест',          subtitle: 'Bilan final · Mix de toutes les compétences',    Icon: Target,        lessonId: null,                view: 'exercises',  color: '#0A0A0A', xp: 100 },
];

function getStatus(step: PathStep, completed: string[], all: PathStep[]): 'done' | 'active' | 'locked' {
  if (step.lessonId && completed.includes(step.lessonId)) return 'done';
  const prevIdx = all.findIndex(s => s.id === step.id) - 1;
  if (prevIdx < 0) return 'active';
  const prev = all[prevIdx];
  return (prev.lessonId ? completed.includes(prev.lessonId) : true) ? 'active' : 'locked';
}

/* ── small stat tile ── */
function StatTile({ label, value, Icon, color }: { label: string; value: string | number; Icon: React.ElementType; color: string }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <Icon size={16} style={{ color }} aria-hidden="true" />
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.35rem', color: 'var(--foreground)' }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>{label}</div>
    </div>
  );
}

export default function LearningPath({ onNavigate }: Props) {
  const { state } = useUser();
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const progress = xpProgress(state.xp);
  const completed = state.completedLessons.length;
  const total = LESSONS.length;
  const pct = total ? Math.round((completed / total) * 100) : 0;
  const learnedCards = Object.values(state.srsState).filter(s => s === 'learned').length;
  const unlockedBadges = BADGES.filter(b => state.unlockedBadges.includes(b.id));

  const activeIdx = PATH.findIndex(s => getStatus(s, state.completedLessons, PATH) === 'active');
  const current = activeIdx >= 0 ? PATH[activeIdx] : PATH[PATH.length - 1];
  const CurrentIcon = current.Icon;

  const firstName = state.profile?.name?.split(' ')[0] ?? '';

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'var(--background)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top bar ── */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'white', flexShrink: 0, padding: '0 clamp(1.25rem, 3vw, 2.5rem)' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', marginBottom: '1px' }}>
              {firstName ? `Bonjour, ${firstName}` : 'Mon espace'} · {pct}% complété
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--foreground)', margin: 0 }}>Mon Parcours</h1>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ padding: '4px 12px', borderRadius: '100px', border: '1px solid var(--border)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--foreground)', fontFamily: 'var(--font-mono)' }}>
              Niv. {state.level}
            </span>
            <span style={{ padding: '4px 12px', borderRadius: '100px', background: 'var(--foreground)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary-foreground)', fontFamily: 'var(--font-mono)' }}>
              {state.xp} XP
            </span>
            {state.streak > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '100px', border: '1px solid #FED7AA', background: '#FFF7ED', fontSize: '0.78rem', fontWeight: 600, color: '#C2410C' }}>
                <Flame size={12} /> {state.streak}j
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div style={{ flex: 1, padding: '0 clamp(1.25rem, 3vw, 2.5rem)' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto', paddingTop: '2.5rem', paddingBottom: '4rem' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1.75rem', fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>
            <span>Parcours A1</span>
            <ChevronRight size={12} />
            <span>Étape {current.step}</span>
            <ChevronRight size={12} />
            <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>{current.title}</span>
          </div>

          {/* ── Featured current step (black card like Magnific's centered hero) ── */}
          <div style={{ background: 'var(--foreground)', color: 'white', borderRadius: '20px', padding: 'clamp(2rem, 4vw, 3rem)', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden' }}>
            {/* Decorative Cyrillic bg letter */}
            <div style={{ position: 'absolute', right: 'clamp(1.5rem, 5vw, 3rem)', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-cyrillic)', fontSize: 'clamp(6rem, 14vw, 10rem)', color: 'rgba(255,255,255,0.04)', userSelect: 'none', pointerEvents: 'none', lineHeight: 1 }} aria-hidden="true">
              {current.titleRu.charAt(0)}
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CurrentIcon size={16} color="white" />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                  Étape {current.step} sur {PATH.length} · En cours
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', color: 'white', margin: '0 0 0.5rem', lineHeight: 1.2 }}>
                {current.title}
              </h2>
              <div style={{ fontFamily: 'var(--font-cyrillic)', fontSize: '0.95rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem' }}>{current.titleRu}</div>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', lineHeight: 1.65, margin: '0 0 2rem', maxWidth: '460px' }}>{current.subtitle}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button onClick={() => onNavigate(current.view)}
                  style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'white', color: '#0A0A0A', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '100px', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'opacity 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                >
                  Continuer cette étape <ChevronRight size={14} />
                </button>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>+{current.xp} XP</span>
              </div>
            </div>
          </div>

          {/* ── Stats row (4 tiles) ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '2.5rem' }}>
            <StatTile label="Progression" value={`${pct}%`} Icon={Target} color="#0A0A0A" />
            <StatTile label="Leçons" value={completed} Icon={BookMarked} color="#4338CA" />
            <StatTile label="Mots appris" value={learnedCards} Icon={Layers} color="#059669" />
            <StatTile label="Badges" value={`${unlockedBadges.length}/${BADGES.length}`} Icon={Trophy} color="#D97706" />
          </div>

          {/* ── XP bar ── */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--foreground)' }}>Niveau {state.level}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{state.xp % 100}/100 XP → Niv. {state.level + 1}</span>
            </div>
            <div style={{ height: '6px', background: 'var(--muted)', borderRadius: '3px', overflow: 'hidden' }} role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
              <div className="xp-shimmer" style={{ height: '100%', width: `${progress}%`, borderRadius: '3px', transition: 'width 0.6s ease' }} />
            </div>
          </div>

          {/* ── Streak Calendar ── */}
          <div style={{ marginBottom: '2.5rem' }}>
            <StreakCalendar />
          </div>

          {/* ── Programme complet ── */}
          <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--foreground)', margin: 0 }}>Programme complet</h2>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted-foreground)' }}>{PATH.length} étapes · A1</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: '10px' }}>
            {PATH.map(step => {
              const status = getStatus(step, state.completedLessons, PATH);
              const isLocked = status === 'locked';
              const isDone = status === 'done';
              const isActive = status === 'active';
              const StepIcon = step.Icon;
              const isExpanded = expandedStep === step.id;

              return (
                <div key={step.id} style={{ background: isActive ? 'var(--foreground)' : 'var(--card)', border: isActive ? 'none' : `1px solid var(--border)`, borderRadius: '14px', overflow: 'hidden', opacity: isLocked ? 0.45 : 1, transition: 'opacity 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { if (!isLocked && !isActive) (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  <button
                    onClick={() => !isLocked && setExpandedStep(isExpanded ? null : step.id)}
                    disabled={isLocked}
                    style={{ width: '100%', background: 'none', border: 'none', padding: '1.1rem 1.25rem', textAlign: 'left', cursor: isLocked ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.9rem' }}
                    aria-expanded={isExpanded}
                    aria-label={`Étape ${step.step}: ${step.title}. ${isLocked ? 'Verrouillée' : isDone ? 'Terminée' : 'En cours'}`}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isActive ? 'rgba(255,255,255,0.12)' : isDone ? 'var(--foreground)' : 'var(--muted)' }}>
                      {isDone
                        ? <CheckCircle size={16} color="white" />
                        : isLocked
                        ? <Lock size={13} color="var(--muted-foreground)" />
                        : <StepIcon size={15} color={isActive ? 'white' : step.color} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: isActive ? 'white' : isDone ? 'var(--muted-foreground)' : 'var(--foreground)', textDecoration: isDone ? 'line-through' : 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {step.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: isActive ? 'rgba(255,255,255,0.45)' : 'var(--muted-foreground)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                        Ét. {step.step} · +{step.xp} XP
                      </div>
                    </div>
                    {isActive && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)', flexShrink: 0 }} aria-hidden="true" />}
                  </button>
                  {isExpanded && !isLocked && (
                    <div style={{ padding: '0 1.25rem 1.1rem', borderTop: `1px solid ${isActive ? 'rgba(255,255,255,0.08)' : 'var(--border)'}` }}>
                      <p style={{ fontSize: '0.8rem', color: isActive ? 'rgba(255,255,255,0.5)' : 'var(--muted-foreground)', margin: '0.75rem 0' }}>{step.subtitle}</p>
                      <button onClick={() => onNavigate(step.view)}
                        style={{ background: isActive ? 'white' : 'var(--foreground)', color: isActive ? '#0A0A0A' : 'white', border: 'none', padding: '0.5rem 1.1rem', borderRadius: '100px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.15s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.8'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                      >
                        {isDone ? 'Revoir' : 'Commencer'} →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Recent badges */}
          {unlockedBadges.length > 0 && (
            <div style={{ marginTop: '2.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--foreground)', marginBottom: '1rem' }}>Badges récents</h2>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {unlockedBadges.slice(-6).reverse().map(badge => (
                  <div key={badge.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '100px', border: `1px solid ${badge.color}25`, background: `${badge.color}08` }}>
                    <span style={{ fontSize: '0.9rem' }} aria-hidden="true">{badge.emoji}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: badge.color }}>{badge.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
