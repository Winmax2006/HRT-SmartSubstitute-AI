
import React, { useState, useEffect, useRef } from 'react';
import { Users, Clock, CheckCircle, Mail, AlertTriangle, RefreshCw, Calendar as CalendarIcon, Search, Filter, Brain, UserPlus, Check, History, User, BookOpen, Database, FileSpreadsheet, Link as LinkIcon, Plus, Trash2, ToggleLeft, ToggleRight, Save, BarChart2, ArrowRight, X, Upload, Image as ImageIcon, Wand2, Download, AlertCircle, CheckCircle as CheckCircleIcon, XCircle, Shuffle, Briefcase, CalendarClock, AlertOctagon, TrendingUp, Layers, PieChart, Phone, Mail as MailIcon, GraduationCap, Edit, UserCheck, UserX, FileText, ArrowLeftRight, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Legend } from 'recharts';
import { Card, Button } from './components';
import { View, Teacher, MOCK_NOTIFICATIONS, MOCK_SCHEDULES, TEACHERS, TIME_SLOTS, MOCK_SUBSTITUTE_HISTORY, MOCK_APPROVALS, INITIAL_RULES, suggestSubstitute, SheetService, ExcelService, analyzeRuleEffectiveness, RuleAnalysisResult, RuleSuggestion, Rule, editImage, getSheetConfig, saveSheetConfig, SheetConfig, SubstituteHistoryItem, MOCK_PERIOD_SWAPS, PeriodSwapItem, WorkloadSettings, DEFAULT_WORKLOAD_SETTINGS } from './data';

// ==========================================
// DASHBOARD
// ==========================================

interface DashboardProps {
  onViewChange: (view: View) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">แดชบอร์ดภาพรวม</h2>
           <p className="text-[#9CA3AF] text-sm font-medium">ข้อมูลประจำวันที่ {new Date().toLocaleDateString('th-TH', { dateStyle: 'long' })}</p>
        </div>
        <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-[#9CA3AF] hover:text-indigo-600 dark:hover:text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm font-bold">
          <RefreshCw size={16} /> อัพเดทข้อมูล
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'การสอนแทนวันนี้', value: '3', icon: <Users size={24} />, color: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-500/50' },
          { label: 'จัดแทนอัตโนมัติ', value: '2', icon: <CheckCircle size={24} />, color: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-500/50' },
          { label: 'รออนุมัติ', value: '1', icon: <Clock size={24} />, color: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/50' },
          { label: 'อีเมลที่ส่งแล้ว', value: '5', icon: <Mail size={24} />, color: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/50' },
        ].map((stat, i) => (
          <div key={i} className={`bg-white dark:bg-slate-900 border-l-4 ${stat.color.replace('text', 'border')} p-6 rounded-r-xl shadow-sm dark:shadow-none`}>
            <div className="flex justify-between items-start">
              <div>
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-[#9CA3AF] text-sm font-bold">{stat.label}</div>
              </div>
              <div className={`p-3 rounded-lg bg-slate-100 dark:bg-slate-800 ${stat.color}`}>
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
                 <div key={notif.id} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                      ${notif.type === 'info' ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400' : 
                        notif.type === 'warning' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400' : 
                        'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'}`}>
                      {notif.type === 'info' ? <Users size={18} /> : 
                       notif.type === 'warning' ? <Clock size={18} /> : 
                       <CheckCircle size={18} />}
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between mb-1">
                          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{notif.title}</h4>
                          <span className="text-xs font-bold text-[#9CA3AF]">{notif.time}</span>
                       </div>
                       <p className="text-sm text-[#9CA3AF] font-bold">{notif.message}</p>
                    </div>
                 </div>
               ))}
             </div>
           </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950 dark:to-slate-900 border dark:border-slate-800">
            <h3 className="text-lg font-bold text-indigo-900 dark:text-white mb-4">สถานะระบบ AI</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-950/50 border border-indigo-100 dark:border-slate-800 rounded-lg shadow-sm">
                 <span className="text-sm font-bold text-slate-700 dark:text-[#9CA3AF]">Gemini 2.5 Flash</span>
                 <span className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                   <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span> Active
                 </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-950/50 border border-indigo-100 dark:border-slate-800 rounded-lg shadow-sm">
                 <span className="text-sm font-bold text-slate-700 dark:text-[#9CA3AF]">Gemini 3 Pro</span>
                 <span className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                   <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span> Active
                 </span>
              </div>
              <p className="text-xs font-bold text-[#9CA3AF] mt-2">
                ระบบพร้อมทำงานสำหรับการจัดตารางและให้คำปรึกษา
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// SCHEDULE
// ==========================================

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
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">ตารางสอน</h2>
        <div className="flex gap-2">
           <Button variant="secondary" size="sm" className="font-bold">
             <Filter size={16} className="mr-2" /> กรองข้อมูล
           </Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
             <label className="block text-xs font-extrabold text-[#9CA3AF] mb-1">ค้นหา</label>
             <div className="relative">
               <input 
                 type="text" 
                 placeholder="ค้นหาวิชา หรือ ห้องเรียน..." 
                 className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder-[#9CA3AF] font-bold"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
               <Search size={16} className="absolute left-3 top-2.5 text-[#9CA3AF]" />
             </div>
          </div>
          <div className="w-full md:w-48">
             <label className="block text-xs font-extrabold text-[#9CA3AF] mb-1">วัน</label>
             <select 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-900 dark:text-slate-100 font-bold"
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
             >
               {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                 <option key={day} value={day}>{day}</option>
               ))}
             </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-indigo-50 dark:bg-slate-800 border-b border-indigo-100 dark:border-slate-700">
                <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">คาบ</th>
                <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">เวลา</th>
                <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">ห้องเรียน</th>
                <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">วิชา</th>
                <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">ครูผู้สอน</th>
                <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">ภาระงาน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map((schedule) => {
                  const teacher = TEACHERS.find(t => t.id === schedule.teacher_id);
                  const timeSlot = TIME_SLOTS.find(ts => ts.id === schedule.timeslot_id);
                  return (
                    <tr key={schedule.id} className="hover:bg-indigo-50/60 dark:hover:bg-indigo-900/10 transition-colors">
                      <td className="p-4">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-base font-extrabold text-white shadow-md">
                          {schedule.period_no}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-extrabold text-slate-700 dark:text-slate-300">{timeSlot?.time_label}</td>
                      <td className="p-4">
                        <span className="text-base font-extrabold text-slate-900 dark:text-white">
                            {schedule.class_name}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1.5 rounded-md text-sm font-extrabold bg-amber-100 text-amber-950 shadow-sm border border-amber-200">
                          {schedule.subject}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                           {teacher?.avatar && <img src={teacher.avatar} alt="" className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700" />}
                           <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{teacher?.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${teacher && teacher.workload > 70 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${teacher?.workload || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-extrabold text-slate-600 dark:text-[#9CA3AF]">{teacher?.workload}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                 <tr>
                   <td colSpan={6} className="p-8 text-center text-[#9CA3AF] font-bold">ไม่พบตารางสอนสำหรับเงื่อนไขที่เลือก</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ==========================================
// SUBSTITUTE
// ==========================================

export const Substitute: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestion, setSuggestion] = useState<{name?: string, reason?: string} | null>(null);
  const [historySearch, setHistorySearch] = useState('');
  
  const [historyData, setHistoryData] = useState<SubstituteHistoryItem[]>(MOCK_SUBSTITUTE_HISTORY);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [dataSource, setDataSource] = useState<'mock' | 'sheets' | 'excel'>('mock');

  const [periodSwaps, setPeriodSwaps] = useState<PeriodSwapItem[]>(MOCK_PERIOD_SWAPS);

  useEffect(() => {
    const storedSource = localStorage.getItem('smartsub_data_source');
    if (storedSource) setDataSource(storedSource as any);
    loadHistory(storedSource as any || 'mock');
  }, []);

  const loadHistory = async (sourceOverride?: 'mock' | 'sheets' | 'excel') => {
    setIsLoadingHistory(true);
    const source = sourceOverride || dataSource;
    
    let data: SubstituteHistoryItem[] | null = null;

    if (source === 'sheets') {
        data = await SheetService.getSubstituteHistory();
    } else if (source === 'excel') {
        data = ExcelService.getLocalData();
    } 

    if (data) {
        setHistoryData(data);
    } else {
        if (source !== 'mock') console.warn(`Failed to load from ${source}, falling back to mock.`);
        setHistoryData(MOCK_SUBSTITUTE_HISTORY);
    }
    
    setIsLoadingHistory(false);
  };

  const handleAISuggest = async () => {
    if (!selectedTeacherId || !selectedSlotId) return;
    
    setIsAnalyzing(true);
    const absentTeacher = TEACHERS.find(t => t.id === selectedTeacherId);
    const schedule = MOCK_SCHEDULES.find(s => s.teacher_id === selectedTeacherId); 
    
    if (absentTeacher && schedule) {
      const availableTeachers = TEACHERS.filter(t => t.id !== selectedTeacherId);
      const resultJson = await suggestSubstitute(absentTeacher, availableTeachers, schedule);
      try {
        const parsed = JSON.parse(resultJson);
        setSuggestion({
            name: parsed.teacher_name || parsed.teacherName,
            reason: parsed.reason
        });
      } catch (e) {
        setSuggestion({
            name: "Error parsing AI response",
            reason: resultJson
        });
      }
    }
    setIsAnalyzing(false);
  };

  const filteredHistory = historyData.filter(item => {
    const teacher = TEACHERS.find(t => t.id === item.teacher_id);
    const substitute = TEACHERS.find(t => t.id === item.substitute_id);
    const searchLower = historySearch.toLowerCase();
    
    return (
      item.subject.toLowerCase().includes(searchLower) ||
      (teacher?.name || '').toLowerCase().includes(searchLower) ||
      (substitute?.name || '').toLowerCase().includes(searchLower) ||
      item.date.includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-slate-900 dark:text-white">จัดการสอนแทน</h2>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="ข้อมูลการลา" icon={<UserPlus />}>
             <div className="space-y-4">
                <div>
                   <label className="block text-sm font-extrabold text-[#9CA3AF] mb-1">วันที่</label>
                   <input 
                     type="date" 
                     className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-900 dark:text-slate-100 font-bold"
                     value={selectedDate}
                     onChange={e => setSelectedDate(e.target.value)}
                   />
                </div>
                <div>
                   <label className="block text-sm font-extrabold text-[#9CA3AF] mb-1">ครูที่ลา</label>
                   <select 
                     className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-900 dark:text-slate-100 font-bold"
                     value={selectedTeacherId}
                     onChange={e => setSelectedTeacherId(e.target.value)}
                   >
                     <option value="">เลือกครู...</option>
                     {TEACHERS.map(t => (
                       <option key={t.id} value={t.id}>{t.name}</option>
                     ))}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-extrabold text-[#9CA3AF] mb-1">คาบที่ต้องการจัดแทน</label>
                   <select 
                     className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-900 dark:text-slate-100 font-bold"
                     value={selectedSlotId}
                     onChange={e => setSelectedSlotId(e.target.value)}
                   >
                      <option value="">เลือกคาบ...</option>
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot.id} value={slot.id}>
                          คาบ {slot.period_no} ({slot.time_label})
                        </option>
                      ))}
                   </select>
                </div>
                
                <Button 
                   onClick={handleAISuggest} 
                   disabled={!selectedTeacherId || !selectedSlotId || isAnalyzing}
                   className="w-full mt-4 font-extrabold"
                >
                   {isAnalyzing ? (
                       <>กำลังวิเคราะห์...</>
                   ) : (
                       <><Brain size={18} className="mr-2" /> ให้ AI แนะนำผู้สอนแทน</>
                   )}
                </Button>
             </div>
          </Card>

          <Card title="ผลการวิเคราะห์ AI" className={!suggestion ? 'opacity-50 pointer-events-none' : ''}>
             {suggestion ? (
                 <div className="space-y-4 animate-fadeIn">
                     <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-lg">
                        <div className="text-sm text-emerald-700 dark:text-emerald-400 font-extrabold mb-1">แนะนำ:</div>
                        <div className="text-xl font-extrabold text-slate-900 dark:text-white">{suggestion.name}</div>
                     </div>
                     <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="text-sm text-[#9CA3AF] font-extrabold mb-2">เหตุผลประกอบ:</div>
                        <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-bold">
                            {suggestion.reason}
                        </p>
                     </div>
                     <div className="flex gap-3 mt-4">
                        <Button variant="success" className="flex-1 font-extrabold">
                            <Check size={18} className="mr-2" /> ยืนยันการจัดแทน
                        </Button>
                        <Button variant="secondary" className="flex-1 font-extrabold">
                            ปฏิเสธ
                        </Button>
                     </div>
                 </div>
             ) : (
                 <div className="h-full flex flex-col items-center justify-center text-[#9CA3AF] py-12">
                     <Brain size={48} className="mb-4 opacity-20" />
                     <p className="font-bold">เลือกข้อมูลและกดปุ่มวิเคราะห์เพื่อรับคำแนะนำ</p>
                 </div>
             )}
          </Card>
       </div>

       <Card title="ประวัติการสลับคาบสอน (Period Swap History)" icon={<ArrowLeftRight />}>
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
             <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-indigo-50 dark:bg-slate-800 border-b border-indigo-100 dark:border-slate-700">
                     <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">วันที่</th>
                     <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">ผู้ขอสลับ</th>
                     <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">สลับกับ</th>
                     <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">รายละเอียดคาบ</th>
                     <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">เหตุผล</th>
                     <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">สถานะ</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {periodSwaps.map((ps) => {
                    const requester = TEACHERS.find(t => t.id === ps.requester_id);
                    const responder = TEACHERS.find(t => t.id === ps.responder_id);
                    return (
                      <tr key={ps.id} className="hover:bg-indigo-50/60 dark:hover:bg-indigo-900/10 transition-colors">
                        <td className="p-4 text-sm font-extrabold text-slate-800 dark:text-slate-200">{ps.date}</td>
                        <td className="p-4">
                           <div className="flex items-center gap-2">
                              {requester?.avatar && <img src={requester.avatar} className="w-6 h-6 rounded-full" alt="" />}
                              <span className="text-sm font-bold text-slate-900 dark:text-white">{requester?.name}</span>
                           </div>
                        </td>
                        <td className="p-4">
                           <div className="flex items-center gap-2">
                              {responder?.avatar && <img src={responder.avatar} className="w-6 h-6 rounded-full" alt="" />}
                              <span className="text-sm font-bold text-slate-900 dark:text-white">{responder?.name}</span>
                           </div>
                        </td>
                        <td className="p-4">
                           <div className="flex flex-col gap-1">
                              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                คาบ {ps.req_period} ({ps.req_subject})
                              </span>
                              <div className="flex items-center gap-2 text-[10px] text-[#9CA3AF] font-extrabold">
                                 <ArrowLeftRight size={10} /> สลับกับ
                              </div>
                              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                                คาบ {ps.res_period} ({ps.res_subject})
                              </span>
                           </div>
                        </td>
                        <td className="p-4 text-xs font-bold text-slate-600 dark:text-[#9CA3AF] italic">{ps.reason}</td>
                        <td className="p-4">
                           <span className={`px-2 py-1 rounded text-[10px] font-extrabold uppercase border ${
                              ps.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                              ps.status === 'approved' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
                              ps.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                              'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                           }`}>
                              {ps.status}
                           </span>
                        </td>
                      </tr>
                    );
                  })}
               </tbody>
             </table>
          </div>
       </Card>

       <Card 
         title={
           <div className="flex items-center gap-2">
             <span>ประวัติการสอนแทน</span>
             {dataSource === 'sheets' && (
               <span className="flex items-center gap-1 text-[10px] bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30 px-2 py-0.5 rounded font-extrabold uppercase">
                  <LinkIcon size={10} /> Google Sheets
               </span>
             )}
             {dataSource === 'excel' && (
               <span className="flex items-center gap-1 text-[10px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded font-extrabold uppercase">
                  <FileSpreadsheet size={10} /> Excel (Local)
               </span>
             )}
             {dataSource === 'mock' && (
               <span className="flex items-center gap-1 text-[10px] bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-600 px-2 py-0.5 rounded font-extrabold uppercase">
                  <Database size={10} /> Mock
               </span>
             )}
           </div>
         } 
         icon={<History />}
         action={
           <div className="flex gap-2">
             <div className="relative">
               <input 
                 type="text" 
                 placeholder="ค้นหา..." 
                 className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 w-40 text-slate-900 dark:text-slate-100 font-bold"
                 value={historySearch}
                 onChange={(e) => setHistorySearch(e.target.value)}
               />
               <Search size={14} className="absolute left-3 top-2 text-[#9CA3AF]" />
             </div>
             <Button variant="secondary" size="sm" onClick={() => loadHistory()} isLoading={isLoadingHistory} className="font-bold">
               <RefreshCw size={14} />
             </Button>
           </div>
         }
       >
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
             <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-indigo-50 dark:bg-slate-800 border-b border-indigo-100 dark:border-slate-700">
                     <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">
                        <div className="flex items-center gap-2"><CalendarIcon size={14} /> วันที่</div>
                     </th>
                     <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">คาบ</th>
                     <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">
                        <div className="flex items-center gap-2"><BookOpen size={14} /> วิชา</div>
                     </th>
                     <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">
                        <div className="flex items-center gap-2"><User size={14} /> ครูเจ้าของวิชา</div>
                     </th>
                     <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">
                        <div className="flex items-center gap-2"><UserPlus size={14} /> ครูสอนแทน</div>
                     </th>
                     <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase tracking-wider">สถานะ</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((item, index) => {
                       const teacher = TEACHERS.find(t => t.id === item.teacher_id);
                       const substitute = TEACHERS.find(t => t.id === item.substitute_id);
                       return (
                          <tr key={item.id || index} className="hover:bg-indigo-50/60 dark:hover:bg-indigo-900/10 transition-colors">
                             <td className="p-4 text-sm font-extrabold text-slate-800 dark:text-slate-200">{item.date}</td>
                             <td className="p-4">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-extrabold text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700">
                                   {item.period}
                                </span>
                             </td>
                             <td className="p-4 text-sm font-extrabold text-slate-900 dark:text-white">{item.subject}</td>
                             <td className="p-4 text-sm text-[#9CA3AF] font-bold">{teacher?.name || item.teacher_id}</td>
                             <td className="p-4 text-sm font-extrabold text-indigo-700 dark:text-indigo-300">{substitute?.name || item.substitute_id}</td>
                             <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-extrabold border shadow-sm ${
                                   item.status === 'completed' 
                                   ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
                                   : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'
                                }`}>
                                   {item.status === 'completed' ? 'เรียบร้อย' : 'ยกเลิก'}
                                </span>
                             </td>
                          </tr>
                       );
                    })
                  ) : (
                    <tr>
                       <td colSpan={6} className="p-8 text-center text-[#9CA3AF] font-extrabold italic">ไม่พบข้อมูลประวัติการสอนแทน</td>
                    </tr>
                  )}
               </tbody>
             </table>
          </div>
       </Card>
    </div>
  );
};

// ==========================================
// RULES
// ==========================================

export const Rules: React.FC = () => {
  const [rules, setRules] = useState(INITIAL_RULES);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<RuleAnalysisResult | null>(null);

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const updateRule = (id: string, updates: Partial<Rule>) => {
    setRules(rules.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const handleDeleteRule = (id: string) => {
    if(confirm('คุณต้องการลบกฎนี้ใช่หรือไม่?')) {
        setRules(rules.filter(r => r.id !== id));
    }
  };

  const handleAddRule = () => {
    const newRule: Rule = {
      id: `rule-${Date.now()}`,
      name: 'เงื่อนไขใหม่',
      type: 'custom',
      value: '',
      priority: '2', 
      weight: 5,
      active: true,
      targetGrade: '',
      fallbackGrade: '',
      maxWorkload: 0,
      tolerance: 0,
      maxSwapsPerWeek: 0,
      allowCrossDay: false,
      noticePeriodDays: 1,
      maxSwapWindowDays: 7,
      allowedReasons: ['sick', 'personal']
    };
    setRules([...rules, newRule]);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await analyzeRuleEffectiveness(rules, MOCK_SUBSTITUTE_HISTORY, MOCK_APPROVALS);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const applySuggestion = (suggestion: RuleSuggestion) => {
      if (suggestion.action === 'modify' && suggestion.suggestedChanges) {
          setRules(rules.map(r => r.id === suggestion.ruleId ? { ...r, ...suggestion.suggestedChanges } : r));
      }
      if (analysisResult) {
          setAnalysisResult({
              ...analysisResult,
              suggestions: analysisResult.suggestions.filter(s => s !== suggestion)
          });
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">เงื่อนไขอัตโนมัติ</h2>
        <Button onClick={handleAddRule} className="font-bold">
           <Plus size={18} className="mr-2" /> เพิ่มกฎใหม่
        </Button>
      </div>

      <div className="grid gap-4">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn shadow-sm">
             <div className="flex-1 w-full space-y-3">
                <div className="flex flex-col md:flex-row gap-4">
                   <div className="flex-1">
                       <label className="text-[10px] font-extrabold text-[#9CA3AF] uppercase mb-1 block">ชื่อเงื่อนไข</label>
                       <input
                          type="text"
                          value={rule.name}
                          onChange={(e) => updateRule(rule.id, { name: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none font-bold"
                       />
                   </div>
                   <div className="w-full md:w-32">
                       <label className="text-[10px] font-extrabold text-[#9CA3AF] uppercase mb-1 block">ประเภท</label>
                       <select
                          value={rule.type}
                          onChange={(e) => updateRule(rule.id, { type: e.target.value as any })}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none font-bold"
                       >
                           <option value="grade_level">ระดับชั้น</option>
                           <option value="workload_balance">ภาระงาน</option>
                           <option value="subject_match">ตรงวิชา</option>
                           <option value="period_swap">สลับคาบ</option>
                           <option value="custom">กำหนดเอง</option>
                       </select>
                   </div>
                   <div className="w-full md:w-24">
                       <label className="text-[10px] font-extrabold text-[#9CA3AF] uppercase mb-1 block">ความสำคัญ</label>
                       <select
                          value={rule.priority}
                          onChange={(e) => updateRule(rule.id, { priority: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none font-bold"
                       >
                           <option value="1">High (1)</option>
                           <option value="2">Med (2)</option>
                           <option value="3">Low (3)</option>
                       </select>
                   </div>
                </div>

                {rule.type === 'grade_level' && (
                   <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-lg border border-slate-200 dark:border-slate-800">
                      <div>
                         <label className="block text-[10px] font-extrabold text-[#9CA3AF] mb-1">Target Grade</label>
                         <input 
                            type="text"
                            value={rule.targetGrade || ''}
                            onChange={(e) => updateRule(rule.id, { targetGrade: e.target.value })}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none font-bold"
                            placeholder="e.g. same"
                         />
                      </div>
                      <div>
                         <label className="block text-[10px] font-extrabold text-[#9CA3AF] mb-1">Fallback Grade</label>
                         <input 
                            type="text"
                            value={rule.fallbackGrade || ''}
                            onChange={(e) => updateRule(rule.id, { fallbackGrade: e.target.value })}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none font-bold"
                            placeholder="e.g. +/- 1"
                         />
                      </div>
                   </div>
                )}

                {rule.type === 'workload_balance' && (
                   <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-lg border border-slate-200 dark:border-slate-800">
                      <div>
                         <label className="block text-[10px] font-extrabold text-[#9CA3AF] mb-1">Max Workload (%)</label>
                         <input 
                            type="number"
                            value={rule.maxWorkload || 0}
                            onChange={(e) => updateRule(rule.id, { maxWorkload: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none font-bold"
                         />
                      </div>
                      <div>
                         <label className="block text-[10px] font-extrabold text-[#9CA3AF] mb-1">Tolerance</label>
                         <input 
                            type="number"
                            value={rule.tolerance || 0}
                            onChange={(e) => updateRule(rule.id, { tolerance: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none font-bold"
                         />
                      </div>
                   </div>
                )}
             </div>
             
             <div className="flex items-center gap-3 self-start md:self-center border-l border-slate-200 dark:border-slate-800 pl-4 h-full">
                <div className="flex flex-col gap-1 w-24">
                   <label className="text-[10px] font-extrabold text-[#9CA3AF]">ค่าน้ำหนัก ({rule.weight})</label>
                   <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={rule.weight} 
                      onChange={(e) => updateRule(rule.id, { weight: parseInt(e.target.value) })}
                      className="h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" 
                   />
                </div>
                <button onClick={() => toggleRule(rule.id)} className={`transition-colors ${rule.active ? 'text-emerald-500 dark:text-emerald-400' : 'text-[#9CA3AF]'}`} title={rule.active ? "ปิดใช้งาน" : "เปิดใช้งาน"}>
                   {rule.active ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
                <button 
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                    title="ลบกฎ"
                >
                   <Trash2 size={18} />
                </button>
             </div>
          </div>
        ))}

        <Button onClick={handleAddRule} variant="secondary" className="border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-[#9CA3AF] hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500 dark:hover:border-indigo-500 w-full py-3 font-extrabold">
            <Plus size={18} className="mr-2" /> เพิ่มกฎใหม่ (Add New Condition)
        </Button>
      </div>

      <Card className="mt-8 border-indigo-200 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-900">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                      <Brain size={24} />
                  </div>
                  <div>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">วิเคราะห์ประสิทธิภาพกฎ (AI Analysis)</h3>
                      <p className="text-sm font-bold text-slate-600 dark:text-[#9CA3AF]">ใช้ Gemini AI วิเคราะห์ประวัติการสอนแทนเพื่อปรับปรุงกฎให้ดียิ่งขึ้น</p>
                  </div>
              </div>
              <Button onClick={handleAnalyze} disabled={isAnalyzing} isLoading={isAnalyzing} className="font-extrabold">
                  {isAnalyzing ? 'กำลังวิเคราะห์...' : 'เริ่มการวิเคราะห์'}
              </Button>
          </div>

          {analysisResult && (
              <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800 font-bold">
                          <div className="text-sm font-extrabold text-[#9CA3AF] mb-2">คะแนนประสิทธิภาพรวม</div>
                          <div className="relative flex items-center justify-center w-32 h-32">
                              <svg className="w-full h-full transform -rotate-90">
                                  <circle cx="64" cy="64" r="56" stroke="#cbd5e1" strokeWidth="12" fill="transparent" className="dark:stroke-slate-800" />
                                  <circle cx="64" cy="64" r="56" stroke={analysisResult.overallScore > 70 ? '#4ade80' : analysisResult.overallScore > 40 ? '#fbbf24' : '#f87171'} strokeWidth="12" fill="transparent" strokeDasharray={`${analysisResult.overallScore * 3.51} 351`} className="transition-all duration-1000 ease-out" />
                              </svg>
                              <span className="absolute text-3xl font-extrabold text-slate-800 dark:text-white">{analysisResult.overallScore}</span>
                          </div>
                      </div>
                      <div className="md:col-span-2 p-6 bg-white dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800 font-bold">
                          <h4 className="font-extrabold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                              <BarChart2 size={18} className="text-indigo-500 dark:text-indigo-400" /> ผลการวิเคราะห์
                          </h4>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              {analysisResult.analysis}
                          </p>
                      </div>
                  </div>
              </div>
          )}
      </Card>
    </div>
  );
};

// ==========================================
// SETTINGS
// ==========================================

export const Settings: React.FC = () => {
  const [config, setConfig] = useState<SheetConfig>({ spreadsheetId: '', apiKey: '', accessToken: '' });
  const [dataSource, setDataSource] = useState<'mock' | 'sheets' | 'excel'>('mock');
  const [sheetStatus, setSheetStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [excelStatus, setExcelStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');
  
  // Workload Rule Settings
  const [workloadSettings, setWorkloadSettings] = useState<WorkloadSettings>(DEFAULT_WORKLOAD_SETTINGS);

  // Teacher Management State
  const [teachers, setTeachers] = useState<Teacher[]>(TEACHERS);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedConfig = getSheetConfig();
    if (storedConfig) setConfig(storedConfig);
    const storedSource = localStorage.getItem('smartsub_data_source');
    if (storedSource) setDataSource(storedSource as any);
    
    const storedWorkload = localStorage.getItem('smartsub_workload_settings');
    if (storedWorkload) setWorkloadSettings(JSON.parse(storedWorkload));
  }, []);

  const handleSaveConfig = () => {
    saveSheetConfig(config);
    localStorage.setItem('smartsub_data_source', dataSource);
    localStorage.setItem('smartsub_workload_settings', JSON.stringify(workloadSettings));
    setSheetStatus('idle');
    if (dataSource === 'sheets') handleTestSheet();
  };

  const handleTestSheet = async () => {
    setSheetStatus('testing');
    const success = await SheetService.testConnection(config);
    setSheetStatus(success ? 'success' : 'error');
  };

  const handleDataSourceChange = (source: 'mock' | 'sheets' | 'excel') => {
      setDataSource(source);
      localStorage.setItem('smartsub_data_source', source);
  };

  // Excel Handlers
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setExcelStatus('importing');
      try {
          await ExcelService.importData(file);
          setExcelStatus('success');
          handleDataSourceChange('excel');
      } catch (error) {
          setExcelStatus('error');
      }
  };

  const handleDownloadTemplate = () => {
      ExcelService.exportData(ExcelService.getTemplateData() as any);
  };

  const handleExportData = () => {
      const data = ExcelService.getLocalData();
      if (data && data.length > 0) {
          ExcelService.exportData(data);
      } else {
          alert("ไม่มีข้อมูลใน Local Database ให้ส่งออก");
      }
  };

  // Teacher Management Handlers
  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setShowTeacherForm(true);
  };

  const handleAddNewTeacher = () => {
    setEditingTeacher(null);
    setShowTeacherForm(true);
  };

  const handleSaveTeacher = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const teachingHours = parseFloat(formData.get('teaching_hours') as string) || 0;
    const substituteHours = parseFloat(formData.get('substitute_hours') as string) || 0;
    const otherHours = parseFloat(formData.get('other_hours') as string) || 0;
    
    // Formula: (Hours / BASE_HOURS) * 100
    const totalHours = teachingHours + substituteHours + otherHours;
    const calculatedWorkload = Math.round((totalHours / workloadSettings.baseHours) * 100);

    const teacherData: Teacher = {
      id: formData.get('teacher_id') as string,
      name: formData.get('teacher_name') as string,
      subject: formData.get('subject') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      status: formData.get('status') as 'active' | 'inactive',
      teaching_hours: teachingHours,
      substitute_hours: substituteHours,
      other_hours: otherHours,
      workload: calculatedWorkload,
      specialty: formData.get('specialty') as string,
      grade_level: formData.get('grade_level') as any,
      notes: formData.get('notes') as string,
      avatar: editingTeacher?.avatar || "https://picsum.photos/200/200?random=" + Math.random()
    };

    if (editingTeacher) {
      setTeachers(teachers.map(t => t.id === editingTeacher.id ? teacherData : t));
    } else {
      setTeachers([...teachers, teacherData]);
    }
    
    setShowTeacherForm(false);
    setEditingTeacher(null);
  };

  const handleDeleteTeacher = (id: string) => {
    if(confirm('คุณต้องการลบข้อมูลครูท่านนี้ใช่หรือไม่?')) {
      setTeachers(teachers.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">ตั้งค่าระบบ (Settings)</h2>

      {/* Workload Rule Tab - New Section */}
      <Card title="เกณฑ์การคำนวณภาระงาน (Workload Rules)" icon={<Activity />}>
        <div className="space-y-6">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-lg font-bold">
            <h4 className="text-sm text-indigo-900 dark:text-indigo-400 mb-2 flex items-center gap-2">
              <PieChart size={18} /> สูตรการคำนวณภาระงาน 100%
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white dark:bg-slate-950 p-3 rounded border border-indigo-100 dark:border-indigo-900">
                <span className="text-[#9CA3AF]">1. สอนปกติ (Teaching)</span>
                <div className="text-indigo-600 dark:text-indigo-400 mt-1">(ชั่วโมงสอน / ฐานชั่วโมง) * 100</div>
              </div>
              <div className="bg-white dark:bg-slate-950 p-3 rounded border border-indigo-100 dark:border-indigo-900">
                <span className="text-[#9CA3AF]">2. สอนแทน (Substitute)</span>
                <div className="text-indigo-600 dark:text-indigo-400 mt-1">(ชั่วโมงแทน / ฐานชั่วโมง) * 100</div>
              </div>
              <div className="bg-white dark:bg-slate-950 p-3 rounded border border-indigo-100 dark:border-indigo-900">
                <span className="text-[#9CA3AF]">3. งานอื่นๆ (Other)</span>
                <div className="text-indigo-600 dark:text-indigo-400 mt-1">(ชั่วโมงงานอื่น / ฐานชั่วโมง) * 100</div>
              </div>
            </div>
            <p className="mt-3 text-[10px] text-slate-500 dark:text-[#9CA3AF] italic">
              * ผลรวมของเปอร์เซ็นต์ (1+2+3) คือภาระงานรวมทั้งหมดของบุคลากร
            </p>
          </div>

          <div className="max-w-xs">
            <label className="block text-sm font-extrabold text-slate-700 dark:text-[#9CA3AF] mb-2">ฐานชั่วโมงมาตรฐานต่อสัปดาห์ (Base Hours) *</label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                value={workloadSettings.baseHours}
                onChange={e => setWorkloadSettings({baseHours: parseFloat(e.target.value) || 0})}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none font-bold"
              />
              <span className="text-sm font-bold text-[#9CA3AF]">ชม./สัปดาห์</span>
            </div>
            <p className="mt-1 text-[10px] text-[#9CA3AF] font-bold italic">ตัวอย่าง: โรงเรียนทั่วไปใช้ 20 หรือ 40 ชม.</p>
          </div>
        </div>
      </Card>

      {/* Teacher Management Section */}
      <Card 
        title="จัดการข้อมูลบุคลากรครู" 
        icon={<Users />}
        action={
          <Button size="sm" onClick={handleAddNewTeacher} className="font-bold">
            <Plus size={16} className="mr-1" /> เพิ่มครูใหม่
          </Button>
        }
      >
        <div className="space-y-6">
          {showTeacherForm ? (
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border-2 border-indigo-100 dark:border-indigo-500/20 animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-bold text-indigo-900 dark:text-indigo-400 flex items-center gap-2">
                  <FileText size={20} /> {editingTeacher ? 'แก้ไขข้อมูลครู' : 'เพิ่มข้อมูลครูใหม่'}
                </h4>
                <button onClick={() => setShowTeacherForm(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveTeacher} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-extrabold text-[#9CA3AF] uppercase tracking-wider">ข้อมูลส่วนตัว</h5>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">รหัสพนักงาน (Teacher ID) *</label>
                      <input name="teacher_id" defaultValue={editingTeacher?.id} required className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none" placeholder="เช่น T001" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ชื่อ-นามสกุล *</label>
                      <input name="teacher_name" defaultValue={editingTeacher?.name} required className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">เบอร์โทรศัพท์</label>
                      <input name="phone" defaultValue={editingTeacher?.phone} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 outline-none" placeholder="08x-xxx-xxxx" />
                    </div>
                  </div>

                  {/* Teaching Info (Hours Breakdown) */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-extrabold text-[#9CA3AF] uppercase tracking-wider">ภาระงาน (จำนวนชั่วโมง)</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">ชั่วโมงสอนปกติ *</label>
                        <input name="teaching_hours" type="number" step="0.5" defaultValue={editingTeacher?.teaching_hours} required className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">ชั่วโมงสอนแทน</label>
                        <input name="substitute_hours" type="number" step="0.5" defaultValue={editingTeacher?.substitute_hours} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ชั่วโมงงานอื่นๆ</label>
                      <input name="other_hours" type="number" step="0.5" defaultValue={editingTeacher?.other_hours} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none" />
                    </div>
                    <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded border border-indigo-100 dark:border-indigo-900 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 italic">
                      * ระบบจะคำนวณภาระงานเป็น % อัตโนมัติจากฐาน {workloadSettings.baseHours} ชม.
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-extrabold text-[#9CA3AF] uppercase tracking-wider">วิชาและสายชั้น</h5>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">วิชาที่สอน *</label>
                      <input name="subject" defaultValue={editingTeacher?.subject} required className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">สายชั้น *</label>
                      <select name="grade_level" defaultValue={editingTeacher?.grade_level} required className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none">
                        <option value="kindergarten">อนุบาล</option>
                        <option value="primary_low">ประถมศึกษาตอนต้น</option>
                        <option value="primary_high">ประถมศึกษาตอนปลาย</option>
                        <option value="secondary_low">มัธยมศึกษาตอนต้น</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">สถานะ</label>
                      <select name="status" defaultValue={editingTeacher?.status || 'active'} className="w-full bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 outline-none">
                        <option value="active">ปกติ (Active)</option>
                        <option value="inactive">พักการสอน (Inactive)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Button type="button" variant="ghost" onClick={() => setShowTeacherForm(false)}>ยกเลิก</Button>
                  <Button type="submit" variant="success" className="font-bold">
                    <Save size={18} className="mr-2" /> บันทึกข้อมูล
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-indigo-50 dark:bg-slate-800 border-b border-indigo-100 dark:border-slate-700">
                    <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase">ครู</th>
                    <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase">ข้อมูลการสอน</th>
                    <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase">ชม. งาน (Load %)</th>
                    <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase">สถานะ</th>
                    <th className="p-4 text-xs font-extrabold text-indigo-900 dark:text-indigo-100 uppercase text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-slate-50 dark:hover:bg-indigo-900/10 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={teacher.avatar} className="w-10 h-10 rounded-full border-2 border-indigo-100 shadow-sm" alt="" />
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white">{teacher.name}</div>
                            <div className="text-[10px] font-extrabold text-[#9CA3AF] uppercase">ID: {teacher.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            <BookOpen size={14} className="text-indigo-500" /> {teacher.subject}
                          </div>
                          <div className="text-xs text-[#9CA3AF] font-bold flex items-center gap-1">
                            <GraduationCap size={14} /> {
                              teacher.grade_level === 'kindergarten' ? 'อนุบาล' :
                              teacher.grade_level === 'primary_low' ? 'ประถมต้น' :
                              teacher.grade_level === 'primary_high' ? 'ประถมปลาย' : 'มัธยมต้น'
                            }
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                           <div className="flex gap-2 text-[10px] font-bold text-[#9CA3AF]">
                              <span>S:{teacher.teaching_hours}</span>
                              <span>T:{teacher.substitute_hours}</span>
                              <span>O:{teacher.other_hours}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                               <div className={`h-full rounded-full ${teacher.workload > 80 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{width: `${teacher.workload}%`}}></div>
                             </div>
                             <span className={`text-xs font-extrabold ${teacher.workload > 80 ? 'text-red-500' : 'text-indigo-600 dark:text-indigo-400'}`}>{teacher.workload}%</span>
                           </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                          teacher.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                          : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                        }`}>
                          {teacher.status === 'active' ? <span className="flex items-center gap-1"><UserCheck size={10} /> Active</span> : <span className="flex items-center gap-1"><UserX size={10} /> Inactive</span>}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEditTeacher(teacher)} className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 rounded-lg transition-colors" title="แก้ไข">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDeleteTeacher(teacher.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors" title="ลบ">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      {/* Data Source Selection */}
      <Card title="เลือกแหล่งข้อมูล (Data Source)" icon={<Database />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                  onClick={() => handleDataSourceChange('mock')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${dataSource === 'mock' ? 'bg-indigo-100 dark:bg-indigo-500/10 border-indigo-500 dark:border-indigo-500 text-indigo-800 dark:text-white shadow-md' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-[#9CA3AF] hover:border-indigo-300 dark:hover:border-indigo-500/50'}`}
              >
                  <RefreshCw size={24} />
                  <span className="font-extrabold">Mock Data</span>
                  <span className="text-xs opacity-80 font-bold italic">ข้อมูลตัวอย่างในระบบ</span>
              </div>
              
              <div 
                  onClick={() => handleDataSourceChange('sheets')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${dataSource === 'sheets' ? 'bg-indigo-100 dark:bg-indigo-500/10 border-indigo-500 dark:border-indigo-500 text-indigo-800 dark:text-white shadow-md' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-[#9CA3AF] hover:border-indigo-300 dark:hover:border-indigo-500/50'}`}
              >
                  <LinkIcon size={24} />
                  <span className="font-extrabold">Google Sheets</span>
                  <span className="text-xs opacity-80 font-bold italic">เชื่อมต่อ API ออนไลน์</span>
              </div>

              <div 
                  onClick={() => handleDataSourceChange('excel')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${dataSource === 'excel' ? 'bg-indigo-100 dark:bg-indigo-500/10 border-indigo-500 dark:border-indigo-500 text-indigo-800 dark:text-white shadow-md' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-[#9CA3AF] hover:border-indigo-300 dark:hover:border-indigo-500/50'}`}
              >
                  <FileSpreadsheet size={24} />
                  <span className="font-extrabold">Excel (Offline)</span>
                  <span className="text-xs opacity-80 font-bold italic">นำเข้าไฟล์ .xlsx</span>
              </div>
          </div>
      </Card>
      
      {/* Configuration Save Button */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSaveConfig} variant="primary" className="px-8 font-extrabold shadow-lg">
           <Save size={18} className="mr-2" /> บันทึกการตั้งค่าทั้งหมด
        </Button>
      </div>

      {/* Google Sheets Config Section */}
      {dataSource === 'sheets' && (
        <Card title="ตั้งค่า Google Sheets API" className="animate-fadeIn">
            <div className="space-y-4 max-w-2xl font-bold">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-lg text-sm text-indigo-700 dark:text-indigo-300 italic">
                คุณสามารถเชื่อมต่อ Google Sheets เพื่อใช้เป็นฐานข้อมูลสำหรับเก็บประวัติการสอนแทนได้ 
                โดยต้องระบุ Spreadsheet ID และ API Key
            </div>

            <div>
                <label className="block text-sm font-extrabold text-slate-600 dark:text-[#9CA3AF] mb-1">Spreadsheet ID</label>
                <input 
                    type="text" 
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-900 dark:text-slate-100"
                    placeholder="เช่น 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                    value={config.spreadsheetId}
                    onChange={e => setConfig({...config, spreadsheetId: e.target.value})}
                />
            </div>

            <div>
                <label className="block text-sm font-extrabold text-slate-600 dark:text-[#9CA3AF] mb-1">API Key</label>
                <input 
                    type="password" 
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-900 dark:text-slate-100"
                    placeholder="Google Cloud API Key"
                    value={config.apiKey}
                    onChange={e => setConfig({...config, apiKey: e.target.value})}
                />
            </div>

            <div className="flex items-center gap-3 mt-4">
                <Button onClick={handleSaveConfig} variant="primary" className="font-extrabold shadow-sm">
                    <Save size={18} className="mr-2" /> บันทึกและทดสอบ
                </Button>
                
                {sheetStatus === 'testing' && <span className="text-slate-500 dark:text-[#9CA3AF] text-sm animate-pulse italic">กำลังทดสอบ...</span>}
                {sheetStatus === 'success' && (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center text-sm font-extrabold animate-fadeIn">
                        <CheckCircleIcon size={18} className="mr-1" /> เชื่อมต่อสำเร็จ
                    </span>
                )}
                {sheetStatus === 'error' && (
                    <span className="text-red-600 dark:text-red-400 flex items-center text-sm font-extrabold animate-fadeIn">
                        <XCircle size={18} className="mr-1" /> เชื่อมต่อล้มเหลว
                    </span>
                )}
            </div>
            </div>
        </Card>
      )}

      {/* Excel Config Section */}
      {dataSource === 'excel' && (
          <Card title="จัดการฐานข้อมูล Excel (Offline)" className="animate-fadeIn">
             <div className="space-y-6 font-bold">
                 <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-lg text-sm text-emerald-700 dark:text-emerald-300 italic">
                    ข้อมูลจะถูกเก็บไว้ใน Browser (LocalStorage) หลังจากนำเข้าไฟล์ .xlsx 
                    คุณสามารถส่งออกข้อมูลเป็นไฟล์ Excel ได้ตลอดเวลา
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-3 border-r border-slate-200 dark:border-slate-800 pr-6">
                        <h4 className="text-slate-800 dark:text-white font-extrabold flex items-center gap-2"><Upload size={18}/> นำเข้าข้อมูล (Import)</h4>
                        <p className="text-xs text-slate-500 dark:text-[#9CA3AF] italic">อัพโหลดไฟล์ .xlsx ที่มีคอลัมน์: ID, Date, Period, Subject, TeacherID, SubstituteID, Status</p>
                        
                        <div className="flex gap-2">
                           <input 
                             type="file" 
                             ref={fileInputRef}
                             className="hidden" 
                             accept=".xlsx, .xls"
                             onChange={handleExcelUpload}
                           />
                           <Button onClick={() => fileInputRef.current?.click()} variant="secondary" isLoading={excelStatus === 'importing'} className="font-extrabold shadow-sm">
                               เลือกไฟล์ Excel
                           </Button>
                           <Button onClick={handleDownloadTemplate} variant="ghost" size="sm" className="text-xs font-bold underline">
                               ดาวน์โหลด Template
                           </Button>
                        </div>
                        {excelStatus === 'success' && (
                            <div className="text-emerald-600 dark:text-emerald-400 text-sm mt-2 flex items-center font-extrabold">
                                <CheckCircleIcon size={16} className="mr-1" /> นำเข้าข้อมูลเรียบร้อยแล้ว
                            </div>
                        )}
                        {excelStatus === 'error' && (
                            <div className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center font-extrabold">
                                <XCircle size={16} className="mr-1" /> เกิดข้อผิดพลาดในการอ่านไฟล์
                            </div>
                        )}
                     </div>

                     <div className="space-y-3 pl-2">
                        <h4 className="text-slate-800 dark:text-white font-extrabold flex items-center gap-2"><Download size={18}/> ส่งออกข้อมูล (Export)</h4>
                        <p className="text-xs text-slate-500 dark:text-[#9CA3AF] italic">ดาวน์โหลดข้อมูลปัจจุบันในระบบออกมาเป็นไฟล์ Excel</p>
                        <Button onClick={handleExportData} variant="primary" className="font-extrabold shadow-sm">
                            Download .xlsx
                        </Button>
                     </div>
                 </div>
             </div>
          </Card>
      )}

      <Card title="โครงสร้างข้อมูล (Schema Guide)">
         <div className="text-sm text-slate-600 dark:text-[#9CA3AF] font-bold">
            <p className="mb-2 italic">ไม่ว่าจะใช้ Google Sheets หรือ Excel กรุณาใช้โครงสร้างคอลัมน์ดังนี้:</p>
            <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800 font-mono text-xs overflow-x-auto text-slate-800 dark:text-slate-200 font-extrabold">
               | ID | Date | Period | Subject | TeacherID | SubstituteID | Status |
            </div>
         </div>
      </Card>
    </div>
  );
};

// ==========================================
// APPROVALS, WORKLOAD, IMAGE EDITOR
// (Already implemented but ensuring they are exported for App.tsx)
// ==========================================

export const Approvals: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApprovals = MOCK_APPROVALS.filter(approval => {
    const teacher = TEACHERS.find(t => t.id === approval.teacher_id);
    const sub = TEACHERS.find(t => t.id === approval.substitute_id);
    const searchLower = searchQuery.toLowerCase();
    
    return (
      (teacher?.name || '').toLowerCase().includes(searchLower) ||
      (sub?.name || '').toLowerCase().includes(searchLower) ||
      approval.subject.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">รายการรออนุมัติ</h2>
        <div className="relative w-full sm:w-auto">
           <input 
             type="text" 
             placeholder="ค้นหาชื่อครู, วิชา..." 
             className="w-full sm:w-64 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder-[#9CA3AF] font-bold"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
           <Search size={16} className="absolute left-3 top-3 text-[#9CA3AF]" />
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredApprovals.length > 0 ? (
          filteredApprovals.map((approval) => {
            const teacher = TEACHERS.find(t => t.id === approval.teacher_id);
            const sub = TEACHERS.find(t => t.id === approval.substitute_id);
            
            return (
              <Card key={approval.id} className="border-l-4 border-l-amber-400">
                 <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400 text-xs font-extrabold border border-amber-200 dark:border-amber-400/20 flex items-center gap-1 shadow-sm">
                             <Clock size={12} /> Pending
                          </span>
                          <span className="text-sm font-bold text-[#9CA3AF]">Requested: {approval.requestedAt}</span>
                       </div>
                       <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                          {approval.subject} - คาบ {approval.period}
                       </h3>
                       <div className="text-sm font-bold text-slate-600 dark:text-[#9CA3AF]">
                          <span className="text-slate-900 dark:text-slate-200">{teacher?.name}</span> (ลา) 
                          <span className="mx-2">→</span>
                          <span className="text-indigo-600 dark:text-indigo-400">{sub?.name}</span> (สอนแทน)
                       </div>
                       <div className="mt-2 text-xs font-bold text-[#9CA3AF]">
                          ขอโดย: {approval.requestedBy}
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <Button variant="success" size="sm" className="font-bold shadow-sm">
                          <Check size={16} className="mr-1" /> อนุมัติ
                       </Button>
                       <Button variant="danger" size="sm" className="font-bold shadow-sm">
                          <X size={16} className="mr-1" /> ปฏิเสธ
                       </Button>
                    </div>
                 </div>
              </Card>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-[#9CA3AF] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-bold">
             <Search size={48} className="mb-4 opacity-20" />
             <p>ไม่พบรายการที่ค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const Workload: React.FC = () => {
  const [baseHours, setBaseHours] = useState(DEFAULT_WORKLOAD_SETTINGS.baseHours);

  useEffect(() => {
    const storedWorkload = localStorage.getItem('smartsub_workload_settings');
    if (storedWorkload) {
      setBaseHours(JSON.parse(storedWorkload).baseHours);
    }
  }, []);

  const chartData = TEACHERS.map(t => {
    const teachingPerc = (t.teaching_hours / baseHours) * 100;
    const substitutePerc = (t.substitute_hours / baseHours) * 100;
    const otherPerc = (t.other_hours / baseHours) * 100;

    return {
      name: t.name.split(' ')[0], 
      teachingPerc: Math.round(teachingPerc * 10) / 10,
      substitutePerc: Math.round(substitutePerc * 10) / 10,
      otherPerc: Math.round(otherPerc * 10) / 10,
      totalLoad: t.workload,
      full: t
    };
  }).sort((a, b) => b.totalLoad - a.totalLoad);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">ภาระงานครู (Workload Analysis)</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2">
            <Card title="กราฟวิเคราะห์ภาระงานแยกตามประเภท (%)">
               <div className="h-[450px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} className="dark:stroke-slate-800" />
                     <XAxis type="number" stroke="#94a3b8" domain={[0, 100]} />
                     <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} style={{ fontSize: '12px', fontWeight: 'bold' }} />
                     <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', borderRadius: '8px', fontWeight: 'bold' }}
                        itemStyle={{ fontWeight: 'bold' }}
                     />
                     <Legend verticalAlign="top" height={36}/>
                     <Bar dataKey="teachingPerc" name="สอนปกติ" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
                     <Bar dataKey="substitutePerc" name="สอนแทน" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                     <Bar dataKey="otherPerc" name="งานอื่นๆ" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} />
                     
                     {/* Reference Line at 80% to show workload warning */}
                     <ReferenceLine x={80} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Overload (80%)', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
               <div className="mt-4 flex flex-wrap gap-4 text-[10px] font-bold text-slate-500 justify-center">
                  <div className="flex items-center gap-1"><span className="w-3 h-3 bg-[#6366f1] rounded"></span> สอนปกติ</div>
                  <div className="flex items-center gap-1"><span className="w-3 h-3 bg-[#f59e0b] rounded"></span> สอนแทน</div>
                  <div className="flex items-center gap-1"><span className="w-3 h-3 bg-[#10b981] rounded"></span> งานอื่นๆ</div>
               </div>
            </Card>
         </div>
         
         <div>
            <Card title="สรุปสถานะภาระงาน" className="h-full">
               <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                     <div className="text-xs font-extrabold text-[#9CA3AF] uppercase mb-1">ภาระงานเฉลี่ยรวม</div>
                     <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                        {Math.round(chartData.reduce((acc, curr) => acc + curr.totalLoad, 0) / chartData.length)}%
                     </div>
                  </div>
                  
                  <h4 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 mt-4 mb-2 flex items-center gap-2">
                    <AlertOctagon size={16} className="text-red-500" /> ครูที่มีภาระงานวิกฤต (>80%)
                  </h4>
                  <div className="space-y-2">
                     {chartData.filter(d => d.totalLoad > 80).map(d => (
                        <div key={d.name} className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 shadow-sm">
                           <span className="text-sm font-bold text-red-700 dark:text-red-300">{d.name}</span>
                           <span className="text-sm font-extrabold text-red-600 dark:text-red-400">{d.totalLoad}%</span>
                        </div>
                     ))}
                     {chartData.filter(d => d.totalLoad > 80).length === 0 && (
                        <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 italic">ไม่มีครูภาระงานเกินเกณฑ์</div>
                     )}
                  </div>

                  <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                    <h5 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-3 uppercase">เกณฑ์การจัดสอนแทนอัตโนมัติ</h5>
                    <ul className="space-y-2 text-[11px] font-bold text-slate-600 dark:text-[#9CA3AF]">
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-indigo-500 shrink-0" />
                        <span>ระบบจะเลือกครูที่มี Load รวมน้อยที่สุดเป็นลำดับต้นๆ</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-indigo-500 shrink-0" />
                        <span>ชั่วโมง "สอนแทน" จะถูกเพิ่มเข้าไปใน Load ทันทีที่ได้รับการอนุมัติ</span>
                      </li>
                    </ul>
                  </div>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
};

export const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResultImage(null); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) return;
    setIsProcessing(true);
    setResultImage(null);
    try {
      const result = await editImage(image, prompt);
      if (result) {
        setResultImage(result);
      }
    } catch (error) {
      alert("Failed to edit image. Check API key or quotas.");
    }
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">แต่งรูปด้วย AI (Nano Banana)</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card title="อัพโหลดรูปภาพ" icon={<Upload />}>
            <div className="space-y-4">
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors min-h-[250px] bg-slate-50 dark:bg-slate-950/50"
               >
                  {image ? (
                    <img src={image} alt="Original" className="max-h-[200px] object-contain rounded-lg shadow-md" />
                  ) : (
                    <>
                      <ImageIcon size={48} className="text-[#9CA3AF] mb-4" />
                      <p className="text-slate-600 dark:text-[#9CA3AF] font-bold">คลิกเพื่ออัพโหลดรูปภาพ</p>
                      <p className="text-xs text-[#9CA3AF] mt-2 font-bold italic">รองรับ PNG, JPG</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
               </div>

               <div>
                 <label className="block text-sm font-extrabold text-[#9CA3AF] mb-2">คำสั่ง (Prompt)</label>
                 <textarea 
                   className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-900 dark:text-slate-100 font-bold min-h-[100px]"
                   placeholder="เช่น เปลี่ยนพื้นหลังเป็นห้องเรียน, ทำให้ภาพดูเก่าแบบ retro, ลบวัตถุสีแดงออก..."
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                 />
               </div>

               <Button 
                 className="w-full font-extrabold shadow-sm" 
                 onClick={handleEdit} 
                 disabled={!image || !prompt || isProcessing}
                 isLoading={isProcessing}
               >
                 <Wand2 size={18} className="mr-2" /> สร้างสรรค์ภาพใหม่
               </Button>
            </div>
         </Card>

         <Card title="ผลลัพธ์" icon={<Wand2 />}>
            <div className="h-full min-h-[400px] flex flex-col">
               <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center overflow-hidden p-4 shadow-inner">
                  {isProcessing ? (
                    <div className="text-center font-bold">
                       <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                       <p className="text-slate-600 dark:text-[#9CA3AF]">กำลังประมวลผลด้วย Gemini 2.5...</p>
                    </div>
                  ) : resultImage ? (
                    <img src={resultImage} alt="Result" className="max-h-full max-w-full object-contain rounded-lg shadow-lg" />
                  ) : (
                    <p className="text-[#9CA3AF] text-sm font-bold italic">ภาพผลลัพธ์จะแสดงที่นี่</p>
                  )}
               </div>
               
               {resultImage && (
                 <div className="mt-4 flex justify-end">
                    <a href={resultImage} download="edited-image.png" className="w-full">
                       <Button variant="success" className="w-full font-extrabold shadow-sm">
                          <Download size={18} className="mr-2" /> ดาวน์โหลดรูปภาพ
                       </Button>
                    </a>
                 </div>
               )}

               <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-lg flex gap-3 shadow-sm">
                  <AlertCircle size={20} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <p className="text-xs text-indigo-700 dark:text-indigo-300 font-bold italic">
                     หมายเหตุ: ฟีเจอร์นี้ใช้ Gemini 2.5 Flash Image. ผลลัพธ์อาจแตกต่างกันไปตามความซับซ้อนของคำสั่ง
                  </p>
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
};
