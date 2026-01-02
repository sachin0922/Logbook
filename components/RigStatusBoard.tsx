
import React from 'react';
import { RigStatus } from '../types';

interface Props {
  status: RigStatus;
}

const RigStatusBoard: React.FC<Props> = ({ status }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[
        { label: 'Active Unit', value: status.activeUnit, icon: '🔧' },
        { label: 'Current Phase', value: status.currentPhase, icon: '🔄' },
        { label: 'Pressure (PSI)', value: `${status.pressure}`, icon: '⚡' },
        { label: 'Uptime', value: status.uptime, icon: '⏱️' },
      ].map((item, i) => (
        <div key={i} className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl shadow-inner">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm opacity-60">{item.icon}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.label}</span>
          </div>
          <div className="text-lg font-bold text-white truncate">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

export default RigStatusBoard;
