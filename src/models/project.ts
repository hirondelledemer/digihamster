import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface Project {
  _id: string;
  title: string;
  deleted: boolean;
  color: string;
  order: number;
  disabled: boolean;
}
export type IProject = Project & mongoose.Document<string>;

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    deleted: { type: Boolean, required: true },
    disabled: { type: Boolean, required: true },
    color: { type: String },
    userId: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

const Project =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
export default Project;
