
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { time: '09:00', temp: 30, pressure: 100 },
  { time: '09:15', temp: 35, pressure: 105 },
  { time: '09:30', temp: 42, pressure: 110 },
  { time: '09:45', temp: 45, pressure: 108 },
  { time: '10:00', temp: 43, pressure: 120 },
  { time: '10:15', temp: 48, pressure: 135 },
  { time: '10:30', temp: 50, pressure: 140 },
];

const AnalyticsBoard: React.FC = () => {
  return (
    <div className="space-y-6 mb-8">
      <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-2xl">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Core Telemetry</h4>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="temp" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTemp)" />
              <Area type="monotone" dataKey="pressure" stroke="#8b5cf6" fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsBoard;
