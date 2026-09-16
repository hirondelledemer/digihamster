import { IPerson } from "../../types/person";
import { RelationshipEntityType } from "../../types/relationship";
import { usePeopleState } from "../use-people/state-context";
import { useRelationshipsState } from "../use-relationships/state-context";

type GroupedPeople = {
  [k in number]: IPerson[];
};

export const usePeopleGroupedByEvents = (): GroupedPeople | undefined => {
  const { data: people, isLoading: isPeopleLoading } = usePeopleState();
  const { data: relationships, isLoading: isRelationshipsLoading } =
    useRelationshipsState();

  if (isPeopleLoading || isRelationshipsLoading || !people || !relationships) {
    return undefined;
  }

  const expandedPeople = people.map((person) => ({
    ...person,
    event_id: relationships.find(
      (r) =>
        r.target_id === person.id &&
        r.target_type === RelationshipEntityType.Person &&
        r.source_type === RelationshipEntityType.Event
    )?.source_id,
  }));

  const groupedPeople = expandedPeople.reduce<GroupedPeople>((acc, current) => {
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
  }, {});

  return groupedPeople;
};
