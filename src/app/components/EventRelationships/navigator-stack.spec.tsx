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

describe("relationship navigator stack", () => {
  it("pushes an entity that is not on the stack yet", () => {
    const { result } = renderNavigator();

    act(() => result.current.setActiveEntity(PERSON));

    expect(result.current.entities).toEqual([EVENT, PERSON]);
  });

  it("navigates back to an entity already on the stack, keeping it", () => {
    const { result } = renderNavigator();

    act(() => result.current.setActiveEntity(PERSON));
    act(() => result.current.setActiveEntity(NOTE));
    expect(result.current.entities).toEqual([EVENT, PERSON, NOTE]);

    act(() => result.current.setActiveEntity(PERSON));

    expect(result.current.entities).toEqual([EVENT, PERSON]);
  });

  // the crash: the root is the only entity sitting at index 0, which is why
  // this only ever showed up on the event the navigator was opened with
  it("never empties the stack when the root is selected", () => {
    const { result } = renderNavigator();

    act(() => result.current.setActiveEntity(PERSON));
    act(() => result.current.setActiveEntity(EVENT));

    expect(result.current.entities).toEqual([EVENT]);
    expect(result.current.entities.length).toBeGreaterThan(0);
  });

  it("keeps the stack non-empty when the root is selected from the root", () => {
    const { result } = renderNavigator();

    act(() => result.current.setActiveEntity(EVENT));

    expect(result.current.entities).toEqual([EVENT]);
  });
});
