"use client";

import React, {
  FunctionComponent,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from "react";

import {
  Calendar,
  momentLocalizer,
  SlotInfo,
  stringOrDate,
  View,
  Event,
} from "react-big-calendar";
import moment from "moment";
import withDragAndDrop, {
  EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";

import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";
import "react-big-calendar/lib/css/react-big-calendar.css";
import * as dates from "date-arithmetic";
import "./Calendar.scss";

import Today from "../Today";

import CalendarToolbar from "../CalendarToolbar";
import {
  addHours,
  addMinutes,
  interval,
  isSameDay,
  isWithinInterval,
} from "date-fns";

import CalendarEvent, { CalendarEventType } from "../CalendarEvent";
import { useEntriesState } from "@/app/utils/hooks/use-entry/state-context";

import {
  CalendarDeadlineEntry,
  CalendarEventEntry,
  CalendarJournalEntry,
  CalendarWeatherEntry,
  isCalendarDeadlineEntry,
  isCalendarEventEntry,
  isCalendarWeatherEntry,
  WeatherData,
} from "../CalendarEvent/CalendarEvent.types";
import CalendarWeatherEvent from "../CalendarWeatherEvent";
import CalendarSlot from "../CalendarSlot";

import useCycle from "@/app/utils/hooks/use-cycle";
import EventTaskFormModal from "../EventTaskFormModal";
import { useEventsState } from "@/app/utils/hooks/use-events/state-context";
import { useEventsActions } from "@/app/utils/hooks/use-events/actions-context";
import { useCalendarDate } from "../../utils/hooks/use-calendar-date";
import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import { parseBackendDate, toBackendDateTime } from "#utils/date";
import { useTasksNewState } from "@/app/utils/hooks/use-tasks-new/state-context";
import { useTasksNewActions } from "@/app/utils/hooks/use-tasks-new/actions-context";
import axios from "axios";

export const now = () => new Date();

// todo: why is this needed
moment.locale("ko", {
  week: {
    dow: 1,
    doy: 1,
  },
});
const DnDropCalendar = withDragAndDrop<CalendarEventType>(Calendar) as any;
const localizer = momentLocalizer(moment); // or glo

export interface PlannerProps {
  view: View;
}

// todo: test this component
// not sure how to test it with jest. maybe e2e is needed
export const Planner: FunctionComponent<PlannerProps> = ({ view }) => {
  const [eventInCreationData, setEventInCreationData] =
    useState<SlotInfo | null>(null);

  const { selectedDate, setSelectedDate } = useCalendarDate();

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const [_isLoading, setLoading] = useState<boolean>(false);

  // todo: redo the wheather api
  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const weatherResponse = await axios.get<WeatherData>("/api/weather");
        setWeatherData(weatherResponse.data);
      } catch (error: unknown) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const { data: journalEntriesData } = useEntriesState();
  const { data: eventsData } = useEventsState();
  const { update: updateEvent } = useEventsActions();
  const { data: cycleData } = useCycle();
  const { isLoading: projectsLoading } = useProjectsState();

  //todo: check editing of deadline tasks
  const { data: tasksData } = useTasksNewState(); //todo this is fetching all the tasks. fetch only tasks with deadline
  const { updateTask: editTask } = useTasksNewActions(); //todo this is fetching all the tasks. fetch only tasks with deadline

  const eventsResolved = eventsData.map<CalendarEventEntry>((event) => {
    return {
      start: new Date(event.start_at!),
      end: new Date(event.end_at!),
      title: event.title,
      allDay: event.all_day,
      resource: {
        id: event.id,
        type: "event",
        event,
        tasks: tasksData.filter((t) => t.event_id === event.id),
      },
    };
  });

  const tasksResolved = tasksData
    .filter((task) => !!task.deadline)
    .map<CalendarDeadlineEntry>((task) => ({
      start: task.deadline ? parseBackendDate(task.deadline) : new Date(),
      end: task.deadline ? addHours(new Date(task.deadline), 1) : undefined,
      title: task.title,
      allDay: false,
      resource: {
        id: task.id,
        completed: task.status === "done",
        type: "deadline",
        task,
      },
    }));

  const entriesResolved = journalEntriesData.map<CalendarJournalEntry>(
    (entry) => ({
      start: new Date(entry.created_at || 0),
      title: entry.title,
      allDay: false,
      resource: {
        type: "journal",
        note: entry,
        id: entry.id?.toString(),
      },
    }),
  );

  const weatherResolved = (weatherData?.list || [])
    .filter(
      (entry) =>
        !entry.dt_txt.includes("03:00:00") &&
        !entry.dt_txt.includes("00:00:00") &&
        !entry.dt_txt.includes("06:00:00"),
    )
    .map<CalendarWeatherEntry>((entry) => ({
      start: new Date(entry.dt_txt),
      end: addMinutes(new Date(entry.dt_txt), 1),
      title:
        entry.main.feels_like.toString() +
        " " +
        entry.weather.map((w) => w.main).join(", "),
      allDay: false,
      resource: {
        type: "weather",
        id: entry.dt.toString(),
        temp: entry.main.feels_like,
        weather: entry.weather,
      },
    }));

  const events = [...eventsResolved, ...entriesResolved, ...tasksResolved];

  const customDayPropGetter = useCallback(
    (date: Date) => {
      const dayIsCycleDay =
        cycleData &&
        !!cycleData
          .filter((i) => !i.is_predicted)
          .filter((i) => {
            return isWithinInterval(date, interval(i.start_date, i.end_date));
          }).length;
      const dayIsFutureCycleDay =
        cycleData &&
        !!cycleData
          .filter((i) => i.is_predicted)
          .filter((i) => {
            return isWithinInterval(date, interval(i.start_date, i.end_date));
          }).length;

      cycleData?.filter((i) =>
        isWithinInterval(date, interval(i.start_date, i.end_date)),
      );

      if (view === "day") {
        return {
          style: {
            backgroundColor: "transparent",
          },
        };
      }

      if (isSameDay(date, now())) {
        return {
          style: {
            backgroundColor: dayIsCycleDay ? " #340411" : "#1b1614",
          },
        };
      }

      return {
        style: {
          background: dayIsFutureCycleDay
            ? "repeating-linear-gradient(45deg, #340411, #340411 5px, transparent 5px, transparent 10px)"
            : "",
          backgroundColor: dayIsCycleDay ? "#1C0209" : "",
        },
      };
    },
    [cycleData, view],
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
    [],
  );

  const customEvent = ({ event }: { event: CalendarEventType }) => {
    if (isCalendarEventEntry(event)) {
      return <CalendarEvent event={event} />;
    }
    if (isCalendarWeatherEntry(event)) {
      return <CalendarWeatherEvent event={event} className="mt-1" />;
    }
  };

  const moveEvent = ({
    event,
    start,
    end,
    isAllDay,
  }: EventInteractionArgs<CalendarEventType>) => {
    if (isCalendarEventEntry(event)) {
      updateEvent(event.resource.id, {
        all_day: isAllDay || false,
        start_at: toBackendDateTime(new Date(start)),
        end_at: toBackendDateTime(new Date(end)),
      });
    } else if (isCalendarDeadlineEntry(event)) {
      editTask(event.resource.id, {
        deadline: toBackendDateTime(new Date(start)),
      });
    }
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
    updateEvent(event.resource.id, {
      all_day: false,
      start_at: toBackendDateTime(new Date(start)),
      end_at: toBackendDateTime(new Date(end)),
    });
  };

  const openEventForm = (event: SlotInfo) => {
    setEventInCreationData(event);
  };

  if (projectsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <EventTaskFormModal
        open={!!eventInCreationData}
        onClose={() => setEventInCreationData(null)}
        onDone={() => setEventInCreationData(null)}
        initialValues={{
          startAt: eventInCreationData
            ? eventInCreationData!.start.toString()
            : "",
          endAt: eventInCreationData ? eventInCreationData!.end.toString() : "",
        }}
      />
      <DnDropCalendar
        date={selectedDate}
        onNavigate={setSelectedDate}
        selectable
        localizer={localizer}
        resizableAccessor={isCalendarEventEntry}
        events={events}
        backgroundEvents={weatherResolved}
        onEventDrop={moveEvent}
        resizable
        showMultiDayTimes
        onEventResize={resizeEvent}
        onSelectSlot={openEventForm}
        defaultView={view}
        popup
        doShowMoreDrillDown
        formats={{ eventTimeRangeFormat: () => "" }}
        components={{
          event: customEvent,
          timeSlotWrapper: CalendarSlot, // TODO: this time slot is special because it is allow events to be dragged in.
          toolbar: CalendarToolbar,
        }}
        min={dates.add(
          dates.startOf(new Date(2015, 17, 1), "day"),
          +8,
          "hours",
        )}
        views={views}
        dayPropGetter={customDayPropGetter} // TODO: this is special because it colors days depending on the cycle and wheather day is today or not.
      />
    </>
  );
};

export default Planner;
