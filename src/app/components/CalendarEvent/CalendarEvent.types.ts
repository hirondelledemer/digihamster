import { TaskWithRelatedTasks } from "@/app/utils/types/task";
import { JournalEntry } from "@/models/entry";
import { INote } from "@/models/note";
import { TaskV2 } from "@/models/taskV2";
import { Event } from "react-big-calendar";

export interface WeatherData {
  list: {
    dt: number;
    dt_txt: string;
    main: {
      feels_like: number;
      humidity: number;
    };
    weather: {
      main: string;
      description: string;
    }[];
  }[];
}

export interface CalendarJournalEntry extends Event {
  title: string;
  resource: {
    id: string;
    type: "journal";
    note: JournalEntry;
  };
}

export interface CalendarWeatherEntry extends Event {
  title: string;
  start: Date;
  resource: {
    id: string;
    type: "weather";
    temp: number;
    weather: { main: string; description: string }[];
  };
}

export interface CalendarDeadlineEntry extends Event {
  title: string;
  start: Date;
  resource: {
    type: "deadline";
    id: string;
    completed?: boolean;
    task: TaskWithRelatedTasks;
  };
}

export interface CalendarEventEntry extends Event {
  title: string;
  start: Date;
  resource: {
    id: string;
    completed?: boolean;
    type: "event";
    description?: string;
    projectId?: string;
    tasks: TaskV2[];
  };
}

export function isCalendarEventEntry(
  event: CalendarEventType
): event is CalendarEventEntry {
  return (event as CalendarEventType).resource.type === "event";
}

export function isCalendarDeadlineEntry(
  event: CalendarEventType
): event is CalendarDeadlineEntry {
  return (event as CalendarDeadlineEntry).resource.type === "deadline";
}

export function isCalendarWeatherEntry(
  event: CalendarEventType
): event is CalendarWeatherEntry {
  return (event as CalendarWeatherEntry).resource.type === "weather";
}

export function isCalendarJournalEntry(
  event: CalendarEventType
): event is CalendarJournalEntry {
  return (event as CalendarJournalEntry).resource.type === "journal";
}

export type CalendarEventType =
  | CalendarEventEntry
  | CalendarDeadlineEntry
  | CalendarWeatherEntry
  | CalendarJournalEntry;
