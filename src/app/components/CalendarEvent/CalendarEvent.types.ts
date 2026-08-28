import { IEvent } from "@/app/utils/types/event";
import { IJournalEntry } from "@/app/utils/types/journal-entry";
import { ITask } from "@/app/utils/types/task";
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
  start: Date;
  resource: {
    id: number;
    type: "journal";
    note: IJournalEntry;
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
    id: number;
    completed?: boolean;
    task: ITask;
  };
}

export interface CalendarEventEntry extends Event {
  title: string;
  start: Date;
  resource: {
    id: number;
    type: "event";
    event: IEvent;
    tasks: ITask[];
    journalEntries: IJournalEntry[];
  };
}

export function isCalendarEventEntry(
  event: CalendarEventType,
): event is CalendarEventEntry {
  return (event as CalendarEventType).resource.type === "event";
}

export function isCalendarDeadlineEntry(
  event: CalendarEventType,
): event is CalendarDeadlineEntry {
  return (event as CalendarDeadlineEntry).resource.type === "deadline";
}

export function isCalendarWeatherEntry(
  event: CalendarEventType,
): event is CalendarWeatherEntry {
  return (event as CalendarWeatherEntry).resource.type === "weather";
}

export function isCalendarJournalEntry(
  event: CalendarEventType,
): event is CalendarJournalEntry {
  return (event as CalendarJournalEntry).resource.type === "journal";
}

export type CalendarEventType =
  | CalendarEventEntry
  | CalendarDeadlineEntry
  | CalendarWeatherEntry
  | CalendarJournalEntry;
