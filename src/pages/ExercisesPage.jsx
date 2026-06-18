
import { useState } from 'react';
import { Search, Home, BookOpen, Zap, Award, User, Menu, Globe, LogOut, X, CheckCircle, XCircle, Star, Trophy, Target, Send, MessageCircle, Bot, RefreshCw } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useExercises from '../hooks/useExercises';
import useAuthStore from '../store/authStore';
import api from '../lib/api';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Accueil',     icon: Home,     to: '/dashboard' },
  { label: 'Mes cours',   icon: BookOpen,  to: '/courses' },
  { label: 'Exercices',   icon: Zap,       to: '/exercises' },
  { label: 'Certificats', icon: Award,     to: '/certificates' },
  { label: 'Portfolio',   icon: User,      to: '/portfolio' },
];

const disciplines = [
  { key: 'tout',          label: 'Tout',     icon: '🌍', color: '#9F67FF' },
  { key: 'Mathématiques', label: 'Maths',    icon: '📐', color: '#7C3AED' },
  { key: 'Physique',      label: 'Physique', icon: '⚡', color: '#F59E0B' },
  { key: 'Chimie',        label: 'Chimie',   icon: '🧪', color: '#EF4444' },
];

const niveaux = [
  { key: 'tout',      label: 'Tous niveaux' },
  { key: 'Lycée',     label: 'Lycée' },
  { key: 'Terminale', label: 'Terminale' },
  { key: 'Licence 1', label: 'Licence 1' },
  { key: 'Licence 2', label: 'Licence 2' },
  { key: 'Master',    label: 'Master' },
];

function Sidebar({ mobile, onClose }) {
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

function ExerciseCard({ exercise }) {
  const [reponses, setReponses] = useState(Array(exercise.questions?.length || 4).fill(''));
  const [correction, setCorrection] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const disciplineColor = exercise.discipline === 'Mathématiques' ? '#7C3AED' : exercise.discipline === 'Physique' ? '#F59E0B' : '#EF4444';
  const disciplineIcon = exercise.discipline === 'Mathématiques' ? '📐' : exercise.discipline === 'Physique' ? '⚡' : '🧪';
  const isIa = exercise.source === 'ia';

  const handleSubmit = async () => {
    const empty = reponses.filter(r => !r.trim()).length;
    if (empty === reponses.length) {
      toast.error('Réponds à au moins une question !');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post(`/exercises/${exercise.id}/submit`, { reponses });
      setCorrection(res.data);
      const score = res.data.correction.score;
      const max = res.data.correction.score_max;
      if (score >= max * 0.8) toast.success(`Excellent ! ${score}/${max} 🎉`);
      else if (score >= max * 0.5) toast.success(`Bien ! ${score}/${max} 👍`);
      else toast(`${score}/${max} — Lis bien la correction ! 📖`, { icon: '💪' });
    } catch (err) {
      toast.error('Erreur lors de la correction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setReponses(Array(exercise.questions?.length || 4).fill(''));
    setCorrection(null);
    setChatMessages([]);
    setChatOpen(false);
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'etudiant', text: msg }]);
    setChatLoading(true);
    try {
      const res = await api.post(`/exercises/${exercise.id}/chat`, {
        message: msg,
        context: correction?.correction,
      });
      setChatMessages(prev => [...prev, { role: 'ia', text: res.data.reponse }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'ia', text: 'Désolé, une erreur s\'est produite.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div style={{ background: '#111827', border: `1px solid ${correction ? (correction.correction.score >= correction.correction.score_max * 0.5 ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)') : 'rgba(255,255,255,0.07)'}`, borderRadius: '18px', overflow: 'hidden', transition: 'border-color 0.3s' }}>

      {/* Barre colorée */}
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${disciplineColor}, ${disciplineColor}66)` }} />

      <div style={{ padding: '1.25rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: disciplineColor + '18', color: disciplineColor, fontSize: '0.68rem', fontWeight: 600, padding: '3px 10px', borderRadius: '100px' }}>
                {disciplineIcon} {exercise.discipline}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', padding: '3px 10px', borderRadius: '100px' }}>
                {exercise.niveau}
              </span>
              {isIa && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'rgba(16,185,129,0.12)', color: '#10B981', fontSize: '0.68rem', fontWeight: 600, padding: '3px 10px', borderRadius: '100px' }}>
                  <Bot size={10} /> IA du jour
                </span>
              )}
            </div>
            <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1rem', margin: 0, lineHeight: 1.4 }}>
              {exercise.titre}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245,158,11,0.12)', borderRadius: '8px', padding: '5px 8px', flexShrink: 0 }}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <span style={{ fontSize: '0.72rem', color: '#F59E0B', fontWeight: 600 }}>{exercise.points} pts</span>
          </div>
        </div>

        {/* QUESTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '1.25rem' }}>
          {(exercise.questions || []).map((q, idx) => {
            const corrQ = correction?.correction?.corrections?.find(c => c.question_id === q.id);
            return (
              <div key={q.id} style={{ background: corrQ ? (corrQ.correct ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)') : 'rgba(255,255,255,0.02)', border: `1px solid ${corrQ ? (corrQ.correct ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)') : 'rgba(255,255,255,0.06)'}`, borderRadius: '12px', padding: '1rem', transition: 'all 0.3s' }}>

                {/* Numéro + question */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: disciplineColor + '20', color: disciplineColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0 }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.88rem', fontWeight: 500, margin: '0 0 4px', lineHeight: 1.5, color: 'rgba(255,255,255,0.9)' }}>
                      {q.question}
                    </p>
                    {q.indication && (
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', margin: 0, fontStyle: 'italic' }}>
                        💡 {q.indication}
                      </p>
                    )}
                  </div>
                </div>

                {/* Zone de réponse */}
                {!correction ? (
                  <textarea
                    value={reponses[idx]}
                    onChange={e => {
                      const newRep = [...reponses];
                      newRep[idx] = e.target.value;
                      setReponses(newRep);
                    }}
                    placeholder="Écris ta réponse ici... (calculs, raisonnements, démonstrations)"
                    rows={3}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.65rem 0.85rem', fontSize: '0.83rem', color: 'white', outline: 'none', resize: 'vertical', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}
                    onFocus={e => { e.target.style.borderColor = disciplineColor + '66'; e.target.style.boxShadow = `0 0 0 3px ${disciplineColor}15`; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                  />
                ) : (
                  <div>
                    {/* Réponse étudiant */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '0.6rem 0.85rem', marginBottom: '8px' }}>
                      <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', margin: '0 0 4px', fontWeight: 500 }}>Ta réponse :</p>
                      <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5 }}>
                        {reponses[idx] || <em style={{ color: 'rgba(255,255,255,0.2)' }}>Pas de réponse</em>}
                      </p>
                    </div>
                    {/* Correction IA */}
                    {corrQ && (
                      <div style={{ background: corrQ.correct ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.06)', borderRadius: '8px', padding: '0.75rem 0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {corrQ.correct ? <CheckCircle size={14} color="#10B981" /> : <XCircle size={14} color="#EF4444" />}
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: corrQ.correct ? '#10B981' : '#FCA5A5' }}>
                              {corrQ.correct ? 'Correct' : 'À revoir'}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: disciplineColor, fontWeight: 600, background: disciplineColor + '18', padding: '2px 8px', borderRadius: '6px' }}>
                            {corrQ.points}/10
                          </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 6px', lineHeight: 1.5 }}>
                          <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Solution :</strong> {corrQ.reponse_correcte}
                        </p>
                        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', margin: '0 0 4px', lineHeight: 1.5 }}>
                          📝 {corrQ.feedback}
                        </p>
                        {corrQ.conseil && (
                          <p style={{ fontSize: '0.75rem', color: '#F59E0B', margin: 0, lineHeight: 1.5 }}>
                            💪 {corrQ.conseil}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* BOUTON SOUMETTRE / RÉSULTATS */}
        {!correction ? (
          <button onClick={handleSubmit} disabled={submitting}
            style={{ width: '100%', background: 'linear-gradient(135deg,#7C3AED,#5B21B6)', border: 'none', borderRadius: '12px', padding: '0.85rem', fontSize: '0.9rem', fontWeight: 700, color: 'white', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: submitting ? 0.7 : 1, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}>
            {submitting ? (
              <><Bot size={18} style={{ animation: 'spin 1s linear infinite' }} /> L'IA corrige tes réponses...</>
            ) : (
              <><Send size={16} /> Soumettre pour correction IA</>
            )}
          </button>
        ) : (
          <div>
            {/* Bilan */}
            <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(245,158,11,0.08))', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '12px', padding: '1rem', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>
                    Score : {correction.correction.score}/{correction.correction.score_max}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#F59E0B', fontWeight: 500 }}>{correction.correction.appreciation}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Points gagnés</div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#10B981' }}>+{correction.points_gagnes}</div>
                </div>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', marginBottom: '10px' }}>
                <div style={{ height: '100%', width: `${(correction.correction.score / correction.correction.score_max) * 100}%`, background: 'linear-gradient(90deg,#7C3AED,#F59E0B)', borderRadius: '3px', transition: 'width 1s ease' }} />
              </div>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', margin: '0 0 4px', lineHeight: 1.6 }}>
                {correction.correction.bilan}
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button onClick={handleReset}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.65rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                <RefreshCw size={14} /> Recommencer
              </button>
              <button onClick={() => setChatOpen(!chatOpen)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: chatOpen ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '10px', padding: '0.65rem', fontSize: '0.82rem', color: '#9F67FF', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                <MessageCircle size={14} /> Demander à l'IA
              </button>
            </div>

            {/* CHAT IA */}
            {chatOpen && (
              <div style={{ marginTop: '10px', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bot size={15} color="#9F67FF" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#9F67FF' }}>Chat avec l'IA tuteur</span>
                </div>

                <div style={{ maxHeight: '200px', overflowY: 'auto', padding: '0.75rem' }}>
                  {chatMessages.length === 0 && (
                    <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', margin: 0 }}>
                      Pose une question sur l'exercice ou la correction...
                    </p>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} style={{ marginBottom: '10px', display: 'flex', gap: '8px', justifyContent: msg.role === 'etudiant' ? 'flex-end' : 'flex-start' }}>
                      {msg.role === 'ia' && (
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                          <Bot size={12} color="#9F67FF" />
                        </div>
                      )}
                      <div style={{ maxWidth: '85%', background: msg.role === 'etudiant' ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.06)', borderRadius: msg.role === 'etudiant' ? '12px 12px 4px 12px' : '12px 12px 12px 4px', padding: '0.6rem 0.85rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bot size={12} color="#9F67FF" />
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>L'IA réfléchit...</div>
                    </div>
                  )}
                </div>

                <div style={{ padding: '0.65rem', borderTop: '1px solid rgba(124,58,237,0.1)', display: 'flex', gap: '8px' }}>
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleChat()}
                    placeholder="Ex: Je n'ai pas compris la question 2..."
                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '7px 12px', fontSize: '0.8rem', color: 'white', outline: 'none', fontFamily: 'Inter, sans-serif' }}
                  />
                  <button onClick={handleChat} disabled={chatLoading || !chatInput.trim()}
                    style={{ background: '#7C3AED', border: 'none', borderRadius: '8px', padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Send size={14} color="white" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonExCard() {
  return (
    <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', overflow: 'hidden' }}>
      <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)' }} />
      <div style={{ padding: '1.25rem' }}>
        <div style={{ height: '14px', width: '120px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginBottom: '10px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '18px', width: '80%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }} />
        {[1,2,3,4].map(i => (
          <div key={i} style={{ height: '90px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', marginBottom: '10px', animation: 'pulse 1.5s infinite' }} />
        ))}
      </div>
    </div>
  );
}

export default function ExercisesPage() {
  const { user } = useAuthStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { exercises, loading, error, discipline, setDiscipline, niveau, setNiveau, search, setSearch, stats } = useExercises();
  const initial = user?.nom?.[0]?.toUpperCase() || 'E';

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
              <input placeholder="Chercher un exercice..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '7px 12px 7px 32px', fontSize: '0.82rem', color: 'white', outline: 'none', width: '230px' }} />
            </div>
          </div>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem' }}>{initial}</div>
        </div>

        <div style={{ padding: '1.5rem 1.25rem', maxWidth: '1000px' }}>

          {/* HEADER */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 'clamp(1.4rem,4vw,1.9rem)', margin: 0 }}>Exercices corrigés ⚡</h1>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16,185,129,0.12)', color: '#10B981', fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: '100px' }}>
                <Bot size={11} /> 3 nouveaux / jour
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem', margin: 0 }}>
              Questions ouvertes · Correction IA instantanée · Chat avec le tuteur
            </p>
          </div>

          {/* STATS */}
          {!loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '1.25rem' }} className="stat-grid">
              {[
                { icon: Target,  label: 'Disponibles', value: stats.total,    color: '#9F67FF', bg: 'rgba(124,58,237,0.12)' },
                { icon: Zap,     label: 'Résolus',     value: stats.resolus,  color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
                { icon: Trophy,  label: 'Réussis',     value: stats.corrects, color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
              ].map(s => (
                <div key={s.label} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <s.icon size={18} color={s.color} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '1.4rem', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FILTRES */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {disciplines.map(d => (
              <button key={d.key} onClick={() => setDiscipline(d.key)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '100px', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s', border: discipline === d.key ? `1px solid ${d.color}55` : '1px solid rgba(255,255,255,0.1)', background: discipline === d.key ? d.color + '20' : 'rgba(255,255,255,0.04)', color: discipline === d.key ? d.color : 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>
                {d.icon} {d.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {niveaux.map(n => (
              <button key={n.key} onClick={() => setNiveau(n.key)}
                style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s', border: niveau === n.key ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.07)', background: niveau === n.key ? 'rgba(255,255,255,0.1)' : 'transparent', color: niveau === n.key ? 'white' : 'rgba(255,255,255,0.35)', fontFamily: 'Inter, sans-serif' }}>
                {n.label}
              </button>
            ))}
          </div>

          {/* GRILLE */}
          {error ? (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '1.25rem', color: '#FCA5A5', fontSize: '0.875rem' }}>
              ⚠️ {error}
            </div>
          ) : (
            <div className="exercises-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' }}>
              {loading
                ? [1,2,3,4].map(i => <SkeletonExCard key={i} />)
                : exercises.length === 0
                  ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                      <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}>Aucun exercice trouvé</div>
                    </div>
                  )
                  : exercises.map(ex => <ExerciseCard key={ex.id} exercise={ex} />)
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
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .dashboard-main { margin-left: 0 !important; }
          .menu-btn { display: flex !important; }
          .bottom-nav { display: block !important; }
          .exercises-grid { grid-template-columns: 1fr !important; }
          .stat-grid { grid-template-columns: repeat(3,1fr) !important; }
        }
        @media (max-width: 480px) {
          .stat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
