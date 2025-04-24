import { TagsContext } from "@/app/utils/hooks/use-tags";
import TaskCard, { cardTestId, TaskCardProps } from "./TaskCard";
import { TasksContext, TasksContextValues } from "@/app/utils/hooks/use-tasks";
import { generateTask } from "@/app/utils/mocks/task";
import {
  render,
  screen,
  userEvent,
  fireEvent,
} from "@/config/utils/test-utils";

import mockAxios from "jest-mock-axios";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";
import { generateListOfProjects } from "@/app/utils/mocks/project";
import { taskFormTestId } from "../TaskForm/TaskForm";

jest.mock("../../utils/date/date");
jest.mock("next/navigation");

// todo redo the test without testkit
describe("TaskCard", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  const defaultTask = generateTask();
  const defaultProps: TaskCardProps = {
    task: defaultTask,
    dragId: "drag-id",
  };

  const defaultTasksContextValues: TasksContextValues = {
    data: [],
    loading: false,
    setData: jest.fn(),
  };

  const renderComponent = (
    props = defaultProps,
    tasksContextValues = defaultTasksContextValues
  ) =>
    render(
      <ProjectsContextProvider>
        <TagsContext.Provider
          value={{
            data: [
              {
                _id: "tag1",
                title: "Tag 1",
                deleted: false,
                color: "color1",
              },
              {
                _id: "tag2",
                title: "Tag 2",
                deleted: false,
                color: "color2",
              },
            ],
            loading: false,
            setData: jest.fn(),
          }}
        >
          <TasksContext.Provider value={tasksContextValues}>
            <TaskCard {...props} />
          </TasksContext.Provider>
        </TagsContext.Provider>
      </ProjectsContextProvider>
    );

  const openContextMenu = () => {
    const title = screen.getByTestId("TaskCard-title-testid");
    fireEvent.contextMenu(title);
  };

  it("shows task title, project name, description, tags", async () => {
    const mockData = {
      projects: generateListOfProjects(3),
      defaultProject: null,
    };
    mockAxios.get.mockResolvedValue({ data: mockData });
    renderComponent();
    await expect(screen.findByText("Task 1")).resolves.toBeInTheDocument();
    expect(screen.getByText("Project 1")).toBeInTheDocument();
    expect(screen.getByText("task description 1")).toBeInTheDocument();
  });

  it("should not show stale indicator", () => {
    renderComponent();
    expect(screen.queryByTestId("dinosaur-icon")).not.toBeInTheDocument();
  });

  it("should open task form", async () => {
    const mockData = {
      projects: generateListOfProjects(3),
      defaultProject: generateListOfProjects(3)[1],
    };
    mockAxios.get.mockResolvedValue({ data: mockData });

    renderComponent(defaultProps);
    openContextMenu();
    fireEvent.click(screen.getByText("Edit"));

    expect(screen.queryAllByTestId(taskFormTestId).length === 1).toBe(true);
    expect(
      screen.getByRole("textbox", { name: /title/i }).getAttribute("value")
    ).toBe(defaultProps.task.title);
    expect(
      screen.getByRole("textbox", { name: /description/i }).innerHTML
    ).toBe(defaultProps.task.description);

    // todo: fix projects mock
    // expect(screen.getByRole("combobox", { name: /project/i }).textContent).toBe(
    //   "Project 1"
    // );
  });

  it("should edit task", async () => {
    renderComponent(defaultProps);
    openContextMenu();
    fireEvent.click(screen.getByText("Edit"));

    const input = screen.getByRole("textbox", { name: /title/i });
    fireEvent.change(input, { target: { value: "new title" } });

    const descInput = screen.getByRole("textbox", {
      name: /description/i,
    });
    await userEvent.type(descInput, "new desc");

    const button = screen.getByRole("button", { name: /save/i });
    await userEvent.click(button);

    expect(mockAxios.patch).toHaveBeenCalledWith("/api/tasks/v2", {
      deadline: null,
      description: "task description 1new desc",
      estimate: 0,
      projectId: "project1",
      taskId: "task1",
      title: "new title",
      tags: [],
    });
  });

  describe("task is not completed", () => {
    it("should complete the task", async () => {
      const setTasksMock = jest.fn();
      const tasksContextValues: TasksContextValues = {
        ...defaultTasksContextValues,
        setData: setTasksMock,
      };
      renderComponent(defaultProps, tasksContextValues);

      openContextMenu();
      fireEvent.click(screen.getByText("Complete"));

      expect(mockAxios.patch).toHaveBeenCalledWith("/api/tasks/v2", {
        completed: true,
        taskId: defaultTask._id,
      });
      expect(setTasksMock).toHaveBeenCalled();
    });

    it("should show task without opacity and full info", () => {
      renderComponent();

      expect(
        screen.getByTestId(cardTestId).className.includes("opacity-40")
      ).toBe(false);
      expect(
        screen.getByTestId(cardTestId).className.includes("line-through")
      ).toBe(false);
    });
  });

  describe("task is completed", () => {
    const task = generateTask(1, { completed: true });
    const props: TaskCardProps = {
      task,
      dragId: "dragId",
    };

    it("should undo the task", async () => {
      renderComponent(props);
      openContextMenu();

      fireEvent.click(screen.getByText("Undo"));
      expect(mockAxios.patch).toHaveBeenCalledWith("/api/tasks/v2", {
        completed: false,
        taskId: defaultTask._id,
      });
    });

    it("should show task as with opacity and limited info", () => {
      renderComponent(props);

      expect(
        screen.getByTestId(cardTestId).className.includes("opacity-40")
      ).toBe(true);
      expect(
        screen.getByTestId(cardTestId).className.includes("line-through")
      ).toBe(true);
    });
  });

  describe("task is active and stale", () => {
    const weekInMs = 7 * 24 * 60 * 60 * 1000;
    const dayInMs = 24 * 60 * 60 * 1000;

    const props: TaskCardProps = {
      task: generateTask(0, { activatedAt: (weekInMs + dayInMs) * -1 }),
      dragId: "dragId",
    };

    it("show stale indicator", () => {
      renderComponent(props);
      expect(screen.queryByTestId("dinosaur-icon") !== null).toBe(true);
    });
  });

  describe("task has an event", () => {
    const props: TaskCardProps = {
      task: generateTask(0, { eventId: "event1" }),
      dragId: "",
    };

    it("should remove event", () => {
      renderComponent(props);

      openContextMenu();
      fireEvent.click(screen.getByText("Remove from event"));

      expect(mockAxios.patch).toHaveBeenCalledWith("/api/tasks/v2", {
        eventId: null,
        taskId: props.task._id,
      });
    });

    it("should not allow to deactivate it", () => {
      renderComponent(props);
      expect(screen.queryByText("Deactivate")).not.toBeInTheDocument();
    });
  });
});
