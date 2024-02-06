import React, { useState } from "react";
import { Navigate, Event, View } from "react-big-calendar";
import * as dates from "date-arithmetic";
import TodayEvent from "../TodayEvent";
import { Button, Collapse, Space, Spoiler, Stack, Text } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import MinimalNote from "../MinimalNote";

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
  const [upcomingEventsOpened, toggleUpcomingEvents] = useState<boolean>(false);

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
      <Spoiler
        key={event.resource.id}
        maxHeight={30}
        hideLabel="hide"
        showLabel="show"
        data-testid={upcomingEventsTestId}
      >
        <MinimalNote note={event.resource.note} />
      </Spoiler>
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
      <Space h="xl" />
      <Stack gap="xs">
        {!allDayEvents.length && !regularEvents.length && (
          <Text>There are not events today.</Text>
        )}
        {allDayEvents.map(getTodayEventComp)}
        {regularEvents.sort(sortByTime).map(getTodayEventComp)}
        {!!upcomingEvents.length && (
          <Button
            rightSection={<IconChevronDown />}
            variant="subtle"
            color="dark"
            radius="xs"
            size="xs"
            onClick={() => toggleUpcomingEvents((opened: boolean) => !opened)}
          >
            Upcoming Events
          </Button>
        )}
        <Collapse in={upcomingEventsOpened}>
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
        </Collapse>
      </Stack>
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
