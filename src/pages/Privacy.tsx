import { AppLogo } from '../components/Logo';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '2.25rem' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: '#0A0A0A', margin: '0 0 0.75rem' }}>
        {title}
      </h2>
      <div style={{ color: '#4A4A4A', fontSize: '0.92rem', lineHeight: 1.75, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {children}
      </div>
    </section>
  );
}

export default function Privacy() {
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
          Politique de confidentialité
        </h1>
        <p style={{ color: '#A3A3A3', fontSize: '0.85rem', margin: '0 0 2.5rem', fontFamily: 'var(--font-mono)' }}>
          Dernière mise à jour : 22 août 2026
        </p>

        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '2.5rem', fontSize: '0.85rem', color: '#92400E', lineHeight: 1.65 }}>
          Ce document est un modèle de base à usage informatif et ne constitue pas un conseil juridique
          professionnel. Pour un usage commercial ou une mise en production à grande échelle, il est
          recommandé de le faire relire par un professionnel du droit.
        </div>

        <Section title="1. Quelles données collectons-nous ?">
          <p>Davai collecte le minimum nécessaire au fonctionnement du Service :</p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li><strong>Sans compte</strong> : aucune donnée n'est envoyée à un serveur. Votre progression (XP, streak, leçons terminées, cartes apprises, badges) est stockée uniquement dans le <code>localStorage</code> de votre navigateur.</li>
            <li><strong>Avec compte</strong> : votre email, votre nom (si renseigné à l'inscription ou fourni par Google) et les mêmes données de progression, synchronisées via Supabase pour être disponibles sur tous vos appareils.</li>
          </ul>
          <p>Nous ne collectons ni données de paiement, ni données de localisation précise, ni contenu d'usage en dehors de votre progression pédagogique.</p>
        </Section>

        <Section title="2. Pourquoi collectons-nous ces données ?">
          <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Faire fonctionner l'authentification et retrouver votre compte à chaque connexion ;</li>
            <li>Sauvegarder et synchroniser votre progression (XP, niveaux, streak, badges, cartes SRS) entre appareils ;</li>
            <li>Afficher votre nom dans l'interface (barre latérale, tableau de bord).</li>
          </ul>
          <p>Aucune de ces données n'est utilisée à des fins publicitaires, revendue, ou partagée avec des tiers non mentionnés dans ce document.</p>
        </Section>

        <Section title="3. Où sont stockées vos données ?">
          <p>
            Les comptes et données de progression sont hébergés sur{' '}
            <a href="https://supabase.com" style={{ color: '#0A0A0A', fontWeight: 600 }}>Supabase</a>{' '}
            (base de données Postgres avec sécurité au niveau des lignes — chaque utilisateur ne peut lire ou
            modifier que ses propres données). Si vous vous connectez avec Google, l'authentification passe
            par les services OAuth de Google.
          </p>
          <p>
            L'application est déployée sur <a href="https://vercel.com" style={{ color: '#0A0A0A', fontWeight: 600 }}>Vercel</a>,
            qui peut collecter des journaux techniques standards (adresse IP, user-agent) à des fins
            d'infrastructure et de sécurité, indépendamment de Davai.
          </p>
        </Section>

        <Section title="4. Cookies et stockage local">
          <p>
            Davai n'utilise pas de cookies publicitaires ni de traceurs tiers. L'application utilise le{' '}
            <code>localStorage</code> de votre navigateur pour mettre en cache votre progression et votre
            session, ce qui permet à l'app de fonctionner rapidement et hors ligne pour les utilisateurs sans
            compte. Supabase peut également utiliser le stockage local pour maintenir votre session
            connectée.
          </p>
        </Section>

        <Section title="5. Combien de temps conservons-nous vos données ?">
          <p>
            Vos données sont conservées tant que votre compte est actif. Si vous supprimez votre compte, vos
            données de profil et de progression associées sont supprimées de notre base (suppression en
            cascade dans Supabase).
          </p>
        </Section>

        <Section title="6. Vos droits">
          <p>Vous disposez à tout moment du droit :</p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>D'accéder aux données associées à votre compte ;</li>
            <li>De les faire rectifier si elles sont inexactes ;</li>
            <li>De demander leur suppression ;</li>
            <li>De retirer votre consentement en supprimant simplement votre compte.</li>
          </ul>
          <p>
            Pour exercer ces droits, ouvrez une{' '}
            <a href="https://github.com/PatrickLoic-dev/Davai/issues" style={{ color: '#0A0A0A', fontWeight: 600 }}>
              issue sur GitHub
            </a>{' '}
            ou contactez le mainteneur du projet.
          </p>
        </Section>

        <Section title="7. Sécurité">
          <p>
            Les mots de passe sont gérés et chiffrés par Supabase Auth — Davai n'y a jamais accès en clair.
            L'accès aux données de progression est protégé par des règles de sécurité au niveau des lignes
            (Row Level Security), garantissant que chaque utilisateur ne peut voir que ses propres données.
          </p>
        </Section>

        <Section title="8. Modifications de cette politique">
          <p>
            Cette politique peut être mise à jour pour refléter l'évolution du Service. La date de dernière
            mise à jour est indiquée en haut de cette page.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            Pour toute question relative à cette politique de confidentialité, ouvrez une{' '}
            <a href="https://github.com/PatrickLoic-dev/Davai/issues" style={{ color: '#0A0A0A', fontWeight: 600 }}>
              issue sur GitHub
            </a>.
          </p>
        </Section>
      </div>
    </div>
  );
}
