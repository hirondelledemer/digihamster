import { render, screen } from "@/config/utils/test-utils";
import DailyProgress, { DailyProgressProps } from "./DailyProgress";
import {
  wrapWithEntriesProvider,
  wrapWithHabitsProvider,
  wrapWithTasksProvider,
} from "@/app/utils/tests/wraps";
import { generateCustomHabitList } from "@/app/utils/mocks/habit";
import { generateCustomTasksList } from "@/app/utils/mocks/task";
import { DAY } from "@/app/utils/consts/dates";
import { generateCustomListOfJournalEntries } from "@/app/utils/mocks/journal-entry";

jest.mock("../../utils/date/date");

describe("DailyProgress", () => {
  const defaultProps: DailyProgressProps = {};
  const renderComponent = (props = defaultProps) =>
    render(
      wrapWithEntriesProvider(
        wrapWithTasksProvider(
          wrapWithHabitsProvider(<DailyProgress {...props} />, {
            data: generateCustomHabitList([
              { log: [{ at: 0, completed: true }] },
              { log: [{ at: 0, completed: true }] },
              { log: [{ at: 0 - DAY * 3, completed: true }] },
            ]),
          }),
          {
            data: generateCustomTasksList([
              {
                completedAt: 0 - DAY,
              },
              {
                completedAt: 0 - DAY,
              },
              {
                completedAt: 0 - DAY * 3,
              },
            ]),
          }
        ),
        {
          data: generateCustomListOfJournalEntries([
            { createdAt: new Date(0 - DAY * 2).toString() },
            { createdAt: new Date(0 - DAY * 2).toString() },
            { createdAt: new Date(0 - DAY * 3).toString() },
          ]),
        }
      )
    );

  it("should render DailyProgress", () => {
    renderComponent();
    const bars = screen.getAllByTestId("bar-testid");
    const barHeights = bars.map((bar) => bar.style.height);

    expect(barHeights).toStrictEqual([
      "1px",
      "1px",
      "1px",
      "1px",
      "9px", // 1 task, 1 habit, 1 journal entry
      "6px", // 2 entries completed
      "6px", // 2 tasks completed
      "6px", // 2 habits completed
    ]);
  });
});
