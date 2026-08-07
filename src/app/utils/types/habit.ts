export interface HabitLog {
  id: number;
  habit_id: number;
  log_date: string;
  completed?: boolean;
  created_at: string;
}

export interface IHabitWithLogs {
  id: number;
  life_aspect_id: number;
  title: string;
  description: string;
  times_per_month: number;
  created_at: string;
  logs: HabitLog[];
}
