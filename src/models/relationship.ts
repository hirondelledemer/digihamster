import mongoose from "mongoose";

export interface Relationship {
  _id: string;
  sourceEntity: string;
  targetEntity: string;
  type: string; // 'task'
}

export type IRelationship = Relationship & mongoose.Document<string>;

const RelationshipSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    sourceEntity: { type: String, required: true },
    targetEntity: { type: String, required: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

const Relationship =
  mongoose.models.Relationship ||
  mongoose.model<Relationship>("Relationship", RelationshipSchema);

export default Relationship;
