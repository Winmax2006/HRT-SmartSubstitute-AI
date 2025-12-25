import React from 'react';
import { Card } from './ui/Card';
import { TEACHERS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const Workload: React.FC = () => {
  const data = TEACHERS.map(t => ({
    name: t.name.split(' ')[0], // First name only for chart
    workload: t.workload,
    full: t
  })).sort((a, b) => b.workload - a.workload);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">ภาระงานครู</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2">
            <Card title="กราฟเปรียบเทียบภาระงาน (%)">
               <div className="h-[400px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#242c47" horizontal={false} />
                     <XAxis type="number" stroke="#a7b0c9" />
                     <YAxis dataKey="name" type="category" stroke="#a7b0c9" width={100} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#171a2e', borderColor: '#242c47', color: '#e9edff' }}
                        itemStyle={{ color: '#7aa2ff' }}
                     />
                     <Bar dataKey="workload" radius={[0, 4, 4, 0]} barSize={20}>
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.workload > 70 ? '#f87171' : entry.workload > 50 ? '#fbbf24' : '#4ade80'} />
                        ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </Card>
         </div>
         
         <div>
            <Card title="สรุปสถานะ" className="h-full">
               <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-[#0b0e1a] border border-[#242c47]">
                     <div className="text-sm text-[#a7b0c9] mb-1">ภาระงานเฉลี่ย</div>
                     <div className="text-3xl font-bold text-[#e9edff]">
                        {Math.round(data.reduce((acc, curr) => acc + curr.workload, 0) / data.length)}%
                     </div>
                  </div>
                  
                  <h4 className="text-sm font-semibold text-[#a7b0c9] mt-4 mb-2">ครูที่มีภาระงานสูง (Overload)</h4>
                  <div className="space-y-2">
                     {data.filter(d => d.workload > 70).map(d => (
                        <div key={d.name} className="flex items-center justify-between p-2 rounded bg-red-500/10 border border-red-500/20">
                           <span className="text-sm text-red-300">{d.name}</span>
                           <span className="text-xs font-bold text-red-400">{d.workload}%</span>
                        </div>
                     ))}
                     {data.filter(d => d.workload > 70).length === 0 && (
                        <div className="text-sm text-emerald-400">ไม่มีครูภาระงานเกินเกณฑ์</div>
                     )}
                  </div>

                  <h4 className="text-sm font-semibold text-[#a7b0c9] mt-4 mb-2">ครูที่ภาระงานน้อย (Available)</h4>
                  <div className="space-y-2">
                     {data.filter(d => d.workload < 50).map(d => (
                        <div key={d.name} className="flex items-center justify-between p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                           <span className="text-sm text-emerald-300">{d.name}</span>
                           <span className="text-xs font-bold text-emerald-400">{d.workload}%</span>
                        </div>
                     ))}
                  </div>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
};