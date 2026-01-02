
import React, { useState, useRef } from 'react';
import { LogSeverity, LogEntry } from '../types';
import { TEST_PHASES } from '../constants';

interface Props {
  onSubmit: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  initialData?: Partial<LogEntry>;
}

const LogForm: React.FC<Props> = ({ onSubmit, initialData }) => {
  const [content, setContent] = useState(initialData?.content || '');
  const [severity, setSeverity] = useState<LogSeverity>(initialData?.severity || LogSeverity.INFO);
  const [phase, setPhase] = useState(initialData?.phase || TEST_PHASES[0]);
  const [unitId, setUnitId] = useState(initialData?.unitId || 'RX-700-B');
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Add explicit type (file: File) to prevent 'unknown' inference which leads to 'Blob' assignability errors
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit({
      engineer: 'Sarah Chen', // In real app, from auth
      unitId,
      phase,
      severity,
      content,
      images,
      tags: []
    });
    setContent('');
    setImages([]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">📝</span>
        Capture Log
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Unit ID</label>
          <input 
            type="text" 
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Test Phase</label>
          <select 
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {TEST_PHASES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Observations</label>
        <textarea 
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Describe rig behavior, measurements, or findings..."
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Severity</label>
          <div className="flex gap-2">
            {[LogSeverity.INFO, LogSeverity.WARNING, LogSeverity.CRITICAL, LogSeverity.SUCCESS].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setSeverity(s)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                  severity === s 
                    ? 'bg-blue-600 border-blue-400 text-white' 
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Attachments</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
            >
              📷 Upload Photo
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              multiple 
              className="hidden" 
              onChange={handleImageUpload}
              accept="image/*"
            />
            {images.length > 0 && (
              <span className="text-xs text-blue-400 font-bold">{images.length} files attached</span>
            )}
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <img key={i} src={img} className="h-16 w-16 object-cover rounded-lg border border-slate-600" />
          ))}
        </div>
      )}

      <button 
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/20 transform active:scale-[0.98] transition-all"
      >
        Submit Log Entry
      </button>
    </form>
  );
};

export default LogForm;
