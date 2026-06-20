
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(form.email, form.password);
    if (ok) {
      const user = useAuthStore.getState().user;
      toast.success(`Bienvenue ${user?.nom?.split(' ')[0] || ''} 👋`);
      // Redirection selon le rôle
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      toast.error(error || 'Email ou mot de passe incorrect');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#060912', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden' }}>

      {/* Grid background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(108,71,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

      {/* Glow */}
      <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(108,71,255,0.1) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#6C47FF,#FF9500)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px', color: 'white' }}>S</div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.25rem', color: '#F0EEF8', letterSpacing: '-0.02em' }}>SkillUp Africa</span>
          </Link>
          <p style={{ color: 'rgba(240,238,248,0.3)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Content de te revoir 👋</p>
        </div>

        {/* Card */}
        <div style={{ background: '#0E1220', border: '1px solid rgba(108,71,255,0.15)', borderRadius: '20px', padding: '2rem' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#F0EEF8', marginBottom: '1.75rem', letterSpacing: '-0.02em' }}>Connexion</h2>

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(240,238,248,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Adresse email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,238,248,0.25)' }} />
                <input
                  type="email"
                  placeholder="ton@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.75rem 0.9rem 0.75rem 2.5rem', fontSize: '0.875rem', color: '#F0EEF8', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(108,71,255,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(240,238,248,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Mot de passe
                </label>
                <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: '#6C47FF', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#9F67FF'}
                  onMouseLeave={e => e.target.style.color = '#6C47FF'}>
                  Mot de passe oublié ?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,238,248,0.25)' }} />
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.75rem 2.5rem 0.75rem 2.5rem', fontSize: '0.875rem', color: '#F0EEF8', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(108,71,255,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <button type="button" onClick={() => setShow(!show)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(240,238,248,0.3)', cursor: 'pointer', padding: 0 }}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '0.65rem 0.9rem', fontSize: '0.82rem', color: '#FCA5A5', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            {/* Bouton */}
            <button type="submit" disabled={isLoading}
              style={{ width: '100%', background: isLoading ? 'rgba(108,71,255,0.5)' : '#6C47FF', border: 'none', borderRadius: '12px', padding: '0.9rem', fontSize: '0.95rem', fontWeight: 600, color: 'white', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', marginTop: '1rem', transition: 'all 0.2s', boxShadow: isLoading ? 'none' : '0 0 30px rgba(108,71,255,0.3)' }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
              {isLoading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Connexion...</> : 'Se connecter'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(240,238,248,0.3)', marginTop: '1.5rem' }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: '#6C47FF', textDecoration: 'none', fontWeight: 600 }}
              onMouseEnter={e => e.target.style.color = '#9F67FF'}
              onMouseLeave={e => e.target.style.color = '#6C47FF'}>
              S'inscrire gratuitement
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
