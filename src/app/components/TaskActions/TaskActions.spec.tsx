import { render, screen, fireEvent } from "@/config/utils/test-utils";
import { TaskActions } from "./TaskActions";
import { generateTask } from "@/app/utils/mocks/task";
import { TaskStatus, ITask } from "@/app/utils/types/task";
import { generateEvent } from "@/app/utils/mocks/event";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { RelationshipType } from "@/app/utils/relationships/relationship-types";
import {
  eventsState,
  providers,
  relationshipsActions,
  taskActions,
} from "@/app/utils/tests/wrappers";

const getSearchParamsMock = jest.fn();

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useSearchParams: () => ({
    get: getSearchParamsMock,
  }),
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

const DEFAULT_EVENT = generateEvent();

const renderComponent = (task: ITask) => {
  const updateTask = jest.fn();
  const deleteTask = jest.fn();
  const createRelationship = jest.fn();

  render(
    <TaskActions task={task}>
      <span>trigger</span>
    </TaskActions>,
    {
      wrapper: providers(
        taskActions({ updateTask, deleteTask }),
        eventsState({ data: [DEFAULT_EVENT] }),
        relationshipsActions({
          create: createRelationship,
        })
      ),
    }
  );

  const openMenu = () => fireEvent.contextMenu(screen.getByText("trigger"));

  return { updateTask, deleteTask, openMenu, createRelationship };
};

describe("TaskActions", () => {
  afterEach(() => {
    getSearchParamsMock.mockReset();
  });

  describe("todo task (no event, no deadline)", () => {
    const TASK = generateTask(1, { status: TaskStatus.Todo });

    it("should show correct menu items", async () => {
      const { openMenu } = renderComponent(TASK);
      openMenu();

      const options = (await screen.findAllByRole("menuitem")).map(
        (el) => el.textContent
      );

      expect(options).toStrictEqual(["Complete", "Activate", "Edit", "Delete"]);
    });

    it("should complete the task", async () => {
      const { openMenu, updateTask } = renderComponent(TASK);
      openMenu();

      fireEvent.click(
        await screen.findByRole("menuitem", { name: "Complete" })
      );

      expect(updateTask).toHaveBeenCalledWith(
        TASK.id,
        { status: TaskStatus.Done },
        expect.any(Function)
      );
    });

    it("should activate the task", async () => {
      const { openMenu, updateTask } = renderComponent(TASK);
      openMenu();

      fireEvent.click(
        await screen.findByRole("menuitem", { name: "Activate" })
      );

      expect(updateTask).toHaveBeenCalledWith(
        TASK.id,
        { status: TaskStatus.Doing },
        expect.any(Function)
      );
    });
  });

  describe("doing task (no event, no deadline)", () => {
    const TASK = generateTask(1, { status: TaskStatus.Doing });

    it("should show correct menu items", async () => {
      const { openMenu } = renderComponent(TASK);
      openMenu();

      const options = (await screen.findAllByRole("menuitem")).map(
        (el) => el.textContent
      );

      expect(options).toStrictEqual([
        "Complete",
        "Deactivate",
        "Edit",
        "Delete",
      ]);
    });

    it("should deactivate the task", async () => {
      const { openMenu, updateTask } = renderComponent(TASK);
      openMenu();

      fireEvent.click(
        await screen.findByRole("menuitem", { name: "Deactivate" })
      );

      expect(updateTask).toHaveBeenCalledWith(
        TASK.id,
        { status: TaskStatus.Todo },
        expect.any(Function)
      );
    });
  });

  describe("done task", () => {
    const TASK = generateTask(1, { status: TaskStatus.Done });

    it("should show correct menu items", async () => {
      const { openMenu } = renderComponent(TASK);
      openMenu();

      const options = (await screen.findAllByRole("menuitem")).map(
        (el) => el.textContent
      );

      expect(options).toStrictEqual(["Undo", "Activate", "Edit", "Delete"]);
    });

    it("should undo the task", async () => {
      const { openMenu, updateTask } = renderComponent(TASK);
      openMenu();

      fireEvent.click(await screen.findByRole("menuitem", { name: "Undo" }));

      expect(updateTask).toHaveBeenCalledWith(
        TASK.id,
        { status: TaskStatus.Doing },
        expect.any(Function)
      );
    });
  });

  describe("task in an event", () => {
    const TASK = generateTask(1, { status: TaskStatus.Doing, event_id: 5 });

    it("should show correct menu items", async () => {
      const { openMenu } = renderComponent(TASK);
      openMenu();

      const options = (await screen.findAllByRole("menuitem")).map(
        (el) => el.textContent
      );

      expect(options).toStrictEqual([
        "Complete",
        "Edit",
        "Remove from event",
        "Delete",
      ]);
    });

    it("should remove from event", async () => {
      const { openMenu, updateTask } = renderComponent(TASK);
      openMenu();

      fireEvent.click(
        await screen.findByRole("menuitem", { name: "Remove from event" })
      );

      expect(updateTask).toHaveBeenCalledWith(TASK.id, {
        event_id: null,
        status: TaskStatus.Doing,
      });
    });
  });

  describe("task with a deadline", () => {
    const TASK = generateTask(1, {
      status: TaskStatus.Todo,
      deadline: "2024-03-15",
    });

    it("should show 'Move to the list' option", async () => {
      const { openMenu } = renderComponent(TASK);
      openMenu();

      const options = (await screen.findAllByRole("menuitem")).map(
        (el) => el.textContent
      );

      expect(options).toContain("Move to the list");
    });

    it("should move to the list", async () => {
      const { openMenu, updateTask } = renderComponent(TASK);
      openMenu();

      fireEvent.click(
        await screen.findByRole("menuitem", { name: "Move to the list" })
      );

      expect(updateTask).toHaveBeenCalledWith(TASK.id, {
        deadline: null,
        status: TaskStatus.Doing,
      });
    });
  });

  describe("delete", () => {
    const TASK = generateTask(1);
    it("should delete the task", async () => {
      const { openMenu, deleteTask } = renderComponent(TASK);
      openMenu();

      fireEvent.click(await screen.findByRole("menuitem", { name: "Delete" }));

      expect(deleteTask).toHaveBeenCalledWith(TASK.id);
    });
  });

  describe("active event is present", () => {
    const TASK = generateTask(1);
    it('should show "Add to the active event" action', async () => {
      getSearchParamsMock.mockImplementation(() => DEFAULT_EVENT.id);

      const { openMenu, createRelationship } = renderComponent(TASK);
      openMenu();

      fireEvent.click(
        await screen.findByRole("menuitem", { name: "Add to the active event" })
      );

      expect(createRelationship).toHaveBeenCalledWith({
        relationship_type: RelationshipType.Contains,
        source_id: DEFAULT_EVENT.id,
        source_type: RelationshipEntityType.Event,
        target_id: TASK.id,
        target_type: RelationshipEntityType.Task,
      });
    });
  });
});
