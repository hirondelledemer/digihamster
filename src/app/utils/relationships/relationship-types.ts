import { IRelationship, RelationshipEntityType } from "../types/relationship";

/**
 * What an edge means, as opposed to what it connects.
 *
 * `related` is the catch-all every row carries today: a link you made on
 * purpose, few of them, interesting from both ends. The named types are for
 * edges that behave differently enough that rendering and counting have to
 * tell them apart.
 */
export enum RelationshipType {
  /** the default - a curated association between two things */
  Related = "related",
  /**
   * "this event is one session of that habit". Machine-ish and unbounded: a
   * weekly habit grows one of these a week forever, so anything showing them
   * has to bound by date instead of listing them all.
   */
  OccurrenceOf = "occurrence_of",
}

export const DEFAULT_RELATIONSHIP_TYPE = RelationshipType.Related;

const isHabitEventPair = (
  a: RelationshipEntityType,
  b: RelationshipEntityType
) =>
  (a === RelationshipEntityType.Habit && b === RelationshipEntityType.Event) ||
  (a === RelationshipEntityType.Event && b === RelationshipEntityType.Habit);

/**
 * The type to stamp on a new edge. Linking a habit and an event always means
 * "I did/will do this here", so it is worth deciding at the point of writing
 * rather than guessing from the pair of types forever after.
 */
export const relationshipTypeFor = (
  sourceType: RelationshipEntityType,
  targetType: RelationshipEntityType
): RelationshipType =>
  isHabitEventPair(sourceType, targetType)
    ? RelationshipType.OccurrenceOf
    : RelationshipType.Related;

export interface IsOccurrenceOptions {
  /**
   * Every row written before this type existed says `related`, so a habit
   * joined to an event has to still count as a session or the existing data
   * silently stops counting.
   *
   * Once those rows are backfilled to `occurrence_of`, pass false (and then
   * delete this option): a habit deliberately marked `related` to an event
   * becomes an ordinary association that no longer counts towards the plan.
   */
  includeLegacy?: boolean;
}

export const isOccurrence = (
  relationship: IRelationship,
  { includeLegacy = true }: IsOccurrenceOptions = {}
): boolean => {
  if (relationship.relationship_type === RelationshipType.OccurrenceOf) {
    return true;
  }

  return (
    includeLegacy &&
    relationship.relationship_type === RelationshipType.Related &&
    isHabitEventPair(relationship.source_type, relationship.target_type)
  );
};
