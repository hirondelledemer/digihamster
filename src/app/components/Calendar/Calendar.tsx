"use client";

import React, {
  FunctionComponent,
  useMemo,
  useCallback,
  useState,
} from "react";

import {
  Calendar,
  momentLocalizer,
  Event,
  SlotInfo,
  stringOrDate,
  View,
} from "react-big-calendar";
import moment from "moment";
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
import { updateObjById } from "@/app/utils/common/update-array";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

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

export interface PlannerProps {
  view: View;
}

// todo: test this component
export const Planner: FunctionComponent<PlannerProps> = ({ view }) => {
  const [eventFormIsOpen, setEventFormOpen] = useState<boolean>(false);
  const { data: journalEntriesData } = useJournalEntries();
  const { data: eventsData, setData: setEventsData } = useEvents();

  const eventsResolved = eventsData.map<Event>((task) => ({
    start: task.event ? new Date(task.event.startAt!) : undefined,
    end: task.event ? new Date(task.event.endAt!) : undefined,
    title: task.title,
    allDay: task.event ? task.event.allDay : false,
    resource: {
      id: task._id,
      completed: task.completed,
    },
  }));

  const entriesResolved = journalEntriesData.map<Event>((entry) => ({
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

  const customEvent = ({ event }: { event: Event }) => {
    return <CalendarEvent event={event} />;
  };

  const cutomDate = (props: any) => {
    return <div className={style.event}>{props.label}</div>;
  };

  const moveEvent = ({
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
    axios.patch("/api/tasks/events", {
      taskId: event.resource.id,
      event: {
        allDay: isAllDay || false,
        startAt: new Date(start).getTime(),
        endAt: new Date(end).getTime(),
      },
    });

    setEventsData((e) =>
      updateObjById<ITask>(e, event.resource.id, {
        event: {
          allDay: isAllDay || false,
          startAt: new Date(start).getTime(),
          endAt: new Date(end).getTime(),
        },
      })
    );
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

    setEventsData((e) =>
      updateObjById<ITask>(e, event.resource.id, {
        event: {
          allDay: false,
          startAt: new Date(start).getTime(),
          endAt: new Date(end).getTime(),
        },
      })
    );
  };

  const newEvent = async (event: SlotInfo) => {
    setEventFormOpen(true);
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
    <>
      <Sheet open={eventFormIsOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
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
        min={dates.add(
          dates.startOf(new Date(2015, 17, 1), "day"),
          +6,
          "hours"
        )}
        views={views}
        slotPropGetter={customSlotPropGetter}
        dayPropGetter={customDayPropGetter}
        slotGroupPropGetter={customGroupGetter}
      />
    </>
  );
};

export default Planner;
