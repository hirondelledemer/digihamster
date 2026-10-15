import { useEventById } from "@/app/utils/hooks/use-events/selectors";
import { useHabitById } from "@/app/utils/hooks/use-habits-new/selectors";
import { useJournalEntryById } from "@/app/utils/hooks/use-entry/selectors";
import { useLocationById } from "@/app/utils/hooks/use-location/selectors";
import { useNoteById } from "@/app/utils/hooks/use-notes/selectors";
import { usePersonById } from "@/app/utils/hooks/use-people/selectors";
import { useProjectById } from "@/app/utils/hooks/use-projects/selectors";
import { useTaskById } from "@/app/utils/hooks/use-tasks-new/selectors";
import { RelationshipEntityType } from "@/app/utils/types/relationship";

/**
 * What to call an entity on screen when all you have is an id and a type.
 *
 * Every lookup runs on every call - they are all reads of state already in
 * context, and hooks cannot be called conditionally. Only the one matching
 * `type` is given an id, so the rest return null without searching.
 */
export const useEntityLabel = (
  id: number,
  type: RelationshipEntityType,
): string | null => {
  const idWhen = (wanted: RelationshipEntityType) =>
    type === wanted ? id : undefined;

  const event = useEventById(idWhen(RelationshipEntityType.Event));
  const habit = useHabitById(idWhen(RelationshipEntityType.Habit));
  const journal = useJournalEntryById(idWhen(RelationshipEntityType.Journal));
  const location = useLocationById(idWhen(RelationshipEntityType.Location));
  const note = useNoteById(idWhen(RelationshipEntityType.Note));
  const person = usePersonById(idWhen(RelationshipEntityType.Person));
  const project = useProjectById(idWhen(RelationshipEntityType.Project));
  const task = useTaskById(idWhen(RelationshipEntityType.Task));

  switch (type) {
    case RelationshipEntityType.Event:
      return event?.title ?? null;
    case RelationshipEntityType.Habit:
      return habit?.title ?? null;
    case RelationshipEntityType.Journal:
      return journal?.title ?? null;
    case RelationshipEntityType.Location:
      return location?.title ?? null;
    case RelationshipEntityType.Note:
      return note?.title ?? null;
    case RelationshipEntityType.Person:
      return person?.name ?? null;
    case RelationshipEntityType.Project:
      return project?.title ?? null;
    case RelationshipEntityType.Task:
      return task?.title ?? null;
    default:
      return null;
  }
};
