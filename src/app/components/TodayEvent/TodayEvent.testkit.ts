import { fireEvent, within } from '@testing-library/react';

export const getTodayEventTestkit = (component: HTMLElement) => ({
  getComponent: () => component,
  getAllDayLabel: () => within(component).getByText(/all day/i),
  getTitle: (title: string) => within(component).getByText(title),
  getCheckbox: () => within(component).getByRole('checkbox'),
  clickCheckbox: () =>
    fireEvent.click(within(component).getByRole('checkbox')),
  getTimeLabel: (time: string) => within(component).getByText(time),
});
