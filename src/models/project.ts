import { Category } from "#src/app/components/HabitForm/HabitForm.consts.js";
import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface Project {
  _id: string;
  title: string;
  deleted: boolean;
  color: string;
  order: number;
  disabled: boolean;
  category: Category;
  jsonDescription: object | null;
}
export type IProject = Project & mongoose.Document<string>;

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    deleted: { type: Boolean, required: true },
    disabled: { type: Boolean, required: true },
    jsonDescription: { type: Object },
    color: { type: String },
    userId: { type: String, required: true },
    order: { type: Number, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

const Project =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
export default Project;
