import { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { AppLogo } from './Logo';

interface Props { onBack?: () => void; }

export default function AuthScreen({ onBack }: Props) {
  const { dispatch } = useUser();
  const [mode, setMode]       = useState<'login' | 'register'>('register');
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const [nameFocus, setNameFocus]   = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [pwdFocus, setPwdFocus]     = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) { setError('Remplissez tous les champs.'); return; }
    if (mode === 'register' && !name.trim()) { setError('Entrez votre prénom.'); return; }
    if (password.length < 6) { setError('Mot de passe trop court (6 caractères min).'); return; }
    setLoading(true);
    setTimeout(() => {
      dispatch({ type: 'LOGIN', profile: { name: name.trim() || email.split('@')[0], email: email.trim() } });
      setLoading(false);
    }, 700);
  }

  function handleGoogle() {
    setLoading(true);
    setTimeout(() => {
      dispatch({ type: 'LOGIN', profile: { name: 'Apprenant', email: 'user@google.com' } });
      setLoading(false);
    }, 600);
  }

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    width: '100%', padding: '0.8rem 1rem',
    border: `1.5px solid ${focused ? '#0A0A0A' : '#E8E8E8'}`,
    borderRadius: '10px', background: 'white', color: '#0A0A0A',
    fontFamily: 'var(--font-ui)', fontSize: '0.95rem', outline: 'none',
    transition: 'border-color 0.15s', boxSizing: 'border-box' as const,
  });

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'white', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{ padding: '1.25rem clamp(1.25rem, 5vw, 2.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E8E8E8', flexShrink: 0 }}>
        <AppLogo size={30} textSize="0.95rem" />
        {onBack && (
          <button onClick={onBack}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid #E8E8E8', color: '#737373', padding: '0.45rem 0.9rem', borderRadius: '100px', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', cursor: 'pointer', transition: 'border-color 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#0A0A0A'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#E8E8E8'}
          ><ArrowLeft size={13} /> Retour</button>
        )}
      </div>

      {/* Centered form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 2rem)' }}>
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>

          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', color: '#0A0A0A', margin: '0 0 0.5rem', lineHeight: 1.15 }}>
              {mode === 'register' ? 'Créer un compte' : 'Bon retour !'}
            </h1>
            <p style={{ color: '#737373', fontSize: '0.92rem', margin: 0 }}>
              {mode === 'register'
                ? 'Commencez votre apprentissage du russe gratuitement.'
                : 'Reprenez là où vous en étiez.'}
            </p>
          </div>

          {/* Google */}
          <button onClick={handleGoogle}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '0.82rem', borderRadius: '10px', background: 'white', border: '1.5px solid #E8E8E8', color: '#0A0A0A', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer', marginBottom: '1.25rem', transition: 'border-color 0.15s, background 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0A0A0A'; (e.currentTarget as HTMLElement).style.background = '#FAFAFA'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E8E8E8'; (e.currentTarget as HTMLElement).style.background = 'white'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuer avec Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1, height: '1px', background: '#E8E8E8' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#A3A3A3', letterSpacing: '0.08em' }}>OU</span>
            <div style={{ flex: 1, height: '1px', background: '#E8E8E8' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#0A0A0A', marginBottom: '5px' }}>Prénom</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Votre prénom"
                  style={inputStyle(nameFocus)} onFocus={() => setNameFocus(true)} onBlur={() => setNameFocus(false)} autoComplete="given-name" />
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#0A0A0A', marginBottom: '5px' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.com"
                style={inputStyle(emailFocus)} onFocus={() => setEmailFocus(true)} onBlur={() => setEmailFocus(false)} autoComplete="email" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#0A0A0A', marginBottom: '5px' }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  style={{ ...inputStyle(pwdFocus), paddingRight: '3rem' }}
                  onFocus={() => setPwdFocus(true)} onBlur={() => setPwdFocus(false)}
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'} />
                <button type="button" onClick={() => setShowPwd(s => !s)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#A3A3A3', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '0.65rem 0.9rem', fontSize: '0.83rem', color: '#DC2626' }}>{error}</div>
            )}

            <button type="submit" disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#0A0A0A', color: 'white', border: 'none', padding: '0.9rem', borderRadius: '10px', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.65 : 1, marginTop: '4px', transition: 'opacity 0.15s' }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = loading ? '0.65' : '1'}
            >
              {loading
                ? <span style={{ display: 'inline-flex', gap: '4px' }}>
                    {[0,1,2].map(i => <span key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'white', animationName: 'bounce-in', animationDuration: '0.6s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', animationDelay: `${i*0.15}s` }} />)}
                  </span>
                : <>{mode === 'register' ? 'Créer mon compte' : 'Se connecter'} <ArrowRight size={16} /></>}
            </button>
          </form>

          {/* Switch mode */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#737373' }}>
              {mode === 'register' ? 'Déjà un compte ? ' : 'Pas encore de compte ? '}
            </span>
            <button onClick={() => { setMode(m => m === 'register' ? 'login' : 'register'); setError(''); }}
              style={{ background: 'none', border: 'none', fontSize: '0.85rem', fontWeight: 700, color: '#0A0A0A', cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '2px' }}>
              {mode === 'register' ? 'Se connecter' : 'Créer un compte'}
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#A3A3A3', marginTop: '1.5rem', fontFamily: 'var(--font-mono)' }}>
            Gratuit · Aucune carte requise
          </p>
        </div>
      </div>
    </div>
  );
}
