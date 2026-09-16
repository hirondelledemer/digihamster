import { render, screen, fireEvent } from "@/config/utils/test-utils";
import { TaskActions } from "./TaskActions";
import { generateTask } from "@/app/utils/mocks/task";
import { TaskStatus, ITask } from "@/app/utils/types/task";
import {
  TasksNewActionsContext,
  TasksNewActionsContextValue,
} from "@/app/utils/hooks/use-tasks-new/actions-context";

const renderComponent = (
  task: ITask,
  actions: Partial<TasksNewActionsContextValue> = {},
) => {
  const updateTask = jest.fn();
  const deleteTask = jest.fn();
  const contextValue: TasksNewActionsContextValue = {
    createTask: jest.fn(),
    updateTask,
    deleteTask,
    reorderTasksInTheEvent: jest.fn(),
    reorderTasksInTheProject: jest.fn(),
    ...actions,
  };

  render(
    <TasksNewActionsContext.Provider value={contextValue}>
      <TaskActions task={task}>
        <span>trigger</span>
      </TaskActions>
    </TasksNewActionsContext.Provider>,
  );

  const openMenu = () => fireEvent.contextMenu(screen.getByText("trigger"));

  return { updateTask, deleteTask, openMenu };
};

describe("TaskActions", () => {
  describe("todo task (no event, no deadline)", () => {
    const task = generateTask(1, { status: TaskStatus.Todo });

    it("should show correct menu items", async () => {
      const { openMenu } = renderComponent(task);
      openMenu();

      const options = (await screen.findAllByRole("menuitem")).map(
        (el) => el.textContent,
      );

      expect(options).toStrictEqual([
        "Complete",
        "Activate",
        "Edit",
        "Delete",
      ]);
    });

    it("should complete the task", async () => {
      const { openMenu, updateTask } = renderComponent(task);
      openMenu();

      fireEvent.click(
        await screen.findByRole("menuitem", { name: "Complete" }),
      );

      expect(updateTask).toHaveBeenCalledWith(
        task.id,
        { status: TaskStatus.Done },
        expect.any(Function),
      );
    });

    it("should activate the task", async () => {
      const { openMenu, updateTask } = renderComponent(task);
      openMenu();

      fireEvent.click(
        await screen.findByRole("menuitem", { name: "Activate" }),
      );

      expect(updateTask).toHaveBeenCalledWith(
        task.id,
        { status: TaskStatus.Doing },
        expect.any(Function),
      );
    });
  });

  describe("doing task (no event, no deadline)", () => {
    const task = generateTask(1, { status: TaskStatus.Doing });

    it("should show correct menu items", async () => {
      const { openMenu } = renderComponent(task);
      openMenu();

      const options = (await screen.findAllByRole("menuitem")).map(
        (el) => el.textContent,
      );

      expect(options).toStrictEqual([
        "Complete",
        "Deactivate",
        "Edit",
        "Delete",
      ]);
    });

    it("should deactivate the task", async () => {
      const { openMenu, updateTask } = renderComponent(task);
      openMenu();

      fireEvent.click(
        await screen.findByRole("menuitem", { name: "Deactivate" }),
      );

      expect(updateTask).toHaveBeenCalledWith(
        task.id,
        { status: TaskStatus.Todo },
        expect.any(Function),
      );
    });
  });

  describe("done task", () => {
    const task = generateTask(1, { status: TaskStatus.Done });

    it("should show correct menu items", async () => {
      const { openMenu } = renderComponent(task);
      openMenu();

      const options = (await screen.findAllByRole("menuitem")).map(
        (el) => el.textContent,
      );

      expect(options).toStrictEqual(["Undo", "Activate", "Edit", "Delete"]);
    });

    it("should undo the task", async () => {
      const { openMenu, updateTask } = renderComponent(task);
      openMenu();

      fireEvent.click(await screen.findByRole("menuitem", { name: "Undo" }));

      expect(updateTask).toHaveBeenCalledWith(
        task.id,
        { status: TaskStatus.Doing },
        expect.any(Function),
      );
    });
  });

  describe("task in an event", () => {
    const task = generateTask(1, { status: TaskStatus.Doing, event_id: 5 });

    it("should show correct menu items", async () => {
      const { openMenu } = renderComponent(task);
      openMenu();

      const options = (await screen.findAllByRole("menuitem")).map(
        (el) => el.textContent,
      );

      expect(options).toStrictEqual([
        "Complete",
        "Edit",
        "Remove from event",
        "Delete",
      ]);
    });

    it("should remove from event", async () => {
      const { openMenu, updateTask } = renderComponent(task);
      openMenu();

      fireEvent.click(
        await screen.findByRole("menuitem", { name: "Remove from event" }),
      );

      expect(updateTask).toHaveBeenCalledWith(task.id, {
        event_id: null,
        status: TaskStatus.Doing,
      });
    });
  });

  describe("task with a deadline", () => {
    const task = generateTask(1, {
      status: TaskStatus.Todo,
      deadline: "2024-03-15",
    });

    it("should show 'Move to the list' option", async () => {
      const { openMenu } = renderComponent(task);
      openMenu();

      const options = (await screen.findAllByRole("menuitem")).map(
        (el) => el.textContent,
      );

      expect(options).toContain("Move to the list");
    });

    it("should move to the list", async () => {
      const { openMenu, updateTask } = renderComponent(task);
      openMenu();

      fireEvent.click(
        await screen.findByRole("menuitem", { name: "Move to the list" }),
      );

      expect(updateTask).toHaveBeenCalledWith(task.id, {
        deadline: null,
        status: TaskStatus.Doing,
      });
    });
  });

  describe("delete", () => {
    it("should delete the task", async () => {
      const task = generateTask(1);
      const { openMenu, deleteTask } = renderComponent(task);
      openMenu();

      fireEvent.click(
        await screen.findByRole("menuitem", { name: "Delete" }),
      );

      expect(deleteTask).toHaveBeenCalledWith(task.id);
    });
  });
});
