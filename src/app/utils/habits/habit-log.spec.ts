import { generateHabit } from "../mocks/habit";
import { HabitLog } from "../types/habit";
import { getHabitLogDate, getHabitLogForADay } from "./habit-log";

describe("habit-log", () => {
  describe("getHabitLogForADay", () => {
    const makeLog = (overrides: Partial<HabitLog> = {}): HabitLog => ({
      id: 1,
      habit_id: 1,
      log_date: "2024-03-15T00:00:00",
      completed: true,
      created_at: "2024-03-15T00:00:00",
      ...overrides,
    });

    it("should return the matching log for the given date", () => {
      const log = makeLog({ log_date: "2024-03-15T00:00:00" });
      const habit = generateHabit(1, { logs: [log] });

      const result = getHabitLogForADay(habit, new Date("2024-03-15T10:30:00"));

      expect(result).toBe(log);
    });

    it("should return undefined when habit has no logs", () => {
      const habit = generateHabit(1, { logs: [] });

      const result = getHabitLogForADay(habit, new Date("2024-03-15T10:30:00"));

      expect(result).toBeUndefined();
    });

    it("should return undefined when no log matches the date", () => {
      const log = makeLog({ log_date: "2024-03-14T00:00:00" });
      const habit = generateHabit(1, { logs: [log] });

      const result = getHabitLogForADay(habit, new Date("2024-03-15T10:30:00"));

      expect(result).toBeUndefined();
    });

    it("should match regardless of time component in date", () => {
      const log = makeLog({ log_date: "2024-03-15T18:45:00" });
      const habit = generateHabit(1, { logs: [log] });

      expect(getHabitLogForADay(habit, new Date("2024-03-15T00:00:00"))).toBe(
        log,
      );
      expect(getHabitLogForADay(habit, new Date("2024-03-15T23:59:59"))).toBe(
        log,
      );
    });

    it("should return the first matching log when multiple exist", () => {
      const log1 = makeLog({ id: 1, log_date: "2024-03-15T08:00:00" });
      const log2 = makeLog({ id: 2, log_date: "2024-03-15T20:00:00" });
      const habit = generateHabit(1, { logs: [log1, log2] });

      const result = getHabitLogForADay(habit, new Date("2024-03-15T12:00:00"));

      expect(result).toBe(log1);
    });

    it("should find the correct log among multiple dates", () => {
      const logMar14 = makeLog({ id: 1, log_date: "2024-03-14T00:00:00" });
      const logMar15 = makeLog({ id: 2, log_date: "2024-03-15T00:00:00" });
      const logMar16 = makeLog({ id: 3, log_date: "2024-03-16T00:00:00" });
      const habit = generateHabit(1, {
        logs: [logMar14, logMar15, logMar16],
      });

      const result = getHabitLogForADay(habit, new Date("2024-03-15T12:00:00"));

      expect(result).toBe(logMar15);
    });
  });

  describe("getHabitLogDate", () => {
    it("should return midnight timestamp for a date with time", () => {
      const date = new Date("2024-03-15T14:30:45");
      const expected = new Date("2024-03-15T00:00:00").setHours(0, 0, 0, 0);

      expect(getHabitLogDate(date)).toBe(expected);
    });

    it("should return same value for different times on same day", () => {
      const morning = new Date("2024-03-15T06:00:00");
      const evening = new Date("2024-03-15T22:00:00");

      expect(getHabitLogDate(morning)).toBe(getHabitLogDate(evening));
    });

    it("should return different values for different days", () => {
      const day1 = new Date("2024-03-15T10:00:00");
      const day2 = new Date("2024-03-16T10:00:00");

      expect(getHabitLogDate(day1)).not.toBe(getHabitLogDate(day2));
    });

    it("should not mutate the original date", () => {
      const date = new Date("2024-03-15T14:30:45");
      const originalTime = date.getTime();

      getHabitLogDate(date);

      expect(date.getTime()).toBe(originalTime);
    });
  });
});
