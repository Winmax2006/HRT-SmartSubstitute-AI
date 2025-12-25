import { Teacher, TimeSlot, ScheduleItem, Rule, Approval, Notification, SubstituteHistoryItem } from './types';

export const TEACHERS: Teacher[] = [
  { id: "T001", name: "ครูโกศลพิสิทธิ์ ปูน้อย", subject: "วิทยาศาสตร์", grade_level: "secondary_low", workload: 65, email: "teacher1@school.ac.th", avatar: "https://picsum.photos/id/1011/200/200" },
  { id: "T002", name: "ครูสุชาดา บุญเลิศ", subject: "ภาษาไทย", grade_level: "primary_high", workload: 45, email: "teacher2@school.ac.th", avatar: "https://picsum.photos/id/1027/200/200" },
  { id: "T003", name: "ครูเชาวลิต โต้ตอบ", subject: "พลศึกษา", grade_level: "secondary_low", workload: 35, email: "teacher3@school.ac.th", avatar: "https://picsum.photos/id/1005/200/200" },
  { id: "T004", name: "ครูพิทักษ์ สุมนต์", subject: "ดนตรี", grade_level: "primary_low", workload: 55, email: "teacher4@school.ac.th", avatar: "https://picsum.photos/id/1012/200/200" },
  { id: "T005", name: "ครูมุฑิตา ศรีคร้าม", subject: "สังคมศึกษา", grade_level: "secondary_high", workload: 75, email: "teacher5@school.ac.th", avatar: "https://picsum.photos/id/1014/200/200" },
  { id: "T006", name: "ครูศุภรดา ละม่อมสาย", subject: "คอมพิวเตอร์", grade_level: "primary_high", workload: 40, email: "teacher6@school.ac.th", avatar: "https://picsum.photos/id/1025/200/200" }
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

export const MOCK_SCHEDULES: ScheduleItem[] = Array.from({ length: 20 }, (_, i) => {
  const teacher = TEACHERS[Math.floor(Math.random() * TEACHERS.length)];
  return {
    id: `S${100 + i}`,
    day_of_week: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][Math.floor(Math.random() * 5)],
    timeslot_id: `${(i % 7) + 1}`,
    period_no: `${(i % 7) + 1}`,
    class_name: ["ป.1", "ป.2", "ป.3", "ป.4", "ป.5", "ป.6", "ม.1", "ม.2", "ม.3"][Math.floor(Math.random() * 9)],
    grade_level: teacher.grade_level,
    subject: teacher.subject,
    teacher_id: teacher.id
  };
});

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'info',
    title: 'มีการจัดสอนแทนใหม่',
    message: 'ครู T002 จัดสอนแทนครู T001 ในคาบ 3',
    time: '10:30 น.'
  },
  {
    id: 'n2',
    type: 'warning',
    title: 'รอการอนุมัติ',
    message: 'มี 2 รายการรอการอนุมัติจากงานวิชาการ',
    time: '09:15 น.'
  },
  {
    id: 'n3',
    type: 'alert',
    title: 'ส่งอีเมลแจ้งเตือนแล้ว',
    message: 'ส่งอีเมลถึงครู T004 และหัวหน้างานวิชาการ',
    time: '08:45 น.'
  }
];

export const MOCK_APPROVALS: Approval[] = [
  {
    id: 'app-001',
    date: new Date().toISOString().split('T')[0],
    teacher_id: 'T001',
    substitute_id: 'T003',
    period: '3',
    subject: 'วิทยาศาสตร์',
    status: 'pending',
    requestedBy: 'หัวหน้ากลุ่มสาระ',
    requestedAt: '08:30 น.'
  },
  {
    id: 'app-002',
    date: new Date().toISOString().split('T')[0],
    teacher_id: 'T002',
    substitute_id: 'T006',
    period: '5',
    subject: 'ภาษาไทย',
    status: 'approved',
    requestedBy: 'ระบบอัตโนมัติ',
    requestedAt: '09:15 น.'
  }
];

export const INITIAL_RULES: Rule[] = [
  {
    id: 'rule-1',
    name: 'จัดครูในสายชั้นเดียวกัน',
    type: 'grade_level',
    value: 'same',
    priority: '1',
    weight: 8,
    active: true,
    targetGrade: 'same'
  },
  {
    id: 'rule-2',
    name: 'สมดุลภาระงาน',
    type: 'workload_balance',
    value: '75',
    priority: '3',
    weight: 5,
    active: true,
    maxWorkload: 75,
    tolerance: 10
  }
];

export const MOCK_SUBSTITUTE_HISTORY: SubstituteHistoryItem[] = [
  {
    id: 'h-1',
    date: '2023-10-20',
    period: '2',
    subject: 'คณิตศาสตร์',
    teacher_id: 'T001',
    substitute_id: 'T005',
    status: 'completed'
  },
  {
    id: 'h-2',
    date: '2023-10-18',
    period: '4',
    subject: 'ภาษาไทย',
    teacher_id: 'T002',
    substitute_id: 'T006',
    status: 'completed'
  },
   {
    id: 'h-3',
    date: '2023-10-15',
    period: '1',
    subject: 'วิทยาศาสตร์',
    teacher_id: 'T001',
    substitute_id: 'T003',
    status: 'cancelled'
  }
];