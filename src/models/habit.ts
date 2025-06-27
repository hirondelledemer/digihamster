import mongoose from "mongoose";
import { TimeStamps } from "./shared-types";
import { Category } from "#src/app/components/HabitForm/HabitForm.consts";

export interface HabitLog {
  at: number;
  completed: boolean;
}

export interface Habit extends TimeStamps {
  _id: string;
  title: string;
  deleted: boolean;
  log: HabitLog[];
  category: Category;
  timesPerMonth: number;
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
  { timestamps: true }
);

const Habit =
  mongoose.models.Habit || mongoose.model<Habit>("Habit", HabitSchema);
export default Habit;
