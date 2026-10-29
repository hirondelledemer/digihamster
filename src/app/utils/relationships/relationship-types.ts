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
  /** this thing happens at that place */
  At = "at",
  /** that person takes part in this thing */
  Includes = "includes",
  /** this note is written about that thing */
  Annotates = "annotates",
  /** this journal entry was written about doing that thing */
  During = "during",
  /** structural parent to child: an event's tasks, a project's habits */
  Contains = "contains",
  /** that task cannot start until this one is done */
  Blocks = "blocks",
  /** this task comes after that one, without blocking it */
  Follows = "follows",
  /** this journal entry picks up the thread of that one */
  Continues = "continues",
  /** these two places are close enough to treat as one trip */
  Near = "near",
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
