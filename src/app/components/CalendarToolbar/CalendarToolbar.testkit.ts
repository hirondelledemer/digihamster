import { fireEvent } from '@testing-library/react';

export const getCalendarToolbarTestkit = (
  component: HTMLElement,
) => ({
  getComponent: () => component,
  pressT: () =>
    fireEvent.keyDown(component, {
      key: 't',
      code: 'KeyT',
      charCode: 84,
    }),
  pressD: () =>
    fireEvent.keyDown(component, {
      key: 'd',
      code: 'KeyD',
    }),
  pressW: () =>
    fireEvent.keyDown(component, {
      key: 'w',
      code: 'KeyW',
    }),
});
