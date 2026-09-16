import { IHabitWithLogs } from "../../types/habit";
import { RelationshipEntityType } from "../../types/relationship";
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
