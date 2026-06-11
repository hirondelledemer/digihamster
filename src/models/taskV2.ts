import mongoose from "mongoose";

export interface TaskV2 {
  id: string;
  project_id: string | null;
  event_id: string | null;
  title: string;
  description: string | null;
  status: "todo" | "doing" | "done" | "cancelled";
  deadline: string | null;
  activated_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export type ITaskV2 = TaskV2 & mongoose.Document<string>;

const TaskV2Schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    descriptionFull: { type: Object, required: false },
    userId: { type: String, required: true },
    completed: { type: Boolean, required: true },
    isActive: { type: Boolean, required: true },
    deleted: { type: Boolean, required: true },
    projectId: { type: String },
    estimate: { type: Number },
    sortOrder: { type: Number },
    activatedAt: { type: Number },
    completedAt: { type: Number },
    parentTaskId: { type: String },
    deadline: { type: Number },
    eventId: { type: String },
    tags: { type: [String] },
  },
  { timestamps: true },
);

const TaskV2 =
  mongoose.models.TaskV2 || mongoose.model<ITaskV2>("TaskV2", TaskV2Schema);
export default TaskV2;
