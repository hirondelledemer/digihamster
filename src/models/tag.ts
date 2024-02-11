import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface ITag extends mongoose.Document {
  title: string;
  color: string;
  deleted: boolean;
}

const TagSchema = new Schema(
  {
    title: { type: String, required: true },
    color: { type: String, required: true },
    deleted: { type: Boolean, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

// export default mongoose.model<ITag>("Tag", TagSchema);

const Tag = mongoose.models.Tag || mongoose.model<ITag>("Tag", TagSchema);
export default Tag;
