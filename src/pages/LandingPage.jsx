
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { BookOpen, Zap, Award, Users, ArrowRight, Star, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('tout');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const symbols = ['∫','∑','π','Δ','∂','λ','∞','</>','fn','{}','≠','√','α','β','γ','θ'];
    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      speed: 0.12 + Math.random() * 0.25,
      opacity: 0.03 + Math.random() * 0.08,
      size: 11 + Math.random() * 14,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.font = `${p.size}px monospace`;
        ctx.fillStyle = `rgba(124,58,237,${p.opacity})`;
        ctx.fillText(p.symbol, p.x, p.y);
        p.y -= p.speed;
        if (p.y < -20) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
          p.symbol = symbols[Math.floor(Math.random() * symbols.length)];
        }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  const disciplines = [
    { icon: '📐', name: 'Mathématiques', count: '180 exercices', color: '#7C3AED', cat: 'sciences' },
    { icon: '⚡', name: 'Physique', count: '140 exercices', color: '#F59E0B', cat: 'sciences' },
    { icon: '🧪', name: 'Chimie', count: '90 exercices', color: '#EF4444', cat: 'sciences' },
    { icon: '💻', name: 'Dev Web', count: '60 cours', color: '#10B981', cat: 'tech' },
    { icon: '📊', name: 'Data & Excel', count: '40 cours', color: '#3B82F6', cat: 'tech' },
    { icon: '🎨', name: 'Design', count: '35 cours', color: '#EC4899', cat: 'tech' },
    { icon: '🐍', name: 'Python', count: '50 cours', color: '#8B5CF6', cat: 'tech' },
    { icon: '📱', name: 'Mobile', count: '30 cours', color: '#F97316', cat: 'tech' },
  ];

  const filtered = activeTab === 'tout' ? disciplines
    : disciplines.filter(d => d.cat === activeTab);

  const testimonials = [
    { nom: 'Koffi M.', univ: 'UAC Cotonou', text: 'J\'ai décroché mon premier client Fiverr 3 semaines après l\'atelier. 45 000 FCFA pour un logo !', stars: 5 },
    { nom: 'Aïcha D.', univ: 'EPAC Cotonou', text: 'Les exercices de maths corrigés m\'ont sauvé pour mes partiels. Vraiment détaillé et clair.', stars: 5 },
    { nom: 'Hervé T.', univ: 'UNSTIM', text: 'Le cours React Native est top. J\'ai construit mon premier portfolio en 2 semaines.', stars: 5 },
  ];

  const courses = [
    { icon: '📐', title: 'Algèbre & Équations', level: 'Terminale', price: 'Gratuit', bg: 'linear-gradient(135deg,#1a1040,#2d1b69)', free: true },
    { icon: '⚡', title: 'Mécanique & Cinématique', level: 'Licence 1', price: '2 500 FCFA', bg: 'linear-gradient(135deg,#1a2a1a,#1a4a2a)', free: false },
    { icon: '💻', title: 'React Native de zéro', level: 'Tous niveaux', price: '3 000 FCFA', bg: 'linear-gradient(135deg,#0f1a2a,#1a2a4a)', free: false },
    { icon: '🐍', title: 'Python pour la data', level: 'Débutant', price: '2 500 FCFA', bg: 'linear-gradient(135deg,#1a1a2a,#2a1a4a)', free: false },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0F1E', color: 'white', fontFamily: 'Inter, sans-serif' }}>

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        backgroundColor: 'rgba(10,15,30,0.85)',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '1.25rem', background: 'linear-gradient(135deg,#7C3AED,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SkillUp Bénin
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <a href="#disciplines" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', textDecoration: 'none' }}>Cours</a>
            <a href="#ateliers" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', textDecoration: 'none' }}>Ateliers</a>
            <Link to="/login" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', textDecoration: 'none' }}>Connexion</Link>
            <Link to="/register" className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1.1rem' }}>
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 1.5rem', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />

        {/* Gradient orbs */}
        <div style={{ position: 'absolute', top: '20%', left: '15%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, #0A0F1E)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: '780px' }}>
          {/* Eyebrow */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '100px', padding: '5px 16px', fontSize: '0.75rem', color: '#9F67FF', fontWeight: 500, marginBottom: '2rem' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F59E0B', animation: 'pulse-slow 2s infinite' }} />
            Plateforme #1 pour les étudiants béninois 🇧🇯
          </div>

          <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 'clamp(2.4rem, 6vw, 4rem)', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Apprends. Pratique.<br />
            <span style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #F59E0B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Gagne ta vie.
            </span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
            Cours vidéo, exercices corrigés en maths & physique,
            ateliers freelance. Tout ce qu'il te faut pour transformer
            tes études en revenus réels.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link to="/register" className="btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2rem', gap: '8px', display: 'inline-flex', alignItems: 'center' }}>
              Commencer gratuitement <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-outline" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
              Se connecter
            </Link>
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex' }}>
              {['K','A','H','M','F'].map((l, i) => (
                <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', background: `hsl(${i * 60 + 240}, 60%, 50%)`, border: '2px solid #0A0F1E', marginLeft: i > 0 ? '-8px' : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                  {l}
                </div>
              ))}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
              <span style={{ color: '#F59E0B', fontWeight: 600 }}>★★★★★</span> · Rejoint par <strong style={{ color: 'white' }}>500+</strong> étudiants
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', textAlign: 'center' }}>
          {[
            { val: '120k+', label: 'Étudiants au Bénin', color: '#9F67FF' },
            { val: '50+', label: 'Cours disponibles', color: '#F59E0B' },
            { val: '500+', label: 'Exercices corrigés', color: '#10B981' },
            { val: '8 sem.', label: 'Pour changer ta vie', color: '#60A5FA' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '2rem', color: s.color, marginBottom: '4px' }}>{s.val}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* DISCIPLINES */}
      <section id="disciplines" style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div className="section-label">Disciplines</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '2rem', marginBottom: '0.4rem' }}>Toutes les matières</h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>Du lycée à l'université · exercices corrigés · tous niveaux</p>
          </div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', background: '#111827', borderRadius: '10px', padding: '4px' }}>
            {[['tout','Tout'], ['sciences','Sciences'], ['tech','Tech']].map(([val, label]) => (
              <button key={val} onClick={() => setActiveTab(val)}
                style={{ padding: '6px 16px', borderRadius: '7px', fontSize: '0.82rem', cursor: 'pointer', border: 'none', fontFamily: 'Inter, sans-serif', transition: 'all .15s', background: activeTab === val ? '#7C3AED' : 'transparent', color: activeTab === val ? 'white' : 'rgba(255,255,255,0.4)', fontWeight: activeTab === val ? 600 : 400 }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
          {filtered.map(d => (
            <div key={d.name} className="disc-card" style={{ '--accent': d.color }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{d.icon}</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{d.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{d.count}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COURS POPULAIRES */}
      <section style={{ background: '#111827', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="section-label">Cours populaires</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '2rem' }}>Commence maintenant</h2>
            <Link to="/register" style={{ color: '#9F67FF', fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {courses.map(c => (
              <div key={c.title} className="course-card">
                <div style={{ height: '130px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.8rem', position: 'relative' }}>
                  {c.icon}
                  {c.free && (
                    <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#F59E0B', color: '#000', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '100px' }}>
                      GRATUIT
                    </span>
                  )}
                </div>
                <div style={{ padding: '1rem' }}>
                  <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.92rem', marginBottom: '8px' }}>{c.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{c.level}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: c.free ? '#10B981' : '#9F67FF' }}>{c.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXERCICE PREVIEW */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div className="section-label">Exercices corrigés</div>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '2rem', marginBottom: '0.5rem' }}>Pratique avec correction IA</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', marginBottom: '2rem' }}>Résous l'exercice, soumets ta réponse, reçois une explication détaillée instantanément</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Exercice maths */}
          <div className="exercise-box">
            <div style={{ display: 'inline-block', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '6px', fontSize: '0.75rem', color: '#9F67FF', fontWeight: 500, padding: '3px 10px', marginBottom: '12px' }}>
              📐 Mathématiques · Terminale · Dérivées
            </div>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1rem' }}>
              Soit f(x) = 3x³ - 2x² + 5x - 1. Quelle est la dérivée f'(x) ?
            </p>
            <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: '8px', padding: '0.75rem', fontFamily: 'monospace', color: '#9F67FF', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>
              f'(x) = ?
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {['A) 3x² - 4x + 5', 'B) 9x² - 4x + 5 ✓', 'C) 6x² - 2x + 5', 'D) 9x³ - 4x + 5'].map((c, i) => (
                <div key={i} style={{ background: i === 1 ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${i === 1 ? '#10B981' : 'rgba(255,255,255,0.08)'}`, borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.82rem', color: i === 1 ? '#10B981' : 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                  {c}
                </div>
              ))}
            </div>
            <p style={{ marginTop: '0.85rem', fontSize: '0.8rem', color: '#10B981' }}>
              ✓ En appliquant (xⁿ)' = n·xⁿ⁻¹ : 3×3x² - 2×2x + 5 = 9x² - 4x + 5
            </p>
          </div>

          {/* Exercice physique */}
          <div className="exercise-box">
            <div style={{ display: 'inline-block', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '6px', fontSize: '0.75rem', color: '#F59E0B', fontWeight: 500, padding: '3px 10px', marginBottom: '12px' }}>
              ⚡ Physique · Licence 1 · Cinématique
            </div>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1rem' }}>
              Un objet part du repos avec une accélération a = 4 m/s². Quelle est sa vitesse après t = 5s ?
            </p>
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '8px', padding: '0.75rem', fontFamily: 'monospace', color: '#F59E0B', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>
              v = v₀ + a·t
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {['A) 10 m/s', 'B) 4 m/s', 'C) 20 m/s ✓', 'D) 25 m/s'].map((c, i) => (
                <div key={i} style={{ background: i === 2 ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${i === 2 ? '#10B981' : 'rgba(255,255,255,0.08)'}`, borderRadius: '8px', padding: '0.6rem 0.85rem', fontSize: '0.82rem', color: i === 2 ? '#10B981' : 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                  {c}
                </div>
              ))}
            </div>
            <p style={{ marginTop: '0.85rem', fontSize: '0.8rem', color: '#10B981' }}>
              ✓ v = 0 + 4 × 5 = 20 m/s. Avec v₀ = 0 (départ du repos).
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: '#111827', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="section-label">Fonctionnalités</div>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '2rem', marginBottom: '3rem' }}>Tout ce qu'il te faut</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { icon: BookOpen, title: 'Cours vidéo', desc: 'Cours courts et pratiques avec quiz de validation à chaque module', bg: 'rgba(124,58,237,0.12)', color: '#9F67FF' },
              { icon: Zap, title: 'Exercices corrigés IA', desc: 'Maths, physique, chimie — correction détaillée et explication instantanée', bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
              { icon: Award, title: 'Certifications', desc: 'Certificat PDF téléchargeable et badge profil après chaque cours terminé', bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
              { icon: Users, title: 'Ateliers Fiverr live', desc: 'Sessions pour créer ton profil freelance et décrocher tes premiers clients', bg: 'rgba(96,165,250,0.12)', color: '#60A5FA' },
            ].map(f => (
              <div key={f.title} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <f.icon size={22} color={f.color} />
                </div>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.83rem', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div className="section-label">Témoignages</div>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '2rem', marginBottom: '2.5rem' }}>Ils ont changé leur trajectoire</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {testimonials.map(t => (
            <div key={t.nom} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
                {[...Array(t.stars)].map((_, i) => <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />)}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem', fontStyle: 'italic' }}>
                "{t.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                  {t.nom[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.nom}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{t.univ}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ATELIER CTA */}
      <section id="ateliers" style={{ padding: '0 1.5rem 5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(245,158,11,0.08) 100%)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '1.5rem', padding: '3.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(245,158,11,0.15), transparent)', borderRadius: '50%' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚀</div>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '2.2rem', marginBottom: '1rem' }}>
              Prochain atelier Fiverr/Upwork<br />
              <span style={{ background: 'linear-gradient(135deg,#7C3AED,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Samedi · 15h00 · En ligne
              </span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
              Crée ton profil freelance, rédige ta première offre et décroche ton premier client international. Places limitées à 20 personnes.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <Link to="/register" className="btn-primary" style={{ fontSize: '0.95rem', padding: '0.75rem 2rem' }}>
                Réserver ma place — 3 000 FCFA
              </Link>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['✓ 2 heures de pratique', '✓ Support post-atelier', '✓ Accès replay'].map(item => (
                <span key={item} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ textAlign: 'center', padding: '3rem 1.5rem 6rem' }}>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>
          Prêt à <span style={{ background: 'linear-gradient(135deg,#7C3AED,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>commencer ?</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', marginBottom: '2.5rem', fontSize: '1rem' }}>
          Gratuit pour commencer. Pas de carte bancaire requise.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn-primary" style={{ fontSize: '1rem', padding: '0.9rem 2.5rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Créer mon compte <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-outline" style={{ fontSize: '1rem', padding: '0.9rem 2.5rem' }}>
            Se connecter
          </Link>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '2rem 1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>
        © 2026 SkillUp Bénin · Cotonou, Bénin · Fait avec ❤️ pour les étudiants africains
      </footer>
    </div>
  );
}
