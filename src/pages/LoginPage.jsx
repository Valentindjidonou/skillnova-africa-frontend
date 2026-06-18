import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(form.email, form.password);
    if (ok) {
      toast.success('Bienvenue ! 👋');
      navigate('/dashboard');
    } else {
      toast.error(error || 'Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96
                        bg-purple/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="font-display font-extrabold text-2xl gradient-text">
              SkillUp Bénin
            </h1>
          </Link>
          <p className="text-white/40 text-sm mt-2">Content de te revoir 👋</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <h2 className="font-display font-bold text-xl mb-6">Connexion</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-white/50 font-medium mb-1.5 block">
                Adresse email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  placeholder="ton@email.com"
                  className="input pl-10"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50 font-medium mb-1.5 block">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input pl-10"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2">
              {isLoading
                ? <><Loader2 size={16} className="animate-spin" /> Connexion...</>
                : 'Se connecter'
              }
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-purple-light hover:underline font-medium">
              S'inscrire gratuitement
            </Link>
          </p>
          <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
  <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#9F67FF', textDecoration: 'none' }}>
    Mot de passe oublié ?
  </Link>
</div>
        </div>
      </div>
    </div>
  );
}