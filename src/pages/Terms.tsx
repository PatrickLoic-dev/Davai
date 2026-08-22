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

export default function Terms() {
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
          Conditions Générales d'Utilisation
        </h1>
        <p style={{ color: '#A3A3A3', fontSize: '0.85rem', margin: '0 0 2.5rem', fontFamily: 'var(--font-mono)' }}>
          Dernière mise à jour : 22 août 2026
        </p>

        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '2.5rem', fontSize: '0.85rem', color: '#92400E', lineHeight: 1.65 }}>
          Ce document est un modèle de base à usage informatif et ne constitue pas un conseil juridique
          professionnel. Pour un usage commercial ou une mise en production à grande échelle, il est
          recommandé de le faire relire par un professionnel du droit.
        </div>

        <Section title="1. Objet">
          <p>
            Les présentes Conditions Générales d'Utilisation (« CGU ») régissent l'accès et l'utilisation
            de l'application Davai (« le Service »), une plateforme gratuite et open source d'apprentissage
            de la langue russe. En créant un compte ou en utilisant le Service, vous acceptez sans réserve
            les présentes CGU.
          </p>
        </Section>

        <Section title="2. Description du service">
          <p>
            Davai propose des contenus pédagogiques (alphabet cyrillique, vocabulaire, grammaire, exercices)
            ainsi qu'un système de suivi de progression, de gamification (XP, niveaux, séries, badges) et,
            pour les utilisateurs inscrits, une synchronisation de la progression dans le cloud.
          </p>
          <p>
            Le Service est fourni « en l'état », à titre gratuit, sans garantie d'exactitude pédagogique
            absolue ni de disponibilité continue.
          </p>
        </Section>

        <Section title="3. Compte utilisateur">
          <p>
            La création d'un compte est facultative : l'application reste utilisable sans compte, avec une
            progression stockée localement dans votre navigateur. La création d'un compte (par email ou via
            Google) permet de synchroniser votre progression sur plusieurs appareils.
          </p>
          <p>
            Vous êtes responsable de la confidentialité de vos identifiants et de toute activité effectuée
            depuis votre compte. Vous pouvez demander la suppression de votre compte et des données associées
            à tout moment.
          </p>
        </Section>

        <Section title="4. Contenu et propriété intellectuelle">
          <p>
            Le code source de Davai est distribué sous licence MIT et disponible publiquement sur GitHub :
            vous êtes libre de le consulter, le modifier et le redistribuer dans les conditions de cette
            licence.
          </p>
          <p>
            Les contenus pédagogiques (leçons, vocabulaire, exercices) sont fournis à des fins éducatives.
            Vos données de progression personnelles (XP, badges, historique) vous appartiennent et ne sont
            utilisées que pour faire fonctionner le Service.
          </p>
        </Section>

        <Section title="5. Usage acceptable">
          <p>Vous vous engagez à ne pas :</p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Utiliser le Service à des fins illégales ou frauduleuses ;</li>
            <li>Tenter de perturber, surcharger ou compromettre la sécurité du Service ;</li>
            <li>Extraire ou revendre les contenus pédagogiques sans autorisation, en dehors des termes de la licence du code ;</li>
            <li>Créer des comptes automatisés ou frauduleux.</li>
          </ul>
        </Section>

        <Section title="6. Disponibilité et responsabilité">
          <p>
            Le Service est un projet open source maintenu de façon bénévole. Il peut faire l'objet
            d'interruptions, de bugs ou d'évolutions sans préavis. Dans la limite permise par la loi
            applicable, Davai et ses contributeurs déclinent toute responsabilité pour les dommages directs
            ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser le Service.
          </p>
        </Section>

        <Section title="7. Résiliation">
          <p>
            Vous pouvez cesser d'utiliser le Service et supprimer votre compte à tout moment. Nous nous
            réservons le droit de suspendre ou supprimer un compte en cas d'usage manifestement abusif du
            Service ou de violation des présentes CGU.
          </p>
        </Section>

        <Section title="8. Modification des CGU">
          <p>
            Les présentes CGU peuvent être mises à jour pour refléter l'évolution du Service. La date de
            dernière mise à jour est indiquée en haut de cette page. Une utilisation continue du Service
            après modification vaut acceptation des nouvelles CGU.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            Pour toute question relative à ces CGU, ouvrez une{' '}
            <a href="https://github.com/PatrickLoic-dev/Davai/issues" style={{ color: '#0A0A0A', fontWeight: 600 }}>
              issue sur GitHub
            </a>.
          </p>
        </Section>
      </div>
    </div>
  );
}
