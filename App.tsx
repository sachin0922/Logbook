
import React, { useState, useEffect, useCallback } from 'react';
import { LogEntry, RigStatus, AIAnalysis, LogSeverity } from './types';
import { INITIAL_LOGS } from './constants';
import { analyzeLogs } from './services/geminiService';
import RigStatusBoard from './components/RigStatusBoard';
import LogForm from './components/LogForm';
import HistoryList from './components/HistoryList';
import AnalyticsBoard from './components/AnalyticsBoard';
import VoiceLogger from './components/VoiceLogger';
import AISummaryCard from './components/AISummaryCard';

function App() {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [rigStatus, setRigStatus] = useState<RigStatus>({
    activeUnit: 'RX-700-B',
    currentPhase: 'Thermal Stress',
    temperature: 45.2,
    pressure: 122.4,
    uptime: '14:22:05'
  });
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Auto-generate AI summary on mount and log updates
  const refreshAnalysis = useCallback(async () => {
    if (logs.length < 2) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeLogs(logs);
      setAiAnalysis(result);
    } catch (err) {
      console.error("AI Analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [logs]);

  useEffect(() => {
    refreshAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewLog = (newLogData: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const log: LogEntry = {
      ...newLogData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    setLogs(prev => [log, ...prev]);
    
    // Update rig status based on log if relevant
    if (newLogData.phase) {
      setRigStatus(prev => ({ ...prev, currentPhase: newLogData.phase }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg font-black italic text-xl shadow-lg shadow-blue-500/20">RL</div>
            <div>
              <h1 className="font-bold text-lg leading-none">RIGLOG PRO</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Enterprise Engineering Suite</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold">Sarah Chen</span>
              <span className="text-[10px] text-emerald-500 font-mono">● LIVE CONNECTION</span>
            </div>
            <img src="https://picsum.photos/32/32" className="w-8 h-8 rounded-full border border-slate-700" alt="Avatar" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Dashboard Column */}
          <div className="flex-1 space-y-8">
            <RigStatusBoard status={rigStatus} />
            
            <AISummaryCard 
              analysis={aiAnalysis} 
              onRefresh={refreshAnalysis} 
              isLoading={isAnalyzing} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnalyticsBoard />
              <div className="bg-slate-800/20 border border-slate-800 p-6 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Phase Completion</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Thermal', progress: 100, color: 'bg-emerald-500' },
                    { label: 'Vibration', progress: 65, color: 'bg-blue-500' },
                    { label: 'Pressure', progress: 0, color: 'bg-slate-700' },
                  ].map((p, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-[10px] mb-1 font-bold">
                        <span>{p.label}</span>
                        <span>{p.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className={`h-full ${p.color} transition-all duration-1000`} style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:hidden">
              <LogForm onSubmit={handleNewLog} />
              <VoiceLogger onLogExtracted={handleNewLog} />
            </div>

            <HistoryList logs={logs} />
          </div>

          {/* Side Panel: Interaction */}
          <aside className="hidden lg:block w-80 shrink-0 space-y-6">
            <div className="sticky top-24">
              <LogForm onSubmit={handleNewLog} />
              <VoiceLogger onLogExtracted={handleNewLog} />
              
              <div className="mt-6 bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
                <span className="text-[10px] text-slate-600 font-bold uppercase block mb-1">System Health</span>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-1 h-3 bg-emerald-500/40 rounded-full" />
                  ))}
                  <div className="w-1 h-3 bg-blue-500 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 mt-20 py-8 bg-slate-950 text-slate-600 text-[10px] text-center uppercase tracking-widest">
        &copy; 2024 RIGLOG PRO v2.4.1-STABLE &bull; SECURE TEST DATA ENVIRONMENT
      </footer>
    </div>
  );
}

export default App;
