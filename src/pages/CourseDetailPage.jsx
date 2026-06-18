
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Zap, Award, User, Menu, Globe, LogOut, X, Play, Lock, CheckCircle, Clock, ChevronRight, ArrowLeft, FileText, Send } from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../lib/api';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Accueil',     icon: Home,    to: '/dashboard' },
  { label: 'Mes cours',   icon: BookOpen, to: '/courses' },
  { label: 'Exercices',   icon: Zap,      to: '/exercises' },
  { label: 'Certificats', icon: Award,    to: '/certificates' },
  { label: 'Portfolio',   icon: User,     to: '/portfolio' },
];

function Sidebar({ onClose, mobile }) {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const initial = user?.nom?.[0]?.toUpperCase() || 'E';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.4rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '1.15rem', background: 'linear-gradient(135deg,#7C3AED,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillUp Africa</div>
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

function ModuleContent({ module, courseId, onComplete, completed, isEnrolled }) {
  const [task, setTask] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitTask = async () => {
    if (!task.trim()) { toast.error('Écris ta réponse avant de soumettre'); return; }
    setSubmitting(true);
    try {
      await api.post(`/courses/${courseId}/modules/${module.id}/task`, { contenu_rendu: task });
      toast.success('Tâche soumise ! ✅');
      onComplete(module.id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isEnrolled && !module.is_free) {
    return (
      <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '3rem', textAlign: 'center' }}>
        <Lock size={32} color="rgba(255,255,255,0.2)" style={{ marginBottom: '1rem' }} />
        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, marginBottom: '0.5rem' }}>Module verrouillé</div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Inscris-toi pour accéder à ce contenu</div>
      </div>
    );
  }

  return (
    <div>
     {/* Contenu texte */}
{module.contenu && (
  <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1rem' }}>
    <pre style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif', margin: 0 }}>
      {module.contenu}
    </pre>
  </div>
)}

{/* Vidéo */}
{module.media_type === 'video' && module.media_url && (
  <div style={{ background: '#000', borderRadius: '14px', overflow: 'hidden', marginBottom: '1rem' }}>
    <video controls style={{ width: '100%', maxHeight: '400px' }} src={module.media_url} />
  </div>
)}

{/* Image */}
{module.media_type === 'image' && module.media_url && (
  <div style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: '1rem' }}>
    <img src={module.media_url} alt={module.titre} style={{ width: '100%', maxHeight: '450px', objectFit: 'contain', background: '#111827', borderRadius: '14px' }} />
  </div>
)}

{/* Document PDF */}
{module.media_type === 'document' && module.media_url && (
  <div style={{ background: '#111827', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '14px', overflow: 'hidden', marginBottom: '1rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.5rem' }}>📄</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Document du cours</div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>PDF</div>
        </div>
      </div>
      <a href={module.media_url} target="_blank" rel="noopener noreferrer"
        style={{ background: '#F59E0B', borderRadius: '8px', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600, color: '#000', textDecoration: 'none' }}>
        📥 Ouvrir
      </a>
    </div>
    <iframe src={module.media_url} style={{ width: '100%', height: '500px', border: 'none' }} title="Document" />
  </div>
)}

{/* Aucun contenu */}
{!module.contenu && !module.media_url && (
  <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '3rem', textAlign: 'center', marginBottom: '1rem' }}>
    <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📝</div>
    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>Contenu en cours de préparation</div>
  </div>
)}

      {/* Marquer comme lu */}
      {!completed && !module.has_task && (
        <button onClick={() => onComplete(module.id)}
          style={{ width: '100%', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', padding: '0.85rem', fontSize: '0.875rem', fontWeight: 600, color: '#10B981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'Inter, sans-serif' }}>
          <CheckCircle size={18} /> Marquer comme lu
        </button>
      )}

      {/* Tâche */}
      {module.has_task && !completed && (
        <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '14px', padding: '1.25rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
            <FileText size={16} color="#9F67FF" />
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#9F67FF' }}>Tâche à rendre</span>
          </div>
          <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem', lineHeight: 1.6 }}>
            {module.task_description}
          </p>
          <textarea
            value={task}
            onChange={e => setTask(e.target.value)}
            placeholder="Écris ta réponse ici, montre toutes tes étapes..."
            rows={5}
            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.75rem', fontSize: '0.83rem', color: 'white', outline: 'none', resize: 'vertical', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, marginBottom: '10px', boxSizing: 'border-box' }}
          />
          <button onClick={handleSubmitTask} disabled={submitting}
            style={{ width: '100%', background: '#7C3AED', border: 'none', borderRadius: '10px', padding: '0.75rem', fontSize: '0.875rem', fontWeight: 600, color: 'white', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', opacity: submitting ? 0.7 : 1 }}>
            <Send size={15} /> {submitting ? 'Soumission...' : 'Soumettre ma tâche'}
          </button>
        </div>
      )}

      {completed && (
        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1rem' }}>
          <CheckCircle size={18} color="#10B981" />
          <span style={{ fontSize: '0.875rem', color: '#10B981', fontWeight: 500 }}>Module complété ✓</span>
        </div>
      )}
    </div>
  );
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const initial = user?.nom?.[0]?.toUpperCase() || 'E';

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [courseRes, enrollRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get('/courses/user/enrollments'),
      ]);

      setCourse(courseRes.data);

      const myEnroll = enrollRes.data.find(e => e.course_id === id);
      setEnrollment(myEnroll || null);
      setCompletedModules(myEnroll?.completed_modules || []);

      const modules = courseRes.data.modules || [];
      if (modules.length > 0) setActiveModule(modules[0]);
    } catch (err) {
      toast.error('Impossible de charger ce cours');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await api.post(`/courses/${id}/enroll`);
      toast.success('Inscription réussie ! 🎉');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur inscription');
    } finally {
      setEnrolling(false);
    }
  };

  const handleCompleteModule = async (moduleId) => {
    try {
      const res = await api.post(`/courses/${id}/modules/${moduleId}/complete`);
      const newCompleted = [...completedModules, moduleId];
      setCompletedModules(newCompleted);

      if (res.data.completed) {
        toast.success('🎉 Cours terminé ! Félicitations !', { duration: 4000 });
      } else {
        toast.success(`Module validé ! ${res.data.progress}% du cours complété`);
        const modules = course?.modules || [];
        const idx = modules.findIndex(m => m.id === moduleId);
        if (idx < modules.length - 1) setActiveModule(modules[idx + 1]);
      }
    } catch {
      toast.error('Erreur lors de la validation');
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0F1E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>Chargement...</div>
    </div>
  );

  const modules = course?.modules || [];
  const color = course?.color || '#7C3AED';
  const isEnrolled = !!enrollment;
  const progress = enrollment?.progress || 0;

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

      <main className="dashboard-main" style={{ marginLeft: '240px', minHeight: '100vh' }}>

        {/* TOP BAR */}
        <div style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(10,15,30,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="menu-btn" onClick={() => setSidebarOpen(true)}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: 'white', display: 'none', alignItems: 'center' }}>
              <Menu size={20} />
            </button>
            <button onClick={() => navigate('/courses')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>
              <ArrowLeft size={16} /> Retour
            </button>
          </div>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem' }}>{initial}</div>
        </div>

        {/* LAYOUT : sidebar modules + contenu */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: 'calc(100vh - 60px)' }} className="course-layout">

          {/* SIDEBAR MODULES */}
          <div style={{ borderRight: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', overflowY: 'auto' }}>

            <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{course?.icon}</div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px', lineHeight: 1.4 }}>{course?.titre}</h2>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={{ background: color + '18', color, fontSize: '0.65rem', fontWeight: 600, padding: '2px 8px', borderRadius: '100px' }}>{course?.categorie}</span>
                <span style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '100px' }}>{course?.niveau}</span>
              </div>

              {isEnrolled ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>Progression</span>
                    <span style={{ fontSize: '0.7rem', color, fontWeight: 600 }}>{progress}%</span>
                  </div>
                  <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: color, borderRadius: '3px', transition: 'width 0.8s' }} />
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                    {completedModules.length}/{modules.length} modules
                  </div>
                </div>
              ) : (
                <button onClick={handleEnroll} disabled={enrolling}
                  style={{ width: '100%', background: course?.prix === 0 ? '#10B981' : '#7C3AED', border: 'none', borderRadius: '10px', padding: '0.65rem', fontSize: '0.85rem', fontWeight: 600, color: 'white', cursor: enrolling ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', opacity: enrolling ? 0.7 : 1 }}>
                  {enrolling ? '...' : course?.prix === 0 ? '✓ S\'inscrire gratuitement' : `S'inscrire — ${course?.prix?.toLocaleString()} FCFA`}
                </button>
              )}
            </div>

            <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
              {modules.length} module{modules.length > 1 ? 's' : ''}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {modules.map((mod, idx) => {
                const accessible = mod.is_free || isEnrolled;
                const completed = completedModules.includes(mod.id);
                const isActive = activeModule?.id === mod.id;
                return (
                  <button key={mod.id}
                    onClick={() => accessible && setActiveModule(mod)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.65rem 0.75rem', borderRadius: '10px', border: isActive ? `1px solid ${color}44` : '1px solid transparent', background: isActive ? color + '12' : 'transparent', cursor: accessible ? 'pointer' : 'not-allowed', textAlign: 'left', width: '100%', transition: 'all 0.15s', opacity: accessible ? 1 : 0.5, fontFamily: 'Inter, sans-serif' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '7px', background: completed ? 'rgba(16,185,129,0.15)' : isActive ? color + '20' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {completed
                        ? <CheckCircle size={13} color="#10B981" />
                        : accessible
                          ? <Play size={10} color={isActive ? color : 'rgba(255,255,255,0.35)'} fill={isActive ? color : 'transparent'} />
                          : <Lock size={10} color="rgba(255,255,255,0.25)" />
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: isActive ? 600 : 400, color: completed ? '#10B981' : isActive ? 'white' : 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {idx + 1}. {mod.titre}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', display: 'flex', gap: '6px' }}>
                        {mod.is_free && <span style={{ color: '#10B981' }}>Gratuit</span>}
                        {mod.has_task && <span>Tâche</span>}
                        {mod.duree && <span>{mod.duree} min</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CONTENU MODULE */}
          <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
            {!activeModule ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '500px', margin: '0 auto' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{course?.icon}</div>
                <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1.4rem', marginBottom: '0.75rem' }}>{course?.titre}</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>{course?.description}</p>
                {!isEnrolled && (
                  <button onClick={handleEnroll} disabled={enrolling}
                    style={{ background: course?.prix === 0 ? '#10B981' : '#7C3AED', border: 'none', borderRadius: '12px', padding: '0.85rem 2rem', fontSize: '0.95rem', fontWeight: 600, color: 'white', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                    {course?.prix === 0 ? '✓ S\'inscrire gratuitement' : `S'inscrire — ${course?.prix?.toLocaleString()} FCFA`}
                  </button>
                )}
              </div>
            ) : (
              <div style={{ maxWidth: '700px' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>
                    Module {modules.findIndex(m => m.id === activeModule.id) + 1} / {modules.length}
                    {completedModules.includes(activeModule.id) && <span style={{ marginLeft: '8px', color: '#10B981', fontWeight: 600 }}>✓ Complété</span>}
                  </div>
                  <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '1.4rem', marginBottom: '8px' }}>
                    {activeModule.titre}
                  </h1>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {activeModule.is_free && <span style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981', fontSize: '0.68rem', fontWeight: 600, padding: '3px 10px', borderRadius: '100px' }}>Gratuit</span>}
                    {activeModule.duree && <span style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', padding: '3px 10px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={10} /> {activeModule.duree} min</span>}
                    {activeModule.has_task && <span style={{ background: 'rgba(124,58,237,0.12)', color: '#9F67FF', fontSize: '0.68rem', fontWeight: 600, padding: '3px 10px', borderRadius: '100px' }}>Tâche obligatoire</span>}
                  </div>
                </div>

                <ModuleContent
                  module={activeModule}
                  courseId={id}
                  onComplete={handleCompleteModule}
                  completed={completedModules.includes(activeModule.id)}
                  isEnrolled={isEnrolled}
                />

                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  {(() => {
                    const idx = modules.findIndex(m => m.id === activeModule.id);
                    return (
                      <>
                        <button onClick={() => idx > 0 && setActiveModule(modules[idx - 1])} disabled={idx === 0}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.65rem 1.1rem', fontSize: '0.83rem', color: 'rgba(255,255,255,0.5)', cursor: idx === 0 ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', opacity: idx === 0 ? 0.3 : 1 }}>
                          ← Précédent
                        </button>
                        <button onClick={() => idx < modules.length - 1 && setActiveModule(modules[idx + 1])} disabled={idx === modules.length - 1}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: color + '18', border: `1px solid ${color}44`, borderRadius: '10px', padding: '0.65rem 1.1rem', fontSize: '0.83rem', color, fontWeight: 600, cursor: idx === modules.length - 1 ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', opacity: idx === modules.length - 1 ? 0.3 : 1 }}>
                          Suivant <ChevronRight size={15} />
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
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
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .dashboard-main { margin-left: 0 !important; }
          .menu-btn { display: flex !important; }
          .bottom-nav { display: block !important; }
          .course-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
