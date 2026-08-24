export type ExerciseType = 'mcq' | 'fill' | 'match';

export interface MCQExercise {
  id: string;
  type: 'mcq';
  question: string;
  options: string[];
  correct: number; // index into options
  explanation?: string;
}

export interface FillExercise {
  id: string;
  type: 'fill';
  question: string; // use ___ as placeholder
  correct: string;
  hint?: string;
  explanation?: string;
}

export interface MatchExercise {
  id: string;
  type: 'match';
  question: string; // instructions shown above the two columns
  pairs: { left: string; right: string }[]; // left/right strings must be unique within the exercise
  explanation?: string;
}

export type Exercise = MCQExercise | FillExercise | MatchExercise;

export interface LessonSection {
  heading: string;
  body: string;
  examples?: { ru: string; translit: string; fr: string }[];
  table?: { headers: string[]; rows: string[][] };
}

/** A sub-lesson is the actual unit of study: its own content + its own
 * graded evaluation (scored out of `maxScore`, typically 20). A parent
 * Lesson is considered complete once every one of its sub-lessons is. */
export interface SubLesson {
  id: string;
  title: string;
  intro: string;
  sections: LessonSection[];
  exercises: Exercise[];
  maxScore: 20 | 30;
}

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export const CEFR_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export interface Lesson {
  id: string;
  title: string;
  titleRu: string;
  module: 'alphabet' | 'phonetics' | 'pronunciation' | 'vocabulary' | 'grammar' | 'numbers';
  level: CEFRLevel;
  order: number;
  prerequisites: string[];
  subLessons: SubLesson[];
}

/** Lessons for one CEFR level, in display order. */
export function lessonsForLevel(level: CEFRLevel): Lesson[] {
  return LESSONS.filter(l => l.level === level).sort((a, b) => a.order - b.order);
}

/** Total XP a lesson is worth — sum of what each sub-lesson pays out. */
export function lessonXpReward(lesson: Lesson): number {
  return lesson.subLessons.reduce((sum, sl) => sum + sl.maxScore * 2, 0);
}

/** A lesson is "done" once every one of its sub-lessons has been passed. */
export function isLessonComplete(lesson: Lesson, completedSubLessons: string[]): boolean {
  return lesson.subLessons.every(sl => completedSubLessons.includes(sl.id));
}

export function findSubLesson(subLessonId: string): { lesson: Lesson; subLesson: SubLesson } | null {
  for (const lesson of LESSONS) {
    const subLesson = lesson.subLessons.find(sl => sl.id === subLessonId);
    if (subLesson) return { lesson, subLesson };
  }
  return null;
}

export const LESSONS: Lesson[] = [
  {
    id: 'alphabet-intro',
    title: "L'alphabet cyrillique",
    titleRu: 'Алфавит',
    module: 'alphabet',
    level: 'A1',
    order: 1,
    prerequisites: [],
    subLessons: [
      {
        id: 'alphabet-intro-voyelles',
        title: 'Les voyelles',
        intro: "Comme en français, l'alphabet cyrillique se comprend mieux en l'étudiant par catégories grammaticales plutôt que dans l'ordre. Commençons par les 10 voyelles — la moitié « molle » (я, ё, ю, е, и) et la moitié « dure » (а, о, у, э, ы) que vous approfondirez dans la leçon sur les syllabes.",
        sections: [
          {
            heading: 'Les 10 voyelles russes',
            body: 'Chaque voyelle a sa jumelle : dure ou douce. Voici les 10, avec un mot d\'usage pour chacune.',
            table: {
              headers: ['Lettre', 'Son (API)', 'Exemple', 'Traduction'],
              rows: [
                ['А а', '/a/', 'аист (aist)', 'cigogne'],
                ['О о', '/o/', 'окно (akno)', 'fenêtre'],
                ['У у', '/u/', 'утка (outka)', 'canard'],
                ['Э э', '/ɛ/', 'это (eta)', 'ceci'],
                ['Ы ы', '/ɨ/', 'рыба (ryba)', 'poisson'],
                ['Я я', '/ja/', 'яблоко (yablaka)', 'pomme'],
                ['Ё ё', '/jo/', 'ёлка (yolka)', 'sapin'],
                ['Ю ю', '/ju/', 'юг (youg)', 'sud'],
                ['Е е', '/jɛ/', 'ехать (yekhat\')', 'aller'],
                ['И и', '/i/', 'имя (imya)', 'prénom'],
              ],
            },
          },
          {
            heading: 'Pourquoi les regrouper ainsi ?',
            body: 'À l\'écrit, une voyelle ne se contente pas de porter un son : elle indique aussi si la consonne juste avant elle est "dure" ou "douce" (mouillée). C\'est ce mécanisme — la palatalisation — que vous étudierez en détail dans la prochaine leçon, « Syllabes communes ». Pour l\'instant, concentrez-vous sur la reconnaissance visuelle et sonore de chaque lettre.',
          },
        ],
        exercises: [
          {
            id: 'av-e1', type: 'mcq',
            question: 'Combien l\'alphabet russe compte-t-il de voyelles ?',
            options: ['8', '10', '12', '33'],
            correct: 1,
            explanation: 'Il y a exactement 10 voyelles : а, о, у, э, ы, я, ё, ю, е, и.',
          },
          {
            id: 'av-e2', type: 'mcq',
            question: 'Quelle voyelle se prononce "ou" comme dans "coucou" ?',
            options: ['О', 'У', 'Ы', 'Ю'],
            correct: 1,
            explanation: 'У se prononce "ou" — attention, elle ressemble au Y latin mais n\'en a pas le son.',
          },
          {
            id: 'av-e3', type: 'fill',
            question: 'Le mot "имя" (prénom) se translittère ___',
            correct: 'imya',
            hint: 'И = i, м = m, я = ya',
          },
          {
            id: 'av-e4', type: 'match',
            question: 'Associez chaque voyelle à son mot d\'exemple.',
            pairs: [
              { left: 'А', right: 'аист (cigogne)' },
              { left: 'Ы', right: 'рыба (poisson)' },
              { left: 'Я', right: 'яблоко (pomme)' },
              { left: 'И', right: 'имя (prénom)' },
            ],
          },
        ],
        maxScore: 20,
      },
      {
        id: 'alphabet-intro-consonnes',
        title: 'Les consonnes',
        intro: "20 des 33 lettres russes sont des consonnes. Plutôt que de toutes les apprendre d'un bloc, on les répartit en deux groupes : celles identiques au français, et les fameux « faux amis » qui ressemblent au latin mais sonnent différemment — la plus grande source d'erreurs des débutants.",
        sections: [
          {
            heading: 'Groupe 1 — consonnes identiques',
            body: 'Ces lettres ont exactement la même forme ET le même son qu\'en français : rien à réapprendre, juste à reconnaître.',
            table: {
              headers: ['Lettre', 'Astuce mnémotechnique', 'Exemple'],
              rows: [
                ['К', 'Un K tout court', 'кот (kot) — chat'],
                ['М', 'Un M, comme partout', 'мама (mama) — maman'],
                ['Т', 'Un T classique', 'такси (taxi) — taxi'],
              ],
            },
          },
          {
            heading: 'Groupe 2 — les 6 faux amis classiques',
            body: 'Après des années à lire l\'alphabet latin, votre cerveau associe automatiquement une forme de lettre à un son. Le problème : ces six consonnes très fréquentes ont la forme d\'une lettre latine... mais un son totalement différent. Oubliez ce que votre œil reconnaît et associez-les plutôt à leur astuce mnémotechnique :',
            table: {
              headers: ['Lettre', 'Ressemble à', 'Se prononce', 'Astuce'],
              rows: [
                ['В', 'B', 'V (verre)', 'Le signe "victoire" (V) fait avec les doigts'],
                ['Н', 'H', 'N (non)', 'Deux poteaux comme un but de foot — "N" comme "Net"'],
                ['Р', 'P', 'R (roulé)', 'Un pirate qui dit "Arrr !"'],
                ['С', 'C', 'S (soleil)', 'Un serpent en forme de C qui siffle "sss"'],
                ['Х', 'X', 'KH (comme la jota espagnole)', 'On se racle la gorge, comme pour tousser'],
              ],
            },
          },
          {
            heading: 'Groupe 3 — formes uniques',
            body: 'Les 12 dernières consonnes n\'ont pas d\'équivalent visuel en français — il faut simplement les mémoriser, souvent avec une image mentale.',
            table: {
              headers: ['Lettre', 'Astuce', 'Exemple'],
              rows: [
                ['Б', 'Un 6 à l\'envers, ou un ventre avec un chapeau', 'банан (banan)'],
                ['Г', 'Un Γ grec, ou une potence', 'город (gorad) — ville'],
                ['Д', 'Une petite maison (дом = maison)', 'дом (dom) — maison'],
                ['Ж', 'Un insecte aux pattes écartées', 'жук (jouk) — scarabée'],
                ['З', 'Le chiffre 3', 'зима (zima) — hiver'],
                ['Л', 'Une tente ouverte à gauche', 'лев (lyev) — lion'],
                ['П', 'Un portail, des poteaux de but', 'папа (papa)'],
                ['Ф', 'Une personne debout, mains sur les hanches', 'фото (fota) — photo'],
                ['Ц', 'Comme un chat, avec une petite queue', 'цирк (tsirk) — cirque'],
                ['Ч', 'Une chaise renversée, ou le chiffre 4', 'чай (tchaï) — thé'],
                ['Ш', 'Un peigne à trois dents', 'школа (chkola) — école'],
                ['Щ', 'Comme Ш, mais avec une petite queue (plus long)', 'щука (chtchouka) — brochet'],
              ],
            },
          },
        ],
        exercises: [
          {
            id: 'ac-e1', type: 'mcq',
            question: 'Que signifie la lettre В en russe ?',
            options: ['Son B comme dans "banane"', 'Son V comme dans "verre"', 'Son W comme dans "wagon"', 'Son F comme dans "feu"'],
            correct: 1,
            explanation: 'В est un faux ami ! Elle ressemble au B latin mais se prononce V.',
          },
          {
            id: 'ac-e2', type: 'mcq',
            question: 'Quelle lettre cyrillique représente le son "N" ?',
            options: ['И', 'Н', 'П', 'Л'],
            correct: 1,
            explanation: 'Н se prononce N — elle ressemble au H latin, c\'est un piège classique !',
          },
          {
            id: 'ac-e3', type: 'mcq',
            question: 'Comment se prononce Р ?',
            options: ['Comme P', 'Comme R roulé', 'Comme F', 'Comme B'],
            correct: 1,
            explanation: 'Р est le R russe — toujours roulé, jamais comme un P.',
          },
          {
            id: 'ac-e4', type: 'fill',
            question: 'Le mot "мама" se translittère ___',
            correct: 'mama',
            hint: 'М = m, А = a',
          },
          {
            id: 'ac-e5', type: 'match',
            question: 'Associez chaque faux ami à sa prononciation réelle.',
            pairs: [
              { left: 'В', right: 'V' },
              { left: 'Н', right: 'N' },
              { left: 'Р', right: 'R (roulé)' },
              { left: 'С', right: 'S' },
              { left: 'Х', right: 'KH' },
            ],
            explanation: 'Ces cinq consonnes sont les faux amis classiques de l\'alphabet cyrillique.',
          },
        ],
        maxScore: 20,
      },
      {
        id: 'alphabet-intro-semivoyelles',
        title: 'La semi-voyelle Й',
        intro: "Й est la seule lettre cyrillique classée « semi-voyelle » : elle n'est ni vraiment une consonne, ni une voyelle à part entière — un peu comme le Y anglais dans \"yes\" ou \"boy\".",
        sections: [
          {
            heading: 'Й — И court',
            body: 'Son nom officiel est « и краткое » (i court). Elle représente un son "y" bref, toujours accroché à une voyelle voisine — jamais isolée au milieu d\'une syllabe. On la trouve surtout en fin de diphtongue (ай, ой, ей) ou en début de mot importé.',
            examples: [
              { ru: 'чай', translit: 'tchaï', fr: 'thé — the "ай" forme une diphtongue' },
              { ru: 'йога', translit: 'yoga', fr: 'yoga' },
              { ru: 'мой', translit: 'moï', fr: 'mon / le mien' },
            ],
          },
          {
            heading: 'Un rôle grammatical clé',
            body: 'Й apparaît aussi à la fin de très nombreux adjectifs masculins (terminaison -ый / -ий), ce qui en fait une des lettres les plus fréquentes du russe malgré son statut à part.',
            examples: [
              { ru: 'красный', translit: 'krasnyy', fr: 'rouge (adjectif masculin)' },
              { ru: 'синий', translit: 'siniy', fr: 'bleu foncé (adjectif masculin)' },
            ],
          },
        ],
        exercises: [
          {
            id: 'asv-e1', type: 'mcq',
            question: 'À quoi ressemble le son de Й ?',
            options: ['Au Y anglais dans "yes"', 'Au K russe', 'Il est toujours muet'],
            correct: 0,
            explanation: 'Й est un son "y" bref — jamais une consonne pleine ni une voyelle isolée.',
          },
          {
            id: 'asv-e2', type: 'mcq',
            question: 'Où trouve-t-on très souvent Й en russe ?',
            options: ['Au début des verbes', 'À la fin des adjectifs masculins (-ый/-ий)', 'Uniquement dans les chiffres'],
            correct: 1,
            explanation: 'La terminaison -ый/-ий est la marque de l\'adjectif masculin — extrêmement fréquente.',
          },
          {
            id: 'asv-e3', type: 'fill',
            question: 'Le mot "thé" (чай) se translittère tcha___',
            correct: 'ï',
            hint: 'La diphtongue ай se rend par "aï" en français',
          },
        ],
        maxScore: 20,
      },
      {
        id: 'alphabet-intro-signes',
        title: 'Les signes : Ъ et Ь',
        intro: "Deux lettres de l'alphabet russe ne représentent aucun son : Ъ (signe dur) et Ь (signe mou). Elles forment leur propre catégorie, à part des voyelles et des consonnes — leur rôle est purement grammatical et phonétique.",
        sections: [
          {
            heading: 'Deux lettres muettes, deux fonctions',
            body: 'Le signe mou (Ь) et le signe dur (Ъ) ne se prononcent jamais seuls. Le premier "ramollit" la consonne qui le précède ; le second sépare une consonne d\'une voyelle sans ramollissement. Vous approfondirez leur prononciation exacte dans la leçon « Sons spéciaux ».',
            table: {
              headers: ['Signe', 'Nom russe', 'Rôle', 'Exemple'],
              rows: [
                ['Ь', 'мягкий знак', 'Ramollit la consonne précédente', 'мать (mère)'],
                ['Ъ', 'твёрдый знак', 'Sépare sans ramollir (rare, après préfixes)', 'объект (objet)'],
              ],
            },
          },
        ],
        exercises: [
          {
            id: 'asg-e1', type: 'mcq',
            question: 'Combien de sons Ъ et Ь représentent-ils à eux deux ?',
            options: ['Un chacun', 'Aucun — ce sont des signes muets', 'Deux chacun'],
            correct: 1,
            explanation: 'Ni Ъ ni Ь ne se prononcent : ce sont des marqueurs, pas des sons.',
          },
          {
            id: 'asg-e2', type: 'mcq',
            question: 'Lequel des deux signes est le plus rare en russe moderne ?',
            options: ['Ь (signe mou)', 'Ъ (signe dur)', 'Ils sont aussi fréquents l\'un que l\'autre'],
            correct: 1,
            explanation: 'Ъ est nettement plus rare, cantonné surtout à des mots avec préfixe + voyelle.',
          },
          {
            id: 'asg-e3', type: 'match',
            question: 'Associez chaque signe à son nom russe.',
            pairs: [
              { left: 'Ь', right: 'мягкий знак' },
              { left: 'Ъ', right: 'твёрдый знак' },
            ],
          },
        ],
        maxScore: 20,
      },
    ],
  },
  {
    id: 'syllables',
    title: 'Syllabes communes',
    titleRu: 'Слоги',
    module: 'pronunciation',
    level: 'A1',
    order: 2,
    prerequisites: ['alphabet-intro'],
    subLessons: [
      {
        id: 'syllables-1',
        title: 'Voyelles dures et douces',
        intro: "Le russe a deux séries de voyelles : dures et douces. La voyelle qui suit une consonne change complètement sa prononciation — c'est la clé pour bien lire le russe.",
        sections: [
          {
            heading: 'Deux familles de voyelles',
            body: 'Chaque voyelle dure a une "jumelle" douce. La douce ramollit (palatalise) la consonne qui la précède, un peu comme ajouter un léger "y".',
            table: {
              headers: ['Dure', 'Douce', 'Effet sur la consonne'],
              rows: [
                ['а', 'я', 'та (dur) vs тя (mouillé)'],
                ['о', 'ё', 'то (dur) vs тё (mouillé)'],
                ['у', 'ю', 'ту (dur) vs тю (mouillé)'],
                ['э', 'е', 'тэ (dur) vs те (mouillé)'],
                ['ы', 'и', 'ты (dur) vs ти (mouillé)'],
              ],
            },
          },
          {
            heading: 'Pourquoi ça compte',
            body: 'Cette règle explique pourquoi un même mot peut sonner très différemment selon sa voyelle. Prononcer мама (dur) et мять (mouillé) demande un geste de langue différent, même si les consonnes de départ se ressemblent.',
            examples: [
              { ru: 'мама', translit: 'mama', fr: 'maman (м dur)' },
              { ru: 'мять', translit: "myat'", fr: 'froisser (м mouillé)' },
            ],
          },
          {
            heading: 'Le geste articulatoire : un seul son fondu',
            body: 'Une consonne mouillée n\'est pas "consonne + son y" mis bout à bout — c\'est un seul son fondu, où le milieu de la langue touche le palais en même temps que vous prononcez la consonne. Astuce pratique : souriez légèrement et laissez échapper un petit "ih" en même temps que la consonne — c\'est exactement ce geste qui produit le son mouillé.',
            examples: [
              { ru: 'зеркало', translit: "zyerkala", fr: 'miroir — seul le з est mouillé, car suivi de е' },
            ],
          },
        ],
        exercises: [
          {
            id: 'syl-e1', type: 'mcq',
            question: 'Quelle voyelle est la "jumelle douce" de а ?',
            options: ['я', 'о', 'ы', 'у'],
            correct: 0,
            explanation: 'я est la version douce de а : elle palatalise la consonne précédente.',
          },
          {
            id: 'syl-e2', type: 'mcq',
            question: 'Une voyelle douce (я, ё, ю, е, и) après une consonne la rend :',
            options: ['Plus dure', 'Mouillée (palatalisée)', 'Muette', 'Nasale'],
            correct: 1,
            explanation: 'Les voyelles douces palatalisent systématiquement la consonne qui les précède.',
          },
          {
            id: 'syl-e7', type: 'mcq',
            question: 'Une consonne "mouillée" est en réalité :',
            options: ['Une consonne suivie d\'un son "y" séparé', 'Un seul son fondu, langue relevée vers le palais', 'Une consonne prononcée deux fois'],
            correct: 1,
            explanation: 'La palatalisation est un geste simultané, pas deux sons l\'un après l\'autre.',
          },
          {
            id: 'syl-e3', type: 'match',
            question: 'Associez chaque voyelle dure à sa jumelle douce.',
            pairs: [
              { left: 'а', right: 'я' },
              { left: 'о', right: 'ё' },
              { left: 'у', right: 'ю' },
              { left: 'ы', right: 'и' },
            ],
          },
        ],
        maxScore: 20,
      },
      {
        id: 'syllables-2',
        title: 'Lire les syllabes',
        intro: 'Le russe se lit syllabe par syllabe : consonne + voyelle. Entraînez-vous à lire ces combinaisons à voix haute pour automatiser la prononciation.',
        sections: [
          {
            heading: 'Syllabes avec М et Н',
            body: 'Essayez de lire chaque syllabe à voix haute — utilisez le bouton audio pour vérifier votre prononciation.',
            table: {
              headers: ['Dur', 'Doux', 'Mot exemple'],
              rows: [
                ['ма', 'мя', 'мама / мяч (balle)'],
                ['мо', 'мё', 'море / мёд (miel)'],
                ['на', 'ня', 'нога / няня (nounou)'],
                ['ну', 'ню', 'нужно / меню'],
              ],
            },
          },
          {
            heading: 'Syllabes avec С, Т, Л',
            body: 'Même logique avec d\'autres consonnes très fréquentes :',
            table: {
              headers: ['Dur', 'Doux', 'Mot exemple'],
              rows: [
                ['са', 'ся', 'сам / сядь (assieds-toi)'],
                ['ту', 'тю', 'тут / тюльпан (tulipe)'],
                ['лу', 'лю', 'лук (oignon) / люблю (j\'aime)'],
              ],
            },
          },
          {
            heading: 'Les exceptions à connaître',
            body: 'Trois consonnes sont toujours dures, quoi qu\'il arrive : ж, ш, ц (même suivies de и, qui se prononce alors "ы" !). Trois autres sont toujours douces : ч, щ, й — impossible de les durcir, même devant а, о ou у.',
            table: {
              headers: ['Consonne', 'Toujours', 'Piège fréquent'],
              rows: [
                ['ж, ш, ц', 'Dures', 'жи, ши se lisent "жы", "шы" — jamais "ji", "chi"'],
                ['ч, щ, й', 'Douces', 'ча, ща se lisent quand même "тча", "щя" mouillés'],
              ],
            },
          },
        ],
        exercises: [
          {
            id: 'syl-e4', type: 'mcq',
            question: 'Dans "мяч" (balle), la syllabe "мя" se prononce :',
            options: ['Comme "ma" dur', 'Comme "mia", м mouillé', 'Comme "mo"', 'Muette'],
            correct: 1,
            explanation: 'я après м donne un м mouillé, proche de "mia".',
          },
          {
            id: 'syl-e5', type: 'fill',
            question: '"J\'aime" en russe commence par la syllabe douce lю : le mot complet est лю___ (5 lettres après лю)',
            correct: 'блю',
            hint: 'люблю = j\'aime',
            explanation: 'люблю (j\'aime) — люб + лю.',
          },
          {
            id: 'syl-e6', type: 'match',
            question: 'Associez chaque syllabe à sa description.',
            pairs: [
              { left: 'ма', right: 'м dur' },
              { left: 'мя', right: 'м mouillé' },
              { left: 'ту', right: 'т dur' },
              { left: 'тю', right: 'т mouillé' },
            ],
          },
        ],
        maxScore: 20,
      },
      {
        id: 'syllables-3',
        title: "L'accentuation : la clé de l'accent russe",
        intro: "En russe, une seule syllabe par mot porte l'accent tonique — et elle se prononce nettement plus fort, plus longue et plus claire que les autres. Ignorer cette règle est LA raison n°1 pour laquelle un francophone garde un accent étranger très marqué, même après des années d'étude.",
        sections: [
          {
            heading: "Un accent qui n'est jamais écrit",
            body: "Contrairement au français où l'accent tonique est prévisible (souvent la dernière syllabe), en russe il peut tomber n'importe où et n'est indiqué nulle part dans l'écriture courante — seuls les dictionnaires et manuels pour débutants le notent avec un petit trait : ударе́ние. Il faut donc mémoriser l'accentuation avec chaque nouveau mot, comme son genre.",
            examples: [
              { ru: 'молоко́', translit: 'malako', fr: 'lait — accent sur la dernière syllabe' },
              { ru: 'ру́сский', translit: 'rousski', fr: 'russe — accent sur la première syllabe' },
            ],
          },
          {
            heading: 'La réduction vocalique (акание)',
            body: 'Conséquence directe de l\'accentuation : les voyelles о et а, quand elles ne sont PAS accentuées, perdent leur timbre net et se prononcent toutes les deux comme un "a" affaibli (proche du schwa anglais). C\'est le phénomène appelé акание. Un о non accentué ne se prononce donc presque jamais "o" franc !',
            table: {
              headers: ['Mot', 'Orthographe', 'Prononciation réelle', 'Explication'],
              rows: [
                ['окно́ (fenêtre, sg.)', 'o-k-NO', '"ak-NO"', 'о non accentué → "a" faible ; accent sur la finale, donc о final = "o" plein'],
                ['о́кна (fenêtres, pl.)', 'OK-n-a', '"OK-na"', 'l\'accent a sauté sur le radical ; le о du radical est plein, le а final s\'affaiblit'],
                ['молоко́', 'ma-la-KO', '"malako"', 'les deux о non accentués sonnent "a", seul le dernier (accentué) reste "o"'],
              ],
            },
          },
          {
            heading: 'Pourquoi ça change tout',
            body: 'Un même mot peut donc changer de prononciation selon la forme grammaticale utilisée, car l\'accent "se déplace" selon les mots en russe (окно́ → о́кна). C\'est déroutant au début, mais c\'est précisément ce qui donne au russe sa musicalité caractéristique. Astuce pratique : quand vous apprenez un nouveau mot, apprenez toujours sa syllabe accentuée en même temps — exactement comme vous apprenez son genre.',
          },
        ],
        exercises: [
          {
            id: 'syl-e8', type: 'mcq',
            question: 'Que devient un о non accentué en russe ?',
            options: ['Il reste "o" dans tous les cas', 'Il s\'affaiblit et se prononce comme un "a"', 'Il devient muet'],
            correct: 1,
            explanation: 'C\'est le phénomène d\'акание : о et а non accentués se prononcent tous les deux "a" faible.',
          },
          {
            id: 'syl-e9', type: 'mcq',
            question: 'Dans "молоко" (lait), combien de о se prononcent réellement "o" plein ?',
            options: ['Les trois', 'Un seul — le dernier, accentué', 'Aucun'],
            correct: 1,
            explanation: 'Seule la syllabe accentuée (la dernière ici) garde le son "o" plein : les deux premiers о sonnent "a".',
          },
          {
            id: 'syl-e10', type: 'mcq',
            question: 'Pourquoi faut-il apprendre l\'accent tonique de chaque nouveau mot ?',
            options: [
              'Parce qu\'il est toujours sur la même syllabe',
              'Parce qu\'il n\'est pas prévisible et change la prononciation des voyelles voisines',
              'Ce n\'est pas nécessaire, l\'accent n\'a aucun effet',
            ],
            correct: 1,
            explanation: 'L\'accent russe est imprévisible et peut même se déplacer selon la forme grammaticale du mot.',
          },
        ],
        maxScore: 20,
      },
    ],
  },
  {
    id: 'phonetics-special',
    title: 'Sons spéciaux : Ы, Ъ, Ь',
    titleRu: 'Фонетика',
    module: 'phonetics',
    level: 'A1',
    order: 3,
    prerequisites: ['alphabet-intro'],
    subLessons: [
      {
        id: 'phonetics-special-1',
        title: 'Ы — la voyelle du fond',
        intro: 'Trois lettres n\'ont pas d\'équivalent en français. Commençons par Ы, la plus emblématique.',
        sections: [
          {
            heading: 'Ы — la voyelle du fond',
            body: 'Le son Ы n\'existe pas en français. Prononcez "i" en reculant la langue vers l\'arrière de la bouche, comme si vous étiez surpris·e. Les Russes l\'entendent immédiatement.',
            examples: [
              { ru: 'рыба', translit: 'ryba', fr: 'poisson' },
              { ru: 'мы', translit: 'my', fr: 'nous' },
              { ru: 'ты', translit: 'ty', fr: 'tu' },
            ],
          },
          {
            heading: 'Astuce physique pour le sentir',
            body: 'Prenez un crayon (ou votre doigt) et mordez-le doucement en écartant les commissures des lèvres au maximum, comme un grand sourire forcé. Dans cette position, prononcez "i" : c\'est exactement le son Ы. Autre méthode : dites "tee", puis reculez la langue sans arrondir les lèvres — vous passez alors de и à ы.',
            examples: [
              { ru: 'мы / ми', translit: "my / mi", fr: 'nous (ы, langue reculée) vs la note "mi" (и, langue avancée)' },
            ],
          },
        ],
        exercises: [
          {
            id: 'ph-e2', type: 'mcq',
            question: 'Le son Ы ressemble le plus à :',
            options: ['I comme dans "île"', 'I prononcé avec la langue en arrière', 'U comme dans "lune"', 'OU comme dans "loup"'],
            correct: 1,
            explanation: 'Ы est un "i" prononcé avec la langue reculée — unique au russe !',
          },
          {
            id: 'ph-e4', type: 'fill',
            question: 'Le mot "мы" (nous) contient la voyelle spéciale ___',
            correct: 'ы',
            hint: 'C\'est la voyelle du fond',
          },
          {
            id: 'ph-e5', type: 'mcq',
            question: 'Dans la paire мы/ми, qu\'est-ce qui change entre les deux ?',
            options: ['La position de la langue (arrière pour ы, avant pour и)', 'Le volume de la voix', 'Rien, c\'est le même son'],
            correct: 0,
            explanation: 'ы = langue reculée (son "dark"), и = langue avancée (son "bright").',
          },
        ],
        maxScore: 20,
      },
      {
        id: 'phonetics-special-2',
        title: 'Ь et Ъ — les signes muets',
        intro: 'Ces deux lettres ne se prononcent jamais seules, mais changent tout autour d\'elles.',
        sections: [
          {
            heading: 'Ь — le signe mou',
            body: 'Le signe mou ne se prononce pas seul, mais "ramollit" la consonne qui le précède — un peu comme ajouter un Y après la consonne. La différence est subtile mais audible.',
            examples: [
              { ru: 'мать', translit: "mat'", fr: 'mère (ть = t mouillé)' },
              { ru: 'день', translit: "den'", fr: 'jour' },
              { ru: 'пять', translit: "pyat'", fr: 'cinq' },
            ],
          },
          {
            heading: 'Le sens change tout : paires minimales',
            body: 'Le signe mou n\'est pas un détail cosmétique : il peut changer complètement le sens d\'un mot. Comparez ces paires — seule la présence du Ь les distingue :',
            table: {
              headers: ['Sans Ь', 'Avec Ь', 'Différence de sens'],
              rows: [
                ['мат (mat)', 'мать (mat\')', '"juron / mat (échecs)" vs "mère"'],
                ['брат (brat)', 'брать (brat\')', '"frère" vs "prendre" (infinitif)'],
                ['нос (nos)', 'нёс (nyos)', '"nez" vs "il portait" (avec ё, aussi mouillé)'],
              ],
            },
          },
          {
            heading: 'Ъ — le signe dur',
            body: 'Le signe dur est rare (surtout après des préfixes). Il sépare une consonne d\'une voyelle sans ramollissement. Ne se prononce pas non plus.',
            examples: [
              { ru: 'объект', translit: "ob''yekt", fr: 'objet' },
              { ru: 'съесть', translit: "s''yest'", fr: 'manger (en entier)' },
            ],
          },
        ],
        exercises: [
          {
            id: 'ph-e1', type: 'mcq',
            question: 'Que fait le signe mou (Ь) dans un mot ?',
            options: [
              'Il ajoute un son "L"',
              'Il ramollit la consonne précédente',
              'Il durcit la consonne précédente',
              'Il est toujours silencieux et inutile',
            ],
            correct: 1,
            explanation: 'Ь ramollit la consonne précédente — une palatisation subtile.',
          },
          {
            id: 'ph-e3', type: 'mcq',
            question: 'Dans quel mot trouve-t-on un signe dur Ъ ?',
            options: ['мать', 'объект', 'рыба', 'день'],
            correct: 1,
            explanation: 'объект (objet) contient un Ъ entre об- et -ъект.',
          },
        ],
        maxScore: 20,
      },
      {
        id: 'phonetics-special-3',
        title: "L'assourdissement final",
        intro: "Dernière règle de prononciation essentielle avant de passer à la grammaire : en fin de mot, les consonnes « sonores » (voisées) perdent leur voix et se prononcent comme leur jumelle « sourde ». C'est une règle systématique, sans exception — et elle explique pourquoi хлеб (pain) ne se prononce jamais comme il s'écrit.",
        sections: [
          {
            heading: 'Les 6 paires sonore / sourde',
            body: 'Le russe organise ses consonnes en paires : une version "sonore" (les cordes vocales vibrent) et une version "sourde" (elles ne vibrent pas). En fin de mot, la sonore s\'assourdit systématiquement et se prononce comme sa jumelle sourde.',
            table: {
              headers: ['Sonore', 'Sourde', 'Exemple en fin de mot'],
              rows: [
                ['б', 'п', 'хлеб → se prononce "khlep"'],
                ['в', 'ф', 'кровь → se prononce "krof\'"'],
                ['г', 'к', 'друг → se prononce "drouk"'],
                ['д', 'т', 'год → se prononce "got"'],
                ['з', 'с', 'глаз → se prononce "glas"'],
                ['ж', 'ш', 'нож → se prononce "noch"'],
              ],
            },
          },
          {
            heading: 'Les sonorants : la seule exception',
            body: 'Cinq consonnes n\'ont pas de jumelle sourde et ne s\'assourdissent donc jamais, même en fin de mot : р, л, м, н, й. On les appelle des sonorants.',
            examples: [
              { ru: 'дом', translit: 'dom', fr: 'maison — м final reste sonore, "dom" et non "domp"' },
              { ru: 'стол', translit: 'stol', fr: 'table — л final reste sonore' },
            ],
          },
          {
            heading: 'Ça s\'applique aussi devant une consonne sourde',
            body: 'Même règle à l\'intérieur d\'un mot, quand une consonne sonore précède directement une consonne sourde : elle s\'assourdit par anticipation. Exemple : « водка » (vodka) se prononce "votka", le д devenant т avant le к sourd.',
          },
        ],
        exercises: [
          {
            id: 'ph-e5', type: 'mcq',
            question: 'Comment se prononce réellement "хлеб" (pain) ?',
            options: ['khleb, comme il s\'écrit', 'khlep, le б final s\'assourdit en п', 'khlev'],
            correct: 1,
            explanation: 'En fin de mot, б se prononce toujours п — c\'est l\'assourdissement final.',
          },
          {
            id: 'ph-e6', type: 'mcq',
            question: 'Laquelle de ces consonnes NE s\'assourdit JAMAIS en fin de mot ?',
            options: ['д', 'м (un sonorant)', 'г'],
            correct: 1,
            explanation: 'Les sonorants (р, л, м, н, й) n\'ont pas de jumelle sourde et restent inchangés.',
          },
          {
            id: 'ph-e7', type: 'match',
            question: 'Associez chaque consonne sonore à sa jumelle sourde.',
            pairs: [
              { left: 'б', right: 'п' },
              { left: 'д', right: 'т' },
              { left: 'г', right: 'к' },
              { left: 'з', right: 'с' },
            ],
          },
        ],
        maxScore: 20,
      },
    ],
  },
  {
    id: 'grammar-gender',
    title: 'Les genres grammaticaux',
    titleRu: 'Род существительных',
    module: 'grammar',
    level: 'A1',
    order: 4,
    prerequisites: ['alphabet-intro'],
    subLessons: [
      {
        id: 'grammar-gender-1',
        title: 'La règle des terminaisons',
        intro: 'En russe, chaque nom a un genre : masculin, féminin ou neutre. Heureusement, les terminaisons le trahissent presque toujours !',
        sections: [
          {
            heading: 'La règle des terminaisons',
            body: '90% des noms russes révèlent leur genre au premier coup d\'œil. Regardez simplement la dernière lettre :',
            table: {
              headers: ['Terminaison', 'Genre', 'Exemple', 'Traduction'],
              rows: [
                ['consonne', 'Masculin (м)', 'брат, стол, дом', 'frère, table, maison'],
                ['-а / -я', 'Féminin (ж)', 'мама, земля', 'maman, terre'],
                ['-о / -е', 'Neutre (с)', 'окно, море', 'fenêtre, mer'],
                ['-ь', 'Ambigu (м ou ж)', 'день (м), ночь (ж)', 'jour, nuit'],
              ],
            },
          },
          {
            heading: 'Les 10% à part : le piège du -ь',
            body: 'Environ 10% des noms se terminent par -ь, et là, aucune règle visuelle ne fonctionne : la graphie est identique pour le masculin et le féminin. Statistiquement, environ 78% de ces mots sont féminins et 22% masculins — mais il faut les mémoriser un par un, souvent en apprenant le mot avec son adjectif ("моя тетрадь" / "мой словарь").',
            examples: [
              { ru: 'словарь (м)', translit: 'slavár\'', fr: 'dictionnaire — masculin malgré le -ь' },
              { ru: 'тетрадь (ж)', translit: "tyetrád'", fr: 'cahier — féminin' },
              { ru: 'дверь (ж)', translit: "dvyer'", fr: 'porte — féminin' },
            ],
          },
          {
            heading: 'Le genre naturel gagne toujours',
            body: 'Pour les noms de personnes, le sexe réel de la personne l\'emporte sur la terminaison. Ainsi папа (papa), дедушка (grand-père) et дядя (oncle) se terminent en -а/-я comme des mots féminins... mais restent grammaticalement masculins, car ils désignent des hommes.',
            examples: [
              { ru: 'мой папа', translit: 'moy papa', fr: 'mon papa (masculin, malgré le -а)' },
              { ru: 'наш дедушка', translit: 'nash dyedushka', fr: 'notre grand-père (masculin)' },
            ],
          },
        ],
        exercises: [
          {
            id: 'gr-e1', type: 'mcq',
            question: 'Quel est le genre de "стол" (table) ?',
            options: ['Masculin', 'Féminin', 'Neutre', 'Impossible à savoir'],
            correct: 0,
            explanation: 'стол se termine par une consonne → masculin.',
          },
          {
            id: 'gr-e7', type: 'mcq',
            question: 'Quel est le genre de "папа" (papa) ?',
            options: ['Masculin (genre naturel)', 'Féminin (à cause du -а)', 'Neutre'],
            correct: 0,
            explanation: 'Le sexe réel de la personne l\'emporte : папа désigne un homme, donc masculin malgré le -а.',
          },
          {
            id: 'gr-e2', type: 'mcq',
            question: 'Quel est le genre de "книга" (livre) ?',
            options: ['Masculin', 'Féminin', 'Neutre', 'Variable'],
            correct: 1,
            explanation: 'книга se termine par -а → féminin.',
          },
          {
            id: 'gr-e3', type: 'mcq',
            question: 'Quel est le genre de "окно" (fenêtre) ?',
            options: ['Masculin', 'Féminin', 'Neutre', 'Masculin ou féminin'],
            correct: 2,
            explanation: 'окно se termine par -о → neutre.',
          },
          {
            id: 'gr-e5', type: 'fill',
            question: '"море" (mer) se termine par -е donc son genre est ___',
            correct: 'neutre',
            hint: '-о/-е = ?',
          },
        ],
        maxScore: 20,
      },
      {
        id: 'grammar-gender-2',
        title: "Pourquoi c'est important",
        intro: 'Le genre ne sert pas qu\'à classer les mots : il détermine l\'accord des adjectifs, pronoms et verbes au passé.',
        sections: [
          {
            heading: 'Pourquoi c\'est important',
            body: 'Le genre détermine les terminaisons des adjectifs, des pronoms et des verbes au passé. Apprendre le genre avec chaque nouveau mot est essentiel !',
            examples: [
              { ru: 'красный дом', translit: 'krasnyy dom', fr: 'une maison rouge (м)' },
              { ru: 'красная книга', translit: 'krasnaya kniga', fr: 'un livre rouge (ж)' },
              { ru: 'красное яблоко', translit: 'krasnoye yabloko', fr: 'une pomme rouge (с)' },
            ],
          },
        ],
        exercises: [
          {
            id: 'gr-e4', type: 'mcq',
            question: 'Quelle terminaison d\'adjectif pour "красный" (rouge) devant un nom féminin ?',
            options: ['-ый / -ий', '-ая / -яя', '-ое / -ее', '-ые / -ие'],
            correct: 1,
            explanation: 'Féminin → красная. Les adjectifs s\'accordent en genre !',
          },
          {
            id: 'gr-e6', type: 'match',
            question: 'Associez chaque nom russe à sa traduction.',
            pairs: [
              { left: 'стол', right: 'table' },
              { left: 'мама', right: 'maman' },
              { left: 'окно', right: 'fenêtre' },
              { left: 'земля', right: 'terre' },
              { left: 'дом', right: 'maison' },
            ],
            explanation: 'стол/дом sont masculins, мама/земля féminins, окно neutre — la terminaison donne le genre.',
          },
        ],
        maxScore: 20,
      },
    ],
  },
  {
    id: 'grammar-cases',
    title: 'Nominatif & Accusatif',
    titleRu: 'Именительный и Винительный падежи',
    module: 'grammar',
    level: 'A1',
    order: 5,
    prerequisites: ['grammar-gender'],
    subLessons: [
      {
        id: 'grammar-cases-1',
        title: 'Le Nominatif — le sujet',
        intro: 'Le russe utilise des "cas" pour indiquer le rôle d\'un mot dans la phrase. Commençons par le plus fondamental : le nominatif.',
        sections: [
          {
            heading: 'Le Nominatif — le sujet',
            body: 'Le nominatif désigne le sujet de la phrase. C\'est la forme de base que vous trouvez dans le dictionnaire.',
            examples: [
              { ru: 'Кот спит.', translit: 'Kot spit.', fr: 'Le chat dort.' },
              { ru: 'Мама готовит.', translit: 'Mama gotovit.', fr: 'Maman cuisine.' },
            ],
          },
        ],
        exercises: [
          {
            id: 'cas-e4', type: 'mcq',
            question: 'Dans "Кот пьёт молоко" (Le chat boit du lait), quel est le sujet ?',
            options: ['молоко', 'пьёт', 'кот', 'Pas de sujet'],
            correct: 2,
            explanation: 'кот est au nominatif — c\'est lui qui effectue l\'action de boire.',
          },
        ],
        maxScore: 20,
      },
      {
        id: 'grammar-cases-2',
        title: "L'Accusatif — l'objet direct",
        intro: "L'accusatif indique l'objet direct de l'action — le deuxième cas fondamental du russe.",
        sections: [
          {
            heading: "L'Accusatif — l'objet direct",
            body: "L'accusatif indique l'objet direct de l'action. Pour les noms inanimés masculins et neutres, la forme ne change pas. Pour les féminins en -а/-я, la terminaison devient -у/-ю.",
            table: {
              headers: ['Genre', 'Nominatif', 'Accusatif', 'Exemple Acc.'],
              rows: [
                ['Masculin (inanimé)', 'стол', 'стол', 'Я вижу стол.'],
                ['Féminin', 'книга', 'книгу', 'Я читаю книгу.'],
                ['Neutre', 'окно', 'окно', 'Я открываю окно.'],
              ],
            },
          },
          {
            heading: "Le piège n°1 : le masculin animé",
            body: "Règle capitale, source de la majorité des erreurs de débutants : quand le nom masculin désigne un être vivant (personne ou animal), l'accusatif ne reste PAS identique au nominatif — il emprunte la terminaison du génitif, en -а/-я.",
            table: {
              headers: ['Nominatif', 'Accusatif (animé)', 'Exemple'],
              rows: [
                ['брат (frère)', 'брата', 'Я вижу брата.'],
                ['кот (chat)', 'кота', 'Я вижу кота.'],
                ['студент (étudiant)', 'студента', 'Я знаю студента.'],
              ],
            },
          },
        ],
        exercises: [
          {
            id: 'cas-e1', type: 'mcq',
            question: 'Dans "Я вижу книгу" (Je vois un livre), quel cas est "книгу" ?',
            options: ['Nominatif', 'Accusatif', 'Génitif', 'Datif'],
            correct: 1,
            explanation: 'книгу est l\'objet direct de "voir" → accusatif féminin (книга → книгу).',
          },
          {
            id: 'cas-e5', type: 'mcq',
            question: 'Comment dit-on "Je vois mon frère" (брат) à l\'accusatif ?',
            options: ['Я вижу брат', 'Я вижу брата', 'Я вижу брату'],
            correct: 1,
            explanation: 'брат est masculin animé → l\'accusatif prend la terminaison du génitif : брата.',
          },
          {
            id: 'cas-e2', type: 'mcq',
            question: 'Quelle est la forme accusative de "мама" ?',
            options: ['мама', 'маму', 'маме', 'мамы'],
            correct: 1,
            explanation: 'мама est féminin en -а → accusatif en -у : маму.',
          },
          {
            id: 'cas-e3', type: 'fill',
            question: '"Я читаю ___ " (Je lis un livre). Mettez книга à l\'accusatif.',
            correct: 'книгу',
            hint: 'Féminin -а → accusatif -у',
          },
        ],
        maxScore: 20,
      },
    ],
  },
  {
    id: 'grammar-verbs',
    title: 'Présent des verbes réguliers',
    titleRu: 'Глаголы — настоящее время',
    module: 'grammar',
    level: 'A1',
    order: 6,
    prerequisites: ['grammar-gender'],
    subLessons: [
      {
        id: 'grammar-verbs-1',
        title: 'Conjugaison 1 : читать',
        intro: 'Les verbes russes se conjuguent selon la personne. Commençons par la 1ère conjugaison avec читать (lire).',
        sections: [
          {
            heading: 'Conjugaison 1 : читать (lire)',
            body: 'Les verbes en -ать/-ять suivent souvent ce schéma. La racine ici est чита-.',
            table: {
              headers: ['Personne', 'Russe', 'Translit.', 'Français'],
              rows: [
                ['я (je)', 'читаю', 'chitayu', 'je lis'],
                ['ты (tu)', 'читаешь', 'chitayesh\'', 'tu lis'],
                ['он/она (il/elle)', 'читает', 'chitayet', 'il/elle lit'],
                ['мы (nous)', 'читаем', 'chitayem', 'nous lisons'],
                ['вы (vous)', 'читаете', 'chitayetye', 'vous lisez'],
                ['они (ils/elles)', 'читают', 'chitayout', 'ils/elles lisent'],
              ],
            },
          },
          {
            heading: 'Attention aux mutations consonantiques',
            body: 'Certains verbes changent une consonne de leur radical au présent — et ce changement se maintient à toutes les personnes. Avec писать (écrire), le с du radical devient ш dès la 1ère personne, et le reste jusqu\'à "ils".',
            table: {
              headers: ['Personne', 'писать (écrire)', 'Explication'],
              rows: [
                ['я', 'пишу', 'с → ш (mutation)'],
                ['ты', 'пишешь', 'la mutation persiste'],
                ['они', 'пишут', 'toujours ш'],
              ],
            },
          },
        ],
        exercises: [
          {
            id: 'vb-e1', type: 'mcq',
            question: 'Quelle est la forme correcte de "читать" pour "они" (ils) ?',
            options: ['читаю', 'читают', 'читает', 'читаем'],
            correct: 1,
            explanation: 'они → читают. La terminaison -ют est caractéristique de la 3e personne du pluriel.',
          },
          {
            id: 'vb-e5', type: 'mcq',
            question: 'Comment dit-on "j\'écris" (писать) ?',
            options: ['я писаю', 'я пишу', 'я писают'],
            correct: 1,
            explanation: 'писать subit une mutation с→ш dès "я" : пишу (pas "писаю").',
          },
          {
            id: 'vb-e3', type: 'mcq',
            question: 'Traduisez : "Мы читаем книгу."',
            options: ['Je lis un livre.', 'Vous lisez un livre.', 'Nous lisons un livre.', 'Ils lisent un livre.'],
            correct: 2,
            explanation: 'мы = nous, читаем = lisons (1ère pers. pl.).',
          },
        ],
        maxScore: 20,
      },
      {
        id: 'grammar-verbs-2',
        title: 'Conjugaison 2 : говорить',
        intro: 'Les verbes en -ить/-еть forment le second groupe de conjugaison — tout aussi fréquent.',
        sections: [
          {
            heading: 'Conjugaison 2 : говорить (parler)',
            body: 'Les verbes en -ить/-еть forment un second groupe. La racine ici est говор-.',
            table: {
              headers: ['Personne', 'Russe', 'Translit.'],
              rows: [
                ['я', 'говорю', 'govoryu'],
                ['ты', 'говоришь', 'govorish\''],
                ['он/она', 'говорит', 'govorit'],
                ['мы', 'говорим', 'govorim'],
                ['вы', 'говорите', 'govorite'],
                ['они', 'говорят', 'govoryat'],
              ],
            },
          },
          {
            heading: 'Le verbe le plus irrégulier : хотеть (vouloir)',
            body: 'хотеть est célèbre pour son irrégularité : il se conjugue comme la 1ère conjugaison au singulier, puis bascule sur la 2e conjugaison au pluriel — un mélange unique à mémoriser par cœur, tant il est utilisé au quotidien.',
            table: {
              headers: ['Personne', 'хотеть (vouloir)', 'Groupe'],
              rows: [
                ['я', 'хочу', '1ère conjugaison'],
                ['ты', 'хочешь', '1ère conjugaison'],
                ['мы', 'хотим', '2e conjugaison'],
                ['они', 'хотят', '2e conjugaison'],
              ],
            },
          },
        ],
        exercises: [
          {
            id: 'vb-e2', type: 'fill',
            question: 'Я ___ по-русски. (Je parle russe.) — Conjuguez "говорить" pour я.',
            correct: 'говорю',
            hint: 'Conjugaison 2 : я → -ю',
          },
          {
            id: 'vb-e6', type: 'mcq',
            question: 'Comment dit-on "nous voulons" (хотеть) ?',
            options: ['мы хочем', 'мы хотим', 'мы хочут'],
            correct: 1,
            explanation: 'хотеть bascule sur la 2e conjugaison au pluriel : хотим (pas "хочем").',
          },
          {
            id: 'vb-e4', type: 'mcq',
            question: 'Quelle terminaison pour "ты" dans la conjugaison 1 ?',
            options: ['-ю', '-ешь', '-ет', '-ем'],
            correct: 1,
            explanation: 'ты читаешь — la terminaison -ешь est typique de "tu" au présent.',
          },
        ],
        maxScore: 20,
      },
    ],
  },
  {
    id: 'numbers-cardinal',
    title: 'Les chiffres 0 à 100',
    titleRu: 'Числа',
    module: 'numbers',
    level: 'A1',
    order: 7,
    prerequisites: ['alphabet-intro'],
    subLessons: [
      {
        id: 'numbers-cardinal-1',
        title: '0 à 20',
        intro: 'Compter en russe suit une logique simple une fois les nombres de base mémorisés.',
        sections: [
          {
            heading: '0 à 10 — les fondations',
            body: 'Ces dix nombres sont à mémoriser en premier — tout le reste en découle.',
            table: {
              headers: ['Chiffre', 'Russe', 'Translit.'],
              rows: [
                ['0', 'ноль', 'nol\''],
                ['1', 'один', 'adín'],
                ['2', 'два', 'dva'],
                ['3', 'три', 'tri'],
                ['4', 'четыре', 'tchétyrye'],
                ['5', 'пять', 'pyat\''],
                ['6', 'шесть', 'chest\''],
                ['7', 'семь', 'syem\''],
                ['8', 'восемь', 'vósyem\''],
                ['9', 'девять', 'dyévyat\''],
                ['10', 'десять', 'dyésyat\''],
              ],
            },
          },
          {
            heading: '11 à 20 — le suffixe -надцать',
            body: 'De 11 à 19, on ajoute le suffixe -надцать ("dix de plus") à la racine du chiffre. 20 a sa propre forme.',
            table: {
              headers: ['Chiffre', 'Russe', 'Translit.'],
              rows: [
                ['11', 'одиннадцать', 'adínnatsat\''],
                ['12', 'двенадцать', 'dvyénatsat\''],
                ['13', 'тринадцать', 'trinátsat\''],
                ['15', 'пятнадцать', 'pyatnátsat\''],
                ['20', 'двадцать', 'dvátsat\''],
              ],
            },
          },
        ],
        exercises: [
          {
            id: 'num-e1', type: 'mcq',
            question: 'Comment dit-on "5" en russe ?',
            options: ['четыре', 'пять', 'шесть', 'семь'],
            correct: 1,
            explanation: 'пять = 5.',
          },
          {
            id: 'num-e2', type: 'mcq',
            question: 'Quel suffixe transforme "6" (шесть) en "16" ?',
            options: ['-десят', '-дцать', '-надцать', '-ста'],
            correct: 2,
            explanation: 'шесть + -надцать → шестнадцать (16).',
          },
          {
            id: 'num-e3', type: 'fill',
            question: 'Écrivez le chiffre "10" en russe : ___',
            correct: 'десять',
            hint: 'Racine "дес-"',
          },
          {
            id: 'num-e6', type: 'match',
            question: 'Associez chaque chiffre à son écriture en russe.',
            pairs: [
              { left: '1', right: 'один' },
              { left: '5', right: 'пять' },
              { left: '10', right: 'десять' },
              { left: '20', right: 'двадцать' },
            ],
          },
        ],
        maxScore: 20,
      },
      {
        id: 'numbers-cardinal-2',
        title: "Dizaines et règles d'accord",
        intro: 'De 30 à 100, puis la règle qui fait trébucher tous les débutants : l\'accord du nom selon le chiffre.',
        sections: [
          {
            heading: 'Les dizaines : 20 à 100',
            body: 'Les dizaines se construisent souvent à partir du chiffre correspondant + -дцать ou -десят. Pour les nombres composés (ex. 25), on dit simplement "vingt-cinq" comme en français : двадцать пять.',
            table: {
              headers: ['Chiffre', 'Russe', 'Translit.'],
              rows: [
                ['30', 'тридцать', 'trítsat\''],
                ['40', 'сорок', 'sórak'],
                ['50', 'пятьдесят', 'pyat\'dyesyát'],
                ['100', 'сто', 'sto'],
              ],
            },
          },
          {
            heading: "La règle d'accord (aperçu)",
            body: 'Le nombre qui précède un nom change sa terminaison ! Règle simplifiée pour le niveau A1 : "1" → nom au singulier normal ; "2, 3, 4" → nom à une forme spéciale (génitif singulier) ; "5" et plus → nom au génitif pluriel.',
            examples: [
              { ru: 'один стол', translit: 'adín stol', fr: '1 table (normal)' },
              { ru: 'два стола', translit: 'dva stalá', fr: '2 tables (forme spéciale)' },
              { ru: 'пять столов', translit: 'pyat\' stalóv', fr: '5 tables (génitif pluriel)' },
            ],
          },
          {
            heading: 'Nombres composés : seul le dernier chiffre compte',
            body: 'Pour un nombre composé comme 21, 22 ou 25, c\'est UNIQUEMENT le dernier mot qui détermine l\'accord — pas le nombre entier. Ainsi 21 se comporte comme "1", 22 comme "2", et 25 comme "5". Exception à retenir : 11 à 14 suivent toujours la règle du génitif pluriel, même s\'ils se terminent visuellement par 1, 2, 3 ou 4.',
            table: {
              headers: ['Nombre', 'Se comporte comme', 'Exemple'],
              rows: [
                ['21 (двадцать один)', '"1" → singulier normal', 'двадцать один стол'],
                ['22 (двадцать два)', '"2" → génitif singulier', 'двадцать два стола'],
                ['25 (двадцать пять)', '"5" → génitif pluriel', 'двадцать пять столов'],
                ['11 à 14', 'Toujours génitif pluriel (exception)', 'одиннадцать столов'],
              ],
            },
          },
        ],
        exercises: [
          {
            id: 'num-e4', type: 'mcq',
            question: 'Avec "2, 3 ou 4", le nom qui suit prend :',
            options: ['Le nominatif pluriel', 'Une forme spéciale (génitif singulier)', 'Le génitif pluriel', 'Aucun changement'],
            correct: 1,
            explanation: 'Règle A1 simplifiée : 2/3/4 + génitif singulier (ex. два стола).',
          },
          {
            id: 'num-e7', type: 'mcq',
            question: 'Pour un nombre composé comme "22", quel chiffre détermine l\'accord du nom ?',
            options: ['Le premier chiffre (2 de 20)', 'Le dernier chiffre (2)', 'Les deux ensemble'],
            correct: 1,
            explanation: 'Seul le dernier mot du nombre compte : 22 se comporte comme "2" → génitif singulier.',
          },
          {
            id: 'num-e8', type: 'mcq',
            question: 'Quelle est l\'exception à la règle du dernier chiffre ?',
            options: ['11 à 14, toujours génitif pluriel', '20 et 30, toujours singulier', 'Il n\'y a aucune exception'],
            correct: 0,
            explanation: '11-14 suivent toujours la règle du "5 et plus", malgré leur dernier chiffre.',
          },
          {
            id: 'num-e5', type: 'mcq',
            question: '"Пять столов" (5 tables) — quelle forme prend "стол" ?',
            options: ['Nominatif singulier', 'Génitif singulier', 'Génitif pluriel', 'Accusatif'],
            correct: 2,
            explanation: '"5" et plus → génitif pluriel : столов.',
          },
        ],
        maxScore: 20,
      },
    ],
  },
];
