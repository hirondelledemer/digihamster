export enum EventStatus {
  Pending = "pending",
  Cancelled = "cancelled",
  Moved = "moved",
  Completed = "completed",
}

export interface IEvent {
  id: number;
  user_id: number;
  project_id: number | undefined | null;
  title: string;
  description: string;
  start_at: string;
  end_at: string;
  created_at: string;
  all_day: boolean;
  status: EventStatus;
}
