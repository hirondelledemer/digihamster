import { TaskV2 } from "@/models/taskV2";

// todo: rename into normal task
/** @deprecated use ITask instead */
export type TaskWithRelations = TaskV2;

export enum TaskStatus {
  Todo = "todo",
  Doing = "doing",
  Done = "done",
  Cancelled = "cancelled",
}

export interface ITask {
  id: number;
  project_id: number | null;
  event_id: number | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  deadline: string | null;
  activated_at: string | null;
  completed_at: string | null;
  created_at: string;
}
