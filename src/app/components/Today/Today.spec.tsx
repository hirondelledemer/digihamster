import { render, screen, userEvent } from "@/config/utils/test-utils";
import Today, { TodayProps } from "./Today";
import { generateEvent } from "@/app/utils/mocks/event";
import { generateTask } from "@/app/utils/mocks/task";
import { DEFAULT_TEST_DATE } from "@/app/utils/mocks/date";
import { EventsContextProvider } from "@/app/utils/hooks/use-events/provider";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";
import { TasksNewContextProvider } from "@/app/utils/hooks/use-tasks-new/provider";
import { DndContext } from "@dnd-kit/core";
import { addHours } from "date-fns";
import mockAxios from "jest-mock-axios";

jest.mock("next/navigation");
jest.mock("../../utils/date/now");

describe("Today", () => {
  const EVENT = generateEvent(1);
  const EVENT_ALL_DAY = generateEvent(2);
  const TASK = generateTask(1);

  const allDayEvent = {
    allDay: true,
    title: EVENT_ALL_DAY.title,
    start: new Date(DEFAULT_TEST_DATE),
    end: addHours(new Date(DEFAULT_TEST_DATE), 1),
    resource: {
      id: EVENT_ALL_DAY.id,
      type: "event" as const,
      event: EVENT_ALL_DAY,
      tasks: [],
      journalEntries: [],
      habits: [],
      people: [],
    },
  };

  const regularEvent = {
    title: EVENT.title,
    start: new Date(DEFAULT_TEST_DATE),
    end: addHours(new Date(DEFAULT_TEST_DATE), 1),
    resource: {
      id: EVENT.id,
      type: "event" as const,
      event: EVENT,
      tasks: [],
      journalEntries: [],
      habits: [],
      people: [],
    },
  };

  const deadlineEvent = {
    title: TASK.title,
    start: new Date(DEFAULT_TEST_DATE),
    resource: {
      type: "deadline" as const,
      id: TASK.id,
      completed: false,
      task: TASK,
    },
  };

  const defaultProps: TodayProps = {
    localizer: { endOf: (date) => date, startOf: (date) => date },
    date: new Date(DEFAULT_TEST_DATE),
    backgroundEvents: [],
    events: [allDayEvent, regularEvent, deadlineEvent],
  };

  afterEach(() => {
    mockAxios.reset();
  });

  const renderComponent = (props = defaultProps) =>
    render(
      <ProjectsContextProvider>
        <TasksNewContextProvider>
          <EventsContextProvider>
            <DndContext>
              <Today {...props} />
            </DndContext>
          </EventsContextProvider>
        </TasksNewContextProvider>
      </ProjectsContextProvider>,
    );

  it("should show all events", () => {
    renderComponent();

    expect(screen.getByText(allDayEvent.title)).toBeInTheDocument();
    expect(screen.getByText(regularEvent.title)).toBeInTheDocument();
    expect(screen.getByText(deadlineEvent.title)).toBeInTheDocument();
  });

  it("should show empty state when no events", () => {
    renderComponent({ ...defaultProps, events: [] });

    expect(
      screen.getByText("There are not events today."),
    ).toBeInTheDocument();
  });

  describe("keyboard navigation", () => {
    it("should focus first event on ArrowDown", async () => {
      renderComponent();

      const entries = screen.getAllByTestId("today-event-container");
      expect(entries[0]).not.toHaveClass("bg-muted");

      await userEvent.keyboard("[ArrowDown]");

      expect(entries[0]).toHaveClass("bg-muted");
      expect(entries[1]).not.toHaveClass("bg-muted");
      expect(entries[2]).not.toHaveClass("bg-muted");
    });

    it("should advance focus to next event on subsequent ArrowDown", async () => {
      renderComponent();

      const entries = screen.getAllByTestId("today-event-container");

      await userEvent.keyboard("[ArrowDown][ArrowDown]");

      expect(entries[0]).not.toHaveClass("bg-muted");
      expect(entries[1]).toHaveClass("bg-muted");
      expect(entries[2]).not.toHaveClass("bg-muted");
    });

    it("should stop focus at first element when ArrowUp pressed repeatedly", async () => {
      renderComponent();

      const entries = screen.getAllByTestId("today-event-container");

      await userEvent.keyboard(
        "[ArrowDown][ArrowUp][ArrowUp][ArrowUp][ArrowUp][ArrowUp]",
      );

      expect(entries[0]).toHaveClass("bg-muted");
      expect(entries[1]).not.toHaveClass("bg-muted");
      expect(entries[2]).not.toHaveClass("bg-muted");
    });

    it("should stop focus at last element when ArrowDown pressed repeatedly", async () => {
      renderComponent();

      const entries = screen.getAllByTestId("today-event-container");

      await userEvent.keyboard(
        "[ArrowDown][ArrowDown][ArrowDown][ArrowDown][ArrowDown][ArrowDown]",
      );

      expect(entries[0]).not.toHaveClass("bg-muted");
      expect(entries[1]).not.toHaveClass("bg-muted");
      expect(entries[2]).toHaveClass("bg-muted");
    });
  });
});
