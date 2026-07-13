export enum ProjectStatus {
  Todo = "todo",
  Doing = "doing",
  Done = "done",
  Cancelled = "cancelled",
}
export interface IProject {
  id: number;
  title: string;
  description: string;
  color: string;
  sort_order: number;
  life_aspect_id: number;
  created_at: string;
  status: ProjectStatus;
}
