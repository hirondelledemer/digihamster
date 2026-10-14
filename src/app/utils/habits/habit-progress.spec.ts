import { addDays, subDays } from "date-fns";
import { generateHabit } from "../mocks/habit";
import { HabitLog } from "../types/habit";
import { getHabitWindow } from "./habit-progress";

const AT = new Date("2026-03-20T12:00:00.000Z");

const log = (date: Date, completed = true): HabitLog => ({
  id: date.valueOf(),
  habit_id: 1,
  log_date: date.toISOString(),
  completed,
  created_at: date.toISOString(),
});

const habitWith = (logs: HabitLog[], times_per_month = 4) =>
  generateHabit(1, { logs, times_per_month });

describe("getHabitWindow", () => {
  it("counts only completed logs inside the look-back window", () => {
    const habit = habitWith([
      log(subDays(AT, 2)),
      log(subDays(AT, 10)),
      log(subDays(AT, 40)), // older than the window
      log(subDays(AT, 3), false), // logged but not completed
    ]);

    expect(getHabitWindow({ habit, at: AT }).done).toBe(2);
  });

  it("does not let a scheduled occurrence inflate `done`", () => {
    const habit = habitWith([log(subDays(AT, 2))]);

    const window = getHabitWindow({
      habit,
      scheduled: [addDays(AT, 1), addDays(AT, 3)],
      at: AT,
    });

    expect(window.done).toBe(1);
    expect(window.committed).toBe(2);
    expect(window.donePercent).toBe(25);
    expect(window.coveredPercent).toBe(75);
  });

  it("ignores occurrences scheduled beyond the look-ahead horizon", () => {
    const habit = habitWith([]);

    const window = getHabitWindow({
      habit,
      scheduled: [addDays(AT, 3), addDays(AT, 30)],
      at: AT,
      lookAheadDays: 7,
    });

    expect(window.committed).toBe(1);
  });

  it("does not count an occurrence that is already logged as done", () => {
    const sameDay = addDays(AT, 1);
    const habit = habitWith([log(sameDay)]);

    const window = getHabitWindow({ habit, scheduled: [sameDay], at: AT });

    expect(window.committed).toBe(0);
  });

  describe("status", () => {
    it("is `drifting` when behind with nothing scheduled", () => {
      const window = getHabitWindow({ habit: habitWith([]), at: AT });

      expect(window.status).toBe("drifting");
      expect(window.gap).toBe(4);
    });

    it("is `at_risk` when the plan helps but does not close the gap", () => {
      const window = getHabitWindow({
        habit: habitWith([]),
        scheduled: [addDays(AT, 1)],
        at: AT,
      });

      expect(window.status).toBe("at_risk");
      expect(window.gap).toBe(3);
    });

    it("is `covered` when the plan closes the gap", () => {
      const window = getHabitWindow({
        habit: habitWith([log(subDays(AT, 1)), log(subDays(AT, 5))]),
        scheduled: [addDays(AT, 1), addDays(AT, 2)],
        at: AT,
      });

      expect(window.status).toBe("covered");
      expect(window.gap).toBe(0);
      expect(window.donePercent).toBe(50);
    });

    it("is `on_track` once the target is actually met", () => {
      const window = getHabitWindow({
        habit: habitWith([
          log(subDays(AT, 1)),
          log(subDays(AT, 5)),
          log(subDays(AT, 9)),
          log(subDays(AT, 13)),
        ]),
        at: AT,
      });

      expect(window.status).toBe("on_track");
      expect(window.donePercent).toBe(100);
    });
  });

  it("does not divide by a zero target", () => {
    const window = getHabitWindow({ habit: habitWith([], 0), at: AT });

    expect(window.donePercent).toBe(0);
    expect(window.coveredPercent).toBe(0);
  });
});
