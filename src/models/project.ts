/**
 * @deprecated use the one from
 */
export interface Project {
  id: number;
  title: string;
  description: string;
  color: string;
  sort_order: number;
  disabled: boolean;
  life_aspect_id: number;
  created_at: string;
  updated_at: string;
  status: "todo" | "doing" | "done" | "cancelled";
}
