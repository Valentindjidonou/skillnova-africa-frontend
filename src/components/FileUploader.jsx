
import { useState, useRef } from 'react';
import { Upload, X, FileText, Image, Video, File, Loader2 } from 'lucide-react';
import api from '../lib/api';

const TYPE_CONFIG = {
  video:    { accept: 'video/*', icon: Video,    color: '#7C3AED', label: 'Vidéo', folder: 'videos' },
  image:    { accept: 'image/*', icon: Image,    color: '#10B981', label: 'Image', folder: 'images' },
  document: { accept: '.pdf,.doc,.docx,.txt', icon: FileText, color: '#F59E0B', label: 'Document PDF', folder: 'documents' },
};

export default function FileUploader({ type = 'video', value, onChange, label }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || null);
  const inputRef = useRef();
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.document;
  const Icon = config.icon;

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', config.folder);

      const res = await api.post('/upload/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setPreview(res.data.url);
      onChange(res.data.url);
    } catch (err) {
      alert('Erreur upload : ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const clear = () => { setPreview(null); onChange(''); };

  return (
    <div>
      {label && <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>}

      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => !uploading && inputRef.current?.click()}
          style={{ border: `2px dashed ${uploading ? config.color + '44' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: uploading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', background: uploading ? config.color + '06' : 'transparent' }}
          onMouseEnter={e => { if (!uploading) e.currentTarget.style.borderColor = config.color + '66'; }}
          onMouseLeave={e => { if (!uploading) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
          {uploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <Loader2 size={28} color={config.color} style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Upload en cours...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: config.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} color={config.color} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
                  Clique ou glisse ton {config.label.toLowerCase()} ici
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>Max 50MB</div>
              </div>
            </div>
          )}
          <input ref={inputRef} type="file" accept={config.accept} style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files?.[0])} />
        </div>
      ) : (
        <div style={{ position: 'relative', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
          {type === 'video' && (
            <video controls style={{ width: '100%', maxHeight: '220px', display: 'block' }} src={preview} />
          )}
          {type === 'image' && (
            <img src={preview} alt="preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }} />
          )}
          {type === 'document' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem' }}>
              <FileText size={28} color="#F59E0B" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>Document uploadé</div>
                <a href={preview} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#9F67FF' }}>Voir le document →</a>
              </div>
            </div>
          )}
          <button onClick={clear}
            style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} />
          </button>
        </div>
      )}
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
