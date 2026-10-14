import { ReactNode, useContext } from "react";
import { renderHook, act } from "@/config/utils/test-utils";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import {
  NavigatorColumn,
  RelationshipNavigatorContext,
  RelationshipNavigatorContextProvider,
  useNavigator,
} from "./navigator-context";

const EVENT = { id: 1, type: RelationshipEntityType.Event };
const JOURNAL = { id: 2, type: RelationshipEntityType.Journal };
const TASK = { id: 3, type: RelationshipEntityType.Task };
const PERSON = { id: 4, type: RelationshipEntityType.Person };

const renderNavigator = () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <RelationshipNavigatorContextProvider initialItem={EVENT}>
      {children}
    </RelationshipNavigatorContextProvider>
  );

  return renderHook(() => useContext(RelationshipNavigatorContext), {
    wrapper,
  });
};

/**
 * The panel is a column browser: a column lists one entity's neighbours, and
 * what you pick there decides what the next column shows. The index passed to
 * selectFromColumn is the column the click came from.
 */
describe("relationship navigator", () => {
  it("opens the picked entity in the next column", () => {
    const { result } = renderNavigator();

    act(() => result.current.selectFromColumn(0, JOURNAL));

    expect(result.current.entities).toEqual([EVENT, JOURNAL]);
  });

  it("descends when the pick comes from the deepest column", () => {
    const { result } = renderNavigator();

    act(() => result.current.selectFromColumn(0, JOURNAL));
    act(() => result.current.selectFromColumn(1, PERSON));

    expect(result.current.entities).toEqual([EVENT, JOURNAL, PERSON]);
  });

  // the one that was wrong: both picked from the event's own column, so they
  // are siblings - the trail must not read event > journal > task
  it("replaces rather than nests when a sibling is picked", () => {
    const { result } = renderNavigator();

    act(() => result.current.selectFromColumn(0, JOURNAL));
    act(() => result.current.selectFromColumn(0, TASK));

    expect(result.current.entities).toEqual([EVENT, TASK]);
  });

  it("drops everything deeper when a sibling replaces a branch", () => {
    const { result } = renderNavigator();

    act(() => result.current.selectFromColumn(0, JOURNAL));
    act(() => result.current.selectFromColumn(1, PERSON));

    act(() => result.current.selectFromColumn(0, TASK));

    expect(result.current.entities).toEqual([EVENT, TASK]);
  });

  it("closes the branch when the column's own selection is picked again", () => {
    const { result } = renderNavigator();

    act(() => result.current.selectFromColumn(0, JOURNAL));
    act(() => result.current.selectFromColumn(0, JOURNAL));

    expect(result.current.entities).toEqual([EVENT]);
  });

  describe("an entity that is already an ancestor", () => {
    // relationships render from both ends, so the event shows up again as a
    // neighbour further in. Appending it would loop the trail through itself,
    // and the very first version of this emptied the stack and crashed.
    it("goes back to it instead of opening a second copy", () => {
      const { result } = renderNavigator();

      act(() => result.current.selectFromColumn(0, JOURNAL));
      act(() => result.current.selectFromColumn(1, PERSON));

      act(() => result.current.selectFromColumn(2, EVENT));

      expect(result.current.entities).toEqual([EVENT]);
    });

    it("never empties the trail", () => {
      const { result } = renderNavigator();

      act(() => result.current.selectFromColumn(0, EVENT));

      expect(result.current.entities).toEqual([EVENT]);
    });
  });

  describe("goToIndex", () => {
    it("keeps the crumb that was clicked", () => {
      const { result } = renderNavigator();

      act(() => result.current.selectFromColumn(0, JOURNAL));
      act(() => result.current.selectFromColumn(1, PERSON));

      act(() => result.current.goToIndex(1));

      expect(result.current.entities).toEqual([EVENT, JOURNAL]);
    });
  });

  // the components doing the picking never pass an index themselves - they
  // read it from the column they are rendered in, so that wiring is the part
  // most likely to silently fall back to "deepest column" and start nesting
  // siblings again
  describe("useNavigator inside a column", () => {
    const renderInColumn = (columnIndex: number) => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <RelationshipNavigatorContextProvider initialItem={EVENT}>
          <NavigatorColumn index={columnIndex}>{children}</NavigatorColumn>
        </RelationshipNavigatorContextProvider>
      );

      return renderHook(() => useNavigator(), { wrapper });
    };

    it("binds picks to the column they came from", () => {
      const { result } = renderInColumn(0);

      act(() => result.current.setActiveEntity(JOURNAL));
      act(() => result.current.setActiveEntity(TASK));

      expect(result.current.entities).toEqual([EVENT, TASK]);
    });
  });
});
