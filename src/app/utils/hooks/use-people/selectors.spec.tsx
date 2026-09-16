import { ReactNode } from "react";
import { generateListOfPeople, generatePerson } from "../../mocks/person";
import { IPerson } from "../../types/person";
import {
  IRelationship,
  RelationshipEntityType,
} from "../../types/relationship";
import { PeopleStateContext } from "./state-context";
import { usePeopleGroupedByEvents } from "./selectors";
import { renderHook } from "@/config/utils/test-utils";
import { RelationshipsStateContext } from "../use-relationships/state-context";

describe("selectors", () => {
  describe("usePeopleGroupedByEvents", () => {
    const wrapper = (people: IPerson[], relationships: IRelationship[]) => {
      const PeopleState = ({ children }: { children: ReactNode }) => (
        <RelationshipsStateContext.Provider
          value={{ data: relationships, isLoading: false }}
        >
          <PeopleStateContext.Provider
            value={{ data: people, isLoading: false }}
          >
            {children}
          </PeopleStateContext.Provider>
        </RelationshipsStateContext.Provider>
      );
      return PeopleState;
    };

    it("should return grouped people by event", () => {
      const people = generateListOfPeople(4);
      const relationships: IRelationship[] = [
        {
          id: 1,
          source_id: 10,
          source_type: RelationshipEntityType.Event,
          target_id: people[0].id,
          target_type: RelationshipEntityType.Person,
          relationship_type: "related",
        },
        {
          id: 2,
          source_id: 10,
          source_type: RelationshipEntityType.Event,
          target_id: people[1].id,
          target_type: RelationshipEntityType.Person,
          relationship_type: "related",
        },
        {
          id: 3,
          source_id: 20,
          source_type: RelationshipEntityType.Event,
          target_id: people[3].id,
          target_type: RelationshipEntityType.Person,
          relationship_type: "related",
        },
      ];

      const { result } = renderHook(() => usePeopleGroupedByEvents(), {
        wrapper: wrapper(people, relationships),
      });

      expect(result.current).toStrictEqual({
        10: [
          expect.objectContaining({ id: people[0].id, event_id: 10 }),
          expect.objectContaining({ id: people[1].id, event_id: 10 }),
        ],
        20: [
          expect.objectContaining({ id: people[3].id, event_id: 20 }),
        ],
      });
    });

    it("should return undefined when people are loading", () => {
      const PeopleState = ({ children }: { children: ReactNode }) => (
        <RelationshipsStateContext.Provider
          value={{ data: [], isLoading: false }}
        >
          <PeopleStateContext.Provider value={{ data: [], isLoading: true }}>
            {children}
          </PeopleStateContext.Provider>
        </RelationshipsStateContext.Provider>
      );

      const { result } = renderHook(() => usePeopleGroupedByEvents(), {
        wrapper: PeopleState,
      });

      expect(result.current).toBeUndefined();
    });

    it("should return undefined when relationships are loading", () => {
      const PeopleState = ({ children }: { children: ReactNode }) => (
        <RelationshipsStateContext.Provider
          value={{ data: [], isLoading: true }}
        >
          <PeopleStateContext.Provider value={{ data: [], isLoading: false }}>
            {children}
          </PeopleStateContext.Provider>
        </RelationshipsStateContext.Provider>
      );

      const { result } = renderHook(() => usePeopleGroupedByEvents(), {
        wrapper: PeopleState,
      });

      expect(result.current).toBeUndefined();
    });

    it("should ignore relationships with non-Person target_type", () => {
      const people = [generatePerson(1)];
      const relationships: IRelationship[] = [
        {
          id: 1,
          source_id: 10,
          source_type: RelationshipEntityType.Event,
          target_id: people[0].id,
          target_type: RelationshipEntityType.Habit,
          relationship_type: "related",
        },
      ];

      const { result } = renderHook(() => usePeopleGroupedByEvents(), {
        wrapper: wrapper(people, relationships),
      });

      expect(result.current).toStrictEqual({});
    });

    it("should ignore relationships with non-Event source_type", () => {
      const people = [generatePerson(1)];
      const relationships: IRelationship[] = [
        {
          id: 1,
          source_id: 10,
          source_type: RelationshipEntityType.Task,
          target_id: people[0].id,
          target_type: RelationshipEntityType.Person,
          relationship_type: "related",
        },
      ];

      const { result } = renderHook(() => usePeopleGroupedByEvents(), {
        wrapper: wrapper(people, relationships),
      });

      expect(result.current).toStrictEqual({});
    });

    it("should return empty object when no people are linked to events", () => {
      const people = generateListOfPeople(2);

      const { result } = renderHook(() => usePeopleGroupedByEvents(), {
        wrapper: wrapper(people, []),
      });

      expect(result.current).toStrictEqual({});
    });
  });
});
