import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface Project {
  id: number;
  title: string;
  description: string;
  color: string;
  sort_order: number;
  disabled: boolean;
  life_aspect_id: number;
  created_at: string;
  updated_at: string;
  status: "todo" | "doing" | "done" | "cancelled";
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
  { timestamps: true },
);

const Project =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
export default Project;
