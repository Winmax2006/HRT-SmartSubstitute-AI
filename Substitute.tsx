import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { TEACHERS, MOCK_SCHEDULES } from '../constants';
import { suggestSubstitute } from '../services/geminiService';
import { Brain, UserPlus, Check } from 'lucide-react';

export const Substitute: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestion, setSuggestion] = useState<{name?: string, reason?: string} | null>(null);

  const handleAISuggest = async () => {
    if (!selectedTeacherId || !selectedSlotId) return;
    
    setIsAnalyzing(true);
    const absentTeacher = TEACHERS.find(t => t.id === selectedTeacherId);
    const schedule = MOCK_SCHEDULES.find(s => s.teacher_id === selectedTeacherId); // Mock logic for schedule finding
    
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
    </div>
  );
};