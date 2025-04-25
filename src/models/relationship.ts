import mongoose from "mongoose";

const RELATIONSHIP_TYPES = ["task", "note"] as const;

type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];
export interface Relationship {
  _id: string;
  sourceEntity: string;
  targetEntity: string;
  type: RelationshipType;
}

export type IRelationship = Relationship & mongoose.Document<string>;

const RelationshipSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    sourceEntity: { type: String, required: true },
    targetEntity: { type: String, required: true },
    type: { type: String, enum: RELATIONSHIP_TYPES, required: true },
  },
  { timestamps: true }
);

const Relationship =
  mongoose.models.Relationship ||
  mongoose.model<Relationship>("Relationship", RelationshipSchema);

export default Relationship;
