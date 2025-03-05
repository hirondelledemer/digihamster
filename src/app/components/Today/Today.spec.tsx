import { render, screen, userEvent } from "@/config/utils/test-utils";
import Today, { TodayProps } from "./Today";
import { generateCustomTasksList, generateTask } from "@/app/utils/mocks/task";

jest.mock("../../utils/date/date");

describe("Today", () => {
  const relatedTasks = generateCustomTasksList([
    { title: "Related Task A" },
    { title: "Related Task B" },
  ]);
  const defaultProps: TodayProps = {
    localizer: { endOf: (date) => date, startOf: (date) => date },
    date: new Date(0),
    backgroundEvents: [],
    events: [
      {
        start: new Date(0),
        end: new Date(10000),
        resource: {
          type: "event",
          id: "event1",
          completed: false,
          description: "",
          projectId: "project1",
          tasks: [],
        },
        title: "Event 1",
      },
      {
        allDay: true,
        resource: {
          type: "event",
          id: "event2",
          completed: false,
          description: "",
          projectId: "project1",
          tasks: [],
        },
        title: "Event 2",
        start: new Date(20000),
        end: new Date(30000),
      },
      {
        start: new Date(20000),
        end: new Date(30000),
        resource: {
          type: "deadline",
          id: "event3",
          completed: false,
          task: generateTask(0, { relatedTasks: relatedTasks }),
        },
        title: "Deadline event",
      },
    ],
  };
  const renderComponent = (props = defaultProps) =>
    render(<Today {...props} />);

  it("should show tasks and events", () => {
    renderComponent();

    expect(screen.getByText(defaultProps.events[0].title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.events[1].title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.events[2].title)).toBeInTheDocument();
  });

  describe("keyboard events", () => {
    it("should indicate when element is focused", async () => {
      renderComponent();

      const todayEventEntries = screen.getAllByTestId("today-event-container");
      expect(todayEventEntries[0]).not.toHaveClass("bg-muted");
      expect(todayEventEntries[1]).not.toHaveClass("bg-muted");
      expect(todayEventEntries[2]).not.toHaveClass("bg-muted");

      await userEvent.keyboard("[ArrowDown]");

      expect(todayEventEntries[0]).toHaveClass("bg-muted");
      expect(todayEventEntries[1]).not.toHaveClass("bg-muted");
      expect(todayEventEntries[2]).not.toHaveClass("bg-muted");

      await userEvent.keyboard("[ArrowDown]");

      expect(todayEventEntries[0]).not.toHaveClass("bg-muted");
      expect(todayEventEntries[1]).toHaveClass("bg-muted");
      expect(todayEventEntries[2]).not.toHaveClass("bg-muted");
    });

    it("should show related tasks on focus", async () => {
      renderComponent();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      await userEvent.keyboard("[ArrowDown]");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      await userEvent.keyboard("[ArrowDown]");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      await userEvent.keyboard("[ArrowDown]");
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("should stop focus on first element", async () => {
      renderComponent();

      const todayEventEntries = screen.getAllByTestId("today-event-container");

      expect(todayEventEntries[0]).not.toHaveClass("bg-muted");
      expect(todayEventEntries[1]).not.toHaveClass("bg-muted");
      expect(todayEventEntries[2]).not.toHaveClass("bg-muted");

      await userEvent.keyboard(
        "[ArrowDown][ArrowUp][ArrowUp][ArrowUp][ArrowUp][ArrowUp][ArrowUp]"
      );

      expect(todayEventEntries[0]).toHaveClass("bg-muted");
      expect(todayEventEntries[1]).not.toHaveClass("bg-muted");
      expect(todayEventEntries[2]).not.toHaveClass("bg-muted");
    });

    it("should stop focus on last element", async () => {
      renderComponent();

      const todayEventEntries = screen.getAllByTestId("today-event-container");

      expect(todayEventEntries[0]).not.toHaveClass("bg-muted");
      expect(todayEventEntries[1]).not.toHaveClass("bg-muted");
      expect(todayEventEntries[2]).not.toHaveClass("bg-muted");

      await userEvent.keyboard(
        "[ArrowDown][ArrowDown][ArrowDown][ArrowDown][ArrowDown][ArrowDown]"
      );

      expect(todayEventEntries[0]).not.toHaveClass("bg-muted");
      expect(todayEventEntries[1]).not.toHaveClass("bg-muted");
      expect(todayEventEntries[2]).toHaveClass("bg-muted");
    });
  });
});
