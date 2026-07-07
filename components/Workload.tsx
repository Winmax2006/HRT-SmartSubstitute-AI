import React from 'react';
import { Card } from './ui/Card';
import { TEACHERS, MOCK_SCHEDULES } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { BookOpen, Calendar, Clock, Sparkles, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export const Workload: React.FC = () => {
  // Dynamic parsing of teaching hours & metrics using the mock data
  const data = TEACHERS.map(t => {
    // Determine number of actual sessions scheduled
    const sessions = MOCK_SCHEDULES.filter(s => s.teacher_id === t.id).length;
    // Each session roughly translates to a 3-hour academic module/prep credit per week, 
    // or fallback to workload percentage scale to maintain realistic range (12 - 24 hours)
    const hours = sessions > 0 ? (sessions * 3) : Math.round((t.workload / 100) * 22) + 4;
    return {
      id: t.id,
      name: t.name.split(' ')[0].replace('ครู', 'ครู '), // Beautiful split
      fullName: t.name,
      subject: t.subject,
      workload: t.workload,
      hours: hours,
      sessions: sessions || 4, // baseline
      avatar: t.avatar
    };
  }).sort((a, b) => b.hours - a.hours);

  // High-level aggregates
  const totalHours = data.reduce((acc, curr) => acc + curr.hours, 0);
  const avgWorkload = Math.round(data.reduce((acc, curr) => acc + curr.workload, 0) / data.length);
  const overloadedCount = data.filter(d => d.workload > 70).length;
  const underloadedCount = data.filter(d => d.workload < 50).length;

  return (
    <div className="space-y-12">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2">Faculty Performance</p>
           <h2 className="text-4xl font-black text-slate-800 tracking-tight">Academic Workload</h2>
           <p className="text-slate-400 text-sm mt-1">Real-time scheduling allocations, hourly loads, and faculty availability indexes</p>
        </div>
      </div>

      {/* Modern High-Contrast Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Weekly Hours', value: `${totalHours} hrs`, icon: <Clock size={20} />, color: 'blue', desc: 'Across entire department' },
          { label: 'Avg Faculty Util', value: `${avgWorkload}%`, icon: <TrendingUp size={20} />, color: 'emerald', desc: 'Target distribution: 60%' },
          { label: 'Overloaded Faculty', value: overloadedCount, icon: <AlertTriangle size={20} />, color: 'amber', desc: 'Util above 70% threshold' },
          { label: 'Available Standbys', value: underloadedCount, icon: <CheckCircle size={20} />, color: 'teal', desc: 'Ready for quick assignments' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 group">
            <div className="flex flex-col items-start gap-4">
              <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:bg-${stat.color}-600 group-hover:text-white transition-all duration-300`}>
                {stat.icon}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">{stat.label}</span>
                <div className="text-3xl font-black text-slate-800 tracking-tight mb-1">{stat.value}</div>
                <p className="text-[11px] text-slate-400 font-medium">{stat.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Analytics Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Card */}
        <div className="lg:col-span-2">
          <Card title="Teching Hours per Teacher" icon={<BookOpen size={18} />}>
            <div className="mb-6">
              <p className="text-xs text-slate-400 font-medium">This chart evaluates the active hours assigned to teachers each week based on curriculum schedulations.</p>
            </div>
            
            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    fontWeight={700}
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    fontWeight={700}
                    tickLine={false} 
                    axisLine={false} 
                    domain={[0, 'auto']}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc', radius: 12 }}
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '1rem', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      fontFamily: 'Inter, sans-serif'
                    }}
                    labelStyle={{ fontWeight: 900, color: '#1e293b', fontSize: '12px' }}
                    itemStyle={{ color: '#2563eb', fontWeight: 600, fontSize: '12px' }}
                  />
                  <Bar dataKey="hours" name="Teaching Hours" fill="#2563eb" radius={[12, 12, 0, 0]} barSize={28}>
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.workload > 70 ? '#f87171' : '#2563eb'} 
                        className="transition-all duration-300"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 border-t border-slate-50 pt-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600 block"></span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Optimal Load</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400 block"></span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overload Alert (70%+)</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Load Status Panel */}
        <div className="space-y-8">
          <Card title="Utilization Alert Panel" icon={<AlertTriangle size={18} />}>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#ef4444] mb-3">FACULTY IN OVERLOAD</p>
                <div className="space-y-3">
                  {data.filter(d => d.workload > 70).map(d => (
                    <div key={d.id} className="flex items-center gap-3 p-4 rounded-2xl bg-red-50/50 border border-red-100">
                      {d.avatar && <img src={d.avatar} className="w-8 h-8 rounded-full border border-red-200" alt="" />}
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-black text-slate-800 truncate">{d.fullName}</div>
                        <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{d.subject}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-red-600">{d.workload}%</span>
                      </div>
                    </div>
                  ))}
                  {data.filter(d => d.workload > 70).length === 0 && (
                    <div className="p-4 rounded-2xl bg-slate-50 text-center text-xs font-medium text-slate-400">
                      No overloaded faculty members detected.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#10b981] mb-3">HIGH RESERVES AVAILABLE</p>
                <div className="space-y-3">
                  {data.filter(d => d.workload < 50).map(d => (
                    <div key={d.id} className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                      {d.avatar && <img src={d.avatar} className="w-8 h-8 rounded-full border border-emerald-200" alt="" />}
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-black text-slate-800 truncate">{d.fullName}</div>
                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{d.subject}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-600">{d.workload}%</span>
                      </div>
                    </div>
                  ))}
                  {data.filter(d => d.workload < 50).length === 0 && (
                    <div className="p-4 rounded-2xl bg-slate-50 text-center text-xs font-medium text-slate-400">
                      No reserve standby teachers.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Relative comparison of Workload utilization vs Curriculum Hours */}
      <Card title="Curriculum Coverage Profile" icon={<Calendar size={18} />}>
        <div className="mb-6">
          <p className="text-xs text-slate-400 font-medium">A macro view comparison between assigned teaching sessions, workloads, and real hours dedicated per faculty member.</p>
        </div>
        
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorWorkload" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  fontFamily: 'Inter, sans-serif'
                }} 
              />
              <Area type="monotone" dataKey="hours" name="Curriculum Hours" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              <Area type="monotone" dataKey="workload" name="Workload %" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorWorkload)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
