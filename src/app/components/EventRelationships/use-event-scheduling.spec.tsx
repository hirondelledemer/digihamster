import { ReactNode } from "react";
import { renderHook, act } from "@/config/utils/test-utils";
import {
  IRelationship,
  RelationshipEntityType,
} from "@/app/utils/types/relationship";
import { RelationshipsStateContext } from "@/app/utils/hooks/use-relationships/state-context";
import { RelationshipsActionsContext } from "@/app/utils/hooks/use-relationships/actions-context";
import {
  NavigatorColumn,
  NavigatorItem,
  RelationshipNavigatorContextProvider,
} from "./navigator-context";
import { useEventScheduling } from "./use-event-scheduling";

const EVENT: NavigatorItem = { id: 1, type: RelationshipEntityType.Event };
const LOCATION: NavigatorItem = {
  id: 2,
  type: RelationshipEntityType.Location,
};
const TASK_ID = 3;
const HABIT_ID = 4;

const relates = (
  id: number,
  source: NavigatorItem,
  target: { id: number; type: RelationshipEntityType },
): IRelationship => ({
  id,
  source_id: source.id,
  source_type: source.type,
  target_id: target.id,
  target_type: target.type,
  relationship_type: "related",
});

interface RenderOptions {
  /** where the panel was opened; an event unless a test says otherwise */
  root?: NavigatorItem;
  /**
   * Which column the card is drawn in. A location expands its tasks inside
   * its own card, so the common case is a suggestion sitting in column 0
   * alongside the event's own list.
   */
  column?: number;
  relationships?: IRelationship[];
  /** what is being offered; a task unless a test says otherwise */
  type?: RelationshipEntityType;
  id?: number;
}

const renderScheduling = ({
  root = EVENT,
  column = 0,
  relationships = [],
  type = RelationshipEntityType.Task,
  id = TASK_ID,
}: RenderOptions = {}) => {
  const create = jest.fn();

  const wrapper = ({ children }: { children: ReactNode }) => (
    <RelationshipsStateContext.Provider
      value={{ data: relationships, isLoading: false }}
    >
      <RelationshipsActionsContext.Provider
        value={{ create, update: jest.fn(), delete: jest.fn() }}
      >
        <RelationshipNavigatorContextProvider initialItem={root}>
          <NavigatorColumn index={column}>{children}</NavigatorColumn>
        </RelationshipNavigatorContextProvider>
      </RelationshipsActionsContext.Provider>
    </RelationshipsStateContext.Provider>
  );

  return {
    create,
    ...renderHook(() => useEventScheduling(type, id), { wrapper }),
  };
};

/**
 * The scenario: you open an event, it shows a location, the location suggests
 * the tasks you do when you are there, and you want one of them pulled into
 * the event you came from.
 */
describe("useEventScheduling", () => {
  it("offers the move for a task suggested under the event", () => {
    const { result } = renderScheduling();

    expect(result.current.scheduled).toBe(false);
    expect(result.current.actions).toHaveLength(1);
    expect(result.current.actions[0].label).toBe("Move to the event");
  });

  // the one that was wrong: the location draws its tasks inside its own card,
  // so the suggestion shares column 0 with the event's own list. Anything
  // keyed off depth hides the action in the only view that has it.
  it("offers the move however deep the card is drawn", () => {
    const { result } = renderScheduling({ column: 2 });

    expect(result.current.actions).toHaveLength(1);
  });

  it("attaches the task to the event the panel was opened on", () => {
    const { result, create } = renderScheduling();

    act(() => result.current.actions[0].onClick());

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        source_id: EVENT.id,
        source_type: RelationshipEntityType.Event,
        target_id: TASK_ID,
        target_type: RelationshipEntityType.Task,
      }),
    );
  });

  describe("once the task is in the event", () => {
    const scheduled = {
      relationships: [
        relates(1, EVENT, { id: TASK_ID, type: RelationshipEntityType.Task }),
      ],
    };

    it("marks it instead of offering the move again", () => {
      const { result } = renderScheduling(scheduled);

      expect(result.current.scheduled).toBe(true);
      expect(result.current.actions).toEqual([]);
    });

    // either end may have written the row, so the marker cannot assume the
    // event is the source
    it("reads the link written from the task's end", () => {
      const { result } = renderScheduling({
        relationships: [
          relates(1, { id: TASK_ID, type: RelationshipEntityType.Task }, EVENT),
        ],
      });

      expect(result.current.scheduled).toBe(true);
    });
  });

  describe("a habit kept at the location", () => {
    const habit = {
      type: RelationshipEntityType.Habit,
      id: HABIT_ID,
    };

    it("is offered the same move as a task", () => {
      const { result } = renderScheduling(habit);

      expect(result.current.actions).toHaveLength(1);
      expect(result.current.actions[0].label).toBe("Move to the event");
    });

    // a habit joined to an event is a session of it, not a loose association,
    // and the plan counts those rows
    it("is attached as an occurrence of the event", () => {
      const { result, create } = renderScheduling(habit);

      act(() => result.current.actions[0].onClick());

      expect(create).toHaveBeenCalledWith(
        expect.objectContaining({
          target_id: HABIT_ID,
          target_type: RelationshipEntityType.Habit,
          relationship_type: "occurrence_of",
        }),
      );
    });

    it("is marked once it is in the event", () => {
      const { result } = renderScheduling({
        ...habit,
        relationships: [relates(1, EVENT, habit)],
      });

      expect(result.current.scheduled).toBe(true);
      expect(result.current.actions).toEqual([]);
    });
  });

  // the habit card needs the event itself to log against, and must not work
  // it out a second way
  it("reports the event the panel was opened on", () => {
    expect(renderScheduling().result.current.eventId).toBe(EVENT.id);
    expect(
      renderScheduling({ root: LOCATION }).result.current.eventId,
    ).toBeNull();
  });

  it("offers nothing when the panel was not opened on an event", () => {
    const { result } = renderScheduling({ root: LOCATION });

    expect(result.current.scheduled).toBe(false);
    expect(result.current.actions).toEqual([]);
  });
});
