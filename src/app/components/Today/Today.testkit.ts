import { within } from "@testing-library/react";
import { getTodayEventTestkit } from "../TodayEvent/TodayEvent.testkit";
import { todayEvent } from "./Today";

export const getTodayTestkit = (component: HTMLElement) => {
  const eventQuery = within(component).queryAllByTestId(todayEvent);
  return {
    getComponent: () => component,
    getEventAt: (index: number) => getTodayEventTestkit(eventQuery[index]),
    getEventCount: () => within(component).queryAllByTestId(todayEvent).length,
  };
};
