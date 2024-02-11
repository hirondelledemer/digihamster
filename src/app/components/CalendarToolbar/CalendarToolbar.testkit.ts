import { fireEvent } from "@testing-library/react";

export const getCalendarToolbarTestkit = (component: HTMLElement) => ({
  getComponent: () => component,
  pressA: () =>
    fireEvent.keyDown(component, {
      key: "a",
      code: "KeyA",
      charCode: 84,
    }),
  pressD: () =>
    fireEvent.keyDown(component, {
      key: "d",
      code: "KeyD",
    }),
  pressW: () =>
    fireEvent.keyDown(component, {
      key: "w",
      code: "KeyW",
    }),
  pressT: () =>
    fireEvent.keyDown(component, {
      key: "t",
      code: "KeyT",
    }),
});
