import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

/** @deprecated delete */
export interface Tag {
  id: number;
  title: string;
  color: string;
  deleted: boolean;
}

/** @deprecated delete */
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

/** @deprecated delete */
const Tag = mongoose.models.Tag || mongoose.model<ITag>("Tag", TagSchema);
export default Tag;
