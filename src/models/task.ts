import mongoose from "mongoose";
import { Taggable, TimeStamps } from "./shared-types";

interface TaskEvent {
  allDay: boolean;
  startAt?: number;
  endAt?: number;
}

export interface Task extends Taggable, TimeStamps {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  isActive: boolean;
  deleted: boolean;
  projectId: string;
  estimate: number;
  sortOrder: number | null;
  event: TaskEvent | null;
  completedAt: number;
  activatedAt: number;
  parentTaskId: string | null;
}

export type ITask = Task & mongoose.Document<string> & Task;

const TaskSchema = new mongoose.Schema(
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
    event: { type: Object },
    activatedAt: { type: Number },
    completedAt: { type: Number },
    parentTaskId: { type: String },
    tags: { type: [String] },
  },
  { timestamps: true }
);

const Task = mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
export default Task;
