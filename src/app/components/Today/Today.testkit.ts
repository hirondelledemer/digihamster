import { fireEvent, within } from '@testing-library/react';
import { getTodayEventTestkit } from '../TodayEvent/TodayEvent.testkit';
import { todayEvent, upcomingEventsTestId } from './Today';

export const getTodayTestkit = (component: HTMLElement) => {
  const getUpcomingEventsBtn = () =>
    within(component).queryByRole('button', {
      name: /upcoming events/i,
    });
  const eventQuery = within(component).queryAllByTestId(todayEvent);
  return {
    getComponent: () => component,
    getUpcomingEventsBtn,
    getSpoiler: () =>
      within(component).queryByTestId(upcomingEventsTestId),
    clickUpcomingBtn: () => {
      const btn = getUpcomingEventsBtn();
      if (!btn) {
        return Error('button does not exists');
      }
      fireEvent.click(btn);
    },
    getEventAt: (index: number) =>
      getTodayEventTestkit(eventQuery[index]),
    getEventCount: () => eventQuery.length, // meda duplicate
  };
};
