export interface VocabCard {
  id: string;
  russian: string;
  ipa: string;
  french: string;
  exampleRu: string;
  exampleFr: string;
  gender?: 'м' | 'ж' | 'с'; // masculine, feminine, neuter
}

export interface VocabTheme {
  id: string;
  title: string;
  titleRu: string;
  emoji: string;
  color: string;
  bgColor: string;
  cards: VocabCard[];
}

export const VOCAB_THEMES: VocabTheme[] = [
  {
    id: 'greetings',
    title: 'Salutations',
    titleRu: 'Приветствия',
    emoji: '👋',
    color: '#00D4B8',
    bgColor: 'rgba(0,212,184,0.1)',
    cards: [
      { id: 'g1', russian: 'Привет', ipa: '/pri-vyét/', french: 'Salut', exampleRu: 'Привет, как дела?', exampleFr: 'Salut, comment ça va ?' },
      { id: 'g2', russian: 'Здравствуйте', ipa: '/zdrást-vouy-tye/', french: 'Bonjour (formel)', exampleRu: 'Здравствуйте, рад вас видеть.', exampleFr: 'Bonjour, ravi de vous voir.' },
      { id: 'g3', russian: 'Пока', ipa: '/pa-ká/', french: 'Au revoir', exampleRu: 'Пока, до встречи!', exampleFr: 'Au revoir, à bientôt !' },
      { id: 'g4', russian: 'Спасибо', ipa: '/spa-sí-ba/', french: 'Merci', exampleRu: 'Большое спасибо!', exampleFr: 'Merci beaucoup !' },
      { id: 'g5', russian: 'Пожалуйста', ipa: '/pa-zhá-louy-sta/', french: 'S\'il vous plaît / De rien', exampleRu: 'Дайте, пожалуйста, воду.', exampleFr: 'Donnez-moi de l\'eau, s\'il vous plaît.' },
      { id: 'g6', russian: 'Да', ipa: '/da/', french: 'Oui', exampleRu: 'Да, я понимаю.', exampleFr: 'Oui, je comprends.' },
      { id: 'g7', russian: 'Нет', ipa: '/nyét/', french: 'Non', exampleRu: 'Нет, спасибо.', exampleFr: 'Non, merci.' },
      { id: 'g8', russian: 'Извините', ipa: '/iz-vi-ní-tye/', french: 'Excusez-moi', exampleRu: 'Извините, где метро?', exampleFr: 'Excusez-moi, où est le métro ?' },
    ],
  },
  {
    id: 'numbers',
    title: 'Chiffres',
    titleRu: 'Числа',
    emoji: '🔢',
    color: '#E8294C',
    bgColor: 'rgba(232,41,76,0.1)',
    cards: [
      { id: 'n1', russian: 'один', ipa: '/a-dín/', french: '1', exampleRu: 'Один кофе, пожалуйста.', exampleFr: 'Un café, s\'il vous plaît.' },
      { id: 'n2', russian: 'два', ipa: '/dva/', french: '2', exampleRu: 'Нас двое.', exampleFr: 'Nous sommes deux.' },
      { id: 'n3', russian: 'три', ipa: '/tri/', french: '3', exampleRu: 'Три часа.', exampleFr: 'Trois heures.' },
      { id: 'n4', russian: 'четыре', ipa: '/tché-ty-rye/', french: '4', exampleRu: 'Четыре сезона.', exampleFr: 'Quatre saisons.' },
      { id: 'n5', russian: 'пять', ipa: '/pyat\'/', french: '5', exampleRu: 'Пять минут.', exampleFr: 'Cinq minutes.' },
      { id: 'n6', russian: 'десять', ipa: '/dyé-syat\'/', french: '10', exampleRu: 'Десять рублей.', exampleFr: 'Dix roubles.' },
      { id: 'n7', russian: 'двадцать', ipa: '/dvá-tsat\'/', french: '20', exampleRu: 'Двадцать лет.', exampleFr: 'Vingt ans.' },
      { id: 'n8', russian: 'сто', ipa: '/sto/', french: '100', exampleRu: 'Сто процентов.', exampleFr: 'Cent pourcent.' },
    ],
  },
  {
    id: 'colors',
    title: 'Couleurs',
    titleRu: 'Цвета',
    emoji: '🎨',
    color: '#7C3AED',
    bgColor: 'rgba(124,58,237,0.1)',
    cards: [
      { id: 'c1', russian: 'красный', ipa: '/krás-nyy/', french: 'rouge', gender: 'м', exampleRu: 'Красный цвет.', exampleFr: 'La couleur rouge.' },
      { id: 'c2', russian: 'синий', ipa: '/sí-nyy/', french: 'bleu (foncé)', gender: 'м', exampleRu: 'Синее небо.', exampleFr: 'Le ciel bleu.' },
      { id: 'c3', russian: 'зелёный', ipa: '/zyé-lyó-nyy/', french: 'vert', gender: 'м', exampleRu: 'Зелёная трава.', exampleFr: 'L\'herbe verte.' },
      { id: 'c4', russian: 'белый', ipa: '/byé-lyy/', french: 'blanc', gender: 'м', exampleRu: 'Белый снег.', exampleFr: 'La neige blanche.' },
      { id: 'c5', russian: 'чёрный', ipa: '/tchyór-nyy/', french: 'noir', gender: 'м', exampleRu: 'Чёрная кошка.', exampleFr: 'Le chat noir.' },
      { id: 'c6', russian: 'жёлтый', ipa: '/zhyól-tyy/', french: 'jaune', gender: 'м', exampleRu: 'Жёлтое солнце.', exampleFr: 'Le soleil jaune.' },
      { id: 'c7', russian: 'оранжевый', ipa: '/a-rán-zhe-vyy/', french: 'orange', gender: 'м', exampleRu: 'Оранжевый закат.', exampleFr: 'Le coucher de soleil orange.' },
      { id: 'c8', russian: 'розовый', ipa: '/ró-za-vyy/', french: 'rose', gender: 'м', exampleRu: 'Розовые цветы.', exampleFr: 'Les fleurs roses.' },
    ],
  },
  {
    id: 'food',
    title: 'Nourriture',
    titleRu: 'Еда',
    emoji: '🍽️',
    color: '#FFB800',
    bgColor: 'rgba(255,184,0,0.1)',
    cards: [
      { id: 'f1', russian: 'хлеб', ipa: '/khleb/', french: 'pain', gender: 'м', exampleRu: 'Свежий хлеб.', exampleFr: 'Du pain frais.' },
      { id: 'f2', russian: 'вода', ipa: '/va-dá/', french: 'eau', gender: 'ж', exampleRu: 'Холодная вода.', exampleFr: 'De l\'eau froide.' },
      { id: 'f3', russian: 'молоко', ipa: '/ma-la-kó/', french: 'lait', gender: 'с', exampleRu: 'Стакан молока.', exampleFr: 'Un verre de lait.' },
      { id: 'f4', russian: 'яблоко', ipa: '/yáb-la-ka/', french: 'pomme', gender: 'с', exampleRu: 'Красное яблоко.', exampleFr: 'Une pomme rouge.' },
      { id: 'f5', russian: 'мясо', ipa: '/myá-sa/', french: 'viande', gender: 'с', exampleRu: 'Жареное мясо.', exampleFr: 'De la viande grillée.' },
      { id: 'f6', russian: 'рыба', ipa: '/ry-ba/', french: 'poisson', gender: 'ж', exampleRu: 'Свежая рыба.', exampleFr: 'Du poisson frais.' },
      { id: 'f7', russian: 'суп', ipa: '/soup/', french: 'soupe', gender: 'м', exampleRu: 'Горячий суп.', exampleFr: 'Une soupe chaude.' },
      { id: 'f8', russian: 'чай', ipa: '/tchaï/', french: 'thé', gender: 'м', exampleRu: 'Чай с лимоном.', exampleFr: 'Du thé au citron.' },
    ],
  },
  {
    id: 'family',
    title: 'Famille',
    titleRu: 'Семья',
    emoji: '👨‍👩‍👧',
    color: '#22C55E',
    bgColor: 'rgba(34,197,94,0.1)',
    cards: [
      { id: 'fa1', russian: 'мама', ipa: '/má-ma/', french: 'maman', gender: 'ж', exampleRu: 'Моя мама работает.', exampleFr: 'Ma mère travaille.' },
      { id: 'fa2', russian: 'папа', ipa: '/pá-pa/', french: 'papa', gender: 'м', exampleRu: 'Мой папа дома.', exampleFr: 'Mon père est à la maison.' },
      { id: 'fa3', russian: 'брат', ipa: '/brat/', french: 'frère', gender: 'м', exampleRu: 'Мой брат студент.', exampleFr: 'Mon frère est étudiant.' },
      { id: 'fa4', russian: 'сестра', ipa: '/syés-tra/', french: 'sœur', gender: 'ж', exampleRu: 'Моя сестра играет.', exampleFr: 'Ma sœur joue.' },
      { id: 'fa5', russian: 'дедушка', ipa: '/dyé-douch-ka/', french: 'grand-père', gender: 'м', exampleRu: 'Дедушка читает книгу.', exampleFr: 'Grand-père lit un livre.' },
      { id: 'fa6', russian: 'бабушка', ipa: '/bá-bouch-ka/', french: 'grand-mère', gender: 'ж', exampleRu: 'Бабушка готовит.', exampleFr: 'Grand-mère cuisine.' },
      { id: 'fa7', russian: 'сын', ipa: '/syne/', french: 'fils', gender: 'м', exampleRu: 'Её сын врач.', exampleFr: 'Son fils est médecin.' },
      { id: 'fa8', russian: 'дочь', ipa: '/dotch\'/', french: 'fille', gender: 'ж', exampleRu: 'Моя дочь учится.', exampleFr: 'Ma fille étudie.' },
    ],
  },
];

export type SRSState = 'new' | 'learning' | 'learned';
