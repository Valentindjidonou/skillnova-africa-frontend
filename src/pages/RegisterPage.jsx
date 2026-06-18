import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

export default function RegisterPage() {
  const [form, setForm] = useState({ nom: '', email: '', password: '' });
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Mot de passe trop court (6 caractères min)');
      return;
    }
    const ok = await register(form.nom, form.email, form.password);
    if (ok) {
      toast.success('Compte créé ! Bienvenue 🎉');
      navigate('/dashboard');
    } else {
      toast.error(error || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-amber/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple/15 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="font-display font-extrabold text-2xl gradient-text">SkillUp Bénin</h1>
          </Link>
          <p className="text-white/40 text-sm mt-2">Commence gratuitement aujourd'hui</p>
        </div>

        <div className="card p-8">
          <h2 className="font-display font-bold text-xl mb-1">Créer un compte</h2>
          <p className="text-white/40 text-sm mb-6">Rejoins 120 000 étudiants béninois</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-white/50 font-medium mb-1.5 block">Ton prénom et nom</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="text" placeholder="Koffi Mensah" className="input pl-10"
                  value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} required />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50 font-medium mb-1.5 block">Adresse email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="email" placeholder="ton@email.com" className="input pl-10"
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50 font-medium mb-1.5 block">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="password" placeholder="Minimum 6 caractères" className="input pl-10"
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2">
              {isLoading
                ? <><Loader2 size={16} className="animate-spin" /> Création du compte...</>
                : 'Créer mon compte gratuitement'
              }
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-purple-light hover:underline font-medium">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}