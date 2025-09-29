import mongoose from "mongoose";
import { TimeStamps } from "./shared-types";

export type LifeAspectAsset =
  | "tree"
  | "house"
  | "shed"
  | "animals"
  | "river"
  | "mountains"
  | "pumpkinGarden"
  | "defaultScore";

export interface LifeAspectLog {
  at: number;
  completed: boolean;
}

export interface LifeAspect extends TimeStamps {
  _id: string;
  title: string;
  deleted: boolean;
  asset: LifeAspectAsset;
  boosts: { value: number; expires: string }[];
}

export type ILifeAspect = LifeAspect & mongoose.Document<string>;

const LifeAspectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    userId: { type: String, required: true },
    deleted: { type: Boolean, required: true },
    asset: { type: String, required: true },
    boosts: { type: Array, required: true },
  },
  { timestamps: true }
);

const LifeAspect =
  mongoose.models.LifeAspect ||
  mongoose.model<LifeAspect>("LifeAspect", LifeAspectSchema);
export default LifeAspect;
