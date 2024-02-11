import React from "react";
import { Navigate, Event, View } from "react-big-calendar";
import * as dates from "date-arithmetic";
import TodayEvent from "../TodayEvent";
import { IconChevronDown } from "@tabler/icons-react";
import MinimalNote from "../MinimalNote";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { cn } from "../utils";
import { lightFormat } from "date-fns";

// todo: make this component server side
export const todayEvent = "Today-today-event-test-id";
export const upcomingEventsTestId = "Today-upcoming-events-test-id";
export interface TodayProps {
  testId?: string;
  events: Event[];
  date: Date;
  localizer: {
    endOf: (date: Date, view: View) => Date;
    startOf: (date: Date, view: View) => Date;
  };
}

function Today({ localizer, events, date }: TodayProps) {
  const max = localizer.endOf(date, "day");
  const min = localizer.startOf(date, "day");

  const sortByTime = (event1: Event, event2: Event) =>
    (event1.start?.getTime() || 0) - (event2.start?.getTime() || 0);

  const upcomingEvents = events.filter((event: Event) =>
    event.start ? dates.gt(event.start, max, "day") : false
  );

  const allDayEvents = events.filter((event: Event) =>
    event.allDay && event.start
      ? dates.inRange(event.start, min, max, "day")
      : false
  );

  const regularEvents = events.filter((event: Event) =>
    !event.allDay && event.start
      ? dates.inRange(event.start, min, max, "day")
      : false
  );

  const getTodayEventComp = (event: Event) => {
    return event.resource.type === "journal" ? (
      <div
        key={event.resource.id}
        className={cn([
          "grid grid-cols-3 gap-4 italic mt-4 text-muted-foreground",
        ])}
      >
        <div>{event.start ? lightFormat(event.start, "H:mm") : "???"}</div>
        <div className="col-span-2">
          <Collapsible>
            <CollapsibleTrigger className="italic">
              {event.title || "-"}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <MinimalNote note={event.resource.note} />
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    ) : (
      <TodayEvent
        key={event.resource.id}
        testId={todayEvent}
        start={event.start}
        end={event.end}
        allDay={event.allDay}
        title={event.title || ""}
        id={event.resource.id}
        completed={event.resource.completed}
      />
    );
  };

  return (
    <>
      <div className="flex flex-col">
        {!allDayEvents.length &&
          !regularEvents.length &&
          "There are not events today."}
        {allDayEvents.map(getTodayEventComp)}
        {regularEvents.sort(sortByTime).map(getTodayEventComp)}

        {!!upcomingEvents.length && (
          <Collapsible>
            <CollapsibleTrigger>
              <div className="flex mt-6">
                Upcoming Events
                <IconChevronDown />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent data-testid={upcomingEventsTestId}>
              {upcomingEvents.sort(sortByTime).map((event: Event) => (
                <TodayEvent
                  key={event.resource.id}
                  testId={todayEvent}
                  start={event.start}
                  end={event.end}
                  allDay={event.allDay}
                  title={event.title || ""}
                  id={event.resource.id}
                  showDate
                  completed={event.resource.completed}
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </>
  );
}

Today.range = (date: any, { localizer }: any) => {
  const start = date;
  const end = dates.add(start, 0, "day");

  let current = start;
  const range = [];

  while (localizer.lte(current, end, "day")) {
    range.push(current);
    current = localizer.add(current, 1, "day");
  }

  return range;
};

Today.navigate = (date: Date, action: string, { localizer }: any) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return localizer.add(date, -1, "day");

    case Navigate.NEXT:
      return localizer.add(date, 1, "day");

    default:
      return date;
  }
};

Today.title = (date: Date) => {
  return `${date.toLocaleDateString()}`;
};

export default Today;
