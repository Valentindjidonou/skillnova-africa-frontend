
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import api from '../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0F1E', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-block', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '1.4rem', background: 'linear-gradient(135deg,#7C3AED,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none' }}>
            SkillUp Africa
          </Link>
        </div>

        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2rem', color: 'white' }}>
          {!sent ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Mail size={22} color="#9F67FF" />
                </div>
                <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1.25rem', marginBottom: '6px' }}>Mot de passe oublié ?</h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Saisis ton adresse email et on t'envoie un lien pour réinitialiser ton mot de passe.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Adresse email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="ton@email.com"
                      required
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.75rem 0.9rem 0.75rem 2.5rem', fontSize: '0.875rem', color: 'white', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                </div>

                {error && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '0.65rem 0.9rem', fontSize: '0.82rem', color: '#FCA5A5', marginBottom: '1rem' }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  style={{ width: '100%', background: '#7C3AED', border: 'none', borderRadius: '12px', padding: '0.85rem', fontSize: '0.9rem', fontWeight: 600, color: 'white', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1, fontFamily: 'Inter, sans-serif', marginBottom: '1rem' }}>
                  {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Envoi en cours...</> : 'Envoyer le lien'}
                </button>

                <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', textDecoration: 'none' }}>
                  <ArrowLeft size={14} /> Retour à la connexion
                </Link>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <CheckCircle size={28} color="#10B981" />
              </div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.75rem' }}>Email envoyé !</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                On a envoyé un lien de réinitialisation à <strong style={{ color: 'white' }}>{email}</strong>.<br />
                Vérifie ta boîte mail (et les spams).
              </p>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '0.85rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                ⏱ Le lien expire dans <strong style={{ color: 'rgba(255,255,255,0.6)' }}>1 heure</strong>
              </div>
              <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#9F67FF', fontSize: '0.875rem', textDecoration: 'none' }}>
                <ArrowLeft size={14} /> Retour à la connexion
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
