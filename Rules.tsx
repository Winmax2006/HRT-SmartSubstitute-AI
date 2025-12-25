import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { INITIAL_RULES } from '../constants';
import { Plus, Trash2, ToggleLeft, ToggleRight, Save } from 'lucide-react';

export const Rules: React.FC = () => {
  const [rules, setRules] = useState(INITIAL_RULES);

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">เงื่อนไขอัตโนมัติ</h2>
        <Button>
           <Plus size={18} className="mr-2" /> เพิ่มกฎใหม่
        </Button>
      </div>

      <div className="grid gap-4">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-[#171a2e] border border-[#242c47] p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
             <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                   <h3 className="font-semibold text-[#e9edff]">{rule.name}</h3>
                   <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#7aa2ff]/20 text-[#7aa2ff]">
                      Priority: {rule.priority}
                   </span>
                </div>
                <p className="text-sm text-[#a7b0c9]">
                   ประเภท: {rule.type} | น้ำหนัก: {rule.weight}
                </p>
             </div>
             
             <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1 w-32">
                   <label className="text-[10px] text-[#a7b0c9]">ค่าน้ำหนัก</label>
                   <input type="range" min="1" max="10" defaultValue={rule.weight} className="h-1 bg-[#242c47] rounded-lg appearance-none cursor-pointer" />
                </div>
                <button onClick={() => toggleRule(rule.id)} className={`transition-colors ${rule.active ? 'text-emerald-400' : 'text-[#a7b0c9]'}`}>
                   {rule.active ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
                <button className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-colors">
                   <Trash2 size={18} />
                </button>
             </div>
          </div>
        ))}
      </div>

      <Card title="ตั้งค่าขั้นสูง" className="mt-8">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-medium text-[#a7b0c9] mb-2">โหมดการอนุมัติ</label>
               <select className="w-full bg-[#0b0e1a] border border-[#242c47] rounded-lg px-3 py-2 text-sm text-[#e9edff]">
                  <option>อนุมัติอัตโนมัติ (แนะนำ)</option>
                  <option>ส่งให้หัวหน้าวิชาการอนุมัติ</option>
                  <option>อนุมัติเฉพาะกรณีข้ามสายชั้น</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-[#a7b0c9] mb-2">การแจ้งเตือน</label>
               <select className="w-full bg-[#0b0e1a] border border-[#242c47] rounded-lg px-3 py-2 text-sm text-[#e9edff]">
                  <option>แจ้งครูสอนแทนทันที</option>
                  <option>แจ้งสรุปรายวัน</option>
                  <option>ไม่แจ้ง</option>
               </select>
            </div>
         </div>
         <div className="mt-6 flex justify-end">
            <Button variant="success">
               <Save size={18} className="mr-2" /> บันทึกการตั้งค่า
            </Button>
         </div>
      </Card>
    </div>
  );
};