import { ReactNode } from "react";
import {
  IRelationship,
  RelationshipEntityType,
} from "../../types/relationship";
import { LocationsStateContext } from "./state-context";
import { useLocationsGroupedByEvents } from "./selectors";
import { renderHook } from "@/config/utils/test-utils";
import { RelationshipsStateContext } from "../use-relationships/state-context";
import { ILocation } from "../../types/location";
import {
  generateListOfLocations,
  generateLocation,
} from "../../mocks/location";

describe("selectors", () => {
  describe("useLocationsGroupedByEvents", () => {
    const wrapper = (
      locations: ILocation[],
      relationships: IRelationship[]
    ) => {
      const LocationsState = ({ children }: { children: ReactNode }) => (
        <RelationshipsStateContext.Provider
          value={{ data: relationships, isLoading: false }}
        >
          <LocationsStateContext.Provider
            value={{ data: locations, isLoading: false }}
          >
            {children}
          </LocationsStateContext.Provider>
        </RelationshipsStateContext.Provider>
      );
      return LocationsState;
    };

    it("should return grouped locations by event", () => {
      const locations = generateListOfLocations(4);
      const relationships: IRelationship[] = [
        {
          id: 1,
          source_id: 10,
          source_type: RelationshipEntityType.Event,
          target_id: locations[0].id,
          target_type: RelationshipEntityType.Location,
          relationship_type: "related",
        },
        {
          id: 2,
          source_id: 10,
          source_type: RelationshipEntityType.Event,
          target_id: locations[1].id,
          target_type: RelationshipEntityType.Location,
          relationship_type: "related",
        },
        {
          id: 3,
          source_id: 20,
          source_type: RelationshipEntityType.Event,
          target_id: locations[3].id,
          target_type: RelationshipEntityType.Location,
          relationship_type: "related",
        },
      ];

      const { result } = renderHook(() => useLocationsGroupedByEvents(), {
        wrapper: wrapper(locations, relationships),
      });

      expect(result.current).toStrictEqual({
        10: [
          expect.objectContaining({ id: locations[0].id, event_id: 10 }),
          expect.objectContaining({ id: locations[1].id, event_id: 10 }),
        ],
        20: [expect.objectContaining({ id: locations[3].id, event_id: 20 })],
      });
    });

    it("should return undefined when locations are loading", () => {
      const LocationsState = ({ children }: { children: ReactNode }) => (
        <RelationshipsStateContext.Provider
          value={{ data: [], isLoading: false }}
        >
          <LocationsStateContext.Provider value={{ data: [], isLoading: true }}>
            {children}
          </LocationsStateContext.Provider>
        </RelationshipsStateContext.Provider>
      );

      const { result } = renderHook(() => useLocationsGroupedByEvents(), {
        wrapper: LocationsState,
      });

      expect(result.current).toBeUndefined();
    });

    it("should return undefined when relationships are loading", () => {
      const LocationsState = ({ children }: { children: ReactNode }) => (
        <RelationshipsStateContext.Provider
          value={{ data: [], isLoading: true }}
        >
          <LocationsStateContext.Provider
            value={{ data: [], isLoading: false }}
          >
            {children}
          </LocationsStateContext.Provider>
        </RelationshipsStateContext.Provider>
      );

      const { result } = renderHook(() => useLocationsGroupedByEvents(), {
        wrapper: LocationsState,
      });

      expect(result.current).toBeUndefined();
    });

    it("should ignore relationships with non-Location target_type", () => {
      const locations = [generateLocation(1)];
      const relationships: IRelationship[] = [
        {
          id: 1,
          source_id: 10,
          source_type: RelationshipEntityType.Event,
          target_id: locations[0].id,
          target_type: RelationshipEntityType.Habit,
          relationship_type: "related",
        },
      ];

      const { result } = renderHook(() => useLocationsGroupedByEvents(), {
        wrapper: wrapper(locations, relationships),
      });

      expect(result.current).toStrictEqual({});
    });

    it("should ignore relationships with non-Event source_type", () => {
      const locations = [generateLocation(1)];
      const relationships: IRelationship[] = [
        {
          id: 1,
          source_id: 10,
          source_type: RelationshipEntityType.Task,
          target_id: locations[0].id,
          target_type: RelationshipEntityType.Location,
          relationship_type: "related",
        },
      ];

      const { result } = renderHook(() => useLocationsGroupedByEvents(), {
        wrapper: wrapper(locations, relationships),
      });

      expect(result.current).toStrictEqual({});
    });

    it("should return empty object when no locations are linked to events", () => {
      const locations = generateListOfLocations(2);

      const { result } = renderHook(() => useLocationsGroupedByEvents(), {
        wrapper: wrapper(locations, []),
      });

      expect(result.current).toStrictEqual({});
    });
  });
});
