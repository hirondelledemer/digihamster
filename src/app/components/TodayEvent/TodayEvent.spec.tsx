import { generateCustomTasksList, generateTask } from "@/app/utils/mocks/task";
import TodayEvent, { TodayEventProps } from "./TodayEvent";
import { fireEvent, render, screen, waitFor } from "@/config/utils/test-utils";
import mockAxios from "jest-mock-axios";
import { EventsContextProvider } from "@/app/utils/hooks/use-events/provider";
import { generateEvent } from "@/app/utils/mocks/event";
import { DEFAULT_TEST_DATE } from "@/app/utils/mocks/date";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";
import { TasksNewContextProvider } from "@/app/utils/hooks/use-tasks-new/provider";
import { getTasksPath, TASKS_PATH } from "@/app/utils/hooks/use-tasks-new/api";
import { TaskStatus } from "@/app/utils/types/task";
import { addHours } from "date-fns";
import { EVENTS_PATH, getEventsPath } from "@/app/utils/hooks/use-events/api";

describe("TodayEvent", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  const EVENT = generateEvent();

  const DEFAULT_PROPS: TodayEventProps = {
    isFocused: false,
    event: {
      title: EVENT.title,
      start: new Date(DEFAULT_TEST_DATE),
      end: addHours(new Date(DEFAULT_TEST_DATE), 1),
      resource: {
        id: EVENT.id,
        type: "event",
        event: EVENT,
        tasks: [],
      },
    },
  };

  const renderComponent = (props = DEFAULT_PROPS) =>
    render(
      <ProjectsContextProvider>
        <TasksNewContextProvider>
          <EventsContextProvider>
            <TodayEvent {...props} />
          </EventsContextProvider>
        </TasksNewContextProvider>
      </ProjectsContextProvider>,
    );

  it("should move event", async () => {
    renderComponent();

    fireEvent.contextMenu(screen.getByText(DEFAULT_PROPS.event.title));
    const moveButton = await screen.findByRole("menuitem", { name: "Move" });
    fireEvent.click(moveButton);

    const tomorrowButton = await screen.findByRole("menuitem", {
      name: "To tomorrow",
    });

    fireEvent.click(tomorrowButton);

    expect(mockAxios.patch).toHaveBeenCalledWith(getEventsPath(EVENT.id), {
      status: "moved",
    });

    expect(mockAxios.post).toHaveBeenCalledWith(EVENTS_PATH, {
      all_day: false,
      created_at: "1970-01-11T10:10:10Z",
      description: "event description 1",
      end_at: "1970-01-12T10:10:10.000Z",
      project_id: null,
      start_at: "1970-01-12T10:10:10.000Z",
      status: "pending",
      title: "(Moved) Event 1",
    });
  });

  it("should move event with tasks", async () => {
    mockAxios.post.mockResolvedValueOnce({ data: { id: EVENT.id } });
    const tasks = generateCustomTasksList([
      { event_id: EVENT.id },
      { event_id: -1 }, // even there are 3 tasks, only 2 should be updated
      { event_id: EVENT.id },
    ]);

    renderComponent();

    await waitFor(() => expect(mockAxios.queue()).toHaveLength(3));

    mockAxios.mockResponseFor({ url: TASKS_PATH }, { data: tasks });

    fireEvent.contextMenu(screen.getByText(DEFAULT_PROPS.event.title));

    const moveButton = await screen.findByRole("menuitem", { name: "Move" });
    fireEvent.click(moveButton);

    const tomorrowButton = await screen.findByRole("menuitem", {
      name: "To tomorrow",
    });
    fireEvent.click(tomorrowButton);

    await waitFor(() => {
      expect(mockAxios.patch).toHaveBeenCalledTimes(3);
    });

    expect(mockAxios.patch).toHaveBeenNthCalledWith(
      1,
      getEventsPath(EVENT.id),
      {
        status: "moved",
      },
    );
    expect(mockAxios.patch).toHaveBeenNthCalledWith(
      2,
      getTasksPath(tasks[0].id),
      {
        event_id: EVENT.id,
      },
    );
    expect(mockAxios.patch).toHaveBeenNthCalledWith(
      3,
      getTasksPath(tasks[2].id),
      {
        event_id: EVENT.id,
      },
    );

    expect(mockAxios.post).toHaveBeenCalledWith(EVENTS_PATH, {
      all_day: false,
      created_at: "1970-01-11T10:10:10Z",
      description: "event description 1",
      end_at: "1970-01-12T10:10:10.000Z",
      project_id: null,
      start_at: "1970-01-12T10:10:10.000Z",
      status: "pending",
      title: "(Moved) Event 1",
    });
  });

  describe("event is a task", () => {
    const TASK = generateTask(1, { deadline: DEFAULT_TEST_DATE });
    const TASK_PROPS: TodayEventProps = {
      isFocused: false,
      event: {
        title: TASK.title,
        start: new Date(DEFAULT_TEST_DATE),
        resource: {
          completed: false,
          id: TASK.id,
          type: "deadline",
          task: TASK,
        },
      },
    };

    it("should show actions", async () => {
      renderComponent(TASK_PROPS);

      fireEvent.contextMenu(screen.getByText(TASK.title));

      const options = (await screen.findAllByRole("menuitem")).map(
        (option) => option.textContent,
      );

      expect(options).toStrictEqual([
        "Add note",
        "Complete",
        "Activate",
        "Edit",
        "Move to the list",
      ]);
    });

    it("should move back to list", async () => {
      renderComponent(TASK_PROPS);

      fireEvent.contextMenu(screen.getByText(TASK.title));

      const moveBackToListItem = await screen.findByRole("menuitem", {
        name: /move to the list/i,
      });

      fireEvent.click(moveBackToListItem);

      expect(mockAxios.patch).toHaveBeenCalledWith(getTasksPath(TASK.id), {
        deadline: null,
        status: TaskStatus.Doing,
      });
    });
  });

  describe("event is not all day", () => {
    it("should show label with time", () => {
      renderComponent();

      expect(screen.getByText("10:10-11:10")).toBeInTheDocument();
    });

    it("should show title", () => {
      renderComponent();

      expect(screen.getByText(DEFAULT_PROPS.event.title)).toBeInTheDocument();
    });

    it("should show actions", async () => {
      renderComponent();
      fireEvent.contextMenu(screen.getByText(DEFAULT_PROPS.event.title));

      const options = (await screen.findAllByRole("menuitem")).map(
        (option) => option.textContent,
      );

      expect(options).toStrictEqual([
        "Complete",
        "Cancel",
        "Move",
        "Delete",
        "Edit",
      ]);
    });
  });
});
