export interface Teacher {
  id: string;
  name: string;
  subject: string;
  grade_level: string;
  workload: number;
  email: string;
  avatar: string;
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
