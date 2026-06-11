import mongoose from "mongoose";
import { TimeStamps } from "./shared-types";

export interface HabitLog {
  log_date: string;
  completed: boolean;
}

export interface Habit extends TimeStamps {
  id: string;
  title: string;
  logs: HabitLog[];
  times_per_month: number;
  life_aspect_id: string;
}

export type IHabit = Habit & mongoose.Document<string>;

const HabitSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    userId: { type: String, required: true },
    deleted: { type: Boolean, required: true },
    log: { type: Array, required: true },
    category: { type: String, required: true },
    timesPerMonth: { type: Number, required: true },
  },
  { timestamps: true },
);

const Habit =
  mongoose.models.Habit || mongoose.model<Habit>("Habit", HabitSchema);
export default Habit;
