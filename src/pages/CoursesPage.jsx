
import { useState } from 'react';
import { Search, BookOpen, Star, Home, Zap, Award, User, Menu, Globe, LogOut, X, Play, Lock, CheckCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useCourses from '../hooks/useCourses';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Accueil',     icon: Home,    to: '/dashboard' },
  { label: 'Mes cours',   icon: BookOpen, to: '/courses' },
  { label: 'Exercices',   icon: Zap,      to: '/exercises' },
  { label: 'Certificats', icon: Award,    to: '/certificates' },
  { label: 'Portfolio',   icon: User,     to: '/portfolio' },
];

const filters = [
  { key: 'tout',          label: 'Tout',    icon: '🌍' },
  { key: 'Mathématiques', label: 'Maths',   icon: '📐' },
  { key: 'Physique',      label: 'Physique',icon: '⚡' },
  { key: 'Dev Mobile',    label: 'Mobile',  icon: '📱' },
  { key: 'Data',          label: 'Data',    icon: '📊' },
  { key: 'Design',        label: 'Design',  icon: '🎨' },
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
        {mobile && <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}><X size={20} /></button>}
      </div>
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link key={item.label} to={item.to} onClick={onClose}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s', background: active ? 'rgba(124,58,237,0.18)' : 'transparent', color: active ? '#9F67FF' : 'rgba(255,255,255,0.45)', border: active ? '1px solid rgba(124,58,237,0.2)' : '1px solid transparent' }}>
              <item.icon size={17} />{item.label}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '8px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>{initial}</div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '0.83rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.nom}</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
          </div>
        </div>
        <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 6px', width: '100%' }}>
          <LogOut size={13} /> Se déconnecter
        </button>
      </div>
    </div>
  );
}

function CourseCard({ course, enrolled, progress, onEnroll, enrolling, onClick }) {
  const isFree = course.prix === 0;
  const color = course.color || '#7C3AED';
  return (
    <div
      onClick={onClick}
      style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = color + '44'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.4)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none'; }}>

      {/* Thumbnail */}
      <div style={{ height: '130px', background: `linear-gradient(135deg,${color}22,${color}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', position: 'relative', borderBottom: `1px solid ${color}22` }}>
        {course.icon || '📚'}
        {isFree && (
          <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#10B981', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '100px' }}>
            GRATUIT
          </span>
        )}
        {enrolled && (
          <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(124,58,237,0.9)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <CheckCircle size={10} /> Inscrit
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'inline-block', background: color + '18', color, fontSize: '0.65rem', fontWeight: 600, padding: '2px 8px', borderRadius: '100px', marginBottom: '8px', width: 'fit-content' }}>
          {course.categorie}
        </div>
        <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '0.92rem', marginBottom: '8px', lineHeight: 1.4, flex: 1 }}>
          {course.titre}
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginBottom: '12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {course.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Star size={11} color="#F59E0B" fill="#F59E0B" /> {course.niveau}
          </span>
        </div>

        {/* Barre de progression */}
        {enrolled && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>Progression</span>
              <span style={{ fontSize: '0.7rem', color, fontWeight: 600 }}>{progress}%</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: color, borderRadius: '2px', transition: 'width 0.8s ease' }} />
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1rem', color: isFree ? '#10B981' : '#9F67FF' }}>
            {isFree ? 'Gratuit' : `${course.prix.toLocaleString()} FCFA`}
          </span>
          {enrolled ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: color + '18', border: `1px solid ${color}44`, borderRadius: '8px', padding: '6px 14px', fontSize: '0.8rem', color, fontWeight: 600 }}>
              <Play size={13} fill={color} /> Continuer
            </span>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); onEnroll(course.id); }}
              disabled={enrolling === course.id}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: isFree ? '#10B981' : '#7C3AED', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '0.8rem', color: 'white', fontWeight: 600, cursor: enrolling === course.id ? 'not-allowed' : 'pointer', opacity: enrolling === course.id ? 0.7 : 1, transition: 'all 0.2s' }}>
              {enrolling === course.id ? '...' : isFree ? '✓ S\'inscrire' : <><Lock size={12} /> Acheter</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonCourseCard() {
  return (
    <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ height: '130px', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s infinite' }} />
      <div style={{ padding: '1rem' }}>
        <div style={{ height: '12px', width: '60px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginBottom: '10px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '16px', width: '90%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginBottom: '6px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '12px', width: '70%', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '36px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { courses, loading, error, activeFilter, setActiveFilter, search, setSearch, enroll, enrolling, isEnrolled, getProgress } = useCourses();
  const initial = user?.nom?.[0]?.toUpperCase() || 'E';

  const handleEnroll = async (courseId) => {
    const result = await enroll(courseId);
    if (result.success) toast.success('Inscription réussie ! 🎉');
    else toast.error(result.message);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0F1E', color: 'white', fontFamily: 'Inter, sans-serif' }}>

      <aside className="sidebar-desktop" style={{ position: 'fixed', left: 0, top: 0, height: '100%', width: '240px', backgroundColor: '#111827', borderRight: '1px solid rgba(255,255,255,0.07)', zIndex: 40 }}>
        <Sidebar onClose={() => {}} />
      </aside>

      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: 'relative', width: '260px', height: '100%', background: '#111827', borderRight: '1px solid rgba(255,255,255,0.07)', zIndex: 70 }}>
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <main className="dashboard-main" style={{ marginLeft: '240px', minHeight: '100vh', paddingBottom: '5rem' }}>

        {/* TOP BAR */}
        <div style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(10,15,30,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="menu-btn" onClick={() => setSidebarOpen(true)}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: 'white', display: 'none', alignItems: 'center' }}>
              <Menu size={20} />
            </button>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
              <input
                placeholder="Rechercher un cours..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '7px 12px 7px 32px', fontSize: '0.82rem', color: 'white', outline: 'none', width: '240px' }} />
            </div>
          </div>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem' }}>{initial}</div>
        </div>

        <div style={{ padding: '1.5rem 1.25rem', maxWidth: '1000px' }}>

          {/* HEADER */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 'clamp(1.4rem,4vw,1.9rem)', marginBottom: '4px' }}>
              Catalogue des cours 📚
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem' }}>
              {loading ? 'Chargement...' : `${courses.length} cours · Clique pour voir le contenu et t'inscrire`}
            </p>
          </div>

          {/* FILTRES */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {filters.map(f => (
              <button key={f.key} onClick={() => setActiveFilter(f.key)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '100px', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s', border: activeFilter === f.key ? '1px solid rgba(124,58,237,0.5)' : '1px solid rgba(255,255,255,0.1)', background: activeFilter === f.key ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)', color: activeFilter === f.key ? '#9F67FF' : 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>
                {f.icon} {f.label}
              </button>
            ))}
          </div>

          {/* GRILLE */}
          {error ? (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '1.25rem', color: '#FCA5A5', fontSize: '0.875rem' }}>
              ⚠️ {error}
            </div>
          ) : (
            <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
              {loading
                ? [1,2,3,4,5,6].map(i => <SkeletonCourseCard key={i} />)
                : courses.length === 0
                  ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                      <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '1rem' }}>Aucun cours trouvé</div>
                    </div>
                  )
                  : courses.map(course => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      enrolled={isEnrolled(course.id)}
                      progress={getProgress(course.id)}
                      onEnroll={handleEnroll}
                      enrolling={enrolling}
                      onClick={() => navigate(`/courses/${course.id}`)}
                    />
                  ))
              }
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
          .courses-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 480px) {
          .courses-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}