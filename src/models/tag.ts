import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface Tag {
  _id: string;
  title: string;
  color: string;
  deleted: boolean;
}

export type ITag = Tag & mongoose.Document<string>;

const TagSchema = new Schema(
  {
    title: { type: String, required: true },
    color: { type: String, required: true },
    deleted: { type: Boolean, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

const Tag = mongoose.models.Tag || mongoose.model<ITag>("Tag", TagSchema);
export default Tag;
