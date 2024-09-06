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
  HeaderProps,
} from "react-big-calendar";
import moment from "moment";
import withDragAndDrop, {
  EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";

import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";
import "react-big-calendar/lib/css/react-big-calendar.css";
import * as dates from "date-arithmetic";
import style from "./Calendar.module.scss";
import "./Calendar.scss";

import Today from "../Today";

import CalendarToolbar from "../CalendarToolbar";
import {
  addMinutes,
  endOfDay,
  interval,
  isSameDay,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import axios from "axios";

import CalendarEvent, { CalendarEventType } from "../CalendarEvent";
// import { eventPropGetter } from "../CalendarEvent/CalendarEvent";
import useJournalEntries from "@/app/utils/hooks/use-entry";
import useEvents from "@/app/utils/hooks/use-events";
import { updateObjById } from "@/app/utils/common/update-array";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import TaskForm from "../EventForm";
import { FormValues } from "../TaskForm/TaskForm";
import { useToast } from "../ui/use-toast";
import { Event as EventType } from "@/models/event";
import useTasks from "@/app/utils/hooks/use-tasks";

export const now = () => new Date();
interface WeatherData {
  list: {
    dt: number;
    dt_txt: string;
    main: {
      feels_like: number;
      humidity: number;
    };
    weather: {
      main: string;
    }[];
  }[];
}

// todo: why is this needed
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

function isCalendarEvent(
  event: Event | CalendarEventType
): event is CalendarEventType {
  return (event as CalendarEventType).resource !== undefined;
}

// todo: test this component
// not sure how to test it with jest. maybe e2e is needed
export const Planner: FunctionComponent<PlannerProps> = ({ view }) => {
  const [eventInCreationData, setEventInCreationData] =
    useState<SlotInfo | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const weatherResponse = await axios.get<WeatherData>("/api/weather");
        console.log("weatherResponse", weatherResponse);
        setWeatherData(weatherResponse.data);
        // setDefaultProject(projectsResponse.data.defaultProject);
      } catch (err) {
        // setError(err);
        // toast({
        //   title: "Error",
        //   description: "error while getting projects",
        //   variant: "destructive",
        // });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const { data: journalEntriesData } = useJournalEntries();
  const { data: eventsData, setData: setEventsData } = useEvents();

  //todo: check editing of deadline tasks
  const { data: tasksData } = useTasks(); //todo this is fetching all the tasks. fetch only tasks with deadline

  const eventsResolved = eventsData.map<CalendarEventType>((event) => {
    return {
      start: new Date(event.startAt!),
      end: new Date(event.endAt!),
      title: event.title,
      allDay: event.allDay,
      resource: {
        id: event._id,
        completed: event.completed,
        type: "event",
        description: event.description,
        projectId: event.projectId,
      },
    };
  });

  const tasksResolved = tasksData
    .filter((task) => !!task.deadline)
    .map<CalendarEventType>((task) => ({
      start: task.deadline ? new Date(task.deadline) : undefined,
      end: task.deadline ? new Date(task.deadline) : undefined,
      title: task.title,
      allDay: false,
      resource: {
        id: task._id,
        completed: task.completed,
        type: "deadline",
        description: task.description || "",
        projectId: task.projectId || "",
      },
    }));

  const entriesResolved = journalEntriesData.map<CalendarEventType>(
    (entry) => ({
      start: new Date(entry.createdAt || 0),
      title: entry.title,
      allDay: false,
      resource: {
        type: "journal",
        id: entry._id,
        title: entry.title,
        note: entry.note,
      },
    })
  );

  const weatherResolved = (weatherData?.list || [])
    .filter(
      (entry) =>
        !entry.dt_txt.includes("03:00:00") && !entry.dt_txt.includes("00:00:00")
    )
    .map<CalendarEventType>((entry) => ({
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

  console.log(weatherResolved);
  const events = [
    ...eventsResolved,
    ...entriesResolved,
    ...tasksResolved,
    // ...weatherResolved,
  ];

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
    if (isCalendarEvent(event)) {
      return <CalendarEvent event={event} />;
    }
  };

  const cutomDate = (props: any) => {
    return <div className={style.event}>{props.label}</div>;
  };

  const moveEvent = ({
    event,
    start,
    end,
    isAllDay,
  }: EventInteractionArgs<Event>) => {
    if (isCalendarEvent(event)) {
      axios.patch("/api/events", {
        eventId: event.resource.id,
        allDay: isAllDay || false,
        startAt: new Date(start).getTime(),
        endAt: new Date(end).getTime(),
      });

      setEventsData((e) =>
        updateObjById<EventType>(e, event.resource.id, {
          allDay: isAllDay || false,
          startAt: new Date(start).getTime(),
          endAt: new Date(end).getTime(),
        })
      );
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
    axios.patch("/api/events", {
      eventId: event.resource.id,
      startAt: new Date(start).getTime(),
      endAt: new Date(end).getTime(),
    });

    setEventsData((e) =>
      updateObjById<EventType>(e, event.resource.id, {
        allDay: false,
        startAt: new Date(start).getTime(),
        endAt: new Date(end).getTime(),
      })
    );
  };

  const openEventForm = (event: SlotInfo) => {
    setEventInCreationData(event);
  };

  const newEvent = async (data: FormValues) => {
    type FieldsRequired =
      | "title"
      | "description"
      | "projectId"
      | "allDay"
      | "startAt"
      | "endAt";

    const eventData: Pick<EventType, FieldsRequired> = {
      title: data.title,
      description: data.description,
      projectId: data.project,
      allDay: eventInCreationData!.slots.length == 1,
      startAt: new Date(eventInCreationData!.start).getTime(),
      endAt: new Date(eventInCreationData!.end).getTime(),
    };
    const tempId = "temp-id";

    const tempEvent: EventType = {
      _id: tempId,
      completed: false,
      deleted: false,
      createdAt: "",
      updatedAt: "",
      tags: [],
      ...eventData,
    };
    setEventsData((e) => [...e, tempEvent]);
    setEventInCreationData(null);

    try {
      const response = await axios.post<EventType>("/api/events", eventData);
      setEventsData((e) => updateObjById<EventType>(e, tempId, response.data));
      toast({
        title: "Success",
        description: "Event has been created",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: JSON.stringify(e),
        variant: "destructive",
      });
    }
  };

  const headerComp = useCallback(
    (props: HeaderProps) => {
      const dayInterval = interval(
        startOfDay(props.date),
        endOfDay(props.date)
      );
      console.log(weatherData);
      const firstResult = weatherData?.list.find((weatherItem) => {
        console.log(
          props.date,
          startOfDay(props.date),
          endOfDay(props.date),
          new Date(weatherItem.dt_txt)
        );

        return isWithinInterval(new Date(weatherItem.dt_txt), dayInterval);
      });
      if (firstResult) {
        return (
          <div>
            {props.label}.{firstResult.main.feels_like}
          </div>
        );
      }
      return "label";
    },
    [weatherData]
  );

  if (loading) {
    return null;
  }
  // todo: test this component
  return (
    <>
      <Sheet open={!!eventInCreationData}>
        <SheetContent
          side="left"
          onCloseClick={() => setEventInCreationData(null)}
        >
          <SheetHeader>
            <SheetTitle>Create Event</SheetTitle>
            <SheetDescription>
              <TaskForm
                onSubmit={newEvent}
                showEta={false}
                showDeadline={false}
              />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <DnDropCalendar
        selectable
        draggableAccessor={(event) => event.resource.type === "event"}
        localizer={localizer}
        events={events}
        backgroundEvents={weatherResolved}
        onEventDrop={moveEvent}
        resizable
        showMultiDayTimes
        onEventResize={resizeEvent}
        onSelectSlot={openEventForm}
        defaultView={"day"}
        popup
        doShowMoreDrillDown
        formats={{ eventTimeRangeFormat: () => "" }}
        components={{
          event: customEvent,
          agenda: {
            date: cutomDate,
            time: cutomDate,
          },
          week: {
            header: headerComp,
          },
          toolbar: CalendarToolbar,
        }}
        // eventPropGetter={eventPropGetter}
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
