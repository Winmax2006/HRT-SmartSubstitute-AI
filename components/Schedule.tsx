import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Calendar, Search, Filter } from 'lucide-react';
import { MOCK_SCHEDULES, TEACHERS, TIME_SLOTS } from '../constants';
import { ScheduleItem } from '../types';

export const Schedule: React.FC = () => {
  const [filterDay, setFilterDay] = useState('Monday');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSchedules = MOCK_SCHEDULES.filter(s => {
    const matchesDay = s.day_of_week === filterDay;
    const matchesSearch = s.class_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDay && matchesSearch;
  }).sort((a, b) => parseInt(a.period_no) - parseInt(b.period_no));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">ตารางสอน</h2>
        <div className="flex gap-2">
           <Button variant="secondary" size="sm">
             <Filter size={16} className="mr-2" /> กรองข้อมูล
           </Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
             <label className="block text-xs font-medium text-[#a7b0c9] mb-1">ค้นหา</label>
             <div className="relative">
               <input 
                 type="text" 
                 placeholder="ค้นหาวิชา หรือ ห้องเรียน..." 
                 className="w-full bg-[#0b0e1a] border border-[#242c47] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#7aa2ff]"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
               <Search size={16} className="absolute left-3 top-2.5 text-[#a7b0c9]" />
             </div>
          </div>
          <div className="w-full md:w-48">
             <label className="block text-xs font-medium text-[#a7b0c9] mb-1">วัน</label>
             <select 
                className="w-full bg-[#0b0e1a] border border-[#242c47] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7aa2ff]"
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
             >
               {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                 <option key={day} value={day}>{day}</option>
               ))}
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#242c47]">
                <th className="p-4 text-xs font-semibold text-[#a7b0c9] uppercase tracking-wider">คาบ</th>
                <th className="p-4 text-xs font-semibold text-[#a7b0c9] uppercase tracking-wider">เวลา</th>
                <th className="p-4 text-xs font-semibold text-[#a7b0c9] uppercase tracking-wider">ห้องเรียน</th>
                <th className="p-4 text-xs font-semibold text-[#a7b0c9] uppercase tracking-wider">วิชา</th>
                <th className="p-4 text-xs font-semibold text-[#a7b0c9] uppercase tracking-wider">ครูผู้สอน</th>
                <th className="p-4 text-xs font-semibold text-[#a7b0c9] uppercase tracking-wider">ภาระงาน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242c47]">
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map((schedule) => {
                  const teacher = TEACHERS.find(t => t.id === schedule.teacher_id);
                  const timeSlot = TIME_SLOTS.find(ts => ts.id === schedule.timeslot_id);
                  return (
                    <tr key={schedule.id} className="hover:bg-[#7aa2ff]/5 transition-colors">
                      <td className="p-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#242c47] text-sm font-bold text-[#7aa2ff]">
                          {schedule.period_no}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-[#e9edff]">{timeSlot?.time_label}</td>
                      <td className="p-4 text-sm text-[#e9edff] font-medium">{schedule.class_name}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-[#7aa2ff]/10 text-[#7aa2ff] border border-[#7aa2ff]/20">
                          {schedule.subject}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                           {teacher?.avatar && <img src={teacher.avatar} alt="" className="w-6 h-6 rounded-full" />}
                           <span className="text-sm text-[#e9edff]">{teacher?.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-[#0b0e1a] rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${teacher && teacher.workload > 70 ? 'bg-red-400' : 'bg-emerald-400'}`} 
                              style={{ width: `${teacher?.workload || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-[#a7b0c9]">{teacher?.workload}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                 <tr>
                   <td colSpan={6} className="p-8 text-center text-[#a7b0c9]">ไม่พบตารางสอนสำหรับเงื่อนไขที่เลือก</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};