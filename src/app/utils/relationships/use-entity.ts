import { useJournalEntryById } from "@/app/utils/hooks/use-entry/selectors";
import { useEventById } from "@/app/utils/hooks/use-events/selectors";
import { useHabitById } from "@/app/utils/hooks/use-habits-new/selectors";
import { useLocationById } from "@/app/utils/hooks/use-location/selectors";
import { useNoteById } from "@/app/utils/hooks/use-notes/selectors";
import { usePersonById } from "@/app/utils/hooks/use-people/selectors";
import { useProjectById } from "@/app/utils/hooks/use-projects/selectors";
import { useTaskById } from "@/app/utils/hooks/use-tasks-new/selectors";
import { IEvent } from "@/app/utils/types/event";
import { IHabitWithLogs } from "@/app/utils/types/habit";
import { IJournalEntry } from "@/app/utils/types/journal-entry";
import { ILocation } from "@/app/utils/types/location";
import { INote } from "@/app/utils/types/note";
import { IPerson } from "@/app/utils/types/person";
import { IProject } from "@/app/utils/types/project";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { ITask } from "@/app/utils/types/task";

type Entity =
  | IEvent
  | IHabitWithLogs
  | IJournalEntry
  | ILocation
  | INote
  | IPerson
  | IProject
  | ITask;

export const useEntityFromRelationship = (
  id: number,
  type: RelationshipEntityType
): Entity | null => {
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
      return event;
    case RelationshipEntityType.Habit:
      return habit;
    case RelationshipEntityType.Journal:
      return journal;
    case RelationshipEntityType.Location:
      return location;
    case RelationshipEntityType.Note:
      return note;
    case RelationshipEntityType.Person:
      return person;
    case RelationshipEntityType.Project:
      return project;
    case RelationshipEntityType.Task:
      return task;
    default:
      return null;
  }
};
