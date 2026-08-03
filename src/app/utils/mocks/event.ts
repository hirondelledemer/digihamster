import { EventStatus, IEvent } from "../types/event";
import { DEFAULT_TEST_DATE } from "./date";

export const generateEvent: (
  i?: number,
  properties?: Partial<IEvent>,
) => IEvent = (i = 1, properties) => {
  return {
    id: i,
    title: `Event ${i}`,
    description: `event description ${i}`,
    project_id: null,
    start_at: DEFAULT_TEST_DATE,
    end_at: DEFAULT_TEST_DATE,
    created_at: DEFAULT_TEST_DATE,
    all_day: false,
    status: EventStatus.Pending,
    ...properties,
  };
};

export const generateListOfEvents: (count: number) => IEvent[] = (count) => {
  return [...Array(count)].map((_v, i) => generateEvent(i));
};

export const generateCustomEventList: (
  eventInfo: Partial<IEvent>[],
) => IEvent[] = (eventInfo) => {
  return eventInfo.map((taskProperties, i) => ({
    ...generateEvent(i, taskProperties),
  }));
};
