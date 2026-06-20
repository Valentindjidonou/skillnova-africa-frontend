
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, BookOpen, Zap, Award, Star } from 'lucide-react';

// Particules : formules maths + symboles code
const SYMBOLS = [
  '∫','∑','π','Δ','∂','λ','∞','√','α','β','γ','θ','σ','μ','∇','≠','≤','≥','∈','∀',
  'fn()','</>','[ ]','{ }','=>','===','null','let','if','for','&&','||','++','--',
  'v=dx/dt','F=ma','E=mc²','ax²+bx','∫f(x)dx','lim→0','d/dx','Δx/Δt',
];

function ParticleCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Créer les particules
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      speed: 0.08 + Math.random() * 0.2,
      opacity: 0.03 + Math.random() * 0.09,
      size: 10 + Math.random() * 10,
      drift: (Math.random() - 0.5) * 0.15,
      // Couleur : violet ou orange ou blanc
      hue: Math.random() < 0.5 ? 'rgba(108,71,255,' : Math.random() < 0.7 ? 'rgba(255,149,0,' : 'rgba(240,238,248,',
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.font = `${p.size}px monospace`;
        ctx.fillStyle = `${p.hue}${p.opacity})`;
        ctx.fillText(p.symbol, p.x, p.y);
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -30) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
          p.symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        }
        if (p.x < -50) p.x = canvas.width + 10;
        if (p.x > canvas.width + 50) p.x = -10;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas ref={ref} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 1 }} />
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('tout');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    // Animation d'entrée
    const t = setTimeout(() => setVisible(true), 100);
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(t); };
  }, []);

  const disciplines = [
    { icon: '📐', name: 'Mathématiques', count: '180+', color: '#6C47FF' },
    { icon: '⚡', name: 'Physique',       count: '140+', color: '#FF9500' },
    { icon: '🧪', name: 'Chimie',         count: '90+',  color: '#FF3B6B' },
    { icon: '💻', name: 'Dev Web',        count: '60+',  color: '#00C896' },
    { icon: '📊', name: 'Data & Excel',   count: '40+',  color: '#3B82F6' },
    { icon: '🎨', name: 'Design',         count: '35+',  color: '#EC4899' },
    { icon: '🐍', name: 'Python',         count: '50+',  color: '#A78BFA' },
    { icon: '📱', name: 'Mobile',         count: '30+',  color: '#FB923C' },
  ];

  const filtered = activeTab === 'tout' ? disciplines
    : activeTab === 'sciences'
      ? disciplines.filter(d => ['Mathématiques','Physique','Chimie'].includes(d.name))
      : disciplines.filter(d => !['Mathématiques','Physique','Chimie'].includes(d.name));

  const testimonials = [
    { init: 'KM', nom: 'Koffi M.', lieu: 'UAC · Cotonou', text: 'Premier client Fiverr en 3 semaines après l\'atelier. 45 000 FCFA pour un logo.', stars: 5 },
    { init: 'AD', nom: 'Aïcha D.', lieu: 'EPAC · Cotonou', text: 'Les exos de maths corrigés m\'ont sauvé pour les partiels. Explication à chaque erreur.', stars: 5 },
    { init: 'HT', nom: 'Hervé T.', lieu: 'UNSTIM · Abomey', text: 'React Native de zéro, c\'est sérieux. Portfolio construit en 2 semaines.', stars: 5 },
  ];

  const S = { // styles réutilisables
    section: { position: 'relative', zIndex: 1 },
    label: { fontSize: '0.7rem', fontWeight: 700, color: '#6C47FF', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' },
    h2: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-0.03em', lineHeight: 1.08, color: '#F0EEF8', margin: 0 },
  };

  return (
    <div style={{ background: '#060912', color: '#F0EEF8', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>

      {/* ── CANVAS FOND ANIMÉ ── */}
      <ParticleCanvas />

      {/* ── NAV ── */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, transition: 'all 0.35s', background: scrolled ? 'rgba(6,9,18,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(24px)' : 'none', borderBottom: scrolled ? '1px solid rgba(108,71,255,0.12)' : '1px solid transparent' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 1.5rem', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg,#6C47FF,#FF9500)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '17px', color: 'white' }}>S</div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#F0EEF8', letterSpacing: '-0.02em' }}>SkillUp Africa</span>
          </Link>

          {/* Desktop */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desk-nav">
            {['#disciplines|Cours','#ateliers|Ateliers'].map(item => {
              const [href, label] = item.split('|');
              return <a key={label} href={href} style={{ color: 'rgba(240,238,248,0.4)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='#F0EEF8'} onMouseLeave={e => e.target.style.color='rgba(240,238,248,0.4)'}>{label}</a>;
            })}
            <Link to="/login" style={{ color: 'rgba(240,238,248,0.4)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='#F0EEF8'} onMouseLeave={e => e.target.style.color='rgba(240,238,248,0.4)'}>Connexion</Link>
            <Link to="/register" style={{ background: '#6C47FF', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 0 20px rgba(108,71,255,0.25)' }}
              onMouseEnter={e => { e.currentTarget.style.background='#7C5CFF'; e.currentTarget.style.transform='translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='#6C47FF'; e.currentTarget.style.transform='translateY(0)'; }}>
              Commencer
            </Link>
          </nav>

          {/* Mobile burger */}
          <button className="burger" onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'none', flexDirection: 'column', gap: '5px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px' }}>
            {[0,1,2].map(i => (
              <span key={i} style={{ display: 'block', width: '22px', height: '2px', background: '#F0EEF8', borderRadius: '1px', transition: 'all 0.3s',
                transform: i===0 && menuOpen ? 'rotate(45deg) translate(5px,5px)' : i===2 && menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none',
                opacity: i===1 && menuOpen ? 0 : 1,
              }} />
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: '#0E1220', borderTop: '1px solid rgba(108,71,255,0.1)', padding: '1.25rem 1.5rem 2rem' }}>
            {[['#disciplines','Cours',true],['#ateliers','Ateliers',true],['/login','Connexion',false]].map(([href,label,ext]) => (
              ext
                ? <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '0.9rem 0', color: 'rgba(240,238,248,0.55)', fontSize: '1rem', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{label}</a>
                : <Link key={label} to={href} onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '0.9rem 0', color: 'rgba(240,238,248,0.55)', fontSize: '1rem', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{label}</Link>
            ))}
            <Link to="/register" onClick={() => setMenuOpen(false)} style={{ display: 'block', marginTop: '1rem', background: '#6C47FF', color: 'white', padding: '0.9rem', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
              Commencer gratuitement
            </Link>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section style={{ ...S.section, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '9rem 1.5rem 5rem', textAlign: 'center' }}>

        {/* Glow central */}
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '700px', background: 'radial-gradient(ellipse, rgba(108,71,255,0.1) 0%, rgba(255,149,0,0.04) 40%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        {/* Badge */}
        <div style={{ position: 'relative', zIndex: 1, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s ease', display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(108,71,255,0.3)', borderRadius: '100px', padding: '6px 18px', marginBottom: '2.5rem', fontSize: '0.78rem', color: '#9F67FF', fontWeight: 500 }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF9500', display: 'inline-block', animation: 'blink 2s ease-in-out infinite' }} />
          Pour les étudiants africains — du Bénin au monde 🌍
        </div>

        {/* ── SIGNATURE TYPOGRAPHIQUE ── */}
        <div style={{ position: 'relative', zIndex: 1, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease 0.1s', marginBottom: '1.5rem' }}>

          {/* Ligne 1 : blanc plein */}
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(3.2rem, 10vw, 7rem)', lineHeight: 0.9, letterSpacing: '-0.04em', color: '#F0EEF8' }}>
            Apprends.
          </div>

          {/* Ligne 2 : outline stroke — LA SIGNATURE */}
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(3.2rem, 10vw, 7rem)', lineHeight: 0.9, letterSpacing: '-0.04em', WebkitTextStroke: '2px rgba(108,71,255,0.7)', WebkitTextFillColor: 'transparent', color: 'transparent', margin: '0.12em 0' }}>
            Pratique.
          </div>

          {/* Ligne 3 : gradient */}
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(3.2rem, 10vw, 7rem)', lineHeight: 0.9, letterSpacing: '-0.04em', background: 'linear-gradient(100deg, #6C47FF 0%, #FF9500 60%, #FF3B6B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Gagne ta vie.
          </div>
        </div>

        <p style={{ position: 'relative', zIndex: 1, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease 0.2s', color: 'rgba(240,238,248,0.4)', fontSize: 'clamp(1rem,2.5vw,1.2rem)', maxWidth: '520px', lineHeight: 1.75, marginBottom: '3rem' }}>
          Cours en ligne, exercices corrigés par l'IA en maths & physique, ateliers freelance.
          Transforme tes études en revenus réels.
        </p>

        {/* CTAs */}
        <div style={{ position: 'relative', zIndex: 1, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease 0.3s', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3.5rem' }}>
          <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#6C47FF', color: 'white', padding: '1rem 2.25rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.25s', boxShadow: '0 0 50px rgba(108,71,255,0.35)' }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 0 80px rgba(108,71,255,0.55)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 0 50px rgba(108,71,255,0.35)'; }}>
            Commencer gratuitement <ArrowRight size={18} />
          </Link>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', color: 'rgba(240,238,248,0.6)', padding: '1rem 2.25rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 500, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.25)'; e.currentTarget.style.color='#F0EEF8'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='rgba(240,238,248,0.6)'; }}>
            J'ai déjà un compte
          </Link>
        </div>

        {/* Social proof */}
        <div style={{ position: 'relative', zIndex: 1, opacity: visible ? 1 : 0, transition: 'all 0.8s ease 0.4s', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex' }}>
            {['K','A','H','M','F'].map((l, i) => (
              <div key={i} style={{ width: '34px', height: '34px', borderRadius: '50%', background: `hsl(${i*55+230},65%,55%)`, border: '2px solid #060912', marginLeft: i > 0 ? '-10px' : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'white' }}>{l}</div>
            ))}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(240,238,248,0.3)' }}>
            <span style={{ color: '#FF9500' }}>★★★★★</span> · <strong style={{ color: 'rgba(240,238,248,0.65)' }}>500+</strong> étudiants actifs
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div style={{ ...S.section, borderTop: '1px solid rgba(108,71,255,0.1)', borderBottom: '1px solid rgba(108,71,255,0.1)', background: 'rgba(108,71,255,0.03)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', padding: '2.5rem 1.5rem', gap: '1rem' }} className="stats-grid">
          {[
            { val: '120 000', label: 'Étudiants au Bénin', color: '#6C47FF' },
            { val: '50+',     label: 'Cours disponibles',  color: '#FF9500' },
            { val: '500+',    label: 'Exercices corrigés', color: '#00C896' },
            { val: '3/jour',  label: 'Nouveaux exos IA',   color: '#A78BFA' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: s.color, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(240,238,248,0.28)', marginTop: '6px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DISCIPLINES ── */}
      <section id="disciplines" style={{ ...S.section, maxWidth: '1160px', margin: '0 auto', padding: '6rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={S.label}>Disciplines</div>
            <h2 style={S.h2}>Toutes les matières.<br /><span style={{ color: 'rgba(240,238,248,0.25)' }}>Du lycée à l'université.</span></h2>
          </div>
          <div style={{ display: 'flex', background: '#0E1220', borderRadius: '10px', padding: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {[['tout','Tout'],['sciences','Sciences'],['tech','Tech']].map(([v,l]) => (
              <button key={v} onClick={() => setActiveTab(v)}
                style={{ padding: '7px 18px', borderRadius: '7px', fontSize: '0.82rem', cursor: 'pointer', border: 'none', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', background: activeTab===v ? '#6C47FF' : 'transparent', color: activeTab===v ? 'white' : 'rgba(240,238,248,0.3)', fontWeight: activeTab===v ? 600 : 400 }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px,1fr))', gap: '10px' }}>
          {filtered.map(d => (
            <div key={d.name}
              style={{ background: '#0E1220', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '1.25rem 1rem', cursor: 'pointer', transition: 'all 0.25s' }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor=d.color+'55'; el.style.transform='translateY(-4px)'; el.style.boxShadow=`0 10px 30px ${d.color}18`; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor='rgba(255,255,255,0.05)'; el.style.transform='translateY(0)'; el.style.boxShadow='none'; }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{d.icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px', color: '#F0EEF8' }}>{d.name}</div>
              <div style={{ fontSize: '0.7rem', color: d.color, fontWeight: 600 }}>{d.count} exercices</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ÉTAPES ── */}
      <section style={{ ...S.section, background: '#0A0E1A', borderTop: '1px solid rgba(108,71,255,0.08)', borderBottom: '1px solid rgba(108,71,255,0.08)', padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={S.label}>Comment ça marche</div>
            <h2 style={{ ...S.h2, textAlign: 'center' }}>Simple. Rapide. Efficace.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'rgba(108,71,255,0.08)', borderRadius: '18px', overflow: 'hidden' }} className="steps-grid">
            {[
              { n:'01', icon: BookOpen, color:'#6C47FF', t:'Choisis un cours',      d:'Parcours le catalogue. Maths, physique, dev, design — le premier module est toujours gratuit.' },
              { n:'02', icon: Zap,      color:'#FF9500', t:'Pratique avec l\'IA',   d:'Résous des exercices ouverts. L\'IA corrige ta copie, explique les erreurs, répond à tes questions.' },
              { n:'03', icon: Award,    color:'#00C896', t:'Certifie et freelance', d:'Décroche ton certificat. Lance-toi sur Fiverr ou Upwork avec notre atelier guidé.' },
            ].map(s => (
              <div key={s.n} style={{ background: '#060912', padding: '2.5rem 2rem' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '3.5rem', color: s.color, opacity: 0.12, lineHeight: 1, marginBottom: '1.25rem', letterSpacing: '-0.05em' }}>{s.n}</div>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: s.color+'18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <s.icon size={20} color={s.color} />
                </div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '0.6rem', color: '#F0EEF8' }}>{s.t}</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(240,238,248,0.38)', lineHeight: 1.65 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXERCICE PREVIEW ── */}
      <section style={{ ...S.section, maxWidth: '1000px', margin: '0 auto', padding: '6rem 1.5rem' }}>
        <div style={S.label}>Correction IA</div>
        <h2 style={{ ...S.h2, marginBottom: '0.5rem' }}>Tu réponds. L'IA corrige.</h2>
        <p style={{ color: 'rgba(240,238,248,0.3)', fontSize: '1rem', marginBottom: '2.5rem' }}>Pas de QCM. De vraies questions ouvertes avec correction détaillée.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="ex-grid">
          {[
            { disc:'Mathématiques', niv:'Terminale', color:'#6C47FF', q:'Soit f(x) = 3x³ − 2x² + 5x − 1. Calcule f′(x) et détermine ses variations.', rep:'f′(x) = 9x² − 4x + 5. Δ = 16 − 180 < 0, donc f′(x) > 0 sur ℝ : f est strictement croissante.' },
            { disc:'Physique', niv:'Licence 1', color:'#FF9500', q:'Un objet en chute libre part du repos à h = 45 m. Quelle est sa vitesse à l\'impact ?', rep:'v² = 2gh = 2 × 10 × 45 = 900, donc v = 30 m/s. (v₀=0, a=g=10 m/s²)' },
          ].map((ex,i) => (
            <div key={i} style={{ background: '#0E1220', border: `1px solid ${ex.color}22`, borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ height: '3px', background: `linear-gradient(90deg,${ex.color},${ex.color}44)` }} />
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: ex.color, background: ex.color+'18', padding: '3px 10px', borderRadius: '100px' }}>{ex.disc}</span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(240,238,248,0.28)', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: '100px' }}>{ex.niv}</span>
                </div>
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.55, marginBottom: '1rem', color: '#F0EEF8' }}>{ex.q}</p>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.7rem 0.9rem', fontSize: '0.82rem', color: 'rgba(240,238,248,0.2)', marginBottom: '1rem', fontStyle: 'italic' }}>
                  Ta réponse ici...
                </div>
                <div style={{ background: 'rgba(0,200,150,0.07)', border: '1px solid rgba(0,200,150,0.18)', borderRadius: '10px', padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.7rem', color: '#00C896', fontWeight: 700, marginBottom: '4px', letterSpacing: '0.05em' }}>✓ CORRECTION IA</div>
                  <p style={{ fontSize: '0.83rem', color: 'rgba(240,238,248,0.55)', margin: 0, lineHeight: 1.65 }}>{ex.rep}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section style={{ ...S.section, background: '#0A0E1A', borderTop: '1px solid rgba(108,71,255,0.08)', borderBottom: '1px solid rgba(108,71,255,0.08)', padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={S.label}>Témoignages</div>
          <h2 style={{ ...S.h2, marginBottom: '2.5rem' }}>Ils ont changé de trajectoire.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }} className="testi-grid">
            {testimonials.map(t => (
              <div key={t.nom} style={{ background: '#060912', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '2px' }}>{[...Array(t.stars)].map((_,i) => <Star key={i} size={13} fill="#FF9500" color="#FF9500" />)}</div>
                <p style={{ fontSize: '0.875rem', color: 'rgba(240,238,248,0.6)', lineHeight: 1.7, flex: 1, margin: 0, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#6C47FF,#FF9500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.78rem', flexShrink: 0 }}>{t.init}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t.nom}</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(240,238,248,0.28)' }}>{t.lieu}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ATELIER CTA ── */}
      <section id="ateliers" style={{ ...S.section, maxWidth: '1000px', margin: '0 auto', padding: '6rem 1.5rem' }}>
        <div style={{ position: 'relative', borderRadius: '22px', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(108,71,255,0.14) 0%, rgba(255,149,0,0.07) 100%)', border: '1px solid rgba(108,71,255,0.22)', padding: 'clamp(2rem,5vw,4rem)' }}>
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '260px', height: '260px', background: 'radial-gradient(circle, rgba(108,71,255,0.18), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,149,0,0.1), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: '560px' }}>
            <div style={{ ...S.label, color: '#FF9500', marginBottom: '1rem' }}>🔥 Prochain atelier live</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem,4vw,2.5rem)', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem', color: '#F0EEF8' }}>
              Fiverr & Upwork —<br />
              <span style={{ background: 'linear-gradient(90deg,#6C47FF,#FF9500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Commence à gagner.</span>
            </h2>
            <p style={{ color: 'rgba(240,238,248,0.4)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Samedi · 15h00 · En ligne · 20 places max.<br />
              Crée ton profil, rédige ta première offre, décroche ton premier client.
            </p>
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#6C47FF', color: 'white', padding: '0.875rem 1.75rem', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 0 35px rgba(108,71,255,0.3)' }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                Réserver — 3 000 FCFA
              </Link>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {['2h de pratique','Support inclus','Replay dispo'].map(f => (
                  <span key={f} style={{ fontSize: '0.78rem', color: 'rgba(240,238,248,0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#00C896' }}>✓</span> {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ ...S.section, textAlign: 'center', padding: '4rem 1.5rem 8rem' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2.2rem,6vw,4rem)', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '1.25rem', color: '#F0EEF8' }}>
          Prêt à commencer ?
        </h2>
        <p style={{ color: 'rgba(240,238,248,0.3)', fontSize: '1rem', marginBottom: '2.5rem' }}>Gratuit pour démarrer. Aucune carte bancaire.</p>
        <Link to="/register"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#6C47FF', color: 'white', padding: '1rem 2.75rem', borderRadius: '14px', fontSize: '1.05rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.25s', boxShadow: '0 0 60px rgba(108,71,255,0.35)' }}
          onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 0 90px rgba(108,71,255,0.55)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 0 60px rgba(108,71,255,0.35)'; }}>
          Créer mon compte gratuitement <ArrowRight size={20} />
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.04)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: 'rgba(240,238,248,0.2)' }}>© 2026 SkillUp Africa · Cotonou, Bénin</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[['/login','Connexion'],['/register','Inscription'],['/forgot-password','Mot de passe oublié']].map(([to,label]) => (
              <Link key={label} to={to} style={{ fontSize: '0.78rem', color: 'rgba(240,238,248,0.2)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color='rgba(240,238,248,0.5)'}
                onMouseLeave={e => e.target.style.color='rgba(240,238,248,0.2)'}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');

        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }

        * { margin:0; padding:0; box-sizing:border-box; }

        @media (max-width: 900px) {
          .desk-nav { display: none !important; }
          .burger   { display: flex !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 700px) {
          .stats-grid  { grid-template-columns: repeat(2,1fr) !important; }
          .ex-grid     { grid-template-columns: 1fr !important; }
          .testi-grid  { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}
