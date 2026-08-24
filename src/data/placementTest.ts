import { CEFRLevel } from './lessons';

export interface PlacementQuestion {
  id: string;
  level: CEFRLevel;
  question: string;
  options: string[];
  correct: number;
}

/**
 * 30 questions, 5 per CEFR level, presented in increasing difficulty order.
 * The level is never shown to the user — it's only used afterwards to
 * compute where they place (see computePlacementLevel).
 */
export const PLACEMENT_TEST: PlacementQuestion[] = [
  // ── A1 ──
  { id: 'p-a1-1', level: 'A1', question: 'Que signifie la lettre В en russe ?', options: ['Son B', 'Son V', 'Son W', 'Son F'], correct: 1 },
  { id: 'p-a1-2', level: 'A1', question: 'Comment dit-on "merci" en russe ?', options: ['привет', 'спасибо', 'пожалуйста', 'извините'], correct: 1 },
  { id: 'p-a1-3', level: 'A1', question: 'Quel est le genre de "стол" (table) ?', options: ['Masculin', 'Féminin', 'Neutre'], correct: 0 },
  { id: 'p-a1-4', level: 'A1', question: 'Comment dit-on "je lis" (читать) ?', options: ['я читаю', 'я читаешь', 'я читает'], correct: 0 },
  { id: 'p-a1-5', level: 'A1', question: 'Comment dit-on "5" en russe ?', options: ['четыре', 'пять', 'шесть'], correct: 1 },

  // ── A2 ──
  { id: 'p-a2-1', level: 'A2', question: '"Я иду в магазин" (Je vais au magasin) — "магазин" est à quel cas ?', options: ['Nominatif', 'Accusatif', 'Génitif'], correct: 1 },
  { id: 'p-a2-2', level: 'A2', question: 'Quelle est la forme au génitif de "книга" (livre) après "нет" (il n\'y a pas de) ?', options: ['книга', 'книгу', 'книги'], correct: 2 },
  { id: 'p-a2-3', level: 'A2', question: '"Я даю подарок ___" (Je donne un cadeau à maman) — quel cas pour "мама" ?', options: ['Датив (маме)', 'Генитив (мамы)', 'Инструменталь (мамой)'], correct: 0 },
  { id: 'p-a2-4', level: 'A2', question: '"Я пишу ___" (J\'écris avec un stylo) — "ручка" (stylo) à l\'instrumental donne :', options: ['ручку', 'ручкой', 'ручке'], correct: 1 },
  { id: 'p-a2-5', level: 'A2', question: 'Comment dit-on "hier" en russe ?', options: ['завтра', 'сегодня', 'вчера'], correct: 2 },

  // ── B1 ──
  { id: 'p-b1-1', level: 'B1', question: '"Я читал книгу вчера" utilise l\'aspect :', options: ['Perfectif', 'Imperfectif', 'Aucun des deux'], correct: 1 },
  { id: 'p-b1-2', level: 'B1', question: 'Quel verbe exprime une action ponctuelle et achevée : "прочитать" ou "читать" ?', options: ['прочитать', 'читать', 'les deux'], correct: 0 },
  { id: 'p-b1-3', level: 'B1', question: 'Pour "aller à pied" de façon habituelle (multidirectionnel), on utilise :', options: ['идти', 'ходить', 'пойти'], correct: 1 },
  { id: 'p-b1-4', level: 'B1', question: '"Я хочу, чтобы ты пришёл" illustre :', options: ['Une subordonnée avec чтобы', 'Un infinitif simple', 'Un impératif'], correct: 0 },
  { id: 'p-b1-5', level: 'B1', question: 'Quelle préposition + cas exprime le mouvement "vers" une personne (chez quelqu\'un) ?', options: ['к + датив', 'от + генитив', 'у + генитив'], correct: 0 },

  // ── B2 ──
  { id: 'p-b2-1', level: 'B2', question: '"Прочитав книгу, он пошёл спать" — "прочитав" est :', options: ['Un participe présent', 'Un gérondif passé (deepricastie)', 'Un infinitif'], correct: 1 },
  { id: 'p-b2-2', level: 'B2', question: '"Человек, читающий книгу" — "читающий" est :', options: ['Un participe actif présent', 'Un participe passif', 'Un gérondif'], correct: 0 },
  { id: 'p-b2-3', level: 'B2', question: 'Le discours indirect "Он сказал, что придёт" traduit :', options: ['"Il a dit qu\'il viendrait"', '"Il dit de venir"', '"Il a demandé de venir"'], correct: 0 },
  { id: 'p-b2-4', level: 'B2', question: 'Quel comparatif signifie "plus intéressant" ?', options: ['интереснее', 'интересный', 'самый интересный'], correct: 0 },
  { id: 'p-b2-5', level: 'B2', question: 'Le préfixe "пере-" dans "перейти" (traverser) exprime typiquement :', options: ['Le passage d\'un lieu à un autre', 'Le début d\'une action', 'La fin définitive'], correct: 0 },

  // ── C1 ──
  { id: 'p-c1-1', level: 'C1', question: '"Несмотря на то, что было холодно, ..." introduit :', options: ['Une concession', 'Une cause', 'Une conséquence'], correct: 0 },
  { id: 'p-c1-2', level: 'C1', question: 'Le registre de "очи" par rapport à "глаза" (yeux) est :', options: ['Familier', 'Poétique / soutenu', 'Neutre'], correct: 1 },
  { id: 'p-c1-3', level: 'C1', question: '"Будь что будет" signifie idiomatiquement :', options: ['"Advienne que pourra"', '"Fais ce que tu veux"', '"Ce sera pour demain"'], correct: 0 },
  { id: 'p-c1-4', level: 'C1', question: 'La particule "же" dans "Я же говорил!" sert à :', options: ['Insister / rappeler', 'Poser une question', 'Nier'], correct: 0 },
  { id: 'p-c1-5', level: 'C1', question: 'Quelle forme est un participe passif passé de "написать" ?', options: ['написанный', 'написавший', 'пишущий'], correct: 0 },

  // ── C2 ──
  { id: 'p-c2-1', level: 'C2', question: '"Как бы то ни было" signifie :', options: ['"Quoi qu\'il en soit"', '"Comment est-ce possible"', '"Comme si de rien n\'était"'], correct: 0 },
  { id: 'p-c2-2', level: 'C2', question: 'Le verbe "ждать" gouverne le génitif ou l\'accusatif selon :', options: ['Le degré d\'abstraction/concrétude du complément', 'Le genre du locuteur', 'Il n\'y a aucune variation possible'], correct: 0 },
  { id: 'p-c2-3', level: 'C2', question: '"Отнюдь не" est un équivalent soutenu de :', options: ['"Совсем не" (pas du tout)', '"Может быть" (peut-être)', '"Наверное" (probablement)'], correct: 0 },
  { id: 'p-c2-4', level: 'C2', question: 'Dans un texte littéraire, l\'inversion "Шёл дождь" par rapport à "Дождь шёл" relève :', options: ['D\'un effet stylistique neutre en russe (ordre libre)', 'D\'une faute de syntaxe', 'D\'un archaïsme obligatoire'], correct: 0 },
  { id: 'p-c2-5', level: 'C2', question: 'Le suffixe "-таки" dans "всё-таки" apporte une nuance de :', options: ['Insistance / persistance malgré tout', 'Négation totale', 'Question rhétorique'], correct: 0 },
];

const LEVEL_ORDER: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

/**
 * Walks levels from A1 up; the assigned level is the highest one where the
 * user scored at least 60% (3/5) on that level's block, stopping at the
 * first block they don't clear. Always at least A1.
 */
export function computePlacementLevel(answers: Record<string, boolean>): CEFRLevel {
  let assigned: CEFRLevel = 'A1';
  for (const level of LEVEL_ORDER) {
    const blockQuestions = PLACEMENT_TEST.filter(q => q.level === level);
    const correctCount = blockQuestions.filter(q => answers[q.id]).length;
    if (blockQuestions.length === 0) continue;
    if (correctCount / blockQuestions.length >= 0.6) {
      assigned = level;
    } else {
      break;
    }
  }
  return assigned;
}
