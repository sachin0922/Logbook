
import React from 'react';
import { LogEntry, LogSeverity } from '../types';

interface Props {
  logs: LogEntry[];
}

const HistoryList: React.FC<Props> = ({ logs }) => {
  const getSeverityStyle = (severity: LogSeverity) => {
    switch (severity) {
      case LogSeverity.CRITICAL: return 'bg-red-500/10 text-red-400 border-red-500/50';
      case LogSeverity.WARNING: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50';
      case LogSeverity.SUCCESS: return 'bg-green-500/10 text-green-400 border-green-500/50';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/50';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Activity Feed</h3>
        <span className="text-xs text-slate-500">{logs.length} Entries recorded</span>
      </div>
      {logs.length === 0 ? (
        <div className="text-center py-10 text-slate-600 italic">No logs recorded yet...</div>
      ) : (
        logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(log => (
          <div key={log.id} className="bg-slate-800/40 border border-slate-700 p-4 rounded-xl hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-2 items-center">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getSeverityStyle(log.severity)}`}>
                  {log.severity}
                </span>
                <span className="text-xs font-mono text-slate-400">[{log.phase}]</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm text-slate-200 mb-3">{log.content}</p>
            {log.images && log.images.length > 0 && (
              <div className="flex gap-2 mb-3">
                {log.images.map((img, idx) => (
                  <img key={idx} src={img} className="w-12 h-12 object-cover rounded-md border border-slate-700 cursor-zoom-in" />
                ))}
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-slate-700/50">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                👤 {log.engineer}
              </span>
              <span className="text-[10px] font-bold text-slate-600">ID: {log.unitId}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default HistoryList;
