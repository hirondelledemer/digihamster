import { ILocation } from "../../types/location";
import { RelationshipEntityType } from "../../types/relationship";
import { useRelationshipsState } from "../use-relationships/state-context";
import { useLocationsState } from "./state-context";

type GroupedLocations = {
  [k in number]: ILocation[];
};

export const useLocationsGroupedByEvents = (): GroupedLocations | undefined => {
  const { data: people, isLoading: isPeopleLoading } = useLocationsState();
  const { data: relationships, isLoading: isRelationshipsLoading } =
    useRelationshipsState();

  if (isPeopleLoading || isRelationshipsLoading || !people || !relationships) {
    return undefined;
  }

  const expandedLocations = people.map((location) => ({
    ...location,
    event_id: relationships.find(
      (r) =>
        r.target_id === location.id &&
        r.target_type === RelationshipEntityType.Location &&
        r.source_type === RelationshipEntityType.Event
    )?.source_id,
  }));

  const groupedLocations = expandedLocations.reduce<GroupedLocations>(
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

  return groupedLocations;
};
