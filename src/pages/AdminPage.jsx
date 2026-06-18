
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, BookOpen, Zap, Calendar, Plus, Trash2, Edit3, X, Save, RefreshCw, Bot, ChevronDown, ChevronUp, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import api from '../lib/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import FileUploader from '../components/FileUploader';

const TABS = [
  { key: 'dashboard', label: 'Tableau de bord', icon: '📊' },
  { key: 'courses',   label: 'Cours',           icon: '📚' },
  { key: 'exercises', label: 'Exercices',        icon: '⚡' },
  { key: 'workshops', label: 'Ateliers & Séances', icon: '🎯' },
  { key: 'users',     label: 'Utilisateurs',    icon: '👥' },
];

const CATEGORIES = ['Mathématiques', 'Physique', 'Chimie', 'Dev Mobile', 'Dev Web', 'Data', 'Design', 'Python'];
const NIVEAUX = ['Lycée', 'Terminale', 'Licence 1', 'Licence 2', 'Master', 'Tous niveaux', 'Débutant'];
const COLORS = ['#7C3AED', '#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#EC4899', '#8B5CF6', '#F97316'];
const ICONS = ['📐', '⚡', '🧪', '💻', '📱', '📊', '🎨', '🐍', '📚', '🔬', '🌍', '💡'];
const TYPES_WORKSHOP = [
  { key: 'atelier',      label: 'Atelier pratique' },
  { key: 'orientation',  label: 'Séance d\'orientation' },
  { key: 'conference',   label: 'Conférence' },
  { key: 'mentoring',    label: 'Session de mentoring' },
];

// ===== COMPOSANTS UTILITAIRES =====
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', zIndex: 101 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1rem', margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div style={{ padding: '1.5rem' }}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children, required }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px', padding: '0.65rem 0.9rem', fontSize: '0.875rem', color: 'white',
  outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
};

const btnPrimary = {
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  background: '#7C3AED', border: 'none', borderRadius: '10px',
  padding: '0.65rem 1.25rem', fontSize: '0.85rem', fontWeight: 600,
  color: 'white', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
};

const btnDanger = {
  ...btnPrimary, background: 'rgba(239,68,68,0.15)',
  border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5',
};

const btnSecondary = {
  ...btnPrimary, background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)',
};

// ===== MODULE BUILDER =====
function ModuleBuilder({ modules, onChange }) {
  const addModule = () => {
    onChange([...modules, {
      id: `m${Date.now()}`, ordre: modules.length + 1,
      titre: '', contenu: '', is_free: modules.length === 0,
      has_task: false, task_description: '', duree: 20,
    }]);
  };

  const updateModule = (idx, key, val) => {
    const updated = [...modules];
    updated[idx] = { ...updated[idx], [key]: val };
    onChange(updated);
  };

  const removeModule = (idx) => onChange(modules.filter((_, i) => i !== idx));

  const [expanded, setExpanded] = useState({});
  const toggle = (idx) => setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Modules ({modules.length})
        </label>
        
        <button type="button" onClick={addModule} style={{ ...btnSecondary, padding: '5px 12px', fontSize: '0.78rem' }}>
          <Plus size={13} /> Ajouter un module
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {modules.map((mod, idx) => (
          <div key={mod.id || idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem 1rem', cursor: 'pointer' }} onClick={() => toggle(idx)}>
              <span style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(124,58,237,0.2)', color: '#9F67FF', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{idx + 1}</span>
              <span style={{ flex: 1, fontSize: '0.85rem', color: mod.titre ? 'white' : 'rgba(255,255,255,0.3)' }}>{mod.titre || 'Module sans titre'}</span>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {mod.is_free && <span style={{ fontSize: '0.65rem', background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '2px 6px', borderRadius: '6px' }}>Gratuit</span>}
                {mod.has_task && <span style={{ fontSize: '0.65rem', background: 'rgba(124,58,237,0.15)', color: '#9F67FF', padding: '2px 6px', borderRadius: '6px' }}>Tâche</span>}
                <button type="button" onClick={e => { e.stopPropagation(); removeModule(idx); }} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', padding: '2px' }}>
                  <Trash2 size={13} />
                </button>
                {expanded[idx] ? <ChevronUp size={14} color="rgba(255,255,255,0.3)" /> : <ChevronDown size={14} color="rgba(255,255,255,0.3)" />}
              </div>
            </div>
            {expanded[idx] && (
              <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ height: '12px' }} />
                <Field label="Titre du module" required>
                  <input value={mod.titre} onChange={e => updateModule(idx, 'titre', e.target.value)} style={inputStyle} placeholder="Ex: Introduction aux dérivées" />
                </Field>
                {/* Type de contenu additionnel */}
<div style={{ marginBottom: '1rem' }}>
  <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
    Contenu additionnel
  </label>
  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
    {[
      { key: '', label: 'Aucun' },
      { key: 'video', label: '🎥 Vidéo' },
      { key: 'image', label: '🖼 Image' },
      { key: 'document', label: '📄 Document' },
    ].map(t => (
      <button key={t.key} type="button"
        onClick={() => updateModule(idx, 'media_type', t.key)}
        style={{ padding: '5px 12px', borderRadius: '8px', border: (mod.media_type || '') === t.key ? '1.5px solid #7C3AED' : '1px solid rgba(255,255,255,0.1)', background: (mod.media_type || '') === t.key ? 'rgba(124,58,237,0.15)' : 'transparent', color: (mod.media_type || '') === t.key ? '#9F67FF' : 'rgba(255,255,255,0.4)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
        {t.label}
      </button>
    ))}
  </div>
  {mod.media_type && (
    <FileUploader
      type={mod.media_type}
      value={mod.media_url || ''}
      onChange={url => updateModule(idx, 'media_url', url)}
    />
  )}
</div>
                <Field label="Contenu (texte du cours)">
                  <textarea value={mod.contenu} onChange={e => updateModule(idx, 'contenu', e.target.value)} rows={6} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} placeholder="Écris le contenu du module ici..." />
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '4px' }}>Durée (min)</label>
                    <input type="number" value={mod.duree} onChange={e => updateModule(idx, 'duree', Number(e.target.value))} style={inputStyle} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={mod.is_free} onChange={e => updateModule(idx, 'is_free', e.target.checked)} />
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Gratuit</span>
                    </label>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={mod.has_task} onChange={e => updateModule(idx, 'has_task', e.target.checked)} />
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Tâche obligatoire</span>
                    </label>
                  </div>
                </div>
                {mod.has_task && (
                  <Field label="Description de la tâche">
                    <textarea value={mod.task_description} onChange={e => updateModule(idx, 'task_description', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Ex: Résous les équations suivantes en montrant toutes les étapes..." />
                  </Field>
                )}
              </div>
            )}
          </div>
        ))}
        {modules.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '12px' }}>
            Aucun module — clique sur "Ajouter un module"
          </div>
        )}
      </div>
    </div>
  );
}

// ===== QUESTION BUILDER =====
function QuestionBuilder({ questions, onChange }) {
  const addQuestion = () => {
    onChange([...questions, { id: questions.length + 1, question: '', indication: '' }]);
  };
  const updateQ = (idx, key, val) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], [key]: val };
    onChange(updated);
  };
  const removeQ = (idx) => {
    const updated = questions.filter((_, i) => i !== idx).map((q, i) => ({ ...q, id: i + 1 }));
    onChange(updated);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Questions ({questions.length})
        </label>
        <button type="button" onClick={addQuestion} disabled={questions.length >= 6} style={{ ...btnSecondary, padding: '5px 12px', fontSize: '0.78rem', opacity: questions.length >= 6 ? 0.5 : 1 }}>
          <Plus size={13} /> Ajouter
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {questions.map((q, idx) => (
          <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#9F67FF' }}>Question {idx + 1}</span>
              <button type="button" onClick={() => removeQ(idx)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer' }}>
                <Trash2 size={13} />
              </button>
            </div>
            <textarea value={q.question} onChange={e => updateQ(idx, 'question', e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical', marginBottom: '8px' }} placeholder="Énoncé de la question..." />
            <input value={q.indication} onChange={e => updateQ(idx, 'indication', e.target.value)} style={inputStyle} placeholder="💡 Indication ou formule utile (optionnel)" />
          </div>
        ))}
        {questions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '12px' }}>
            Aucune question — clique sur "Ajouter"
          </div>
        )}
      </div>
    </div>
  );
}

// ===== FORMULAIRE COURS =====
function CourseForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || {
    titre: '', description: '', prix: 0, categorie: 'Mathématiques',
    icon: '📚', niveau: 'Tous niveaux', color: '#7C3AED', modules: [],
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.titre) { toast.error('Le titre est requis'); return; }
    setSaving(true);
    try {
      if (initial?.id) {
        await api.put(`/admin/courses/${initial.id}`, form);
        toast.success('Cours mis à jour !');
      } else {
        await api.post('/admin/courses', form);
        toast.success('Cours créé ! 🎉');
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="Titre" required>
          <input value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} style={inputStyle} placeholder="Ex: Algèbre & Équations" />
        </Field>
        <Field label="Prix (FCFA)">
          <input type="number" value={form.prix} onChange={e => setForm({ ...form, prix: Number(e.target.value) })} style={inputStyle} placeholder="0 = Gratuit" />
        </Field>
      </div>
      <Field label="Description">
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Description courte du cours" />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="Catégorie">
          <select value={form.categorie} onChange={e => setForm({ ...form, categorie: e.target.value })} style={{ ...inputStyle }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Niveau">
          <select value={form.niveau} onChange={e => setForm({ ...form, niveau: e.target.value })} style={{ ...inputStyle }}>
            {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </Field>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
        <Field label="Icône">
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {ICONS.map(ic => (
              <button key={ic} type="button" onClick={() => setForm({ ...form, icon: ic })}
                style={{ width: '36px', height: '36px', borderRadius: '8px', border: form.icon === ic ? '2px solid #7C3AED' : '1px solid rgba(255,255,255,0.1)', background: form.icon === ic ? 'rgba(124,58,237,0.15)' : 'transparent', cursor: 'pointer', fontSize: '1.1rem' }}>
                {ic}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Couleur">
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {COLORS.map(c => (
              <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                style={{ width: '30px', height: '30px', borderRadius: '50%', background: c, border: form.color === c ? '3px solid white' : '2px solid transparent', cursor: 'pointer' }} />
            ))}
          </div>
        </Field>
      </div>
      <ModuleBuilder modules={form.modules || []} onChange={modules => setForm({ ...form, modules })} />
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <button type="button" onClick={onClose} style={btnSecondary}>Annuler</button>
        <button type="button" onClick={handleSave} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
          <Save size={15} /> {saving ? 'Enregistrement...' : 'Enregistrer le cours'}
        </button>
      </div>
    </div>
  );
}

// ===== FORMULAIRE EXERCICE =====
function ExerciseForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || {
    titre: '', discipline: 'Mathématiques', niveau: 'Terminale', questions: [], points: 40,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.titre) { toast.error('Titre requis'); return; }
    if (!form.questions?.length) { toast.error('Ajoute au moins une question'); return; }
    setSaving(true);
    try {
      if (initial?.id) {
        await api.put(`/admin/exercises/${initial.id}`, form);
        toast.success('Exercice mis à jour !');
      } else {
        await api.post('/admin/exercises', form);
        toast.success('Exercice créé ! ⚡');
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Field label="Titre" required>
        <input value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} style={inputStyle} placeholder="Ex: Les dérivées — Série 1" />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        <Field label="Discipline">
          <select value={form.discipline} onChange={e => setForm({ ...form, discipline: e.target.value })} style={inputStyle}>
            {['Mathématiques', 'Physique', 'Chimie'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Niveau">
          <select value={form.niveau} onChange={e => setForm({ ...form, niveau: e.target.value })} style={inputStyle}>
            {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </Field>
        <Field label="Points total">
          <input type="number" value={form.points} onChange={e => setForm({ ...form, points: Number(e.target.value) })} style={inputStyle} />
        </Field>
      </div>
      <QuestionBuilder questions={form.questions || []} onChange={questions => setForm({ ...form, questions })} />
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <button type="button" onClick={onClose} style={btnSecondary}>Annuler</button>
        <button type="button" onClick={handleSave} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
          <Save size={15} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}

// ===== FORMULAIRE ATELIER =====
function WorkshopForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || {
    titre: '', description: '', type: 'atelier', date_heure: '',
    duree_minutes: 120, prix: 3000, places_max: 20, zoom_link: '', intervenant: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.titre || !form.date_heure) { toast.error('Titre et date requis'); return; }
    setSaving(true);
    try {
      if (initial?.id) {
        await api.put(`/admin/workshops/${initial.id}`, form);
        toast.success('Atelier mis à jour !');
      } else {
        await api.post('/admin/workshops', form);
        toast.success('Atelier programmé ! 🎯');
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Field label="Type de séance">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {TYPES_WORKSHOP.map(t => (
            <button key={t.key} type="button" onClick={() => setForm({ ...form, type: t.key })}
              style={{ padding: '0.65rem', borderRadius: '10px', border: form.type === t.key ? '1.5px solid #7C3AED' : '1px solid rgba(255,255,255,0.1)', background: form.type === t.key ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)', color: form.type === t.key ? '#9F67FF' : 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontWeight: form.type === t.key ? 600 : 400, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              {t.label}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Titre" required>
        <input value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} style={inputStyle} placeholder="Ex: Fiverr & Upwork — Commence à gagner" />
      </Field>
      <Field label="Description">
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Description de la séance, objectifs..." />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="Date et heure" required>
          <input type="datetime-local" value={form.date_heure} onChange={e => setForm({ ...form, date_heure: e.target.value })} style={inputStyle} />
        </Field>
        <Field label="Durée (minutes)">
          <input type="number" value={form.duree_minutes} onChange={e => setForm({ ...form, duree_minutes: Number(e.target.value) })} style={inputStyle} />
        </Field>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="Prix (FCFA) — 0 = Gratuit">
          <input type="number" value={form.prix} onChange={e => setForm({ ...form, prix: Number(e.target.value) })} style={inputStyle} />
        </Field>
        <Field label="Nombre de places max">
          <input type="number" value={form.places_max} onChange={e => setForm({ ...form, places_max: Number(e.target.value) })} style={inputStyle} />
        </Field>
      </div>
      <Field label="Intervenant / Formateur">
        <input value={form.intervenant} onChange={e => setForm({ ...form, intervenant: e.target.value })} style={inputStyle} placeholder="Nom du formateur ou intervenant" />
      </Field>
      <Field label="Lien Zoom / Meet">
        <input value={form.zoom_link} onChange={e => setForm({ ...form, zoom_link: e.target.value })} style={inputStyle} placeholder="https://zoom.us/j/..." />
      </Field>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <button type="button" onClick={onClose} style={btnSecondary}>Annuler</button>
        <button type="button" onClick={handleSave} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
          <Save size={15} /> {saving ? 'Enregistrement...' : 'Programmer la séance'}
        </button>
      </div>
    </div>
  );
}

// ===== PAGE PRINCIPALE ADMIN =====
export default function AdminPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { type, data }
  const [generating, setGenerating] = useState(false);

  useEffect(() => { fetchAll(); }, [tab]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      if (tab === 'dashboard') {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } else if (tab === 'courses') {
        const res = await api.get('/admin/courses');
        setCourses(res.data);
      } else if (tab === 'exercises') {
        const res = await api.get('/admin/exercises');
        setExercises(res.data);
      } else if (tab === 'workshops') {
        const res = await api.get('/admin/workshops');
        setWorkshops(res.data);
      } else if (tab === 'users') {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error('Accès refusé — compte admin requis');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    try {
      await api.delete(`/admin/${type}/${id}`);
      toast.success('Supprimé !');
      fetchAll();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleGenerateIA = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/admin/generate-exercises');
      toast.success(res.data.message);
      if (tab === 'exercises') fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur génération IA');
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const typeLabel = (t) => TYPES_WORKSHOP.find(x => x.key === t)?.label || t;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0F1E', color: 'white', fontFamily: 'Inter, sans-serif' }}>

      {/* TOP BAR */}
      <div style={{ background: '#111827', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>
            <ArrowLeft size={16} /> Retour
          </button>
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '1rem', background: 'linear-gradient(135deg,#7C3AED,#F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Admin — SkillUp Africa
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>{user?.nom}</div>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem' }}>
            {user?.nom?.[0]?.toUpperCase()}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>

        {/* SIDEBAR ADMIN */}
        <aside style={{ width: '220px', background: '#0D1526', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '1rem 0.75rem', flexShrink: 0 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: 'none', background: tab === t.key ? 'rgba(124,58,237,0.18)' : 'transparent', color: tab === t.key ? '#9F67FF' : 'rgba(255,255,255,0.4)', fontSize: '0.875rem', fontWeight: tab === t.key ? 600 : 400, cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter, sans-serif', marginBottom: '2px', transition: 'all 0.15s' }}>
              <span style={{ fontSize: '1rem' }}>{t.icon}</span> {t.label}
            </button>
          ))}
        </aside>

        {/* CONTENU PRINCIPAL */}
        <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>

          {/* ===== DASHBOARD ===== */}
          {tab === 'dashboard' && (
            <div>
              <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                Tableau de bord admin
              </h1>
              {loading ? (
                <div style={{ color: 'rgba(255,255,255,0.3)' }}>Chargement...</div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '12px', marginBottom: '2rem' }}>
                    {[
                      { label: 'Étudiants', value: stats?.users, icon: '👥', color: '#9F67FF' },
                      { label: 'Cours', value: stats?.courses, icon: '📚', color: '#F59E0B' },
                      { label: 'Exercices', value: stats?.exercises, icon: '⚡', color: '#10B981' },
                      { label: 'Inscriptions', value: stats?.enrollments, icon: '✅', color: '#60A5FA' },
                      { label: 'Ateliers', value: stats?.workshops, icon: '🎯', color: '#EC4899' },
                    ].map(s => (
                      <div key={s.label} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{s.icon}</div>
                        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div onClick={() => setTab('courses')} style={{ background: '#111827', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '14px', padding: '1.25rem', cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)'}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📚</div>
                      <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, marginBottom: '4px' }}>Gérer les cours</div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>Ajouter, modifier, supprimer des cours</div>
                    </div>
                    <div onClick={() => setTab('exercises')} style={{ background: '#111827', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '14px', padding: '1.25rem', cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.2)'}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⚡</div>
                      <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, marginBottom: '4px' }}>Gérer les exercices</div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>Ajouter des exercices ou générer avec l'IA</div>
                    </div>
                    <div onClick={() => setTab('workshops')} style={{ background: '#111827', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '14px', padding: '1.25rem', cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(16,185,129,0.2)'}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🎯</div>
                      <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, marginBottom: '4px' }}>Programmer une séance</div>
                      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>Ateliers, orientations, conférences</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ===== COURS ===== */}
          {tab === 'courses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '1.4rem' }}>Cours ({courses.length})</h1>
                <button onClick={() => setModal({ type: 'course', data: null })} style={btnPrimary}>
                  <Plus size={16} /> Nouveau cours
                </button>
              </div>
              {loading ? <div style={{ color: 'rgba(255,255,255,0.3)' }}>Chargement...</div> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {courses.map(c => (
                    <div key={c.id} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: (c.color || '#7C3AED') + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{c.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.92rem', marginBottom: '3px' }}>{c.titre}</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{c.categorie}</span>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>·</span>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{c.niveau}</span>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>·</span>
                          <span style={{ fontSize: '0.7rem', color: c.prix === 0 ? '#10B981' : '#9F67FF', fontWeight: 600 }}>{c.prix === 0 ? 'Gratuit' : `${c.prix.toLocaleString()} FCFA`}</span>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>·</span>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{(c.modules || []).length} module(s)</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setModal({ type: 'course', data: c })} style={{ ...btnSecondary, padding: '6px 12px', fontSize: '0.78rem' }}>
                          <Edit3 size={13} /> Modifier
                        </button>
                        <button onClick={() => handleDelete('courses', c.id)} style={{ ...btnDanger, padding: '6px 12px', fontSize: '0.78rem' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {courses.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)' }}>Aucun cours — clique sur "Nouveau cours"</div>}
                </div>
              )}
            </div>
          )}

          {/* ===== EXERCICES ===== */}
          {tab === 'exercises' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
                <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '1.4rem' }}>Exercices ({exercises.length})</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleGenerateIA} disabled={generating} style={{ ...btnSecondary, opacity: generating ? 0.7 : 1 }}>
                    <Bot size={15} /> {generating ? 'Génération...' : 'Générer 3 avec l\'IA'}
                  </button>
                  <button onClick={() => setModal({ type: 'exercise', data: null })} style={btnPrimary}>
                    <Plus size={16} /> Nouvel exercice
                  </button>
                </div>
              </div>
              {loading ? <div style={{ color: 'rgba(255,255,255,0.3)' }}>Chargement...</div> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {exercises.map(ex => (
                    <div key={ex.id} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.92rem', marginBottom: '3px' }}>{ex.titre}</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{ex.discipline} · {ex.niveau}</span>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>· {(ex.questions || []).length} questions</span>
                          <span style={{ fontSize: '0.7rem', color: '#F59E0B', fontWeight: 600 }}>· {ex.points} pts</span>
                          {ex.source === 'ia' && <span style={{ fontSize: '0.65rem', background: 'rgba(16,185,129,0.12)', color: '#10B981', padding: '2px 6px', borderRadius: '6px', fontWeight: 600 }}>🤖 IA</span>}
                          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)' }}>{new Date(ex.date_publication).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setModal({ type: 'exercise', data: ex })} style={{ ...btnSecondary, padding: '6px 12px', fontSize: '0.78rem' }}>
                          <Edit3 size={13} /> Modifier
                        </button>
                        <button onClick={() => handleDelete('exercises', ex.id)} style={{ ...btnDanger, padding: '6px 12px', fontSize: '0.78rem' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {exercises.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)' }}>Aucun exercice</div>}
                </div>
              )}
            </div>
          )}

          {/* ===== ATELIERS ===== */}
          {tab === 'workshops' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '1.4rem' }}>Ateliers & Séances ({workshops.length})</h1>
                <button onClick={() => setModal({ type: 'workshop', data: null })} style={btnPrimary}>
                  <Plus size={16} /> Programmer une séance
                </button>
              </div>
              {loading ? <div style={{ color: 'rgba(255,255,255,0.3)' }}>Chargement...</div> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {workshops.map(w => {
                    const isPast = new Date(w.date_heure) < new Date();
                    return (
                      <div key={w.id} style={{ background: '#111827', border: `1px solid ${isPast ? 'rgba(255,255,255,0.05)' : 'rgba(124,58,237,0.15)'}`, borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', opacity: isPast ? 0.6 : 1 }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: isPast ? 'rgba(255,255,255,0.05)' : 'rgba(124,58,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                          {w.type === 'orientation' ? '🧭' : w.type === 'conference' ? '🎤' : w.type === 'mentoring' ? '💬' : '🎯'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.92rem' }}>{w.titre}</span>
                            {isPast && <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)', padding: '2px 6px', borderRadius: '6px' }}>Passé</span>}
                          </div>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.7rem', color: '#9F67FF', fontWeight: 500 }}>{typeLabel(w.type)}</span>
                            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>· {formatDate(w.date_heure)}</span>
                            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>· {w.duree_minutes} min</span>
                            <span style={{ fontSize: '0.7rem', color: w.prix === 0 ? '#10B981' : '#F59E0B', fontWeight: 600 }}>· {w.prix === 0 ? 'Gratuit' : `${w.prix.toLocaleString()} FCFA`}</span>
                            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>· {w.places_max} places</span>
                            {w.intervenant && <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>· {w.intervenant}</span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => setModal({ type: 'workshop', data: w })} style={{ ...btnSecondary, padding: '6px 12px', fontSize: '0.78rem' }}>
                            <Edit3 size={13} /> Modifier
                          </button>
                          <button onClick={() => handleDelete('workshops', w.id)} style={{ ...btnDanger, padding: '6px 12px', fontSize: '0.78rem' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {workshops.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)' }}>Aucune séance programmée</div>}
                </div>
              )}
            </div>
          )}

          {/* ===== UTILISATEURS ===== */}
          {tab === 'users' && (
            <div>
              <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '1.4rem', marginBottom: '1.5rem' }}>
                Utilisateurs ({users.length})
              </h1>
              {loading ? <div style={{ color: 'rgba(255,255,255,0.3)' }}>Chargement...</div> : (
                <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        {['Nom', 'Email', 'Pays', 'Points', 'Rôle', 'Inscrit le'].map(h => (
                          <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => (
                        <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}>
                                {u.nom?.[0]?.toUpperCase()}
                              </div>
                              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{u.nom}</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>{u.email}</td>
                          <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>{u.pays || '—'}</td>
                          <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: '#F59E0B', fontWeight: 600 }}>{u.points || 0}</td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: u.role === 'admin' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)', color: u.role === 'admin' ? '#FCA5A5' : 'rgba(255,255,255,0.4)' }}>
                              {u.role || 'etudiant'}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>
                            {new Date(u.created_at).toLocaleDateString('fr-FR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)' }}>Aucun utilisateur</div>}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* MODALS */}
      {modal?.type === 'course' && (
        <Modal title={modal.data ? 'Modifier le cours' : 'Nouveau cours'} onClose={() => setModal(null)}>
          <CourseForm initial={modal.data} onSave={fetchAll} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === 'exercise' && (
        <Modal title={modal.data ? 'Modifier l\'exercice' : 'Nouvel exercice'} onClose={() => setModal(null)}>
          <ExerciseForm initial={modal.data} onSave={fetchAll} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === 'workshop' && (
        <Modal title={modal.data ? 'Modifier la séance' : 'Programmer une séance'} onClose={() => setModal(null)}>
          <WorkshopForm initial={modal.data} onSave={fetchAll} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}
