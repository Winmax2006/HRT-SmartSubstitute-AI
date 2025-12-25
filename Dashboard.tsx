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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-white mb-1">แดชบอร์ดภาพรวม</h2>
           <p className="text-[#a7b0c9] text-sm">ข้อมูลประจำวันที่ {new Date().toLocaleDateString('th-TH', { dateStyle: 'long' })}</p>
        </div>
        <button className="flex items-center gap-2 bg-[#242c47] hover:bg-[#2d3759] text-[#a7b0c9] hover:text-white px-4 py-2 rounded-lg text-sm transition-colors">
          <RefreshCw size={16} /> อัพเดทข้อมูล
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'การสอนแทนวันนี้', value: '3', icon: <Users size={24} />, color: 'text-indigo-400', border: 'border-indigo-500/30' },
          { label: 'จัดแทนอัตโนมัติ', value: '2', icon: <CheckCircle size={24} />, color: 'text-emerald-400', border: 'border-emerald-500/30' },
          { label: 'รออนุมัติ', value: '1', icon: <Clock size={24} />, color: 'text-amber-400', border: 'border-amber-500/30' },
          { label: 'อีเมลที่ส่งแล้ว', value: '5', icon: <Mail size={24} />, color: 'text-blue-400', border: 'border-blue-500/30' },
        ].map((stat, i) => (
          <div key={i} className={`bg-[#171a2e] border-l-4 ${stat.color.replace('text', 'border')} p-6 rounded-r-xl shadow-lg`}>
            <div className="flex justify-between items-start">
              <div>
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-[#a7b0c9] text-sm font-medium">{stat.label}</div>
              </div>
              <div className={`p-3 rounded-lg bg-opacity-10 bg-white ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <Card title="การแจ้งเตือนล่าสุด" icon={<AlertTriangle />} className="h-full">
             <div className="space-y-4">
               {MOCK_NOTIFICATIONS.map(notif => (
                 <div key={notif.id} className="flex items-start gap-4 p-4 rounded-lg bg-[#0b0e1a]/50 border border-[#242c47] hover:border-[#7aa2ff]/30 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                      ${notif.type === 'info' ? 'bg-indigo-500/20 text-indigo-400' : 
                        notif.type === 'warning' ? 'bg-amber-500/20 text-amber-400' : 
                        'bg-emerald-500/20 text-emerald-400'}`}>
                      {notif.type === 'info' ? <Users size={18} /> : 
                       notif.type === 'warning' ? <Clock size={18} /> : 
                       <CheckCircle size={18} />}
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between mb-1">
                          <h4 className="font-semibold text-sm text-white">{notif.title}</h4>
                          <span className="text-xs text-[#a7b0c9]">{notif.time}</span>
                       </div>
                       <p className="text-sm text-[#a7b0c9]">{notif.message}</p>
                    </div>
                 </div>
               ))}
             </div>
           </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-900/40 to-[#171a2e]">
            <h3 className="text-lg font-semibold text-white mb-4">สถานะระบบ AI</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#0b0e1a]/50 rounded-lg">
                 <span className="text-sm text-[#a7b0c9]">Gemini 2.5 Flash</span>
                 <span className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                   <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Active
                 </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#0b0e1a]/50 rounded-lg">
                 <span className="text-sm text-[#a7b0c9]">Gemini 3 Pro</span>
                 <span className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                   <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Active
                 </span>
              </div>
              <p className="text-xs text-[#a7b0c9] mt-2">
                ระบบพร้อมทำงานสำหรับการจัดตารางและให้คำปรึกษา
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};