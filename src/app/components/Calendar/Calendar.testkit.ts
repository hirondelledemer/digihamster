import { fireEvent, within } from "@testing-library/react";
// import { getTodayEventTestkit } from "../TodayEvent/TodayEvent.testkit";

export const getCalendarTestkit = (component: HTMLElement) => {
  return {
    getComponent: () => component,
    clickEventSlot: () => {
      //   const eventSlot = component.querySelector(".rbc-day-slot");
      //   console.log(eventSlot?.textContent);
      const eventSlot = component.querySelector(".rbc-time-slot");
      //   console.log(eventSlot);
      if (!eventSlot) {
        throw new Error("event slot not found");
      }
      fireEvent.select(eventSlot);
    },
  };
};
