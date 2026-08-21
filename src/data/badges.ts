export interface Badge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  condition: (stats: BadgeStats) => boolean;
}

export interface BadgeStats {
  completedLessons: string[];
  totalXP: number;
  streak: number;
  alphabetQuizScore: number; // highest % score
  learnedCards: number;
  lessonsToday: number;
}

export const BADGES: Badge[] = [
  {
    id: 'first-step',
    title: 'Premier pas',
    description: 'Terminer votre première leçon',
    emoji: '🚀',
    color: '#00D4B8',
    condition: (s) => s.completedLessons.length >= 1,
  },
  {
    id: 'alphabet-learner',
    title: 'Cyrillique débutant',
    description: "Terminer la leçon de l'alphabet",
    emoji: '🔤',
    color: '#E8294C',
    condition: (s) => s.completedLessons.includes('alphabet-intro'),
  },
  {
    id: 'phonetician',
    title: 'Phonéticien',
    description: 'Maîtriser les sons Ы, Ъ et Ь',
    emoji: '🎤',
    color: '#7C3AED',
    condition: (s) => s.completedLessons.includes('phonetics-special'),
  },
  {
    id: 'grammarian',
    title: 'Grammairien',
    description: 'Terminer la leçon sur les genres',
    emoji: '📐',
    color: '#FFB800',
    condition: (s) => s.completedLessons.includes('grammar-gender'),
  },
  {
    id: 'streak-3',
    title: '3 jours de suite',
    description: 'Maintenir un streak de 3 jours',
    emoji: '🔥',
    color: '#FF6B35',
    condition: (s) => s.streak >= 3,
  },
  {
    id: 'streak-7',
    title: 'Semaine parfaite',
    description: 'Maintenir un streak de 7 jours',
    emoji: '🌟',
    color: '#FFB800',
    condition: (s) => s.streak >= 7,
  },
  {
    id: 'xp-100',
    title: 'Cent points',
    description: 'Accumuler 100 XP',
    emoji: '💯',
    color: '#22C55E',
    condition: (s) => s.totalXP >= 100,
  },
  {
    id: 'xp-500',
    title: 'Demi-millénaire',
    description: 'Accumuler 500 XP',
    emoji: '⚡',
    color: '#00D4B8',
    condition: (s) => s.totalXP >= 500,
  },
  {
    id: 'flashcard-master',
    title: 'Mémoriseur',
    description: 'Apprendre 20 mots de vocabulaire',
    emoji: '🃏',
    color: '#7C3AED',
    condition: (s) => s.learnedCards >= 20,
  },
  {
    id: 'grammar-case',
    title: 'Cassologue',
    description: 'Terminer la leçon sur les cas',
    emoji: '🏛️',
    color: '#E8294C',
    condition: (s) => s.completedLessons.includes('grammar-cases'),
  },
];
