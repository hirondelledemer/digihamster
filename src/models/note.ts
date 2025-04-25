import mongoose from "mongoose";
import { Taggable, TimeStamps } from "./shared-types";

export interface Note extends Taggable, TimeStamps {
  _id: string;
  title: string;
  note: string;
  jsonNote: object;
  isActive: boolean;
  deleted: boolean;
  userId: string;
}

export type INote = Note & mongoose.Document<string>;

const NoteSchema = new mongoose.Schema(
  {
    title: { type: String },
    note: { type: String, required: true },
    jsonNote: { type: Object, required: true },
    isActive: { type: Boolean, required: true },
    deleted: { type: Boolean, required: true },
    userId: { type: String, required: true },
    tags: { type: [String] },
  },
  { timestamps: true }
);

const Note = mongoose.model<INote>("Note", NoteSchema);
export default Note;
