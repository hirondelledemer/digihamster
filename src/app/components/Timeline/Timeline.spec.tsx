import { render, screen, userEvent } from "@/config/utils/test-utils";
import Timeline, { TimelineProps } from "./Timeline";
import { getTimelineTestkit } from "./Timeline.testkit";
import {
  wrapWithEntriesProvider,
  wrapWithEventProvider,
  wrapWithTasksProvider,
} from "@/app/utils/tests/wraps";
import { generateCustomTasksList } from "@/app/utils/mocks/task";
import { DAY, WEEK } from "@/app/utils/consts/dates";
import { generateCustomEventList } from "@/app/utils/mocks/event";
import { generateCustomListOfJournalEntries } from "@/app/utils/mocks/journal-entry";
jest.mock("../../utils/date/date");

const getThisWeekButton = () =>
  screen.getByRole("radio", { name: /this week/i });
const get2WeeksButton = () => screen.getByRole("radio", { name: /2 weeks/i });
const getMonthButton = () => screen.getByRole("radio", { name: /month/i });

describe("Timeline", () => {
  const defaultProps: TimelineProps = {};
  const defaultTasks = generateCustomTasksList([
    {
      completedAt: 0 - WEEK - DAY,
    },
    {
      completedAt: 0 - DAY,
      estimate: 1,
    },
  ]);
  const defaultEvents = generateCustomEventList([
    {
      startAt: 0 - DAY,
      endAt: 0 - DAY + 20000,
    },
    {
      startAt: 0 - DAY - WEEK,
      endAt: 0 - DAY - WEEK + 20000,
    },
  ]);
  const defaultEntires = generateCustomListOfJournalEntries([
    {
      createdAt: new Date(0 - DAY).toString(),
      updatedAt: new Date(0 - DAY).toString(),
    },
    {
      createdAt: new Date(0 - DAY - WEEK).toString(),
      updatedAt: new Date(0 - DAY - WEEK).toString(),
    },
  ]);

  const renderComponent = (props = defaultProps) =>
    getTimelineTestkit(
      render(
        wrapWithTasksProvider(
          wrapWithEventProvider(
            wrapWithEntriesProvider(<Timeline {...props} />, {
              data: defaultEntires,
            }),
            {
              data: defaultEvents,
            }
          ),
          {
            data: defaultTasks,
          }
        )
      ).container
    );

  it("should render Timeline", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });

  describe("initial load", () => {
    it("should timeline buttons", () => {
      renderComponent();
      expect(getThisWeekButton()).toBeInTheDocument();
      expect(get2WeeksButton()).toBeInTheDocument();
      expect(getMonthButton()).toBeInTheDocument();
    });
  });

  it('should check "this week" by default', () => {
    renderComponent();
    expect(getThisWeekButton().getAttribute("data-state")).toBe("on");
    expect(get2WeeksButton().getAttribute("data-state")).toBe("off");
    expect(getMonthButton().getAttribute("data-state")).toBe("off");
  });

  it("should filter tasks, events, journal entries completed this week", () => {
    renderComponent();
    const taskEntries = screen.getAllByTestId("task-entry");
    const eventEntries = screen.getAllByTestId("event-entry");
    const journalEntries = screen.getAllByTestId("journal-entry");

    expect(taskEntries.length).toBe(1);
    expect(eventEntries.length).toBe(1);
    expect(journalEntries.length).toBe(1);

    expect(taskEntries[0].textContent).toBe("We, 00:00Task 1");
    expect(eventEntries[0].textContent).toBe("We, 00:00Event 0");
    expect(journalEntries[0].textContent).toBe("We, 00:00entry 0 note");
  });

  describe("changing period", () => {
    it("should select different button", async () => {
      renderComponent();
      await userEvent.click(get2WeeksButton());
      expect(getThisWeekButton().getAttribute("data-state")).toBe("off");
      expect(get2WeeksButton().getAttribute("data-state")).toBe("on");
      expect(getMonthButton().getAttribute("data-state")).toBe("off");
    });

    it("should filter tasks, events, journal entries completed last two weeks", async () => {
      renderComponent();
      await userEvent.click(get2WeeksButton());
      const taskEntries = screen.getAllByTestId("task-entry");
      const eventEntries = screen.getAllByTestId("event-entry");
      const journalEntries = screen.getAllByTestId("journal-entry");

      expect(taskEntries.length).toBe(2);
      expect(eventEntries.length).toBe(2);
      expect(journalEntries.length).toBe(2);

      expect(taskEntries[0].textContent).toBe("We, 00:00Task 0");
      expect(taskEntries[1].textContent).toBe("We, 00:00Task 1");
      expect(eventEntries[0].textContent).toBe("We, 00:00Event 1");
      expect(eventEntries[1].textContent).toBe("We, 00:00Event 0");
      expect(journalEntries[0].textContent).toBe("We, 00:00entry 1 note");
      expect(journalEntries[1].textContent).toBe("We, 00:00entry 0 note");
    });
  });
});
