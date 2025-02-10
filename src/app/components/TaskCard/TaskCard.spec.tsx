import { TagsContext } from "@/app/utils/hooks/use-tags";
import TaskCard, { TaskCardProps } from "./TaskCard";
import { getTaskCardTestkit } from "./TaskCard.testkit";
import { TasksContext, TasksContextValues } from "@/app/utils/hooks/use-tasks";
import { generateTask } from "@/app/utils/mocks/task";
import { render, act } from "@/config/utils/test-utils";

import mockAxios from "jest-mock-axios";
import { wrapWithProjectsProvider } from "@/app/utils/tests/wraps";

jest.mock("../../utils/date/date");

describe("TaskCard", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  const defaultTask = generateTask();
  const defaultProps: TaskCardProps = {
    task: defaultTask,
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
    getTaskCardTestkit(
      render(
        wrapWithProjectsProvider(
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
        )
      ).container
    );

  it("should render TaskCard", () => {
    const { getComponent } = renderComponent();
    expect(getComponent()).not.toBe(null);
  });

  it("shows task title, project name, description, tags", () => {
    const { getComponent } = renderComponent();
    expect(getComponent().textContent).toBe(
      "Task 1Project 1task description 1"
    );
  });

  it("should not show stale indicator", () => {
    const { staleIndicatorIsVisible } = renderComponent();
    expect(staleIndicatorIsVisible()).toBe(false);
  });

  it("should deactivate task", () => {
    const { clickDeactivate } = renderComponent(defaultProps);
    clickDeactivate();
    expect(mockAxios.patch).toHaveBeenCalledWith("/api/tasks/v2", {
      isActive: false,
      taskId: defaultTask._id,
    });
  });

  it("should open task form", () => {
    const {
      clickEdit,
      taskFormIsOpen,
      getTaskFormTitleValue,
      getTaskFormDescriptionValue,
      getTaskFormEtaValue,
      getTaskFormProjectValue,
    } = renderComponent(defaultProps);
    clickEdit();
    expect(taskFormIsOpen()).toBe(true);
    expect(getTaskFormTitleValue()).toBe(defaultProps.task.title);
    expect(getTaskFormDescriptionValue()).toBe(defaultProps.task.description);
    expect(getTaskFormEtaValue("eta-0")).toBe(true);
    expect(getTaskFormProjectValue()).toBe("Project 1");
  });

  it("should edit task", async () => {
    const { clickEdit, enterTitle, enterDescription, setEta, submitForm } =
      renderComponent(defaultProps);
    clickEdit();
    enterTitle("new title");
    await enterDescription("new desc");
    setEta("eta-3");
    await act(() => {
      submitForm();
    });

    expect(mockAxios.patch).toHaveBeenCalledWith("/api/tasks/v2", {
      deadline: null,
      description: "task description 1new desc",
      estimate: 3,
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
      const { clickComplete } = renderComponent(
        defaultProps,
        tasksContextValues
      );
      clickComplete();
      expect(mockAxios.patch).toHaveBeenCalledWith("/api/tasks/v2", {
        completed: true,
        taskId: defaultTask._id,
      });
      expect(setTasksMock).toHaveBeenCalled();
    });

    it("should show task without opacity and full info", () => {
      const { cardIsFaded, cardTextIsStriked, getComponent } =
        renderComponent();
      expect(cardIsFaded()).toBe(false);
      expect(cardTextIsStriked()).toBe(false);
      expect(getComponent().textContent).toBe(
        "Task 1Project 1task description 1"
      );
    });
  });

  describe("task is completed", () => {
    const task = generateTask(1, { completed: true });
    const props: TaskCardProps = {
      task,
    };

    it("should undo the task", async () => {
      const { clickUndo } = renderComponent(props);
      clickUndo();
      expect(mockAxios.patch).toHaveBeenCalledWith("/api/tasks/v2", {
        completed: false,
        taskId: defaultTask._id,
      });
    });

    it("should show task as with opacity and limited info", () => {
      const { cardIsFaded, cardTextIsStriked, getComponent } =
        renderComponent(props);
      expect(cardIsFaded()).toBe(true);
      expect(cardTextIsStriked()).toBe(true);
      expect(getComponent().textContent).toBe("Task 1");
    });
  });

  describe("task is active and stale", () => {
    const weekInMs = 7 * 24 * 60 * 60 * 1000;
    const dayInMs = 24 * 60 * 60 * 1000;

    const props: TaskCardProps = {
      task: generateTask(0, { activatedAt: (weekInMs + dayInMs) * -1 }),
    };

    it("show stale indicator", () => {
      const { staleIndicatorIsVisible } = renderComponent(props);
      expect(staleIndicatorIsVisible()).toBe(true);
    });
  });

  describe("task has an event", () => {
    const props: TaskCardProps = {
      task: generateTask(0, { eventId: "event1" }),
    };

    it("should remove event", () => {
      const { clickRemoveEvent } = renderComponent(props);
      clickRemoveEvent();
      expect(mockAxios.patch).toHaveBeenCalledWith("/api/tasks/v2", {
        eventId: null,
        taskId: props.task._id,
      });
    });

    it("should not allow to deactivate it", () => {
      const { deactivateButtonExists } = renderComponent(props);
      expect(deactivateButtonExists()).toBe(false);
    });
  });
});
