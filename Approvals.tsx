import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { MOCK_APPROVALS, TEACHERS } from '../constants';
import { Check, X, Clock } from 'lucide-react';

export const Approvals: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">รายการรออนุมัติ</h2>
      
      <div className="space-y-4">
        {MOCK_APPROVALS.map((approval) => {
          const teacher = TEACHERS.find(t => t.id === approval.teacher_id);
          const sub = TEACHERS.find(t => t.id === approval.substitute_id);
          
          return (
            <Card key={approval.id} className="border-l-4 border-l-amber-400">
               <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                     <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 rounded-md bg-amber-400/10 text-amber-400 text-xs font-bold border border-amber-400/20 flex items-center gap-1">
                           <Clock size={12} /> Pending
                        </span>
                        <span className="text-sm text-[#a7b0c9]">Requested: {approval.requestedAt}</span>
                     </div>
                     <h3 className="text-lg font-semibold text-white mb-1">
                        {approval.subject} - คาบ {approval.period}
                     </h3>
                     <div className="text-sm text-[#a7b0c9]">
                        <span className="text-[#e9edff]">{teacher?.name}</span> (ลา) 
                        <span className="mx-2">→</span>
                        <span className="text-[#7aa2ff]">{sub?.name}</span> (สอนแทน)
                     </div>
                     <div className="mt-2 text-xs text-[#a7b0c9]">
                        ขอโดย: {approval.requestedBy}
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                     <Button variant="success" size="sm">
                        <Check size={16} className="mr-1" /> อนุมัติ
                     </Button>
                     <Button variant="danger" size="sm">
                        <X size={16} className="mr-1" /> ปฏิเสธ
                     </Button>
                  </div>
               </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};