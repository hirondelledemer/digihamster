import { DAY } from "@/app/utils/consts/dates";
import { Habit } from "@/models/habit";

jest.mock("../../utils/date/date");

describe("Today.utils", () => {
  describe("getHabitsForToday", () => {
    const habits: Habit[] = [
      // completed today
      {
        _id: "habit1",
        title: "Habit 1",
        deleted: false,
        category: "category1",
        timesPerMonth: 2,
        updatedAt: "",
        log: [
          {
            at: 0,
            completed: true,
          },
        ],
      },
      // required every day, completed yesterday
      {
        _id: "habit1",
        title: "Habit 1",
        deleted: false,
        category: "category1",
        timesPerMonth: 28,
        updatedAt: "",
        log: [
          {
            at: 0 - DAY,
            completed: true,
          },
        ],
      },
      // required every day, completed 5 days ago
      {
        _id: "habit1",
        title: "Habit 1",
        deleted: false,
        category: "category1",
        timesPerMonth: 28,
        updatedAt: "",
        log: [
          {
            at: 0 - DAY * 5,
            completed: true,
          },
        ],
      },
      // required 5 times per week, completed
      {
        _id: "habit1",
        title: "Habit 1",
        deleted: false,
        category: "category1",
        timesPerMonth: 20,
        updatedAt: "",
        log: [],
      },
    ];
  });
});
