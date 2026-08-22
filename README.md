<div align="center">

<img src="src/imports/logo-bear.svg" width="120" height="120" alt="Davai logo" />

# Davai

**Apprenez le russe, gratuitement, de zéro à la fluidité.**

Alphabet cyrillique · Vocabulaire · Grammaire · Exercices · Progression gamifiée

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_DB-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contribuer)

</div>

---

## Pourquoi Davai ?

Apprendre le russe est souvent présenté comme intimidant : un alphabet différent, des cas grammaticaux, une prononciation exigeante. **Davai** décompose tout ça en un parcours structuré, gratuit et open source — sans mur payant, sans compte obligatoire pour commencer à apprendre.

Le nom vient du russe **давай** — une interjection familière qui veut dire *« allez, go ! »*. C'est l'esprit du projet : on avance, une leçon à la fois.

## Fonctionnalités

### 📚 Apprentissage
- **Alphabet cyrillique interactif** — 33 lettres classées par catégorie (voyelles, consonnes, semi-voyelles, signes), avec IPA, romanisation, ressemblances avec le latin, exemples audio et quiz de reconnaissance
- **Vocabulaire thématique** — flashcards avec répétition espacée (SRS), 5 thèmes de départ (salutations, chiffres, couleurs, nourriture, famille)
- **Grammaire progressive** — genres, accord des adjectifs, cas nominatif/accusatif, conjugaison au présent, chiffres 0–100 et règles d'accord — chaque leçon avec explications, tableaux et exemples en contexte
- **Exercices** — QCM et textes à trous, par leçon ou en mix aléatoire
- **Prononciation audio** — synthèse vocale native pour chaque lettre, mot et exemple

### 🎮 Progression & gamification
- Parcours A1 structuré en 8 étapes, avec déblocage progressif par prérequis
- XP, niveaux, streak quotidien avec calendrier visuel
- Badges de gratification (premiers pas, séries de jours, maîtrise d'un module...)
- Tableau de bord de progression en temps réel

### 👤 Comptes utilisateurs
- Inscription / connexion par email ou Google (via Supabase Auth)
- Progression synchronisée dans le cloud (XP, streak, leçons terminées, cartes apprises, badges) — utilisable aussi sans compte, en local

## Aperçu technique

| | |
|---|---|
| **Frontend** | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) + [Vite](https://vite.dev) |
| **Style** | [Tailwind CSS v4](https://tailwindcss.com) |
| **Icônes** | [Lucide](https://lucide.dev) |
| **Backend** | [Supabase](https://supabase.com) (Auth + Postgres + Edge Functions + Storage) |
| **Voix** | [ElevenLabs](https://elevenlabs.io) via une Edge Function (cache permanent en Storage), repli automatique sur la Web Speech API du navigateur |

## Démarrer en local

### Prérequis
- [Node.js](https://nodejs.org) 18+
- (optionnel) un projet [Supabase](https://supabase.com) pour les comptes utilisateurs

### Installation

```bash
git clone https://github.com/PatrickLoic-dev/Davai.git
cd Davai
npm install
```

### Variables d'environnement (optionnel)

L'app fonctionne sans backend — la progression est alors stockée uniquement dans le `localStorage` du navigateur. Pour activer les comptes utilisateurs et la synchronisation cloud :

1. Crée un projet sur [supabase.com](https://supabase.com)
2. Copie `.env.example` vers `.env` et renseigne tes clés :
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=ta-cle-anon
   ```
3. Exécute [`supabase/schema.sql`](./supabase/schema.sql) dans l'éditeur SQL de ton projet (Project → SQL Editor → New query) — crée la table de progression **et** le bucket de cache audio

### Activer la prononciation audio (optionnel)

Sans configuration, l'app retombe automatiquement sur la synthèse vocale du navigateur (qualité et fiabilité variables selon le système). Pour une prononciation russe de bien meilleure qualité, fiable sur tous les navigateurs :

1. Crée un compte gratuit sur [elevenlabs.io](https://elevenlabs.io) et récupère une clé API (Profile → API Keys)
2. Installe la CLI Supabase et connecte-toi :
   ```bash
   npm install -g supabase
   supabase login
   supabase link --project-ref ton-project-ref
   ```
3. Enregistre la clé comme secret (jamais exposée au client) :
   ```bash
   supabase secrets set ELEVENLABS_API_KEY=ta-cle-elevenlabs
   ```
4. Déploie la fonction :
   ```bash
   supabase functions deploy tts
   ```

Chaque texte n'est synthétisé qu'une seule fois — les appels suivants (de n'importe quel utilisateur) réutilisent le fichier mis en cache dans Supabase Storage, ce qui garde la consommation ElevenLabs minimale.

### Lancer le serveur de dev

```bash
npm run dev
```

L'app est accessible sur `http://localhost:8443`.

### Autres commandes

```bash
npm run build     # build de production
npm run preview   # prévisualiser le build
npm run format    # formater le code avec oxfmt
npm test          # tests unitaires (Vitest)
```

## Structure du projet

```
src/
  components/     composants UI (modules d'apprentissage, navigation, écrans)
  contexts/       état global (UserContext : XP, streak, badges, progression)
  data/           contenu pédagogique (alphabet, vocabulaire, leçons, badges)
  lib/            client Supabase
  utils/          utilitaires (synthèse vocale)
supabase/
  schema.sql      schéma de base de données (table progress + RLS + bucket tts-cache)
  functions/tts/  Edge Function : synthèse vocale ElevenLabs avec cache permanent
```

## Feuille de route

- [ ] Plus de thèmes de vocabulaire et de leçons de grammaire (cas datif, instrumental, prépositionnel, aspect verbal, verbes de mouvement)
- [ ] Compréhension orale et écrite (textes gradués A1 → B2)
- [ ] Reconnaissance vocale pour la prononciation
- [ ] Mode hors-ligne (PWA)
- [ ] Internationalisation de l'interface (au-delà du français)
- [ ] Contenu culturel (histoire, coutumes, expressions)

Une idée qui n'est pas dans la liste ? [Ouvre une issue](https://github.com/PatrickLoic-dev/Davai/issues) !

## Contribuer

Les contributions sont les bienvenues, qu'il s'agisse de code, de contenu pédagogique, de corrections ou de suggestions.

### Étapes

1. **Fork** le dépôt et clone ta copie
2. Crée une branche descriptive : `git checkout -b feature/vocab-animaux` ou `fix/quiz-score`
3. Installe les dépendances et lance le serveur de dev (voir [Démarrer en local](#démarrer-en-local))
4. Fais tes changements en respectant le style existant (TypeScript strict, composants fonctionnels, styles inline cohérents avec les variables CSS de `src/index.css`)
5. Vérifie que le typecheck et les tests passent :
   ```bash
   npx tsc --noEmit
   npm test
   ```
6. Commit avec un message clair, push, puis ouvre une **Pull Request** avec une description du changement (et une capture d'écran si c'est visuel)

### Contribuer du contenu pédagogique

C'est la façon la plus simple de contribuer sans toucher au code applicatif — tout le contenu vit dans `src/data/` sous forme de fichiers TypeScript typés :

| Fichier | Contenu |
|---|---|
| `src/data/alphabet.ts` | Les 33 lettres cyrilliques (IPA, romanisation, exemples) |
| `src/data/vocabulary.ts` | Mots de vocabulaire, organisés par thème |
| `src/data/lessons.ts` | Leçons de grammaire (sections, tableaux, exercices) |
| `src/data/badges.ts` | Badges et leurs conditions de déblocage |

Respecte les interfaces TypeScript existantes en tête de chaque fichier, et ajoute des exemples cohérents (mot russe, translittération, traduction française).

### Signaler un bug ou proposer une idée

Ouvre une [issue GitHub](https://github.com/PatrickLoic-dev/Davai/issues) en décrivant :
- **Bug** : comportement observé vs attendu, étapes pour reproduire
- **Idée** : le besoin ou le problème que ça résout, pas seulement la solution

### Code de conduite

Sois respectueux et bienveillant. Ce projet existe pour aider des gens à apprendre une langue difficile — gardons cet esprit dans les échanges, en code review comme en discussion.

## Licence

Distribué sous licence [MIT](./LICENSE) — utilise, modifie et redistribue librement.

---

<div align="center">
<sub>Fait avec le coeur par <a href="https://github.com/PatrickLoic-dev">Patrick Loïc</a> pour l'amour de la langue.</sub>
</div>
