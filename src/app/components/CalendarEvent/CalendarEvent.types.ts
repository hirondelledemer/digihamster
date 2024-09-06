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
    }[];
  }[];
}

export interface CalendarJournalEntry {
  title: string;
  resource: {
    id: string;
    type: "journal";
    note: string;
    title?: string;
  };
}

export interface CalendarWeatherEntry extends Event {
  title: string;
  resource: {
    id: string;
    type: "weather";
    temp: number;
    weather: { main: string }[];
  };
}

export interface CalendarDeadlineEntry extends Event {
  title: string;
  resource: {
    id: string;
    completed: boolean;
    type: "deadline";
    description?: string;
    projectId: string;
  };
}

export interface CalendarEventEntry extends Event {
  title: string;
  resource: {
    id: string;
    completed?: boolean;
    type: "event";
    description?: string;
    projectId?: string;
  };
}

export type CalendarEventType =
  | CalendarEventEntry
  | CalendarDeadlineEntry
  | CalendarWeatherEntry
  | CalendarJournalEntry;
