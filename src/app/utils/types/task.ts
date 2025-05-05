import { TaskV2 } from "@/models/taskV2";

export type TaskWithRelations = TaskV2 & {
  relatedTaskIds: string[];
  relatedNoteIds: string[];
};
