import mongoose from "mongoose";
import { Taggable } from "./shared-types";

export interface Event extends Taggable {
  id: string;
  title: string;
  description: string;
  project_id: string;
  all_day: boolean;
  start_at: string;
  end_at: string;
  status: "pending" | "failed" | "completed" | "moved" | "canceled";
}

export type IEvent = Event & mongoose.Document<string>;

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    userId: { type: String, required: true },
    completed: { type: Boolean, required: true },
    allDay: { type: Boolean, required: false },
    startAt: { type: Number, required: true },
    endAt: { type: Number, required: true },
    deleted: { type: Boolean, required: true },
    projectId: { type: String },
    completedAt: { type: Number },
    tags: { type: [String] },
  },
  { timestamps: true },
);

const Event =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
export default Event;
