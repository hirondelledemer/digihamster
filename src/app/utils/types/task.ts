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
  title: string;
  project_id: number | null;
  event_id: number | null;
  event_sort_order: number | null; // this should be null only when the event_id is null, think of how to express it in types
  description: string | null;
  status: TaskStatus;
  deadline: string | null;
  activated_at: string | null;
  completed_at: string | null;
  created_at: string;
}
