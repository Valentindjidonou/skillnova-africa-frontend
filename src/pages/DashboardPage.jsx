
import { useState } from 'react';
import { BookOpen, Zap, Award, LogOut, User, Home, Menu, X, ChevronRight, Play, Star, Bell, Search, Globe } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useDashboard from '../hooks/useDashboard';
import { Link, useLocation, useNavigate } from 'react-router-dom';
 
const navItems = [
  { label: 'Accueil',     icon: Home,    to: '/dashboard' },
  { label: 'Mes cours',   icon: BookOpen, to: '/courses' },
  { label: 'Exercices',   icon: Zap,      to: '/exercises' },
  { label: 'Certificats', icon: Award,    to: '/certificates' },
  { label: 'Portfolio',   icon: User,     to: '/portfolio' },
];

const quickActions = [
  { icon: '📐', label: 'Maths',    color: '#7C3AED', bg: 'rgba(124,58,237,0.12)', cat: 'Mathématiques' },
  { icon: '⚡', label: 'Physique', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', cat: 'Physique' },
  { icon: '💻', label: 'Dev Web',  color: '#10B981', bg: 'rgba(16,185,129,0.12)', cat: 'Dev Mobile' },
  { icon: '🐍', label: 'Python',   color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', cat: 'Data' },
  { icon: '🎨', label: 'Design',   color: '#EC4899', bg: 'rgba(236,72,153,0.12)', cat: 'Design' },
  { icon: '📊', label: 'Data',     color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', cat: 'Data' },
];

function Sidebar({ mobile, onClose }) {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const initial = user?.nom?.[0]?.toUpperCase() || 'E';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.4rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '1.15rem', background: 'linear-gradient(135deg,#7C3AED,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SkillUp Africa
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
            <Globe size={10} color="#10B981" />
            <span style={{ fontSize: '0.65rem', color: '#10B981', fontWeight: 500 }}>Pour toute l'Afrique 🌍</span>
          </div>
        </div>
        {mobile && (
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        )}
      </div>

      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link key={item.label} to={item.to} onClick={onClose}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s', background: active ? 'rgba(124,58,237,0.18)' : 'transparent', color: active ? '#9F67FF' : 'rgba(255,255,255,0.45)', border: active ? '1px solid rgba(124,58,237,0.2)' : '1px solid transparent' }}>
              <item.icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '8px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
            {initial}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '0.83rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.nom || 'Étudiant'}</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
          </div>
        </div>
        <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '6px', width: '100%' }}>
          <LogOut size={13} /> Se déconnecter
        </button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1rem' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', marginBottom: '10px', animation: 'pulse 1.5s infinite' }} />
      <div style={{ height: '24px', width: '50px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', marginBottom: '6px' }} />
      <div style={{ height: '12px', width: '70px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }} />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data, loading, error } = useDashboard();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const firstName = user?.nom?.split(' ')[0] || 'Étudiant';
  const initial = user?.nom?.[0]?.toUpperCase() || 'E';

  const stats = [
    { label: 'Cours',       value: data?.stats?.cours       ?? '—', icon: BookOpen, color: '#9F67FF', bg: 'rgba(124,58,237,0.12)' },
    { label: 'Exercices',   value: data?.stats?.exercices   ?? '—', icon: Zap,      color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
    { label: 'Certificats', value: data?.stats?.certificats ?? '—', icon: Award,    color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
    { label: 'Points',      value: data?.stats?.points      ?? '—', icon: Star,     color: '#60A5FA', bg: 'rgba(96,165,250,0.12)' },
  ];

  const enrollments = data?.enrollments || [];
  const workshop = data?.workshop || null;

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0F1E', color: 'white', fontFamily: 'Inter, sans-serif' }}>

      {/* SIDEBAR DESKTOP */}
      <aside className="sidebar-desktop"
        style={{ position: 'fixed', left: 0, top: 0, height: '100%', width: '240px', backgroundColor: '#111827', borderRight: '1px solid rgba(255,255,255,0.07)', zIndex: 40 }}>
        <Sidebar onClose={() => {}} />
      </aside>

      {/* SIDEBAR MOBILE OVERLAY */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSidebarOpen(false)} />
          <div style={{ position: 'relative', width: '260px', height: '100%', background: '#111827', borderRight: '1px solid rgba(255,255,255,0.07)', zIndex: 70 }}>
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* MAIN */}
      <main className="dashboard-main" style={{ marginLeft: '240px', minHeight: '100vh', paddingBottom: '5rem' }}>

        {/* TOP BAR */}
        <div style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(10,15,30,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="menu-btn" onClick={() => setSidebarOpen(true)}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: 'white', display: 'none', alignItems: 'center' }}>
              <Menu size={20} />
            </button>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', color: 'rgba(255,255,255,0.25)' }} />
              <input
                placeholder="Rechercher un cours..."
                onClick={() => navigate('/courses')}
                readOnly
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '7px 12px 7px 32px', fontSize: '0.82rem', color: 'white', outline: 'none', width: '220px', cursor: 'pointer' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '7px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', position: 'relative' }}>
              <Bell size={17} />
              <span style={{ position: 'absolute', top: '5px', right: '5px', width: '7px', height: '7px', background: '#F59E0B', borderRadius: '50%', border: '1.5px solid #0A0F1E' }} />
            </button>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem' }}>
              {initial}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ padding: '1.5rem 1.25rem', maxWidth: '900px' }}>

          {/* GREETING */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Globe size={13} color="#10B981" />
              <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 500 }}>SkillUp Africa · Ouvert à tout le continent 🌍</span>
            </div>
            <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 'clamp(1.4rem,4vw,1.9rem)', marginBottom: '4px' }}>
              Bonjour, {firstName} 👋
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem' }}>
              {loading
                ? 'Chargement de tes données...'
                : enrollments.length > 0
                  ? <><strong style={{ color: '#F59E0B' }}>{enrollments.length} cours</strong> en cours · Continue sur ta lancée !</>
                  : "Commence ton premier cours dès aujourd'hui !"}
            </p>
          </div>

          {/* STATS */}
          <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '1.75rem' }}>
            {loading
              ? [1,2,3,4].map(i => <SkeletonCard key={i} />)
              : stats.map(s => (
                <div key={s.label} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <s.icon size={18} color={s.color} />
                  </div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '1.5rem', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: '3px' }}>{s.label}</div>
                </div>
              ))
            }
          </div>

          {/* DISCIPLINES */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1rem' }}>Disciplines</h2>
              <Link to="/courses" style={{ fontSize: '0.78rem', color: '#9F67FF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
                Voir tout <ChevronRight size={13} />
              </Link>
            </div>
            <div className="quick-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '8px' }}>
              {quickActions.map(a => (
                <button key={a.label}
                  onClick={() => navigate(`/courses?categorie=${encodeURIComponent(a.cat)}`)}
                  style={{ background: a.bg, border: `1px solid ${a.color}22`, borderRadius: '12px', padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = a.color + '55'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = a.color + '22'; }}>
                  <span style={{ fontSize: '1.4rem' }}>{a.icon}</span>
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* COURS EN COURS */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1rem' }}>Continue à apprendre</h2>
              <Link to="/courses" style={{ fontSize: '0.78rem', color: '#9F67FF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
                Mes cours <ChevronRight size={13} />
              </Link>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[1,2].map(i => (
                  <div key={i} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1rem', height: '80px', animation: 'pulse 1.5s infinite' }} />
                ))}
              </div>
            ) : enrollments.length === 0 ? (
              <div style={{ background: '#111827', border: '1px dashed rgba(255,255,255,0.12)', borderRadius: '14px', padding: '2.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🚀</div>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.4rem' }}>Commence ton premier cours</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', marginBottom: '1.25rem' }}>Maths, Physique, Dev, Design... Choisis ta discipline</div>
                <Link to="/courses" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.55rem 1.25rem' }}>
                  Voir les cours
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {enrollments.map((e, i) => {
                  const c = e.courses;
                  const color = c?.color || '#7C3AED';
                  const courseId = e.course_id || c?.id;
                  return (
                    <div key={i}
                      onClick={() => courseId && navigate(`/courses/${courseId}`)}
                      style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1rem 1.1rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={el => { el.currentTarget.style.borderColor = color + '44'; el.currentTarget.style.background = '#1a2235'; }}
                      onMouseLeave={el => { el.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; el.currentTarget.style.background = '#111827'; }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                        {c?.icon || '📚'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.9rem', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c?.titre || 'Cours'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>
                          {c?.niveau} · {e.progress}% complété
                        </div>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${e.progress}%`, background: color, borderRadius: '2px', transition: 'width 1s ease' }} />
                        </div>
                      </div>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Play size={14} color={color} fill={color} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ATELIER LIVE */}
          {!loading && (
            <div style={{ marginBottom: '1.75rem' }}>
              {workshop ? (
                <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.18),rgba(245,158,11,0.1))', border: '1px solid rgba(124,58,237,0.22)', borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#F59E0B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>🔥 Prochain atelier live</div>
                    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '3px' }}>{workshop.titre}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                      {formatDate(workshop.date_heure)} · Plus que <strong style={{ color: '#F59E0B' }}>{workshop.placesRestantes} places</strong>
                    </div>
                  </div>
                  <button style={{ background: '#7C3AED', border: 'none', borderRadius: '10px', padding: '0.65rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, color: 'white', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    Réserver — {workshop.prix.toLocaleString()} FCFA
                  </button>
                </div>
              ) : (
                <div style={{ background: '#111827', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>📅</div>
                  <div>
                    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.9rem', marginBottom: '3px' }}>Aucun atelier prévu pour le moment</div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>Les prochains ateliers Fiverr & Upwork seront annoncés ici · Reviens bientôt 🔔</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '1rem', color: '#FCA5A5', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚠️</span><span>{error} — Vérifie ta connexion à Supabase</span>
            </div>
          )}

        </div>
      </main>

      {/* BOTTOM NAV MOBILE */}
      <nav className="bottom-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(17,24,39,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '0.6rem 0 0.5rem', display: 'none', zIndex: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {navItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <Link key={item.label} to={item.to} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', textDecoration: 'none', padding: '4px 10px', color: active ? '#9F67FF' : 'rgba(255,255,255,0.35)' }}>
                <div style={{ width: active ? '36px' : '32px', height: active ? '36px' : '32px', borderRadius: '10px', background: active ? 'rgba(124,58,237,0.2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                  <item.icon size={active ? 20 : 18} />
                </div>
                <span style={{ fontSize: '0.6rem', fontWeight: active ? 600 : 400 }}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .dashboard-main { margin-left: 0 !important; }
          .menu-btn { display: flex !important; }
          .bottom-nav { display: block !important; }
          .quick-grid { grid-template-columns: repeat(3,1fr) !important; }
        }
        @media (max-width: 480px) {
          .stat-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  );
}