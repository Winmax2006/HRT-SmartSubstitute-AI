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
  }).sort((a, b) => {
    const indexA = TIME_SLOTS.findIndex(ts => ts.id === a.timeslot_id);
    const indexB = TIME_SLOTS.findIndex(ts => ts.id === b.timeslot_id);
    return indexA - indexB;
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2">Class Schedules</p>
           <h2 className="text-4xl font-black text-slate-800 tracking-tight">Main Timetable</h2>
           <p className="text-slate-400 text-sm mt-1">Manage and view teaching periods across all grades</p>
        </div>
        <div className="flex gap-3">
           <Button variant="secondary" size="md">
             <Filter size={14} className="mr-2 text-blue-600" /> Export Excel
           </Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          <div className="flex-1">
             <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Refine Search</label>
             <div className="relative group">
               <input 
                 type="text" 
                 placeholder="Search subject or class..." 
                 className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-[13px] font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all group-hover:bg-white"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
               <Search size={18} className="absolute left-4 top-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
             </div>
          </div>
          <div className="w-full md:w-64">
             <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Select Day</label>
             <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-[13px] font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer"
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
             >
               {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                 <option key={day} value={day}>{day}</option>
               ))}
             </select>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Period</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Time</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Classroom</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Subject</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Instructor</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Workload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {TIME_SLOTS.map((slot) => {
                  const schedule = filteredSchedules.find(s => s.timeslot_id === slot.id);
                  const teacher = schedule ? TEACHERS.find(t => t.id === schedule.teacher_id) : null;
                  const isLunch = slot.id === 'L';
                  
                  return (
                    <tr key={slot.id} className={`${isLunch ? 'bg-amber-50/30' : 'hover:bg-slate-50/50'} transition-all group`}>
                      <td className="p-6">
                        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${isLunch ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white'} text-[13px] font-black transition-colors`}>
                          {slot.period_no}
                        </span>
                      </td>
                      <td className="p-6 text-[13px] font-bold text-slate-600">{slot.time_label}</td>
                      {isLunch ? (
                        <td colSpan={4} className="p-6 text-center">
                          <span className="text-[11px] font-black text-amber-600 uppercase tracking-[0.2em] bg-white/50 px-4 py-1.5 rounded-full border border-amber-100">
                            Lunch Break
                          </span>
                        </td>
                      ) : (
                        <>
                          <td className="p-6 text-[13px] font-black text-slate-800">{schedule?.class_name || '-'}</td>
                          <td className="p-6">
                            {schedule ? (
                              <span className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
                                {schedule.subject}
                              </span>
                            ) : (
                              <span className="text-slate-300 font-bold">-</span>
                            )}
                          </td>
                          <td className="p-6">
                            {teacher ? (
                              <div className="flex items-center gap-3">
                                 {teacher.avatar && <img src={teacher.avatar} alt="" className="w-8 h-8 rounded-full border border-slate-200" />}
                                 <span className="text-[13px] font-bold text-slate-700">{teacher.name}</span>
                              </div>
                            ) : (
                              <span className="text-slate-300 font-bold">-</span>
                            )}
                          </td>
                          <td className="p-6">
                            {teacher ? (
                              <div className="flex items-center gap-3">
                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${teacher.workload > 70 ? 'bg-red-400' : 'bg-blue-600'}`} 
                                    style={{ width: `${teacher.workload || 0}%` }}
                                  ></div>
                                </div>
                                <span className="text-[11px] font-black text-slate-400">{teacher.workload}%</span>
                              </div>
                            ) : (
                              <span className="text-slate-300 font-bold">-</span>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};