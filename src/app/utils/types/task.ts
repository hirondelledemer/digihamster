import { TaskV2 } from "@/models/taskV2";

export type TaskWithRelatedTasks = TaskV2 & { relatedTaskIds: string[] };
