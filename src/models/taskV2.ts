import mongoose from "mongoose";
import { Taggable, TimeStamps } from "./shared-types";


export interface TaskV2 extends Taggable, TimeStamps {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  isActive: boolean;
  deleted: boolean;
  projectId: string;
  estimate: number;
  sortOrder: number | null;
  completedAt: number;
  activatedAt: number;
  parentTaskId: string | null;
  deadline: number | null;
}

export type ITaskV2 = TaskV2 & mongoose.Document<string> & TaskV2;

const TaskV2Schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
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
    tags: { type: [String] },
  },
  { timestamps: true }
);

const TaskV2 = mongoose.models.TaskV2 || mongoose.model<ITaskV2>("TaskV2", TaskV2Schema);
export default TaskV2;
