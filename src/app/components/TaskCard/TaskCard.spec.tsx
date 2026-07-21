import TaskCard, { cardTestId, TaskCardProps } from "./TaskCard";
import { generateTask } from "@/app/utils/mocks/task";
import {
  render,
  screen,
  userEvent,
  fireEvent,
  waitFor,
} from "@/config/utils/test-utils";

import mockAxios from "jest-mock-axios";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";
import { generateProject } from "@/app/utils/mocks/project";
import { TasksNewContextProvider } from "@/app/utils/hooks/use-tasks-new/provider";
import { PROJECTS_PATH } from "@/app/utils/hooks/use-projects/api";
import { getTasksPath } from "@/app/utils/hooks/use-tasks-new/api";
import { TaskStatus } from "@/app/utils/types/task";
import { toBackendDateTime } from "#utils/date";

jest.mock("../../utils/date/now");
jest.mock("next/navigation");

describe("TaskCard", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  const DEFAULT_PROJECT = generateProject();
  const DEFAULT_PROJECTS = [DEFAULT_PROJECT];
  const DEFAULT_TASK = generateTask(1, { project_id: DEFAULT_PROJECT.id });

  const DEFAULT_PROPS: TaskCardProps = {
    task: DEFAULT_TASK,
    dragId: "drag-id",
  };

  const renderComponent = (props = DEFAULT_PROPS) =>
    render(
      <ProjectsContextProvider>
        <TasksNewContextProvider>
          <TaskCard {...props} />
        </TasksNewContextProvider>
      </ProjectsContextProvider>,
    );

  const openContextMenu = () => {
    const title = screen.getByTestId("TaskCard-title-testid");
    fireEvent.contextMenu(title);
  };

  const assertLoaded = async () => {
    await waitFor(() => expect(mockAxios.queue()).toHaveLength(2));

    mockAxios.mockResponseFor(
      { url: PROJECTS_PATH },
      { data: DEFAULT_PROJECTS },
    );
  };

  it("shows task title, project name, description, tags", async () => {
    renderComponent();

    await assertLoaded();

    await expect(
      screen.findByText(DEFAULT_TASK.title),
    ).resolves.toBeInTheDocument();

    expect(screen.getByText(DEFAULT_PROJECT.title)).toBeInTheDocument();
    expect(screen.getByText(DEFAULT_TASK.description!)).toBeInTheDocument();
  });

  it("should not show stale indicator", () => {
    renderComponent();
    expect(screen.queryByTestId("dinosaur-icon")).not.toBeInTheDocument();
  });

  it("should edit task", async () => {
    renderComponent();

    await assertLoaded();

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

    expect(mockAxios.patch).toHaveBeenCalledWith(
      getTasksPath(DEFAULT_TASK.id),
      {
        deadline: null,
        description: "task description 1new desc",
        project_id: 1,
        title: "new title",
      },
    );
  });

  // TODO add this feature
  // it("should add note to the task", async () => {
  //   mockAxios.get.mockResolvedValueOnce({ data: { projects: [] } });
  //   mockAxios.get.mockResolvedValueOnce({ data: [] });

  //   renderComponent(defaultProps);
  //   openContextMenu();
  //   fireEvent.click(screen.getByText("Add note"));
  //   expect(
  //     screen.getByRole("heading", { name: /Add note/i }),
  //   ).toBeInTheDocument();

  //   const rte = screen.getByTestId(rteTestId);
  //   const rteWrapper = getRichTextEditorTestkit(rte);
  //   rteWrapper.enterValue("<p>new note/p><p>new desc</p>");
  //   rteWrapper.blur();

  //   await waitFor(async () => {
  //     expect(
  //       screen.getByRole("button", { name: /create/i }),
  //     ).not.toBeDisabled();
  //   });
  //   await userEvent.click(screen.getByRole("button", { name: /create/i }));

  //   expect(mockAxios.post).toHaveBeenCalledWith("/api/notes", {
  //     jsonNote: {
  //       content: [
  //         {
  //           content: [
  //             {
  //               text: "new note/p>",
  //               type: "text",
  //             },
  //           ],
  //           type: "paragraph",
  //         },
  //         {
  //           content: [
  //             {
  //               text: "new desc",
  //               type: "text",
  //             },
  //           ],
  //           type: "paragraph",
  //         },
  //       ],
  //       type: "doc",
  //     },
  //     note: "new desc",
  //     parentTaskId: "task1",
  //     tags: [],
  //     title: "new note/p>",
  //   });
  // });

  describe("task is not completed", () => {
    it("should complete the task", async () => {
      renderComponent();

      await assertLoaded();

      openContextMenu();
      fireEvent.click(screen.getByText("Complete"));

      expect(mockAxios.patch).toHaveBeenCalledWith(
        getTasksPath(DEFAULT_TASK.id),
        {
          status: TaskStatus.Done,
        },
      );
    });

    it("should show task without opacity and full info", () => {
      renderComponent();

      expect(
        screen.getByTestId(cardTestId).className.includes("opacity-40"),
      ).toBe(false);
      expect(
        screen.getByTestId(cardTestId).className.includes("line-through"),
      ).toBe(false);
    });
  });

  describe("task is completed", () => {
    const COMPLETED_TASK = generateTask(1, { status: TaskStatus.Done });
    const props: TaskCardProps = {
      task: COMPLETED_TASK,
      dragId: "dragId",
    };

    it("should undo the task", async () => {
      renderComponent(props);

      await assertLoaded();

      openContextMenu();

      fireEvent.click(screen.getByText("Undo"));
      expect(mockAxios.patch).toHaveBeenCalledWith(
        getTasksPath(COMPLETED_TASK.id),
        {
          status: TaskStatus.Doing,
        },
      );
    });

    it("should show task as with opacity and limited info", () => {
      renderComponent(props);

      expect(
        screen.getByTestId(cardTestId).className.includes("opacity-40"),
      ).toBe(true);
      expect(
        screen.getByTestId(cardTestId).className.includes("line-through"),
      ).toBe(true);
    });
  });

  describe("task is active and stale", () => {
    const weekInMs = 7 * 24 * 60 * 60 * 1000;
    const dayInMs = 24 * 60 * 60 * 1000;

    const STALE_TASK = generateTask(1, {
      activated_at: toBackendDateTime(new Date((weekInMs + dayInMs) * -1)),
      status: TaskStatus.Doing,
    });

    const props: TaskCardProps = {
      task: STALE_TASK,
      dragId: "dragId",
    };

    it("show stale indicator", () => {
      renderComponent(props);
      expect(screen.queryByTestId("dinosaur-icon") !== null).toBe(true);
    });
  });

  describe("task has an event", () => {
    const TASK_WITH_EVENT = generateTask(1, { event_id: 2 });
    const props: TaskCardProps = {
      task: TASK_WITH_EVENT,
      dragId: "",
    };

    it("should remove event", () => {
      renderComponent(props);

      openContextMenu();
      fireEvent.click(screen.getByText("Remove from event"));

      expect(mockAxios.patch).toHaveBeenCalledWith(
        getTasksPath(TASK_WITH_EVENT.id),
        {
          event_id: null,
        },
      );
    });

    it("should not allow to deactivate it", () => {
      renderComponent(props);
      expect(screen.queryByText("Deactivate")).not.toBeInTheDocument();
    });
  });
});
