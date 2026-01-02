
import React from 'react';
import { AIAnalysis } from '../types';

interface Props {
  analysis: AIAnalysis | null;
  onRefresh: () => void;
  isLoading: boolean;
}

const AISummaryCard: React.FC<Props> = ({ analysis, onRefresh, isLoading }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 p-6 rounded-2xl mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
        </svg>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">✨</span>
          Gemini Run Intelligence
        </h3>
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="text-xs bg-indigo-500/20 hover:bg-indigo-500/40 px-3 py-1.5 rounded-lg font-bold text-indigo-300 transition-colors"
        >
          {isLoading ? 'Processing...' : 'Recalculate Insight'}
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-slate-700 rounded w-3/4"></div>
          <div className="h-4 bg-slate-700 rounded w-1/2"></div>
        </div>
      ) : analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest block mb-2">Current Status</label>
              <p className="text-sm leading-relaxed text-slate-200">{analysis.summary}</p>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest block mb-2">Detected Anomalies</label>
              <ul className="text-sm space-y-1">
                {analysis.anomalies.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-red-300/80">
                    <span className="text-red-500">•</span> {a}
                  </li>
                ))}
                {analysis.anomalies.length === 0 && <li className="text-slate-500 italic">No anomalies detected.</li>}
              </ul>
            </div>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-indigo-500/10">
            <label className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest block mb-3">Recommendations</label>
            <ul className="text-sm space-y-3">
              {analysis.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <span className="bg-emerald-500/20 text-emerald-400 w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold shrink-0">
                    {i+1}
                  </span> 
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-slate-500 italic">Gather more logs to unlock AI-powered insights.</div>
      )}
    </div>
  );
};

export default AISummaryCard;
