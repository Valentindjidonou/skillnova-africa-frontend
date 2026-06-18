
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Zap, Award, Users, Star } from 'lucide-react';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('tout');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const disciplines = [
    { icon: '📐', name: 'Mathématiques', count: '180+', color: '#6C47FF' },
    { icon: '⚡', name: 'Physique', count: '140+', color: '#FF9500' },
    { icon: '🧪', name: 'Chimie', count: '90+', color: '#FF3B6B' },
    { icon: '💻', name: 'Dev Web', count: '60+', color: '#00C896' },
    { icon: '📊', name: 'Data & Excel', count: '40+', color: '#3B82F6' },
    { icon: '🎨', name: 'Design', count: '35+', color: '#EC4899' },
    { icon: '🐍', name: 'Python', count: '50+', color: '#A78BFA' },
    { icon: '📱', name: 'Mobile', count: '30+', color: '#FB923C' },
  ];

  const filtered = activeTab === 'tout' ? disciplines
    : activeTab === 'sciences'
      ? disciplines.filter(d => ['Mathématiques','Physique','Chimie'].includes(d.name))
      : disciplines.filter(d => !['Mathématiques','Physique','Chimie'].includes(d.name));

  const testimonials = [
    { init: 'KM', nom: 'Koffi M.', lieu: 'UAC · Cotonou', text: 'Premier client Fiverr en 3 semaines après l\'atelier. 45 000 FCFA pour un logo.', stars: 5 },
    { init: 'AD', nom: 'Aïcha D.', lieu: 'EPAC · Cotonou', text: 'Les exos de maths corrigés m\'ont sauvé pour les partiels. Explication détaillée à chaque fois.', stars: 5 },
    { init: 'HT', nom: 'Hervé T.', lieu: 'UNSTIM · Abomey', text: 'React Native de zéro, c\'est sérieux. Portfolio construit en 2 semaines.', stars: 5 },
  ];

  return (
    <div style={{ background: '#060912', color: '#F0EEF8', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>

      {/* ── GRID BACKGROUND ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(108,71,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(108,71,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* ── NAV ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        transition: 'all 0.3s',
        background: scrolled ? 'rgba(6,9,18,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(108,71,255,0.15)' : '1px solid transparent',
      }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 1.5rem', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#6C47FF,#FF9500)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>S</div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.15rem', color: '#F0EEF8', letterSpacing: '-0.02em' }}>SkillUp Africa</span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
            <a href="#disciplines" style={{ color: 'rgba(240,238,248,0.45)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#F0EEF8'} onMouseLeave={e => e.target.style.color = 'rgba(240,238,248,0.45)'}>
              Cours
            </a>
            <a href="#ateliers" style={{ color: 'rgba(240,238,248,0.45)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#F0EEF8'} onMouseLeave={e => e.target.style.color = 'rgba(240,238,248,0.45)'}>
              Ateliers
            </a>
            <Link to="/login" style={{ color: 'rgba(240,238,248,0.45)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#F0EEF8'} onMouseLeave={e => e.target.style.color = 'rgba(240,238,248,0.45)'}>
              Connexion
            </Link>
            <Link to="/register" style={{
              background: '#6C47FF', color: 'white', padding: '0.5rem 1.25rem',
              borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none',
              transition: 'all 0.2s', display: 'inline-block',
            }}
              onMouseEnter={e => { e.target.style.background = '#7C5CFF'; e.target.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.target.style.background = '#6C47FF'; e.target.style.transform = 'translateY(0)'; }}>
              Commencer
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'none', background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', color: '#F0EEF8' }}>
            <div style={{ width: '22px', height: '2px', background: '#F0EEF8', marginBottom: '5px', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
            <div style={{ width: '22px', height: '2px', background: '#F0EEF8', marginBottom: '5px', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
            <div style={{ width: '22px', height: '2px', background: '#F0EEF8', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: '#0E1220', borderTop: '1px solid rgba(108,71,255,0.15)', padding: '1rem 1.5rem 1.5rem' }} className="mobile-menu">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { label: 'Cours', href: '#disciplines', external: true },
                { label: 'Ateliers', href: '#ateliers', external: true },
                { label: 'Connexion', href: '/login', external: false },
              ].map(item => (
                item.external
                  ? <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} style={{ color: 'rgba(240,238,248,0.6)', fontSize: '1rem', textDecoration: 'none', padding: '0.85rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{item.label}</a>
                  : <Link key={item.label} to={item.href} onClick={() => setMenuOpen(false)} style={{ color: 'rgba(240,238,248,0.6)', fontSize: '1rem', textDecoration: 'none', padding: '0.85rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{item.label}</Link>
              ))}
              <Link to="/register" onClick={() => setMenuOpen(false)} style={{ marginTop: '1rem', background: '#6C47FF', color: 'white', padding: '0.85rem', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                Commencer gratuitement
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8rem 1.5rem 5rem', textAlign: 'center' }}>

        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', background: 'radial-gradient(ellipse, rgba(108,71,255,0.12) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

        {/* Badge */}
        <div style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(108,71,255,0.35)', borderRadius: '100px', padding: '6px 16px', marginBottom: '2.5rem', fontSize: '0.78rem', color: '#A38BFF', fontWeight: 500, letterSpacing: '0.02em' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF9500', display: 'inline-block', animation: 'blink 2s ease-in-out infinite' }} />
          Pour les étudiants africains — du Bénin au monde
        </div>

        {/* Headline — SIGNATURE TYPOGRAPHIQUE */}
        <div style={{ position: 'relative', zIndex: 1, marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(3rem, 9vw, 6.5rem)', lineHeight: 0.95, letterSpacing: '-0.04em', marginBottom: '0.15em' }}>
            Apprends.
          </div>
          <div style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(3rem, 9vw, 6.5rem)', lineHeight: 0.95, letterSpacing: '-0.04em',
            WebkitTextStroke: '2px #6C47FF',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
          }}>
            Pratique.
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(3rem, 9vw, 6.5rem)', lineHeight: 0.95, letterSpacing: '-0.04em', background: 'linear-gradient(90deg, #6C47FF 0%, #FF9500 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: '0.1em' }}>
            Gagne ta vie.
          </div>
        </div>

        <p style={{ position: 'relative', zIndex: 1, color: 'rgba(240,238,248,0.45)', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', maxWidth: '520px', lineHeight: 1.7, marginBottom: '3rem' }}>
          Cours en ligne, exercices corrigés par l'IA en maths & physique,
          ateliers freelance. Transforme tes études en revenus.
        </p>

        {/* CTAs */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '4rem' }}>
          <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#6C47FF', color: 'white', padding: '0.9rem 2rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.25s', boxShadow: '0 0 40px rgba(108,71,255,0.3)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 60px rgba(108,71,255,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(108,71,255,0.3)'; }}>
            Commencer gratuitement <ArrowRight size={18} />
          </Link>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'transparent', color: 'rgba(240,238,248,0.65)', padding: '0.9rem 2rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 500, textDecoration: 'none', border: '1px solid rgba(240,238,248,0.12)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(240,238,248,0.3)'; e.currentTarget.style.color = '#F0EEF8'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(240,238,248,0.12)'; e.currentTarget.style.color = 'rgba(240,238,248,0.65)'; }}>
            J'ai déjà un compte
          </Link>
        </div>

        {/* Social proof */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex' }}>
            {['K','A','H','M','F'].map((l, i) => (
              <div key={i} style={{ width: '34px', height: '34px', borderRadius: '50%', background: `hsl(${i * 55 + 230}, 65%, 55%)`, border: '2px solid #060912', marginLeft: i > 0 ? '-10px' : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'white' }}>
                {l}
              </div>
            ))}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(240,238,248,0.35)' }}>
            <span style={{ color: '#FF9500' }}>★★★★★</span> · <strong style={{ color: 'rgba(240,238,248,0.7)' }}>500+</strong> étudiants actifs
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(108,71,255,0.12)', borderBottom: '1px solid rgba(108,71,255,0.12)', background: 'rgba(108,71,255,0.04)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', padding: '2.5rem 1.5rem' }} className="stats-grid">
          {[
            { val: '120 000', label: 'Étudiants au Bénin', color: '#6C47FF' },
            { val: '50+', label: 'Cours disponibles', color: '#FF9500' },
            { val: '500+', label: 'Exercices corrigés', color: '#00C896' },
            { val: '3 / jour', label: 'Nouveaux exercices IA', color: '#A78BFA' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '0 1rem' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: s.color, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(240,238,248,0.3)', marginTop: '6px', lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DISCIPLINES ── */}
      <section id="disciplines" style={{ position: 'relative', zIndex: 1, maxWidth: '1160px', margin: '0 auto', padding: '6rem 1.5rem' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6C47FF', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>Disciplines</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em', lineHeight: 1.05, margin: 0 }}>
              Toutes les matières.<br />
              <span style={{ color: 'rgba(240,238,248,0.3)' }}>Du lycée à l'université.</span>
            </h2>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', background: '#0E1220', borderRadius: '10px', padding: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
            {[['tout','Tout'],['sciences','Sciences'],['tech','Tech']].map(([v, l]) => (
              <button key={v} onClick={() => setActiveTab(v)}
                style={{ padding: '7px 18px', borderRadius: '7px', fontSize: '0.82rem', cursor: 'pointer', border: 'none', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', background: activeTab === v ? '#6C47FF' : 'transparent', color: activeTab === v ? 'white' : 'rgba(240,238,248,0.35)', fontWeight: activeTab === v ? 600 : 400 }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
          {filtered.map(d => (
            <div key={d.name}
              style={{ background: '#0E1220', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem 1rem', cursor: 'pointer', transition: 'all 0.25s', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = d.color + '55'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 30px ${d.color}18`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '10px', lineHeight: 1 }}>{d.icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px', color: '#F0EEF8' }}>{d.name}</div>
              <div style={{ fontSize: '0.72rem', color: d.color, fontWeight: 600 }}>{d.count} exercices</div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: d.color, transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.3s' }} className="disc-bar" />
            </div>
          ))}
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section style={{ position: 'relative', zIndex: 1, background: '#0E1220', borderTop: '1px solid rgba(108,71,255,0.1)', borderBottom: '1px solid rgba(108,71,255,0.1)', padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6C47FF', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center' }}>Comment ça marche</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', letterSpacing: '-0.03em', textAlign: 'center', marginBottom: '3.5rem' }}>
            Simple. Rapide. Efficace.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'rgba(108,71,255,0.1)', borderRadius: '16px', overflow: 'hidden' }} className="steps-grid">
            {[
              { num: '01', icon: BookOpen, color: '#6C47FF', title: 'Choisis un cours', desc: 'Parcours le catalogue. Maths, physique, dev, design — le premier module est toujours gratuit.' },
              { num: '02', icon: Zap, color: '#FF9500', title: 'Pratique avec l\'IA', desc: 'Résous des exercices ouverts. L\'IA corrige ta réponse, explique les erreurs, répond à tes questions.' },
              { num: '03', icon: Award, color: '#00C896', title: 'Certifie et gagne', desc: 'Décroche ton certificat. Lance-toi sur Fiverr ou Upwork avec notre atelier guidé.' },
            ].map((s, i) => (
              <div key={s.num} style={{ background: '#060912', padding: '2.5rem 2rem', position: 'relative' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '3.5rem', color: s.color, opacity: 0.15, lineHeight: 1, marginBottom: '1.25rem', letterSpacing: '-0.05em' }}>{s.num}</div>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <s.icon size={20} color={s.color} />
                </div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '0.6rem', color: '#F0EEF8' }}>{s.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(240,238,248,0.4)', lineHeight: 1.65 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXERCICE PREVIEW ── */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', padding: '6rem 1.5rem' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6C47FF', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>Correction IA</div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
          Tu réponds. L'IA corrige.
        </h2>
        <p style={{ color: 'rgba(240,238,248,0.35)', fontSize: '1rem', marginBottom: '2.5rem' }}>Pas de QCM. De vraies questions ouvertes avec correction détaillée.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="ex-grid">
          {[
            {
              disc: 'Mathématiques', niveau: 'Terminale', color: '#6C47FF',
              q: 'Soit f(x) = 3x³ − 2x² + 5x − 1. Calcule f′(x) et détermine ses variations.',
              rep: 'f′(x) = 9x² − 4x + 5. Discriminant Δ = 16 − 180 < 0, donc f′(x) > 0 partout : f est strictement croissante sur ℝ.',
            },
            {
              disc: 'Physique', niveau: 'Licence 1', color: '#FF9500',
              q: 'Un objet en chute libre part du repos à h = 45 m. Quelle est sa vitesse à l\'impact ?',
              rep: 'v² = 2gh = 2 × 10 × 45 = 900. Donc v = 30 m/s. (On utilise v² = v₀² + 2aΔy avec v₀=0, a=g=10 m/s²)',
            },
          ].map((ex, i) => (
            <div key={i} style={{ background: '#0E1220', border: `1px solid ${ex.color}22`, borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ height: '3px', background: `linear-gradient(90deg, ${ex.color}, ${ex.color}44)` }} />
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: ex.color, background: ex.color + '18', padding: '3px 10px', borderRadius: '100px' }}>{ex.disc}</span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(240,238,248,0.3)', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: '100px' }}>{ex.niveau}</span>
                </div>
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.55, marginBottom: '1rem', color: '#F0EEF8' }}>{ex.q}</p>
                <textarea readOnly rows={2} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '0.65rem 0.9rem', fontSize: '0.82rem', color: 'rgba(240,238,248,0.3)', fontFamily: 'Inter, sans-serif', resize: 'none', boxSizing: 'border-box' }} value="Ta réponse ici..." />
                <div style={{ marginTop: '1rem', background: 'rgba(0,200,150,0.07)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: '10px', padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.72rem', color: '#00C896', fontWeight: 600, marginBottom: '4px' }}>✓ Correction IA</div>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(240,238,248,0.55)', margin: 0, lineHeight: 1.6 }}>{ex.rep}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section style={{ position: 'relative', zIndex: 1, background: '#0E1220', borderTop: '1px solid rgba(108,71,255,0.1)', borderBottom: '1px solid rgba(108,71,255,0.1)', padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6C47FF', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>Témoignages</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', letterSpacing: '-0.03em', marginBottom: '2.5rem' }}>Ils ont changé de trajectoire.</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }} className="testi-grid">
            {testimonials.map(t => (
              <div key={t.nom} style={{ background: '#060912', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(t.stars)].map((_, i) => <Star key={i} size={13} fill="#FF9500" color="#FF9500" />)}
                </div>
                <p style={{ fontSize: '0.88rem', color: 'rgba(240,238,248,0.65)', lineHeight: 1.7, flex: 1, margin: 0, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#6C47FF,#FF9500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.78rem', flexShrink: 0 }}>{t.init}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t.nom}</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(240,238,248,0.3)' }}>{t.lieu}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ATELIER CTA ── */}
      <section id="ateliers" style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', padding: '6rem 1.5rem' }}>
        <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(108,71,255,0.15) 0%, rgba(255,149,0,0.08) 100%)', border: '1px solid rgba(108,71,255,0.25)', padding: 'clamp(2rem,5vw,4rem)' }}>
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(108,71,255,0.2), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,149,0,0.12), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: '560px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#FF9500', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>🔥 Prochain atelier live</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', letterSpacing: '-0.03em', marginBottom: '1rem', lineHeight: 1.1 }}>
              Fiverr & Upwork —<br />
              <span style={{ background: 'linear-gradient(90deg,#6C47FF,#FF9500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Commence à gagner.</span>
            </h2>
            <p style={{ color: 'rgba(240,238,248,0.45)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Samedi · 15h00 · En ligne · 20 places max.<br />
              Crée ton profil, rédige ta première offre, décroche ton premier client.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#6C47FF', color: 'white', padding: '0.85rem 1.75rem', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 0 30px rgba(108,71,255,0.35)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                Réserver — 3 000 FCFA
              </Link>
              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.78rem', color: 'rgba(240,238,248,0.35)' }}>
                {['2h de pratique', 'Support inclus', 'Replay disponible'].map(f => (
                  <span key={f} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#00C896' }}>✓</span> {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '4rem 1.5rem 8rem' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2.2rem, 6vw, 4rem)', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '1.25rem' }}>
          Prêt à commencer ?
        </h2>
        <p style={{ color: 'rgba(240,238,248,0.35)', fontSize: '1rem', marginBottom: '2.5rem' }}>
          Gratuit pour démarrer. Aucune carte bancaire.
        </p>
        <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#6C47FF', color: 'white', padding: '1rem 2.5rem', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.25s', boxShadow: '0 0 50px rgba(108,71,255,0.3)' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 0 80px rgba(108,71,255,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 50px rgba(108,71,255,0.3)'; }}>
          Créer mon compte gratuitement <ArrowRight size={20} />
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.05)', padding: '2.5rem 1.5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'rgba(240,238,248,0.3)' }}>
            © 2026 SkillUp Africa · Cotonou, Bénin
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/login" style={{ fontSize: '0.8rem', color: 'rgba(240,238,248,0.25)', textDecoration: 'none' }}>Connexion</Link>
            <Link to="/register" style={{ fontSize: '0.8rem', color: 'rgba(240,238,248,0.25)', textDecoration: 'none' }}>Inscription</Link>
            <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'rgba(240,238,248,0.25)', textDecoration: 'none' }}>Mot de passe oublié</Link>
          </div>
        </div>
      </footer>

      {/* ── GOOGLE FONTS + CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        /* Hover bar effect on disciplines */
        .disc-card:hover .disc-bar { transform: scaleX(1) !important; }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; gap: 1.5rem; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .ex-grid { grid-template-columns: 1fr !important; }
          .testi-grid { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}
