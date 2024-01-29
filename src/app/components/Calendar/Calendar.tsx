import React, {
  useEffect,
  useState,
  FunctionComponent,
  useMemo,
  useCallback,
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
import { IJournalEntry } from "@/models/entry";

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

//todo: find out how to use it?
// export const getStaticProps = (async () => {
//   console.log("jere");
//   const res = await fetch("/api/tasks/events");
//   const events = await res.json();
//   return { props: { events } };
// }) satisfies GetStaticProps<{
//   events: Events;
// }>;

// todo: test this component
export const Planner: FunctionComponent<PlannerProps> = ({ view }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [_draggedEvent, setDraggedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // todo: is this a good idea to leave {data: [...]}
      const eventsResponse = await axios.get<{ data: ITask[] }>(
        "/api/tasks/events"
      );
      const journalEntriesResponse = await axios.get<{ data: IJournalEntry[] }>(
        "/api/entries"
      );
      const events = eventsResponse.data.data.map((task) => ({
        start: task.event ? new Date(task.event.startAt!) : undefined,
        end: task.event ? new Date(task.event.endAt!) : undefined,
        title: task.title,
        allDay: task.event ? task.event.allDay : false,
        resource: {
          id: task._id,
          completed: task.completed,
        },
      }));
      const entries = journalEntriesResponse.data.data.map((entry) => ({
        start: entry.createdAt ? new Date(entry.createdAt) : undefined,
        title: entry.title,
        allDay: false,
        resource: {
          type: "journal",
          id: entry.id,
          title: entry.title,
          note: entry.note,
        },
      }));
      setEvents([...events, ...entries]);

      console.log(journalEntriesResponse);
    };

    fetchData();
  }, []);

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
        agenda: true,
        day: true,
        work_week: Today,
      },
    }),
    []
  );

  const customEvent = ({ event }: { event: Event }) => (
    <CalendarEvent event={event} />
  );

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
    console.log("updating event", event);
    axios.patch("/api/tasks/events", {
      taskId: event.resource.id,
      event: {
        allDay: isAllDay || false,
        startAt: new Date(start).getTime(),
        endAt: new Date(end).getTime(),
      },
    });
    const newEvents = [...events];
    const eventIndex = newEvents.findIndex(
      (e) => event.resource.id === e.resource.id
    );
    newEvents[eventIndex].allDay = isAllDay || false;
    newEvents[eventIndex].start = new Date(start);
    newEvents[eventIndex].end = new Date(end);
    setEvents(newEvents); // todo: make it prettier
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
    const newEvents = [...events];
    const eventIndex = newEvents.findIndex(
      (e) => event.resource.id === e.resource.id
    );
    newEvents[eventIndex].start = new Date(start);
    newEvents[eventIndex].end = new Date(end);
    setEvents(newEvents); // todo: make it prettier
  };

  const newEvent = async (event: SlotInfo) => {
    const eventName = prompt("Name:", "New Event");
    if (!!eventName && !!eventName.length) {
      console.log("creating event");
      const response = await axios.post("/api/tasks/events", {
        title: eventName,
        event: {
          allDay: event.slots.length == 1,
          startAt: new Date(event.start).getTime(),
          endAt: new Date(event.end).getTime(),
        },
      });
      console.log("response", response);
      setEvents([
        ...events,
        {
          start: new Date(event.start),
          end: new Date(event.end),
          title: eventName,
          allDay: event.slots.length == 1,
          resource: {
            id: undefined, // todo: figure out how to get an id
            completed: false,
          },
        },
      ]);
    }
  };

  const handleDragStart = (event: Event) => {
    // setDraggedEvent(event);
  };

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
      handleDragStart={handleDragStart}
      slotPropGetter={customSlotPropGetter}
      dayPropGetter={customDayPropGetter}
      slotGroupPropGetter={customGroupGetter}
    />
  );
};

export default Planner;
