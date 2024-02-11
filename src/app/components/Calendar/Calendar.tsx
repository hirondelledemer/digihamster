"use client";

import React, { FunctionComponent, useMemo, useCallback } from "react";

import {
  Calendar,
  momentLocalizer,
  Event,
  SlotInfo,
  stringOrDate,
  View,
} from "react-big-calendar";
import moment from "moment";
import { filter } from "remeda";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";
import "react-big-calendar/lib/css/react-big-calendar.css";
import * as dates from "date-arithmetic";
import style from "./Calendar.module.scss";

import Today from "../Today";

import CalendarToolbar from "../CalendarToolbar";
import { isSameDay } from "date-fns";
import axios from "axios";

import CalendarEvent from "../CalendarEvent";
import { eventPropGetter } from "../CalendarEvent/CalendarEvent";
import { ITask } from "@/models/task";
import useJournalEntries from "@/app/utils/hooks/use-entry";
import useEvents from "@/app/utils/hooks/use-events";

export const now = () => new Date();

// todo: what is this?
moment.locale("ko", {
  week: {
    dow: 1,
    doy: 1,
  },
});
const DnDropCalendar = withDragAndDrop(Calendar as any);
const localizer = momentLocalizer(moment); // or glo

interface PlannerProps {
  view: View;
}

// todo: test this component
export const Planner: FunctionComponent<PlannerProps> = ({ view }) => {
  const { data: journalEntriesData } = useJournalEntries();
  const { data: eventsData, setData: setEventsData } = useEvents();

  const eventsResolved = eventsData.map((task) => ({
    start: task.event ? new Date(task.event.startAt!) : undefined,
    end: task.event ? new Date(task.event.endAt!) : undefined,
    title: task.title,
    allDay: task.event ? task.event.allDay : false,
    resource: {
      id: task._id,
      completed: task.completed,
    },
  }));

  const entriesResolved = journalEntriesData.map((entry) => ({
    start: new Date(entry.createdAt),
    title: entry.title,
    allDay: false,
    resource: {
      type: "journal",
      id: entry._id,
      title: entry.title,
      note: entry.note,
    },
  }));

  const events = [...eventsResolved, ...entriesResolved];

  const customSlotPropGetter = useCallback(
    () => ({
      className: style.slot,
    }),
    []
  );

  const customDayPropGetter = useCallback((date: Date) => {
    if (isSameDay(date, now())) {
      return {
        className: style.today,
      };
    }

    return {
      className: style.day,
    };
  }, []);

  const customGroupGetter = useCallback(
    () => ({
      className: style.group,
    }),
    []
  );

  const { views } = useMemo(
    () => ({
      defaultDate: new Date(),
      views: {
        month: true,
        week: true,
        agenda: Today,
        day: true,
      },
    }),
    []
  );

  const handleDeleteEvent = (eventId: string) => {
    setEventsData((e) => {
      return filter<ITask>((event) => event._id !== eventId)(e);
    });
  };

  const customEvent = ({ event }: { event: Event }) => {
    return <CalendarEvent event={event} onDelete={handleDeleteEvent} />;
  };

  const cutomDate = (props: any) => {
    return <div className={style.event}>{props.label}</div>;
  };

  const moveEvent = async ({
    event,
    start,
    end,
    isAllDay,
  }: {
    event: Event;
    start: stringOrDate;
    end: stringOrDate;
    isAllDay?: boolean;
  }) => {
    await axios.patch("/api/tasks/events", {
      taskId: event.resource.id,
      event: {
        allDay: isAllDay || false,
        startAt: new Date(start).getTime(),
        endAt: new Date(end).getTime(),
      },
    });

    setEventsData((e) => {
      const newEvents = [...e];
      const eventIndex = newEvents.findIndex(
        (e) => event.resource.id === e._id
      );
      const updatedEvent = newEvents[eventIndex];
      if (updatedEvent.event) {
        updatedEvent.event.allDay = isAllDay || false;
        updatedEvent.event.startAt = new Date(start).getTime();
        updatedEvent.event.endAt = new Date(end).getTime();
      }
      return newEvents;
    });
  };

  const resizeEvent = ({
    event,
    start,
    end,
  }: {
    event: Event;
    start: stringOrDate;
    end: stringOrDate;
  }) => {
    axios.patch("/api/tasks/events", {
      taskId: event.resource.id,
      event: {
        startAt: new Date(start).getTime(),
        endAt: new Date(end).getTime(),
      },
    });
    setEventsData((e) => {
      const newEvents = [...e];
      const eventIndex = newEvents.findIndex(
        (e) => event.resource.id === e._id
      );
      const updatedEvent = newEvents[eventIndex];
      if (updatedEvent.event) {
        updatedEvent.event.startAt = new Date(start).getTime();
        updatedEvent.event.endAt = new Date(end).getTime();
      }
      return newEvents;
    });
  };

  const newEvent = async (event: SlotInfo) => {
    const eventName = prompt("Name:", "New Event");
    if (!!eventName && !!eventName.length) {
      const response = await axios.post<ITask>("/api/tasks/events", {
        title: eventName,
        event: {
          allDay: event.slots.length == 1,
          startAt: new Date(event.start).getTime(),
          endAt: new Date(event.end).getTime(),
        },
      });

      setEventsData((e) => [...e, response.data]);
    }
  };

  // todo: test this component
  return (
    <DnDropCalendar
      selectable
      localizer={localizer}
      events={events}
      onEventDrop={moveEvent}
      resizable
      showMultiDayTimes
      onEventResize={resizeEvent}
      onSelectSlot={newEvent}
      defaultView={view}
      popup
      formats={{ eventTimeRangeFormat: () => "" }}
      components={{
        event: customEvent,
        agenda: {
          date: cutomDate,
          time: cutomDate,
        },
        toolbar: CalendarToolbar,
      }}
      eventPropGetter={eventPropGetter}
      min={dates.add(dates.startOf(new Date(2015, 17, 1), "day"), +6, "hours")}
      views={views}
      slotPropGetter={customSlotPropGetter}
      dayPropGetter={customDayPropGetter}
      slotGroupPropGetter={customGroupGetter}
    />
  );
};

export default Planner;
