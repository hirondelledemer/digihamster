import { ReactNode } from "react";
import { generateHabit, generateListOfHabits } from "../../mocks/habit";
import { IHabitWithLogs } from "../../types/habit";
import {
  IRelationship,
  RelationshipEntityType,
} from "../../types/relationship";
import { HabitsNewStateContext } from "./state-context";
import { useHabitsGroupedByEvents } from "./selectors";
import { renderHook } from "@/config/utils/test-utils";
import { RelationshipsStateContext } from "../use-relationships/state-context";

describe("selectors", () => {
  describe("useHabitsGroupedByEvents", () => {
    const wrapper = (
      habits: IHabitWithLogs[],
      relationships: IRelationship[],
    ) => {
      const HabitsState = ({ children }: { children: ReactNode }) => (
        <RelationshipsStateContext.Provider
          value={{ data: relationships, isLoading: false }}
        >
          <HabitsNewStateContext.Provider
            value={{ data: habits, isLoading: false }}
          >
            {children}
          </HabitsNewStateContext.Provider>
        </RelationshipsStateContext.Provider>
      );
      return HabitsState;
    };

    it("should return grouped habits by event", () => {
      const habits = generateListOfHabits(4);
      const relationships: IRelationship[] = [
        {
          id: 1,
          source_id: 10,
          source_type: RelationshipEntityType.Event,
          target_id: habits[0].id,
          target_type: RelationshipEntityType.Habit,
          relationship_type: "related",
        },
        {
          id: 2,
          source_id: 10,
          source_type: RelationshipEntityType.Event,
          target_id: habits[1].id,
          target_type: RelationshipEntityType.Habit,
          relationship_type: "related",
        },
        {
          id: 3,
          source_id: 20,
          source_type: RelationshipEntityType.Event,
          target_id: habits[3].id,
          target_type: RelationshipEntityType.Habit,
          relationship_type: "related",
        },
      ];

      const { result } = renderHook(() => useHabitsGroupedByEvents(), {
        wrapper: wrapper(habits, relationships),
      });

      expect(result.current).toStrictEqual({
        10: [
          expect.objectContaining({ id: habits[0].id, event_id: 10 }),
          expect.objectContaining({ id: habits[1].id, event_id: 10 }),
        ],
        20: [
          expect.objectContaining({ id: habits[3].id, event_id: 20 }),
        ],
      });
    });

    it("should return undefined when habits are loading", () => {
      const HabitsState = ({ children }: { children: ReactNode }) => (
        <RelationshipsStateContext.Provider
          value={{ data: [], isLoading: false }}
        >
          <HabitsNewStateContext.Provider
            value={{ data: [], isLoading: true }}
          >
            {children}
          </HabitsNewStateContext.Provider>
        </RelationshipsStateContext.Provider>
      );

      const { result } = renderHook(() => useHabitsGroupedByEvents(), {
        wrapper: HabitsState,
      });

      expect(result.current).toBeUndefined();
    });

    it("should return undefined when relationships are loading", () => {
      const HabitsState = ({ children }: { children: ReactNode }) => (
        <RelationshipsStateContext.Provider
          value={{ data: [], isLoading: true }}
        >
          <HabitsNewStateContext.Provider
            value={{ data: [], isLoading: false }}
          >
            {children}
          </HabitsNewStateContext.Provider>
        </RelationshipsStateContext.Provider>
      );

      const { result } = renderHook(() => useHabitsGroupedByEvents(), {
        wrapper: HabitsState,
      });

      expect(result.current).toBeUndefined();
    });

    it("should ignore relationships with non-Habit target_type", () => {
      const habits = [generateHabit(1)];
      const relationships: IRelationship[] = [
        {
          id: 1,
          source_id: 10,
          source_type: RelationshipEntityType.Event,
          target_id: habits[0].id,
          target_type: RelationshipEntityType.Person,
          relationship_type: "related",
        },
      ];

      const { result } = renderHook(() => useHabitsGroupedByEvents(), {
        wrapper: wrapper(habits, relationships),
      });

      expect(result.current).toStrictEqual({});
    });

    it("should ignore relationships with non-Event source_type", () => {
      const habits = [generateHabit(1)];
      const relationships: IRelationship[] = [
        {
          id: 1,
          source_id: 10,
          source_type: RelationshipEntityType.Task,
          target_id: habits[0].id,
          target_type: RelationshipEntityType.Habit,
          relationship_type: "related",
        },
      ];

      const { result } = renderHook(() => useHabitsGroupedByEvents(), {
        wrapper: wrapper(habits, relationships),
      });

      expect(result.current).toStrictEqual({});
    });

    it("should return empty object when no habits are linked to events", () => {
      const habits = generateListOfHabits(2);

      const { result } = renderHook(() => useHabitsGroupedByEvents(), {
        wrapper: wrapper(habits, []),
      });

      expect(result.current).toStrictEqual({});
    });
  });
});
