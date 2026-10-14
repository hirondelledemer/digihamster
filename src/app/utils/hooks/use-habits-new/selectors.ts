import {
  getHabitWindow,
  HabitWindow,
} from "../../habits/habit-progress";
import { isOccurrence } from "../../relationships/relationship-types";
import { EventStatus } from "../../types/event";
import { IHabitWithLogs } from "../../types/habit";
import { RelationshipEntityType } from "../../types/relationship";
import { useEventsState } from "../use-events/state-context";
import { useAllRelationshipsForEntity } from "../use-relationships/selectors";
import { useRelationshipsState } from "../use-relationships/state-context";
import { useHabitsNewState } from "./state-context";

type GroupedHabits = {
  [k in number]: IHabitWithLogs[];
};

export const useHabitsGroupedByEvents = (): GroupedHabits | undefined => {
  const { data: habits, isLoading: isHabitsLoading } = useHabitsNewState();
  const { data: relationships, isLoading: isRelationshipsLoading } =
    useRelationshipsState();

  if (isHabitsLoading || isRelationshipsLoading || !habits || !relationships) {
    return undefined;
  }

  const expandedJournalEntries = habits.map((habit) => ({
    ...habit,
    event_id: relationships.find(
      (r) =>
        r.target_id === habit.id &&
        r.target_type === RelationshipEntityType.Habit &&
        r.source_type === RelationshipEntityType.Event
    )?.source_id,
  }));

  const groupedHabits = expandedJournalEntries.reduce<GroupedHabits>(
    (acc, current) => {
      if (current.event_id !== undefined) {
        return {
          ...acc,
          [current.event_id]: [
            ...(acc[current.event_id] ? acc[current.event_id] : []),
            current,
          ],
        };
      }

      return {
        ...acc,
      };
    },
    {}
  );

  return groupedHabits;
};

export const useHabitsForEvent = (eventId: number): IHabitWithLogs[] => {
  const { data: habits, isLoading: isHabitsLoading } = useHabitsNewState();
  const { data: relationships, isLoading: isRelationshipsLoading } =
    useRelationshipsState();

  if (isHabitsLoading || isRelationshipsLoading || !habits || !relationships) {
    return [];
  }

  const expandedHabits = habits.map((h) => ({
    ...h,
    event_id: relationships.find(
      (r) =>
        r.target_id === h.id &&
        r.target_type === RelationshipEntityType.Habit &&
        r.source_type === RelationshipEntityType.Event
    )?.source_id,
  }));

  const filteredHabits = expandedHabits.filter(
    (entry) => entry.event_id === eventId
  );

  return filteredHabits;
};

export const useHabitById = (
  id: number | null | undefined
): IHabitWithLogs | null => {
  const { data } = useHabitsNewState();

  if (id === null || id === undefined) {
    return null;
  }

  return data.find((habit) => habit.id === id) ?? null;
};

/**
 * The done / committed / gap split for a habit.
 *
 * Occurrences come from the relationship table rather than a foreign key, so
 * this is the one place that knows how a habit finds its events.
 */
export const useHabitWindow = (
  habitId: number | null | undefined
): HabitWindow | null => {
  const habit = useHabitById(habitId);
  const { data: events } = useEventsState();

  const relationships = useAllRelationshipsForEntity({
    entityId: habitId ?? -1,
    entityType: RelationshipEntityType.Habit,
  });

  // not every habit-to-event link is a session: one can be a plain
  // association, and only the sessions belong in the plan
  const occurrenceEventIds = relationships
    .filter(
      (r) => r.target_type === RelationshipEntityType.Event && isOccurrence(r)
    )
    .map((r) => r.target_id);

  // A cancelled event is not a commitment, so it must not count towards the
  // plan - otherwise cancelling something would leave the habit looking safe.
  const scheduled = events
    .filter(
      (event) =>
        occurrenceEventIds.includes(event.id) &&
        event.status !== EventStatus.Cancelled &&
        !!event.start_at
    )
    .map((event) => new Date(event.start_at));

  if (!habit) {
    return null;
  }

  return getHabitWindow({ habit, scheduled });
};
