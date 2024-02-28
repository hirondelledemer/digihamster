import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface Project {
  _id: string;
  title: string;
  deleted: boolean;
  color: string;
  order: number;
}
export type IProject = Project & mongoose.Document<string>;

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    deleted: { type: Boolean, required: true },
    color: { type: String },
    userId: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProject>("Project", ProjectSchema);
