import mongoose from "mongoose";
import { Taggable, TimeStamps } from "./shared-types";

export interface JournalEntry extends Taggable, TimeStamps {
  _id: string;
  title: string;
  note: string;
}

export type IJournalEntry = JournalEntry & mongoose.Document<string>;

const JournalEntrySchema = new mongoose.Schema<string>(
  {
    title: { type: String },
    note: { type: String, required: true },
    userId: { type: String, required: true },
    tags: { type: [String] },
  },
  { timestamps: true }
);

const JournalEntry =
  mongoose.models.JournalEntry ||
  mongoose.model("JournalEntry", JournalEntrySchema);
export default JournalEntry;
