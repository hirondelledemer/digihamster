import { Event } from "@/models/event";

export const generateEvent: (
  i?: number,
  properties?: Partial<Event>
) => Event = (i = 1, properties) => {
  return {
    _id: `event${i}`,
    title: `Event ${i}`,
    description: `event description ${i}`,
    completed: false,
    deleted: false,
    projectId: "project1",
    allDay: false,
    startAt: 0,
    endAt: 20000,
    tags: [],
    updatedAt: "",
    ...properties,
  };
};

export const generateListOfEvents: (count: number) => Event[] = (count) => {
  return [...Array(count)].map((_v, i) => generateEvent(i));
};

export const generateCustomEventList: (
  eventInfo: Partial<Event>[]
) => Event[] = (eventInfo) => {
  return eventInfo.map((taskProperties, i) => ({
    ...generateEvent(i, taskProperties),
  }));
};
