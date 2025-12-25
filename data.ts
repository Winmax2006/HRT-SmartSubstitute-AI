
import { GoogleGenAI } from "@google/genai";
import * as XLSX from 'xlsx';

// ==========================================
// TYPES
// ==========================================

export type View = 'dashboard' | 'schedule' | 'substitute' | 'rules' | 'approvals' | 'workload' | 'image-editor' | 'settings';

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  grade_level: 'kindergarten' | 'primary_low' | 'primary_high' | 'secondary_low';
  workload: number; // calculated %
  teaching_hours: number;
  substitute_hours: number;
  other_hours: number;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  specialty: string;
  notes: string;
  avatar: string;
}

export interface WorkloadSettings {
  baseHours: number; // Standard hours per week (e.g., 20 or 40)
}

export interface TimeSlot {
  id: string;
  period_no: string;
  time_label: string;
}

export interface ScheduleItem {
  id: string;
  day_of_week: string;
  timeslot_id: string;
  period_no: string;
  class_name: string;
  grade_level: string;
  subject: string;
  teacher_id: string;
}

export interface Rule {
  id: string;
  name: string;
  type: 'grade_level' | 'workload_balance' | 'period_swap' | 'subject_match' | 'custom';
  value: string;
  priority: string;
  weight: number;
  active: boolean;
  targetGrade?: string;
  fallbackGrade?: string;
  maxWorkload?: number;
  tolerance?: number;
  maxSwapsPerWeek?: number;
  allowCrossDay?: boolean;
  noticePeriodDays?: number;
  maxSwapWindowDays?: number;
  allowedReasons?: string[];
}

export interface Approval {
  id: string;
  date: string;
  teacher_id: string;
  substitute_id: string;
  period: string;
  subject: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  requestedAt: string;
  reason?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  title: string;
  message: string;
  time: string;
}

export interface SubstituteHistoryItem {
  id: string;
  date: string;
  period: string;
  subject: string;
  teacher_id: string;
  substitute_id: string;
  status: 'completed' | 'cancelled';
}

export interface PeriodSwapItem {
  id: string;
  date: string;
  requester_id: string;
  responder_id: string;
  req_period: string;
  res_period: string;
  req_subject: string;
  res_subject: string;
  status: 'approved' | 'pending' | 'rejected' | 'completed';
  reason: string;
}

export interface RuleSuggestion {
  ruleId: string;
  title: string;
  description: string;
  action: 'modify' | 'create' | 'remove';
  suggestedChanges?: Partial<Rule>;
}

export interface RuleAnalysisResult {
  analysis: string;
  overallScore: number;
  suggestions: RuleSuggestion[];
}

export interface SheetConfig {
  spreadsheetId: string;
  apiKey: string;
  accessToken?: string;
}

export interface ChatHistoryItem {
  role: 'user' | 'model';
  text: string;
}

// ==========================================
// CONSTANTS
// ==========================================

export const DEFAULT_WORKLOAD_SETTINGS: WorkloadSettings = {
  baseHours: 20
};

export const TEACHERS: Teacher[] = [
  { 
    id: "T001", 
    name: "ครูโกศลพิสิทธิ์ ปูน้อย", 
    subject: "วิทยาศาสตร์", 
    grade_level: "secondary_low", 
    teaching_hours: 12,
    substitute_hours: 2,
    other_hours: 1,
    workload: 75, // (12+2+1)/20 * 100
    email: "teacher1@school.ac.th", 
    phone: "081-234-5678",
    status: "active",
    specialty: "ฟิสิกส์ประยุกต์",
    notes: "รับผิดชอบห้อง Lab วิทยาศาสตร์",
    avatar: "https://picsum.photos/id/1011/200/200" 
  },
  { 
    id: "T002", 
    name: "ครูสุชาดา บุญเลิศ", 
    subject: "ภาษาไทย", 
    grade_level: "primary_high", 
    teaching_hours: 8,
    substitute_hours: 0,
    other_hours: 2,
    workload: 50, 
    email: "teacher2@school.ac.th", 
    phone: "082-345-6789",
    status: "active",
    specialty: "วรรณคดีไทย",
    notes: "-",
    avatar: "https://picsum.photos/id/1027/200/200" 
  },
  { 
    id: "T003", 
    name: "ครูเชาวลิต โต้ตอบ", 
    subject: "พลศึกษา", 
    grade_level: "secondary_low", 
    teaching_hours: 10,
    substitute_hours: 4,
    other_hours: 0,
    workload: 70, 
    email: "teacher3@school.ac.th", 
    phone: "083-456-7890",
    status: "active",
    specialty: "ฟุตบอล/บาสเกตบอล",
    notes: "โค้ชทีมโรงเรียน",
    avatar: "https://picsum.photos/id/1005/200/200" 
  }
];

export const TIME_SLOTS: TimeSlot[] = [
  { id: "1", period_no: "1", time_label: "08:30-09:20" },
  { id: "2", period_no: "2", time_label: "09:20-10:10" },
  { id: "3", period_no: "3", time_label: "10:10-11:00" },
  { id: "4", period_no: "4", time_label: "11:00-11:50" },
  { id: "5", period_no: "5", time_label: "12:50-13:40" },
  { id: "6", period_no: "6", time_label: "13:40-14:30" },
  { id: "7", period_no: "7", time_label: "14:40-15:30" }
];

export const MOCK_SCHEDULES: ScheduleItem[] = (() => {
  const schedules: ScheduleItem[] = [];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const classesPrimary = ["ป.1", "ป.2", "ป.3", "ป.4", "ป.5", "ป.6"];
  const classesSecondary = ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];
  
  let idCounter = 100;

  TEACHERS.forEach(teacher => {
    const isSecondary = teacher.grade_level.includes('secondary');
    const classPool = isSecondary ? classesSecondary : classesPrimary;

    days.forEach(day => {
      const periods = [1, 2, 3, 4, 5, 6, 7].sort(() => 0.5 - Math.random());
      const teachCount = Math.floor(Math.random() * 2) + 4;
      const periodsToTeach = periods.slice(0, teachCount);

      periodsToTeach.forEach(p => {
        schedules.push({
          id: `S${idCounter++}`,
          day_of_week: day,
          timeslot_id: p.toString(),
          period_no: p.toString(),
          class_name: classPool[Math.floor(Math.random() * classPool.length)],
          grade_level: teacher.grade_level,
          subject: teacher.subject,
          teacher_id: teacher.id
        });
      });
    });
  });

  return schedules;
})();

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'info', title: 'มีการจัดสอนแทนใหม่', message: 'ครู T002 จัดสอนแทนครู T001 ในคาบ 3', time: '10:30 น.' },
  { id: 'n2', type: 'warning', title: 'รอการอนุมัติ', message: 'มี 2 รายการรอการอนุมัติจากงานวิชาการ', time: '09:15 น.' },
  { id: 'n3', type: 'alert', title: 'ส่งอีเมลแจ้งเตือนแล้ว', message: 'ส่งอีเมลถึงครู T004 และหัวหน้างานวิชาการ', time: '08:45 น.' }
];

export const MOCK_APPROVALS: Approval[] = [
  { id: 'app-001', date: new Date().toISOString().split('T')[0], teacher_id: 'T001', substitute_id: 'T003', period: '3', subject: 'วิทยาศาสตร์', status: 'pending', requestedBy: 'หัวหน้ากลุ่มสาระ', requestedAt: '08:30 น.' },
  { id: 'app-002', date: new Date().toISOString().split('T')[0], teacher_id: 'T002', substitute_id: 'T006', period: '5', subject: 'ภาษาไทย', status: 'approved', requestedBy: 'ระบบอัตโนมัติ', requestedAt: '09:15 น.' }
];

export const INITIAL_RULES: Rule[] = [
  { id: 'rule-1', name: 'จัดครูในสายชั้นเดียวกัน', type: 'grade_level', value: 'same', priority: '1', weight: 8, active: true, targetGrade: 'same' },
  { id: 'rule-2', name: 'สมดุลภาระงาน', type: 'workload_balance', value: '75', priority: '3', weight: 5, active: true, maxWorkload: 75, tolerance: 10 },
  { id: 'rule-3', name: 'สลับคาบสอน (Period Swap)', type: 'period_swap', value: 'flexible', priority: '2', weight: 6, active: true, maxSwapsPerWeek: 2, allowCrossDay: false, noticePeriodDays: 3, maxSwapWindowDays: 14, allowedReasons: ['sick', 'personal', 'official', 'urgent'] }
];

export const MOCK_SUBSTITUTE_HISTORY: SubstituteHistoryItem[] = [
  { id: 'h-1', date: '2023-10-20', period: '2', subject: 'คณิตศาสตร์', teacher_id: 'T001', substitute_id: 'T005', status: 'completed' },
  { id: 'h-2', date: '2023-10-18', period: '4', subject: 'ภาษาไทย', teacher_id: 'T002', substitute_id: 'T006', status: 'completed' },
  { id: 'h-3', date: '2023-10-15', period: '1', subject: 'วิทยาศาสตร์', teacher_id: 'T001', substitute_id: 'T003', status: 'cancelled' }
];

export const MOCK_PERIOD_SWAPS: PeriodSwapItem[] = [
  { id: 'ps-1', date: '2023-11-05', requester_id: 'T001', responder_id: 'T002', req_period: '2', res_period: '5', req_subject: 'วิทยาศาสตร์', res_subject: 'ภาษาไทย', status: 'completed', reason: 'ติดธุระด่วนช่วงเช้า' },
  { id: 'ps-2', date: '2023-11-07', requester_id: 'T003', responder_id: 'T005', req_period: '1', res_period: '4', req_subject: 'พลศึกษา', res_subject: 'สังคมศึกษา', status: 'pending', reason: 'ไปราชการนอกสถานที่' },
  { id: 'ps-3', date: '2023-11-02', requester_id: 'T002', responder_id: 'T001', req_period: '3', res_period: '6', req_subject: 'ภาษาไทย', res_subject: 'วิทยาศาสตร์', status: 'approved', reason: 'มีประชุมกลุ่มสาระ' },
  { id: 'ps-4', date: '2023-10-28', requester_id: 'T005', responder_id: 'T003', req_period: '7', res_period: '2', req_subject: 'สังคมศึกษา', res_subject: 'พลศึกษา', status: 'rejected', reason: 'ครูผู้รับคำขอติดสอนพิเศษ' }
];

// ==========================================
// GEMINI SERVICE
// ==========================================

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export async function chatWithAI(message: string, history: ChatHistoryItem[] = []): Promise<string> {
  if (!apiKey) return "API Key not configured.";
  try {
    const teacherContext = TEACHERS.map(t => `- ${t.name} (${t.subject}, Workload: ${t.workload}%)`).join('\n');
    const activeRules = INITIAL_RULES.filter(r => r.active).map(r => `- ${r.name} (Type: ${r.type})`).join('\n');
    const systemInstruction = `You are "SmartSub AI", an assistant for a school substitute teacher management system. Access to: Teachers: ${teacherContext}, Rules: ${activeRules}. Help user manage substitution. Thai/English support.`;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: [...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })), { role: 'user', parts: [{ text: message }] }], config: { systemInstruction: systemInstruction } });
    return response.text || "ขออภัย ไม่สามารถตอบคำถามได้ในขณะนี้";
  } catch (error) { return "เกิดข้อผิดพลาดในการเชื่อมต่อกับ Gemini"; }
}

export async function suggestSubstitute(absentTeacher: Teacher, availableTeachers: Teacher[], schedule: ScheduleItem): Promise<string> {
  if (!apiKey) return "{}";
  try {
    const context = `Absent: ${absentTeacher.name}. Candidates: ${availableTeachers.map(t => `${t.name} (${t.subject}, Load: ${t.workload}%)`).join(', ')}. Rec sub in JSON {teacher_name, reason}.`;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: context, config: { responseMimeType: 'application/json' } });
    return response.text || "{}";
  } catch (error) { return "{}"; }
}

export async function editImage(base64Image: string, prompt: string): Promise<string | null> {
  if (!apiKey) return null;
  try {
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash-image', contents: { parts: [{ inlineData: { mimeType: 'image/png', data: base64Data } }, { text: prompt }] } });
    if (response.candidates?.[0]?.content?.parts) { for (const part of response.candidates[0].content.parts) { if (part.inlineData && part.inlineData.data) return `data:image/png;base64,${part.inlineData.data}`; } }
    return null;
  } catch (error) { throw error; }
}

export async function analyzeRuleEffectiveness(rules: Rule[], history: SubstituteHistoryItem[], approvals: Approval[]): Promise<RuleAnalysisResult | null> {
  if (!apiKey) return null;
  try {
    const context = `Analyze rules: ${JSON.stringify(rules)}. History: ${JSON.stringify(history)}. Output JSON {analysis, overallScore, suggestions}.`;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: context, config: { responseMimeType: 'application/json' } });
    return response.text ? JSON.parse(response.text) : null;
  } catch (error) { return null; }
}

// ==========================================
// SHEET & EXCEL HELPERS
// ==========================================

export const SHEET_CONFIG_KEY = 'smartsub_sheet_config';
export const getSheetConfig = (): SheetConfig | null => {
  const stored = localStorage.getItem(SHEET_CONFIG_KEY);
  if (stored) return JSON.parse(stored);
  return null;
};
export const saveSheetConfig = (config: SheetConfig) => localStorage.setItem(SHEET_CONFIG_KEY, JSON.stringify(config));
export const SheetService = {
  async getSubstituteHistory(): Promise<SubstituteHistoryItem[] | null> {
    const config = getSheetConfig();
    if (!config?.spreadsheetId || !config?.apiKey) return null;
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/History!A2:G?key=${config.apiKey}`;
      const response = await fetch(url);
      if (!response.ok) return null;
      const data = await response.json();
      return data.values?.map((row: any) => ({ id: row[0], date: row[1], period: row[2], subject: row[3], teacher_id: row[4], substitute_id: row[5], status: row[6] })) || [];
    } catch { return null; }
  },
  async testConnection(config: SheetConfig): Promise<boolean> {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}?key=${config.apiKey}`;
      const response = await fetch(url);
      return response.ok;
    } catch { return false; }
  }
};

export const LOCAL_DB_KEY = 'smartsub_local_db';
export const ExcelService = {
  importData: async (file: File): Promise<SubstituteHistoryItem[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
          const historyItems = (jsonData.slice(1) as any[][]).map(row => ({ id: String(row[0]), date: String(row[1]), period: String(row[2]), subject: String(row[3]), teacher_id: String(row[4]), substitute_id: String(row[5]), status: row[6] }));
          localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(historyItems));
          resolve(historyItems as any);
        } catch (e) { reject(e); }
      };
      reader.readAsArrayBuffer(file);
    });
  },
  getLocalData: (): SubstituteHistoryItem[] | null => {
    const data = localStorage.getItem(LOCAL_DB_KEY);
    return data ? JSON.parse(data) : null;
  },
  exportData: (data: SubstituteHistoryItem[]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "History");
    XLSX.writeFile(workbook, "SubstituteHistory.xlsx");
  },
  getTemplateData: () => [{ ID: "h-001", Date: "2023-10-25", Period: "1", Subject: "Math", TeacherID: "T001", SubstituteID: "T002", Status: "completed" }]
};
