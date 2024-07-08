import mongoose from "mongoose";
import { Taggable, TimeStamps } from "./shared-types";

export interface IJournalEntry extends Taggable, mongoose.Document, TimeStamps {
  _id: string;
  title: string;
  note: string;
  userId: string;
}

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
