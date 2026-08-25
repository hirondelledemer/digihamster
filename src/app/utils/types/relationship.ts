export enum RelationshipEntityType {
  Task = "task",
  Project = "project",
  Event = "event",
  Note = "note",
  Journal = "journal",
  Habit = "habit",
}

export interface IRelationship {
  id: number;
  source_type: RelationshipEntityType;
  source_id: number;
  target_type: RelationshipEntityType;
  target_id: number;
  relationship_type: string; // TODO: for now it is only related
}
