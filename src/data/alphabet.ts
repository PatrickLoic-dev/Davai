export type LetterCategory = 'vowel' | 'consonant' | 'semivowel' | 'sign';

export interface CyrillicLetter {
  upper: string;
  lower: string;
  name: string;
  ipa: string;
  romanized: string;
  example: string;
  exampleTranslit: string;
  translation: string;
  category: LetterCategory;
  lookalike?: string;
  tip?: string;
}

export const CATEGORY_COLOR: Record<LetterCategory, string> = {
  vowel:     '#00D4B8', // teal
  consonant: '#E8294C', // red
  semivowel: '#7C3AED', // violet
  sign:      '#FFB800', // gold
};

export const CATEGORY_BG: Record<LetterCategory, string> = {
  vowel:     'rgba(0,212,184,0.12)',
  consonant: 'rgba(232,41,76,0.12)',
  semivowel: 'rgba(124,58,237,0.12)',
  sign:      'rgba(255,184,0,0.12)',
};

export const CATEGORY_LABEL: Record<LetterCategory, string> = {
  vowel:     'Voyelle',
  consonant: 'Consonne',
  semivowel: 'Semi-voyelle',
  sign:      'Signe',
};

export const ALPHABET: CyrillicLetter[] = [
  {
    upper: 'А', lower: 'а', name: 'А', ipa: '/a/', romanized: 'a',
    example: 'аист', exampleTranslit: 'aist', translation: 'cigogne',
    category: 'vowel', lookalike: 'A',
    tip: 'Identique au A latin — la lettre la plus facile !',
  },
  {
    upper: 'Б', lower: 'б', name: 'Б', ipa: '/b/', romanized: 'b',
    example: 'банан', exampleTranslit: 'banan', translation: 'banane',
    category: 'consonant',
    tip: 'Ressemble à un 6 à l\'envers.',
  },
  {
    upper: 'В', lower: 'в', name: 'В', ipa: '/v/', romanized: 'v',
    example: 'вода', exampleTranslit: 'voda', translation: 'eau',
    category: 'consonant', lookalike: 'B',
    tip: 'Ressemble au B latin mais se prononce V.',
  },
  {
    upper: 'Г', lower: 'г', name: 'Г', ipa: '/ɡ/', romanized: 'g',
    example: 'город', exampleTranslit: 'gorod', translation: 'ville',
    category: 'consonant',
    tip: 'Ressemble à un Γ grec.',
  },
  {
    upper: 'Д', lower: 'д', name: 'Д', ipa: '/d/', romanized: 'd',
    example: 'дом', exampleTranslit: 'dom', translation: 'maison',
    category: 'consonant',
    tip: 'Ressemble à une tente ou au delta grec Δ.',
  },
  {
    upper: 'Е', lower: 'е', name: 'Е', ipa: '/jɛ/', romanized: 'ye',
    example: 'ехать', exampleTranslit: 'yekhat\'', translation: 'aller',
    category: 'vowel', lookalike: 'E',
    tip: 'Ressemble au E latin mais se prononce "yé".',
  },
  {
    upper: 'Ё', lower: 'ё', name: 'Ё', ipa: '/jo/', romanized: 'yo',
    example: 'ёлка', exampleTranslit: 'yolka', translation: 'sapin',
    category: 'vowel',
    tip: 'Comme Е mais avec un tréma — se prononce "yo".',
  },
  {
    upper: 'Ж', lower: 'ж', name: 'Ж', ipa: '/ʐ/', romanized: 'zh',
    example: 'жизнь', exampleTranslit: 'zhizn\'', translation: 'vie',
    category: 'consonant',
    tip: 'Ressemble à un insecte avec des pattes. Comme le J dans "journal".',
  },
  {
    upper: 'З', lower: 'з', name: 'З', ipa: '/z/', romanized: 'z',
    example: 'зима', exampleTranslit: 'zima', translation: 'hiver',
    category: 'consonant', lookalike: '3',
    tip: 'Ressemble au chiffre 3 — se prononce Z.',
  },
  {
    upper: 'И', lower: 'и', name: 'И', ipa: '/i/', romanized: 'i',
    example: 'имя', exampleTranslit: 'imya', translation: 'prénom',
    category: 'vowel',
    tip: 'Comme le N latin mais à l\'envers. Se prononce "i".',
  },
  {
    upper: 'Й', lower: 'й', name: 'Й краткое', ipa: '/j/', romanized: 'y',
    example: 'йога', exampleTranslit: 'yoga', translation: 'yoga',
    category: 'semivowel',
    tip: 'И court — comme le Y dans "yeux". Toujours suivi ou précédé d\'une voyelle.',
  },
  {
    upper: 'К', lower: 'к', name: 'К', ipa: '/k/', romanized: 'k',
    example: 'кот', exampleTranslit: 'kot', translation: 'chat',
    category: 'consonant', lookalike: 'K',
    tip: 'Identique au K latin !',
  },
  {
    upper: 'Л', lower: 'л', name: 'Л', ipa: '/l/', romanized: 'l',
    example: 'лев', exampleTranslit: 'lev', translation: 'lion',
    category: 'consonant',
    tip: 'Ressemble au lambda grec Λ. Se prononce L.',
  },
  {
    upper: 'М', lower: 'м', name: 'М', ipa: '/m/', romanized: 'm',
    example: 'мама', exampleTranslit: 'mama', translation: 'maman',
    category: 'consonant', lookalike: 'M',
    tip: 'Identique au M latin !',
  },
  {
    upper: 'Н', lower: 'н', name: 'Н', ipa: '/n/', romanized: 'n',
    example: 'нос', exampleTranslit: 'nos', translation: 'nez',
    category: 'consonant', lookalike: 'H',
    tip: 'Ressemble au H latin mais se prononce N.',
  },
  {
    upper: 'О', lower: 'о', name: 'О', ipa: '/o/', romanized: 'o',
    example: 'окно', exampleTranslit: 'okno', translation: 'fenêtre',
    category: 'vowel', lookalike: 'O',
    tip: 'Identique au O latin !',
  },
  {
    upper: 'П', lower: 'п', name: 'П', ipa: '/p/', romanized: 'p',
    example: 'папа', exampleTranslit: 'papa', translation: 'papa',
    category: 'consonant',
    tip: 'Ressemble au pi grec π. Se prononce P.',
  },
  {
    upper: 'Р', lower: 'р', name: 'Р', ipa: '/r/', romanized: 'r',
    example: 'рыба', exampleTranslit: 'ryba', translation: 'poisson',
    category: 'consonant', lookalike: 'P',
    tip: 'Ressemble au P latin mais se prononce R (roulé).',
  },
  {
    upper: 'С', lower: 'с', name: 'С', ipa: '/s/', romanized: 's',
    example: 'сон', exampleTranslit: 'son', translation: 'rêve',
    category: 'consonant', lookalike: 'C',
    tip: 'Ressemble au C latin mais se prononce toujours S.',
  },
  {
    upper: 'Т', lower: 'т', name: 'Т', ipa: '/t/', romanized: 't',
    example: 'тигр', exampleTranslit: 'tigr', translation: 'tigre',
    category: 'consonant', lookalike: 'T',
    tip: 'Ressemble au T latin (minuscule = m inversé sans la barre centrale).',
  },
  {
    upper: 'У', lower: 'у', name: 'У', ipa: '/u/', romanized: 'u',
    example: 'утка', exampleTranslit: 'utka', translation: 'canard',
    category: 'vowel', lookalike: 'Y',
    tip: 'Ressemble au Y latin mais se prononce "ou".',
  },
  {
    upper: 'Ф', lower: 'ф', name: 'Ф', ipa: '/f/', romanized: 'f',
    example: 'фото', exampleTranslit: 'foto', translation: 'photo',
    category: 'consonant',
    tip: 'Ressemble à un phi grec φ. Se prononce F.',
  },
  {
    upper: 'Х', lower: 'х', name: 'Х', ipa: '/x/', romanized: 'kh',
    example: 'хлеб', exampleTranslit: 'khleb', translation: 'pain',
    category: 'consonant', lookalike: 'X',
    tip: 'Ressemble au X latin mais se prononce comme le ch allemand (Bach).',
  },
  {
    upper: 'Ц', lower: 'ц', name: 'Ц', ipa: '/ts/', romanized: 'ts',
    example: 'цирк', exampleTranslit: 'tsirk', translation: 'cirque',
    category: 'consonant',
    tip: 'Se prononce "ts" comme dans "tsar".',
  },
  {
    upper: 'Ч', lower: 'ч', name: 'Ч', ipa: '/tɕ/', romanized: 'tch',
    example: 'чай', exampleTranslit: 'tchai', translation: 'thé',
    category: 'consonant',
    tip: 'Se prononce "tch" comme dans "tchèque". Toujours doux.',
  },
  {
    upper: 'Ш', lower: 'ш', name: 'Ш', ipa: '/ʂ/', romanized: 'ch',
    example: 'шар', exampleTranslit: 'char', translation: 'ballon',
    category: 'consonant',
    tip: 'Se prononce "ch" comme dans "chat". Toujours dur.',
  },
  {
    upper: 'Щ', lower: 'щ', name: 'Щ', ipa: '/ɕː/', romanized: 'chtch',
    example: 'щука', exampleTranslit: 'chtchouka', translation: 'brochet',
    category: 'consonant',
    tip: 'Se prononce "chtch" — plus long et plus doux que Ш.',
  },
  {
    upper: 'Ъ', lower: 'ъ', name: 'Твёрдый знак', ipa: '(signe dur)', romanized: 'ʺ',
    example: 'объект', exampleTranslit: 'obʺyekt', translation: 'objet',
    category: 'sign',
    tip: 'Signe dur : sépare une consonne d\'une voyelle sans les ramollir. Ne se prononce pas.',
  },
  {
    upper: 'Ы', lower: 'ы', name: 'Ы', ipa: '/ɨ/', romanized: 'y',
    example: 'рыба', exampleTranslit: 'ryba', translation: 'poisson',
    category: 'vowel',
    tip: 'Son unique au russe — comme un "i" prononcé avec la langue en arrière.',
  },
  {
    upper: 'Ь', lower: 'ь', name: 'Мягкий знак', ipa: '(signe mou)', romanized: 'ʼ',
    example: 'мать', exampleTranslit: 'mat\'', translation: 'mère',
    category: 'sign',
    tip: 'Signe mou : ramollit la consonne précédente. Ne se prononce pas seul.',
  },
  {
    upper: 'Э', lower: 'э', name: 'Э', ipa: '/ɛ/', romanized: 'é',
    example: 'это', exampleTranslit: 'éto', translation: 'ceci',
    category: 'vowel',
    tip: 'Se prononce "é" comme dans "été", sans le son Y initial de Е.',
  },
  {
    upper: 'Ю', lower: 'ю', name: 'Ю', ipa: '/ju/', romanized: 'you',
    example: 'юг', exampleTranslit: 'youg', translation: 'sud',
    category: 'vowel',
    tip: 'Se prononce "you" comme dans "yourte".',
  },
  {
    upper: 'Я', lower: 'я', name: 'Я', ipa: '/ja/', romanized: 'ya',
    example: 'яблоко', exampleTranslit: 'yabloko', translation: 'pomme',
    category: 'vowel',
    tip: 'Se prononce "ya" et signifie aussi "je" en russe !',
  },
];

export const ALPHABET_QUIZ_POOL = ALPHABET.filter(l => l.category !== 'sign');
