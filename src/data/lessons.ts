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

export interface Lesson {
  id: string;
  title: string;
  titleRu: string;
  module: 'alphabet' | 'phonetics' | 'vocabulary' | 'grammar' | 'numbers';
  order: number;
  xpReward: number;
  prerequisites: string[];
  intro: string;
  sections: LessonSection[];
  exercises: Exercise[];
}

export const LESSONS: Lesson[] = [
  {
    id: 'alphabet-intro',
    title: "L'alphabet cyrillique",
    titleRu: 'Алфавит',
    module: 'alphabet',
    order: 1,
    xpReward: 50,
    prerequisites: [],
    intro: "Le russe s'écrit avec l'alphabet cyrillique — 33 lettres au total. Beaucoup ressemblent aux lettres latines, ce qui facilite le début !",
    sections: [
      {
        heading: '10 lettres faciles',
        body: 'Ces lettres ressemblent ET se prononcent comme leurs équivalentes latines :',
        examples: [
          { ru: 'А, Е, О, К, М, Т', translit: 'A, Ye, O, K, M, T', fr: 'sons similaires' },
        ],
      },
      {
        heading: 'Faux amis',
        body: 'Ces lettres ressemblent au latin mais sonnent différemment — attention !',
        table: {
          headers: ['Lettre', 'Ressemble à', 'Se prononce'],
          rows: [
            ['В', 'B', 'V (verre)'],
            ['Н', 'H', 'N (non)'],
            ['Р', 'P', 'R (roulé)'],
            ['С', 'C', 'S (soleil)'],
            ['У', 'Y', 'OU (loup)'],
            ['Х', 'X', 'KH (Bach)'],
          ],
        },
      },
    ],
    exercises: [
      {
        id: 'al-e1', type: 'mcq',
        question: 'Que signifie la lettre В en russe ?',
        options: ['Son B comme dans "banane"', 'Son V comme dans "verre"', 'Son W comme dans "wagon"', 'Son F comme dans "feu"'],
        correct: 1,
        explanation: 'В est un faux ami ! Elle ressemble au B latin mais se prononce V.',
      },
      {
        id: 'al-e2', type: 'mcq',
        question: 'Quelle lettre cyrillique représente le son "N" ?',
        options: ['И', 'Н', 'П', 'Л'],
        correct: 1,
        explanation: 'Н se prononce N — elle ressemble au H latin, c\'est un piège classique !',
      },
      {
        id: 'al-e3', type: 'mcq',
        question: 'Comment se prononce Р ?',
        options: ['Comme P', 'Comme R roulé', 'Comme F', 'Comme B'],
        correct: 1,
        explanation: 'Р est le R russe — toujours roulé, jamais comme un P.',
      },
      {
        id: 'al-e4', type: 'fill',
        question: 'Le mot "мама" se translittère ___',
        correct: 'mama',
        hint: 'М = m, А = a',
        explanation: 'М = m et А = a, donc мама = mama. Facile !',
      },
      {
        id: 'al-e5', type: 'mcq',
        question: 'Combien de lettres contient l\'alphabet cyrillique russe ?',
        options: ['26', '30', '33', '36'],
        correct: 2,
        explanation: 'L\'alphabet russe compte 33 lettres.',
      },
      {
        id: 'al-e6', type: 'match',
        question: 'Associez chaque lettre à sa prononciation.',
        pairs: [
          { left: 'В', right: 'V' },
          { left: 'Н', right: 'N' },
          { left: 'Р', right: 'R (roulé)' },
          { left: 'С', right: 'S' },
          { left: 'У', right: 'OU' },
        ],
        explanation: 'Ces cinq lettres sont les faux amis classiques de l\'alphabet cyrillique.',
      },
    ],
  },
  {
    id: 'phonetics-special',
    title: 'Sons spéciaux : Ы, Ъ, Ь',
    titleRu: 'Фонетика',
    module: 'phonetics',
    order: 2,
    xpReward: 60,
    prerequisites: ['alphabet-intro'],
    intro: 'Trois lettres n\'ont pas d\'équivalent en français. Maîtrisez-les et vous sonnerez authentiquement russe !',
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
        heading: 'Ь — le signe mou',
        body: 'Le signe mou ne se prononce pas seul, mais "ramollit" la consonne qui le précède — un peu comme ajouter un Y après la consonne. La différence est subtile mais audible.',
        examples: [
          { ru: 'мать', translit: "mat'", fr: 'mère (ть = t mouillé)' },
          { ru: 'день', translit: "den'", fr: 'jour' },
          { ru: 'пять', translit: "pyat'", fr: 'cinq' },
        ],
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
        id: 'ph-e2', type: 'mcq',
        question: 'Le son Ы ressemble le plus à :',
        options: ['I comme dans "île"', 'I prononcé avec la langue en arrière', 'U comme dans "lune"', 'OU comme dans "loup"'],
        correct: 1,
        explanation: 'Ы est un "i" prononcé avec la langue reculée — unique au russe !',
      },
      {
        id: 'ph-e3', type: 'mcq',
        question: 'Dans quel mot trouve-t-on un signe dur Ъ ?',
        options: ['мать', 'объект', 'рыба', 'день'],
        correct: 1,
        explanation: 'объект (objet) contient un Ъ entre об- et -ъект.',
      },
      {
        id: 'ph-e4', type: 'fill',
        question: 'Le mot "мы" (nous) contient la voyelle spéciale ___',
        correct: 'ы',
        hint: 'C\'est la voyelle du fond',
      },
    ],
  },
  {
    id: 'grammar-gender',
    title: 'Les genres grammaticaux',
    titleRu: 'Род существительных',
    module: 'grammar',
    order: 3,
    xpReward: 70,
    prerequisites: ['alphabet-intro'],
    intro: 'En russe, chaque nom a un genre : masculin, féminin ou neutre. Heureusement, les terminaisons le trahissent presque toujours !',
    sections: [
      {
        heading: 'La règle des terminaisons',
        body: 'Regardez la dernière lettre du nom :',
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
        id: 'gr-e1', type: 'mcq',
        question: 'Quel est le genre de "стол" (table) ?',
        options: ['Masculin', 'Féminin', 'Neutre', 'Impossible à savoir'],
        correct: 0,
        explanation: 'стол se termine par une consonne → masculin.',
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
        id: 'gr-e4', type: 'mcq',
        question: 'Quelle terminaison d\'adjectif pour "красный" (rouge) devant un nom féminin ?',
        options: ['-ый / -ий', '-ая / -яя', '-ое / -ее', '-ые / -ие'],
        correct: 1,
        explanation: 'Féminin → красная. Les adjectifs s\'accordent en genre !',
      },
      {
        id: 'gr-e5', type: 'fill',
        question: '"море" (mer) se termine par -е donc son genre est ___',
        correct: 'neutre',
        hint: '-о/-е = ?',
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
  },
  {
    id: 'grammar-cases',
    title: 'Nominatif & Accusatif',
    titleRu: 'Именительный и Винительный падежи',
    module: 'grammar',
    order: 4,
    xpReward: 80,
    prerequisites: ['grammar-gender'],
    intro: 'Le russe utilise des "cas" pour indiquer le rôle d\'un mot dans la phrase. Commençons par les deux plus fondamentaux.',
    sections: [
      {
        heading: 'Le Nominatif — le sujet',
        body: 'Le nominatif désigne le sujet de la phrase. C\'est la forme de base que vous trouvez dans le dictionnaire.',
        examples: [
          { ru: 'Кот спит.', translit: 'Kot spit.', fr: 'Le chat dort.' },
          { ru: 'Мама готовит.', translit: 'Mama gotovit.', fr: 'Maman cuisine.' },
        ],
      },
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
      {
        id: 'cas-e4', type: 'mcq',
        question: 'Dans "Кот пьёт молоко" (Le chat boit du lait), quel est le sujet ?',
        options: ['молоко', 'пьёт', 'кот', 'Pas de sujet'],
        correct: 2,
        explanation: 'кот est au nominatif — c\'est lui qui effectue l\'action de boire.',
      },
    ],
  },
  {
    id: 'grammar-verbs',
    title: 'Présent des verbes réguliers',
    titleRu: 'Глаголы — настоящее время',
    module: 'grammar',
    order: 5,
    xpReward: 90,
    prerequisites: ['grammar-gender'],
    intro: 'Les verbes russes se conjuguent selon la personne. Il existe deux conjugaisons principales. Commençons par la 1ère conjugaison avec читать (lire).',
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
        id: 'vb-e2', type: 'fill',
        question: 'Я ___ по-русски. (Je parle russe.) — Conjuguez "говорить" pour я.',
        correct: 'говорю',
        hint: 'Conjugaison 2 : я → -ю',
      },
      {
        id: 'vb-e3', type: 'mcq',
        question: 'Traduisez : "Мы читаем книгу."',
        options: ['Je lis un livre.', 'Vous lisez un livre.', 'Nous lisons un livre.', 'Ils lisent un livre.'],
        correct: 2,
        explanation: 'мы = nous, читаем = lisons (1ère pers. pl.).',
      },
      {
        id: 'vb-e4', type: 'mcq',
        question: 'Quelle terminaison pour "ты" dans la conjugaison 1 ?',
        options: ['-ю', '-ешь', '-ет', '-ем'],
        correct: 1,
        explanation: 'ты читаешь — la terminaison -ешь est typique de "tu" au présent.',
      },
    ],
  },
  {
    id: 'numbers-cardinal',
    title: 'Les chiffres 0 à 100',
    titleRu: 'Числа',
    module: 'numbers',
    order: 6,
    xpReward: 60,
    prerequisites: ['alphabet-intro'],
    intro: 'Compter en russe suit une logique simple une fois les nombres de base mémorisés — les dizaines et centaines se construisent à partir d\'eux.',
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
        id: 'num-e4', type: 'mcq',
        question: 'Avec "2, 3 ou 4", le nom qui suit prend :',
        options: ['Le nominatif pluriel', 'Une forme spéciale (génitif singulier)', 'Le génitif pluriel', 'Aucun changement'],
        correct: 1,
        explanation: 'Règle A1 simplifiée : 2/3/4 + génitif singulier (ex. два стола).',
      },
      {
        id: 'num-e5', type: 'mcq',
        question: '"Пять столов" (5 tables) — quelle forme prend "стол" ?',
        options: ['Nominatif singulier', 'Génitif singulier', 'Génitif pluriel', 'Accusatif'],
        correct: 2,
        explanation: '"5" et plus → génitif pluriel : столов.',
      },
      {
        id: 'num-e6', type: 'match',
        question: 'Associez chaque chiffre à son écriture en russe.',
        pairs: [
          { left: '1', right: 'один' },
          { left: '5', right: 'пять' },
          { left: '10', right: 'десять' },
          { left: '20', right: 'двадцать' },
          { left: '100', right: 'сто' },
        ],
      },
    ],
  },
];
