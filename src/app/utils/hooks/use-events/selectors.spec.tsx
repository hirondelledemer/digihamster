import { ReactNode } from "react";
import { renderHook } from "@/config/utils/test-utils";
import { EventsStateContext } from "./state-context";
import { useCurrentEvent, useEventsForDay } from "./selectors";
import { generateEvent } from "@/app/utils/mocks/event";
import { IEvent } from "../../types/event";

// the selectors work in the user's timezone, so the fixtures are built from
// local dates to keep the spec independent of the timezone it runs in
const localDate = (day: number, hours: number, minutes = 0) =>
  new Date(2020, 0, day, hours, minutes);
const backendDate = (day: number, hours: number, minutes = 0) =>
  localDate(day, hours, minutes).toISOString();

describe("use-events selectors", () => {
  const morning = generateEvent(1, {
    start_at: backendDate(2, 8),
    end_at: backendDate(2, 9),
  });
  const midday = generateEvent(2, {
    start_at: backendDate(2, 11, 30),
    end_at: backendDate(2, 12, 30),
  });
  const allDay = generateEvent(3, {
    start_at: backendDate(2, 0),
    end_at: backendDate(2, 23, 59),
    all_day: true,
  });
  const nextDay = generateEvent(4, {
    start_at: backendDate(3, 11, 30),
    end_at: backendDate(3, 12, 30),
  });

  const wrapper = (data: IEvent[]) => {
    const EventsState = ({ children }: { children: ReactNode }) => (
      <EventsStateContext.Provider value={{ data, isLoading: false }}>
        {children}
      </EventsStateContext.Provider>
    );
    return EventsState;
  };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.setSystemTime(localDate(2, 12));
  });

  describe("useEventsForDay", () => {
    it("should return only the events of that day", () => {
      const { result } = renderHook(() => useEventsForDay(localDate(2, 15)), {
        wrapper: wrapper([midday, nextDay, morning]),
      });

      expect(result.current).toEqual([morning, midday]);
    });

    it("should return the events earliest first", () => {
      const { result } = renderHook(() => useEventsForDay(localDate(2, 15)), {
        wrapper: wrapper([midday, morning]),
      });

      expect(result.current.map((event) => event.id)).toEqual([
        morning.id,
        midday.id,
      ]);
    });

    it("should return nothing when the day has no events", () => {
      const { result } = renderHook(() => useEventsForDay(localDate(5, 15)), {
        wrapper: wrapper([morning, midday, nextDay]),
      });

      expect(result.current).toEqual([]);
    });

    it("should not recompute when given a different time of the same day", () => {
      const { result, rerender } = renderHook(
        ({ date }: { date: Date }) => useEventsForDay(date),
        {
          wrapper: wrapper([morning, midday]),
          initialProps: { date: localDate(2, 9) },
        },
      );
      const first = result.current;

      rerender({ date: localDate(2, 21) });

      expect(result.current).toBe(first);
    });
  });

  describe("useCurrentEvent", () => {
    it("should return the event happening at the moment", () => {
      const { result } = renderHook(() => useCurrentEvent(), {
        wrapper: wrapper([morning, midday, nextDay]),
      });

      expect(result.current).toEqual(midday);
    });

    it("should return nothing when no event is happening", () => {
      jest.setSystemTime(localDate(2, 15));

      const { result } = renderHook(() => useCurrentEvent(), {
        wrapper: wrapper([morning, midday, nextDay]),
      });

      expect(result.current).toBeUndefined();
    });

    it("should not count all day events", () => {
      const { result } = renderHook(() => useCurrentEvent(), {
        wrapper: wrapper([allDay]),
      });

      expect(result.current).toBeUndefined();
    });

    it("should follow the clock instead of holding on to a stale event", () => {
      const { result, rerender } = renderHook(() => useCurrentEvent(), {
        wrapper: wrapper([morning, midday]),
      });
      expect(result.current).toEqual(midday);

      jest.setSystemTime(localDate(2, 15));
      rerender();

      expect(result.current).toBeUndefined();
    });
  });
});
