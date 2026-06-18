
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../lib/api';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer le token depuis l'URL (#access_token=... ou ?token=...)
    const hash = window.location.hash;
    const search = window.location.search;

    const hashParams = new URLSearchParams(hash.replace('#', ''));
    const searchParams = new URLSearchParams(search);

    const t = hashParams.get('access_token') || searchParams.get('token') || hashParams.get('token');
    if (t) setToken(t);
    else setError('Lien invalide ou expiré. Demande un nouveau lien.');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { setError('Mot de passe trop court (6 caractères min)'); return; }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas'); return; }

    setLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-password', { token, password });
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColor = ['transparent', '#EF4444', '#F59E0B', '#10B981'][strength];
  const strengthLabel = ['', 'Trop court', 'Correct', 'Fort'][strength];

  return (
    <div style={{ minHeight: '100vh', background: '#0A0F1E', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ position: 'fixed', bottom: '20%', right: '25%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-block', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '1.4rem', background: 'linear-gradient(135deg,#7C3AED,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none' }}>
            SkillUp Africa
          </Link>
        </div>

        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2rem', color: 'white' }}>
          {done ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <CheckCircle size={28} color="#10B981" />
              </div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.75rem' }}>Mot de passe mis à jour !</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                Tu vas être redirigé vers la page de connexion dans 3 secondes...
              </p>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Lock size={22} color="#9F67FF" />
                </div>
                <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1.25rem', marginBottom: '6px' }}>Nouveau mot de passe</h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>Choisis un mot de passe sécurisé</p>
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#FCA5A5', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={15} /> {error}
                </div>
              )}

              {!token && !error && (
                <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#FCD34D', marginBottom: '1rem' }}>
                  ⏳ Vérification du lien...
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Nouveau mot de passe
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
                    <input
                      type={show ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Minimum 6 caractères"
                      required
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.75rem 2.5rem 0.75rem 2.5rem', fontSize: '0.875rem', color: 'white', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                    <button type="button" onClick={() => setShow(!show)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                      {show ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {password && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(strength / 3) * 100}%`, background: strengthColor, borderRadius: '2px', transition: 'all 0.3s' }} />
                      </div>
                      <span style={{ fontSize: '0.72rem', color: strengthColor, fontWeight: 500 }}>{strengthLabel}</span>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Confirmer le mot de passe
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
                    <input
                      type={show ? 'text' : 'password'}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="Répète le mot de passe"
                      required
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${confirm && confirm !== password ? 'rgba(239,68,68,0.4)' : confirm && confirm === password ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '10px', padding: '0.75rem 0.9rem 0.75rem 2.5rem', fontSize: '0.875rem', color: 'white', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}
                    />
                    {confirm && (
                      <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                        {confirm === password
                          ? <CheckCircle size={15} color="#10B981" />
                          : <AlertCircle size={15} color="#EF4444" />
                        }
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" disabled={loading || !token}
                  style={{ width: '100%', background: '#7C3AED', border: 'none', borderRadius: '12px', padding: '0.85rem', fontSize: '0.9rem', fontWeight: 600, color: 'white', cursor: loading || !token ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading || !token ? 0.6 : 1, fontFamily: 'Inter, sans-serif' }}>
                  {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Mise à jour...</> : 'Mettre à jour mon mot de passe'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
