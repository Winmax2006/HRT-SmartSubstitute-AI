import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { INITIAL_RULES, MOCK_SUBSTITUTE_HISTORY, MOCK_APPROVALS } from '../constants';
import { analyzeRuleEffectiveness } from '../services/geminiService';
import { RuleAnalysisResult, RuleSuggestion, Rule } from '../types';
import { Plus, Trash2, ToggleLeft, ToggleRight, Save, Brain, BarChart2, ArrowRight } from 'lucide-react';

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

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // In a real app, we would fetch fresh history/approval data here
    const result = await analyzeRuleEffectiveness(rules, MOCK_SUBSTITUTE_HISTORY, MOCK_APPROVALS);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const applySuggestion = (suggestion: RuleSuggestion) => {
      // Logic to apply the suggestion to the local rules state
      if (suggestion.action === 'modify' && suggestion.suggestedChanges) {
          setRules(rules.map(r => r.id === suggestion.ruleId ? { ...r, ...suggestion.suggestedChanges } : r));
      }
      // Remove the suggestion from the list after applying
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
        <h2 className="text-2xl font-bold text-white">เงื่อนไขอัตโนมัติ</h2>
        <Button>
           <Plus size={18} className="mr-2" /> เพิ่มกฎใหม่
        </Button>
      </div>

      <div className="grid gap-4">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-[#171a2e] border border-[#242c47] p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
             <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-1">
                   <h3 className="font-semibold text-[#e9edff]">{rule.name}</h3>
                   <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#7aa2ff]/20 text-[#7aa2ff]">
                      Priority: {rule.priority}
                   </span>
                </div>
                <p className="text-sm text-[#a7b0c9] mb-3">
                   ประเภท: {rule.type}
                </p>

                {rule.type === 'grade_level' && (
                   <div className="grid grid-cols-2 gap-4 mb-2 p-3 bg-[#0b0e1a]/30 rounded-lg border border-[#242c47]/50 max-w-md">
                      <div>
                         <label className="block text-[10px] text-[#a7b0c9] mb-1">Target Grade</label>
                         <input 
                            type="text"
                            value={rule.targetGrade || ''}
                            onChange={(e) => updateRule(rule.id, { targetGrade: e.target.value })}
                            className="w-full bg-[#171a2e] border border-[#242c47] rounded px-2 py-1 text-xs text-[#e9edff] focus:border-[#7aa2ff] outline-none"
                            placeholder="e.g. same"
                         />
                      </div>
                      <div>
                         <label className="block text-[10px] text-[#a7b0c9] mb-1">Fallback Grade</label>
                         <input 
                            type="text"
                            value={rule.fallbackGrade || ''}
                            onChange={(e) => updateRule(rule.id, { fallbackGrade: e.target.value })}
                            className="w-full bg-[#171a2e] border border-[#242c47] rounded px-2 py-1 text-xs text-[#e9edff] focus:border-[#7aa2ff] outline-none"
                            placeholder="e.g. +/- 1"
                         />
                      </div>
                   </div>
                )}

                {rule.type === 'workload_balance' && (
                   <div className="grid grid-cols-2 gap-4 mb-2 p-3 bg-[#0b0e1a]/30 rounded-lg border border-[#242c47]/50 max-w-md">
                      <div>
                         <label className="block text-[10px] text-[#a7b0c9] mb-1">Max Workload (%)</label>
                         <input 
                            type="number"
                            value={rule.maxWorkload || 0}
                            onChange={(e) => updateRule(rule.id, { maxWorkload: parseInt(e.target.value) || 0 })}
                            className="w-full bg-[#171a2e] border border-[#242c47] rounded px-2 py-1 text-xs text-[#e9edff] focus:border-[#7aa2ff] outline-none"
                         />
                      </div>
                      <div>
                         <label className="block text-[10px] text-[#a7b0c9] mb-1">Tolerance</label>
                         <input 
                            type="number"
                            value={rule.tolerance || 0}
                            onChange={(e) => updateRule(rule.id, { tolerance: parseInt(e.target.value) || 0 })}
                            className="w-full bg-[#171a2e] border border-[#242c47] rounded px-2 py-1 text-xs text-[#e9edff] focus:border-[#7aa2ff] outline-none"
                         />
                      </div>
                   </div>
                )}
             </div>
             
             <div className="flex items-center gap-3 self-start md:self-center">
                <div className="flex flex-col gap-1 w-32">
                   <label className="text-[10px] text-[#a7b0c9]">ค่าน้ำหนัก ({rule.weight})</label>
                   <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={rule.weight} 
                      onChange={(e) => updateRule(rule.id, { weight: parseInt(e.target.value) })}
                      className="h-1 bg-[#242c47] rounded-lg appearance-none cursor-pointer" 
                   />
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

      <Card className="mt-8 border-indigo-500/30 bg-gradient-to-br from-[#171a2e] to-indigo-900/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400">
                      <Brain size={24} />
                  </div>
                  <div>
                      <h3 className="text-xl font-bold text-white">วิเคราะห์ประสิทธิภาพกฎ (AI Analysis)</h3>
                      <p className="text-sm text-[#a7b0c9]">ใช้ Gemini AI วิเคราะห์ประวัติการสอนแทนเพื่อปรับปรุงกฎให้ดียิ่งขึ้น</p>
                  </div>
              </div>
              <Button onClick={handleAnalyze} disabled={isAnalyzing} isLoading={isAnalyzing}>
                  {isAnalyzing ? 'กำลังวิเคราะห์...' : 'เริ่มการวิเคราะห์'}
              </Button>
          </div>

          {analysisResult && (
              <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-[#0b0e1a]/50 rounded-xl border border-[#242c47]">
                          <div className="text-sm text-[#a7b0c9] mb-2">คะแนนประสิทธิภาพรวม</div>
                          <div className="relative flex items-center justify-center w-32 h-32">
                              <svg className="w-full h-full transform -rotate-90">
                                  <circle cx="64" cy="64" r="56" stroke="#242c47" strokeWidth="12" fill="transparent" />
                                  <circle cx="64" cy="64" r="56" stroke={analysisResult.overallScore > 70 ? '#4ade80' : analysisResult.overallScore > 40 ? '#fbbf24' : '#f87171'} strokeWidth="12" fill="transparent" strokeDasharray={`${analysisResult.overallScore * 3.51} 351`} className="transition-all duration-1000 ease-out" />
                              </svg>
                              <span className="absolute text-3xl font-bold text-white">{analysisResult.overallScore}</span>
                          </div>
                      </div>
                      <div className="md:col-span-2 p-6 bg-[#0b0e1a]/50 rounded-xl border border-[#242c47]">
                          <h4 className="font-semibold text-[#e9edff] mb-2 flex items-center gap-2">
                              <BarChart2 size={18} className="text-[#7aa2ff]" /> ผลการวิเคราะห์
                          </h4>
                          <p className="text-sm text-[#a7b0c9] leading-relaxed">
                              {analysisResult.analysis}
                          </p>
                      </div>
                  </div>

                  <div>
                      <h4 className="font-semibold text-[#e9edff] mb-4">ข้อเสนอแนะในการปรับปรุง</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {analysisResult.suggestions.map((suggestion, idx) => (
                              <div key={idx} className="p-4 bg-[#0b0e1a] border border-[#242c47] hover:border-[#7aa2ff] rounded-xl transition-all">
                                  <div className="flex justify-between items-start mb-2">
                                      <h5 className="font-semibold text-white">{suggestion.title}</h5>
                                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                                          suggestion.action === 'modify' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                          suggestion.action === 'create' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                          'bg-red-500/10 text-red-500 border-red-500/20'
                                      }`}>
                                          {suggestion.action}
                                      </span>
                                  </div>
                                  <p className="text-xs text-[#a7b0c9] mb-4 h-10 overflow-hidden text-ellipsis">
                                      {suggestion.description}
                                  </p>
                                  {suggestion.suggestedChanges && suggestion.suggestedChanges.weight && (
                                       <div className="text-xs text-[#7aa2ff] mb-3 bg-[#7aa2ff]/10 p-2 rounded inline-block">
                                           Weight: {rules.find(r => r.id === suggestion.ruleId)?.weight} → {suggestion.suggestedChanges.weight}
                                       </div>
                                  )}
                                  <Button 
                                      size="sm" 
                                      variant="secondary" 
                                      className="w-full" 
                                      onClick={() => applySuggestion(suggestion)}
                                  >
                                      ปรับใช้ <ArrowRight size={14} className="ml-1" />
                                  </Button>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}
      </Card>

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