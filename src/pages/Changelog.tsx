import { AppLogo } from '../components/Logo';

interface Entry {
  version: string;
  date: string;
  tag: 'Nouveau' | 'Amélioré' | 'Corrigé';
  items: string[];
}

const TAG_COLOR: Record<Entry['tag'], string> = {
  Nouveau: '#16A34A',
  Amélioré: '#0891B2',
  Corrigé: '#DC2626',
};

const ENTRIES: Entry[] = [
  {
    version: '1.2.0',
    date: '22 août 2026',
    tag: 'Corrigé',
    items: [
      "Le bouton « Connexion » ouvrait par erreur l'écran de création de compte — il ouvre maintenant le bon formulaire.",
      "La connexion avec Google renvoyait parfois vers la page d'accueil sans connecter l'utilisateur — le retour après authentification est désormais fiable.",
      "L'onboarding pouvait être sauté à tort pour un nouveau compte s'il avait déjà été complété par un autre compte sur le même navigateur — il est maintenant rattaché à chaque compte individuellement.",
    ],
  },
  {
    version: '1.1.0',
    date: '21 août 2026',
    tag: 'Nouveau',
    items: [
      'Barre de navigation flottante sur la page d\'accueil.',
      "Favicon et métadonnées (titre, description, aperçus de partage) pour un meilleur référencement et un partage soigné sur les réseaux.",
      'Comptes utilisateurs réels : inscription et connexion par email ou Google, progression synchronisée dans le cloud.',
      'Détection des voix de synthèse vocale disponibles, pour éviter un bouton audio silencieux sans message.',
    ],
  },
  {
    version: '1.0.0',
    date: '20 août 2026',
    tag: 'Nouveau',
    items: [
      'Première version publique : alphabet cyrillique interactif, vocabulaire thématique avec répétition espacée, leçons de grammaire, exercices, parcours A1 gamifié avec XP, niveaux, streak et badges.',
      'Leçon « Les chiffres 0 à 100 » ajoutée au parcours.',
      'Documentation complète (README, licence MIT, guide de contribution).',
    ],
  },
];

export default function Changelog() {
  return (
    <div style={{ minHeight: '100%', overflowY: 'auto', background: 'white' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: 'clamp(1.5rem, 5vw, 3rem) clamp(1.25rem, 5vw, 2rem) 4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <AppLogo size={28} textSize="0.92rem" />
          </a>
          <a
            href="/"
            style={{ fontSize: '0.85rem', color: '#737373', textDecoration: 'none', border: '1px solid #E8E8E8', borderRadius: '100px', padding: '0.45rem 1rem' }}
          >
            ← Retour à l'accueil
          </a>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 2.75rem)', color: '#0A0A0A', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
          Changelog
        </h1>
        <p style={{ color: '#737373', fontSize: '1rem', margin: '0 0 3rem' }}>
          Tout ce qui change sur Davai, au fil des mises à jour.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {ENTRIES.map(entry => (
            <div key={entry.version} style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid #EBEBEB' }}>
              <div
                style={{
                  position: 'absolute', left: '-7px', top: '4px',
                  width: '12px', height: '12px', borderRadius: '50%',
                  background: TAG_COLOR[entry.tag], border: '2px solid white', boxShadow: '0 0 0 1px #EBEBEB',
                }}
                aria-hidden="true"
              />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', color: '#0A0A0A' }}>
                  v{entry.version}
                </span>
                <span
                  style={{
                    fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                    color: TAG_COLOR[entry.tag], background: `${TAG_COLOR[entry.tag]}15`,
                    borderRadius: '100px', padding: '2px 10px',
                  }}
                >
                  {entry.tag}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#A3A3A3', fontFamily: 'var(--font-mono)' }}>{entry.date}</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {entry.items.map((item, i) => (
                  <li key={i} style={{ color: '#4A4A4A', fontSize: '0.92rem', lineHeight: 1.65 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
