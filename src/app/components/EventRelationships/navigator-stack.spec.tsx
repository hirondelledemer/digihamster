import { ReactNode, useContext } from "react";
import { renderHook, act } from "@/config/utils/test-utils";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import {
  RelationshipNavigatorContext,
  RelationshipNavigatorContextProvider,
} from "./EventRealtionships";

const EVENT = { id: 1, type: RelationshipEntityType.Event };
const PERSON = { id: 2, type: RelationshipEntityType.Person };
const NOTE = { id: 3, type: RelationshipEntityType.Note };

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
 * The compact rail renders an entity that is on the stack as selected, so
 * selecting it a second time closes it again. These cover both halves of that
 * toggle, plus the root, which has nothing to fall back to.
 */
describe("relationship navigator stack", () => {
  it("opens an entity that is not on the stack yet", () => {
    const { result } = renderNavigator();

    act(() => result.current.setActiveEntity(PERSON));

    expect(result.current.entities).toEqual([EVENT, PERSON]);
  });

  it("closes the entity being viewed, which is how you go back", () => {
    const { result } = renderNavigator();

    act(() => result.current.setActiveEntity(PERSON));
    expect(result.current.entities).toEqual([EVENT, PERSON]);

    act(() => result.current.setActiveEntity(PERSON));

    expect(result.current.entities).toEqual([EVENT]);
  });

  it("closing one partway down drops everything after it too", () => {
    const { result } = renderNavigator();

    act(() => result.current.setActiveEntity(PERSON));
    act(() => result.current.setActiveEntity(NOTE));
    expect(result.current.entities).toEqual([EVENT, PERSON, NOTE]);

    act(() => result.current.setActiveEntity(PERSON));

    expect(result.current.entities).toEqual([EVENT]);
  });

  describe("the root", () => {
    // it is reachable as a neighbour further in, because relationships are
    // shown from both ends - selecting it there used to empty the stack and
    // crash the panel on entities[entities.length - 1]
    it("collapses back to itself instead of emptying the stack", () => {
      const { result } = renderNavigator();

      act(() => result.current.setActiveEntity(PERSON));
      act(() => result.current.setActiveEntity(NOTE));

      act(() => result.current.setActiveEntity(EVENT));

      expect(result.current.entities).toEqual([EVENT]);
    });

    it("stays put when it is the only thing on the stack", () => {
      const { result } = renderNavigator();

      act(() => result.current.setActiveEntity(EVENT));

      expect(result.current.entities).toEqual([EVENT]);
    });
  });
});
