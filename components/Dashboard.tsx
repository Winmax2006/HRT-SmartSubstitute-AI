import React from 'react';
import { Card } from './ui/Card';
import { Users, Clock, CheckCircle, Mail, AlertTriangle, RefreshCw } from 'lucide-react';
import { View } from '../App';
import { MOCK_NOTIFICATIONS } from '../constants';

interface DashboardProps {
  onViewChange: (view: View) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2">Academic Overview</p>
           <h2 className="text-4xl font-black text-slate-800 tracking-tight">Executive Dashboard</h2>
           <p className="text-slate-400 text-sm mt-1">{new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm hover:-translate-y-1">
          <RefreshCw size={14} className="text-blue-600" /> Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Today Substitutions', value: '3', icon: <Users size={20} />, color: 'blue' },
          { label: 'Auto Arranged', value: '2', icon: <CheckCircle size={20} />, color: 'emerald' },
          { label: 'Pending Approvals', value: '1', icon: <Clock size={20} />, color: 'amber' },
          { label: 'Emails Sent', value: '5', icon: <Mail size={20} />, color: 'slate' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group">
            <div className="flex flex-col items-start gap-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:bg-${stat.color}-600 group-hover:text-white transition-colors`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-4xl font-black text-slate-800 mb-1">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <Card title="Recent Activity" icon={<AlertTriangle />}>
             <div className="space-y-6">
               {MOCK_NOTIFICATIONS.map(notif => (
                 <div key={notif.id} className="flex items-start gap-5 p-6 rounded-[1.5rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-md transition-all group">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors
                      ${notif.type === 'info' ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 
                        notif.type === 'warning' ? 'bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white' : 
                        'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'}`}>
                      {notif.type === 'info' ? <Users size={20} /> : 
                       notif.type === 'warning' ? <Clock size={20} /> : 
                       <CheckCircle size={20} />}
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-center mb-1">
                          <h4 className="font-black text-[13px] text-slate-800 uppercase tracking-tight">{notif.title}</h4>
                          <span className="text-[10px] font-bold text-slate-400">{notif.time}</span>
                       </div>
                       <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{notif.message}</p>
                    </div>
                 </div>
               ))}
             </div>
           </Card>
        </div>
        
        <div className="space-y-8">
          <Card title="AI Status" className="bg-blue-600 border-none shadow-xl shadow-blue-200">
            <div className="space-y-4">
              {[
                { name: 'Gemini 2.5 Flash', status: 'Optimal' },
                { name: 'Gemini 3 Pro', status: 'Online' }
              ].map((sys, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                   <span className="text-[11px] font-black text-white uppercase tracking-wider">{sys.name}</span>
                   <span className="flex items-center gap-2 text-[10px] font-black text-blue-100 uppercase tracking-widest">
                     <span className="w-2 h-2 rounded-full bg-emerald-400"></span> {sys.status}
                   </span>
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-white/10">
                <p className="text-[11px] text-blue-100 font-medium leading-relaxed">
                  Systems fully calibrated. Ready for automated scheduling and workload analysis.
                </p>
              </div>
            </div>
          </Card>
          
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">System Health</p>
            <div className="flex items-end gap-1 h-12">
               {[...Array(20)].map((_, i) => (
                 <div key={i} className={`flex-1 rounded-sm transition-all duration-500 ${i > 15 ? 'bg-slate-100 h-4' : 'bg-blue-600 ' + (Math.random() > 0.5 ? 'h-10' : 'h-8')}`}></div>
               ))}
            </div>
            <div className="flex justify-between mt-4">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Latency</span>
               <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">24ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};