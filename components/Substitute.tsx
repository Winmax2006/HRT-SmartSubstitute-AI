import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { TEACHERS, MOCK_SCHEDULES, MOCK_SUBSTITUTE_HISTORY } from '../constants';
import { suggestSubstitute } from '../services/geminiService';
import { SheetService } from '../services/sheetService';
import { ExcelService } from '../services/excelService';
import { SubstituteHistoryItem } from '../types';
import { Brain, UserPlus, Check, History, Calendar, User, BookOpen, Search, RefreshCw, Database, FileSpreadsheet, Link } from 'lucide-react';

export const Substitute: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestion, setSuggestion] = useState<{name?: string, reason?: string} | null>(null);
  const [historySearch, setHistorySearch] = useState('');
  
  // State for history data
  const [historyData, setHistoryData] = useState<SubstituteHistoryItem[]>(MOCK_SUBSTITUTE_HISTORY);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [dataSource, setDataSource] = useState<'mock' | 'sheets' | 'excel'>('mock');

  useEffect(() => {
    // Check preferred data source on mount
    const storedSource = localStorage.getItem('smartsub_data_source');
    if (storedSource) setDataSource(storedSource as any);
    
    // Load data initially
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

    // If data fetch failed or source is mock, use mock
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
       <h2 className="text-2xl font-bold text-white">จัดการสอนแทน</h2>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="ข้อมูลการลา" icon={<UserPlus />}>
             <div className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-[#a7b0c9] mb-1">วันที่</label>
                   <input 
                     type="date" 
                     className="w-full bg-[#0b0e1a] border border-[#242c47] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7aa2ff]"
                     value={selectedDate}
                     onChange={e => setSelectedDate(e.target.value)}
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-[#a7b0c9] mb-1">ครูที่ลา</label>
                   <select 
                     className="w-full bg-[#0b0e1a] border border-[#242c47] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7aa2ff]"
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
                   <label className="block text-sm font-medium text-[#a7b0c9] mb-1">คาบที่ต้องการจัดแทน</label>
                   <select 
                     className="w-full bg-[#0b0e1a] border border-[#242c47] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7aa2ff]"
                     value={selectedSlotId}
                     onChange={e => setSelectedSlotId(e.target.value)}
                   >
                      <option value="">เลือกคาบ...</option>
                      <option value="1">คาบ 1 (08:30-09:20)</option>
                      <option value="2">คาบ 2 (09:20-10:10)</option>
                      <option value="3">คาบ 3 (10:10-11:00)</option>
                   </select>
                </div>
                
                <Button 
                   onClick={handleAISuggest} 
                   disabled={!selectedTeacherId || !selectedSlotId || isAnalyzing}
                   className="w-full mt-4"
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
                     <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                        <div className="text-sm text-emerald-400 font-bold mb-1">แนะนำ:</div>
                        <div className="text-xl font-bold text-white">{suggestion.name}</div>
                     </div>
                     <div className="p-4 bg-[#0b0e1a] rounded-lg border border-[#242c47]">
                        <div className="text-sm text-[#a7b0c9] font-bold mb-2">เหตุผลประกอบ:</div>
                        <p className="text-sm text-[#e9edff] leading-relaxed">
                            {suggestion.reason}
                        </p>
                     </div>
                     <div className="flex gap-3 mt-4">
                        <Button variant="success" className="flex-1">
                            <Check size={18} className="mr-2" /> ยืนยันการจัดแทน
                        </Button>
                        <Button variant="secondary" className="flex-1">
                            ปฏิเสธ
                        </Button>
                     </div>
                 </div>
             ) : (
                 <div className="h-full flex flex-col items-center justify-center text-[#a7b0c9] py-12">
                     <Brain size={48} className="mb-4 opacity-20" />
                     <p>เลือกข้อมูลและกดปุ่มวิเคราะห์เพื่อรับคำแนะนำ</p>
                 </div>
             )}
          </Card>
       </div>

       <Card 
         title={
           <div className="flex items-center gap-2">
             <span>ประวัติการสอนแทน</span>
             {dataSource === 'sheets' && (
               <span className="flex items-center gap-1 text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded">
                  <Link size={10} /> Google Sheets
               </span>
             )}
             {dataSource === 'excel' && (
               <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  <FileSpreadsheet size={10} /> Excel (Local)
               </span>
             )}
             {dataSource === 'mock' && (
               <span className="flex items-center gap-1 text-[10px] bg-gray-500/20 text-gray-400 border border-gray-500/30 px-2 py-0.5 rounded">
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
                 className="bg-[#0b0e1a] border border-[#242c47] rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#7aa2ff] w-40 text-[#e9edff]"
                 value={historySearch}
                 onChange={(e) => setHistorySearch(e.target.value)}
               />
               <Search size={14} className="absolute left-3 top-2 text-[#a7b0c9]" />
             </div>
             <Button variant="secondary" size="sm" onClick={() => loadHistory()} isLoading={isLoadingHistory}>
               <RefreshCw size={14} />
             </Button>
           </div>
         }
       >
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-[#242c47]">
                     <th className="p-4 text-xs font-semibold text-[#a7b0c9] uppercase tracking-wider">
                        <div className="flex items-center gap-2"><Calendar size={14} /> วันที่</div>
                     </th>
                     <th className="p-4 text-xs font-semibold text-[#a7b0c9] uppercase tracking-wider">คาบ</th>
                     <th className="p-4 text-xs font-semibold text-[#a7b0c9] uppercase tracking-wider">
                        <div className="flex items-center gap-2"><BookOpen size={14} /> วิชา</div>
                     </th>
                     <th className="p-4 text-xs font-semibold text-[#a7b0c9] uppercase tracking-wider">
                        <div className="flex items-center gap-2"><User size={14} /> ครูเจ้าของวิชา</div>
                     </th>
                     <th className="p-4 text-xs font-semibold text-[#a7b0c9] uppercase tracking-wider">
                        <div className="flex items-center gap-2"><UserPlus size={14} /> ครูสอนแทน</div>
                     </th>
                     <th className="p-4 text-xs font-semibold text-[#a7b0c9] uppercase tracking-wider">สถานะ</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-[#242c47]">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((item, index) => {
                       const teacher = TEACHERS.find(t => t.id === item.teacher_id);
                       const substitute = TEACHERS.find(t => t.id === item.substitute_id);
                       return (
                          <tr key={item.id || index} className="hover:bg-[#7aa2ff]/5 transition-colors">
                             <td className="p-4 text-sm text-[#e9edff]">{item.date}</td>
                             <td className="p-4">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#242c47] text-sm font-bold text-[#7aa2ff]">
                                   {item.period}
                                </span>
                             </td>
                             <td className="p-4 text-sm text-[#e9edff]">{item.subject}</td>
                             <td className="p-4 text-sm text-[#a7b0c9]">{teacher?.name || item.teacher_id}</td>
                             <td className="p-4 text-sm text-[#7aa2ff]">{substitute?.name || item.substitute_id}</td>
                             <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium border ${
                                   item.status === 'completed' 
                                   ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' 
                                   : 'bg-red-400/10 text-red-400 border-red-400/20'
                                }`}>
                                   {item.status === 'completed' ? 'เรียบร้อย' : 'ยกเลิก'}
                                </span>
                             </td>
                          </tr>
                       );
                    })
                  ) : (
                    <tr>
                       <td colSpan={6} className="p-8 text-center text-[#a7b0c9]">ไม่พบข้อมูลประวัติการสอนแทน</td>
                    </tr>
                  )}
               </tbody>
             </table>
          </div>
       </Card>
    </div>
  );
};