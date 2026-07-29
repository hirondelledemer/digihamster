import { render, screen, userEvent, waitFor } from "@/config/utils/test-utils";

import TaskForm, { TaskFormProps } from "./TaskForm";
import { generateTask } from "@/app/utils/mocks/task";

import mockAxios from "jest-mock-axios";

import { generateCustomProjectsList } from "@/app/utils/mocks/project";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";
import { TasksNewContextProvider } from "@/app/utils/hooks/use-tasks-new/provider";
import { PROJECTS_PATH } from "@/app/utils/hooks/use-projects/api";
import { getTasksPath, TASKS_PATH } from "@/app/utils/hooks/use-tasks-new/api";
import { ProjectStatus } from "@/app/utils/types/project";
import { TaskStatus } from "@/app/utils/types/task";

jest.mock("../../utils/date/now");

const onDoneMock = jest.fn();

const DEFAULT_PROJECTS = generateCustomProjectsList([
  { status: ProjectStatus.Todo },
  { status: ProjectStatus.Cancelled },
  { status: ProjectStatus.Done },
  { status: ProjectStatus.Doing },
]);

describe("TaskForm", () => {
  const DEFAULT_PROPS: TaskFormProps = {
    onDone: onDoneMock,
    task: generateTask(),
  };
  const renderComponent = (props: TaskFormProps = DEFAULT_PROPS) =>
    render(
      <ProjectsContextProvider>
        <TasksNewContextProvider>
          <TaskForm {...props} />
        </TasksNewContextProvider>
      </ProjectsContextProvider>,
    );

  afterEach(() => {
    mockAxios.reset();
  });

  it("should show cancelled and done projects as disabled", async () => {
    renderComponent();

    await waitFor(() => expect(mockAxios.queue()).toHaveLength(2));

    mockAxios.mockResponseFor(
      { url: PROJECTS_PATH },
      { data: DEFAULT_PROJECTS },
    );
    mockAxios.mockResponseFor({ url: TASKS_PATH }, { data: [] });

    await userEvent.click(screen.getByRole("combobox", { name: /project/i }));

    const options = await screen.findAllByRole("option");

    expect(options.map((o) => o.textContent)).toStrictEqual([
      "Project 0",
      "Project 1",
      "Project 2",
      "Project 3active",
    ]);

    expect(options[0]).toBeEnabled();
    expect(options[1]).toHaveAttribute("aria-disabled");
    expect(options[2]).toHaveAttribute("aria-disabled");
    expect(options[3]).toBeEnabled();
  });

  describe("editMode", () => {
    beforeEach(() => {
      onDoneMock.mockClear();
      mockAxios.patch.mockResolvedValueOnce({ data: {} });
    });

    it("should edit the task", async () => {
      renderComponent();

      await waitFor(() => expect(mockAxios.queue()).toHaveLength(2));

      mockAxios.mockResponseFor(
        { url: PROJECTS_PATH },
        { data: DEFAULT_PROJECTS },
      );
      mockAxios.mockResponseFor({ url: TASKS_PATH }, { data: [] });

      await userEvent.type(
        screen.getByRole("textbox", { name: "Title" }),
        " edited",
      );

      await userEvent.click(screen.getByRole("combobox", { name: /project/i }));
      await userEvent.click(screen.getAllByRole("option")[0]);

      await userEvent.type(
        screen.getByRole("textbox", { name: "Description" }),
        " edited",
      );

      await userEvent.click(screen.getByRole("button", { name: /deadline/i }));
      await userEvent.click(screen.getAllByRole("gridcell")[0]);
      await userEvent.click(screen.getByRole("button", { name: /save/i }));

      await waitFor(() => {
        expect(mockAxios.patch).toHaveBeenCalledWith(
          getTasksPath(DEFAULT_PROPS.task.id),
          {
            deadline: expect.anything(),
            description: "task description 1 edited",
            project_id: 0,
            title: "Task 1 edited",
          },
        );
      });
    });

    it("should delete task", async () => {
      renderComponent();

      await userEvent.click(screen.getByRole("button", { name: "Delete" }));

      await waitFor(() => {
        expect(mockAxios.delete).toHaveBeenCalledWith(
          getTasksPath(DEFAULT_PROPS.task.id),
        );
      });

      // call onDone
      expect(onDoneMock).toHaveBeenCalledTimes(1);
    });

    it("should complete task", async () => {
      renderComponent();

      await userEvent.click(screen.getByRole("button", { name: "Complete" }));

      await waitFor(() => {
        expect(mockAxios.patch).toHaveBeenCalledWith(
          getTasksPath(DEFAULT_PROPS.task.id),
          { status: TaskStatus.Done },
        );
      });

      // call onDone
      expect(onDoneMock).toHaveBeenCalledTimes(1);
    });

    it("should undo task", async () => {
      const TASK_COMPLETED = generateTask(1, { status: TaskStatus.Done });

      renderComponent({ ...DEFAULT_PROPS, task: TASK_COMPLETED });

      await userEvent.click(screen.getByRole("button", { name: "Undo" }));

      await waitFor(() => {
        expect(mockAxios.patch).toHaveBeenCalledWith(
          getTasksPath(DEFAULT_PROPS.task.id),
          { status: TaskStatus.Doing },
        );
      });

      // call onDone
      expect(onDoneMock).toHaveBeenCalledTimes(1);
    });
  });
});
