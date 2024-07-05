import mongoose from "mongoose";
import { Taggable, TimeStamps } from "./shared-types";

export interface Event extends Taggable, TimeStamps {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  deleted: boolean;
  projectId: string;
  allDay: boolean;
  startAt?: number;
  endAt?: number;
  completedAt?: number;
}

export type IEvent = Event & mongoose.Document<string> & Event;

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
  { timestamps: true }
);

const Event =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
export default Event;
