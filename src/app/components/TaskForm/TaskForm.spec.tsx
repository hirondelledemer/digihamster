import { render, screen, userEvent, waitFor } from "@/config/utils/test-utils";

import TaskForm, { TaskFormProps } from "./TaskForm";
import { generateTask } from "@/app/utils/mocks/task";
import { getTaskFormTestkit } from "./TaskForm.testkit";

import { TasksContext } from "@/app/utils/hooks/use-tasks";
import mockAxios from "jest-mock-axios";

import { generateCustomProjectsList } from "@/app/utils/mocks/project";
import { ProjectsStateContext } from "@/app/utils/hooks/use-projects/state-context";

jest.mock("../../utils/date/date");

const onDoneMock = jest.fn();

describe("TaskForm", () => {
  const defaultProps: TaskFormProps = {
    onDone: onDoneMock,
    task: generateTask(),
  };
  const renderComponent = (
    props: TaskFormProps = defaultProps,
    projectsProps: any = {
      data: [],
    }
  ) =>
    getTaskFormTestkit(
      render(
        <ProjectsStateContext.Provider value={projectsProps}>
          <TasksContext.Provider
            value={{
              data: [],
              loading: false,
              setData: jest.fn(),
            }}
          >
            <TaskForm {...props} />
          </TasksContext.Provider>
        </ProjectsStateContext.Provider>
      ).container
    );

  afterEach(() => {
    mockAxios.reset();
  });

  it("should non disabled projects in dropdown", async () => {
    renderComponent(defaultProps, {
      data: generateCustomProjectsList([
        { disabled: false },
        { disabled: false },
        { disabled: true },
      ]),
    });

    await userEvent.click(screen.getByRole("combobox", { name: /project/i }));

    const options = await screen.findAllByRole("option");

    expect(options.map((o) => o.textContent)).toStrictEqual([
      "Project 0",
      "Project 1",
    ]);
  });

  describe("editMode", () => {
    const task = generateTask();

    beforeEach(() => {
      onDoneMock.mockClear();
      mockAxios.patch.mockResolvedValueOnce({ data: {} });
    });
    describe("delete action", () => {
      it("should delete task, if it is not deleted", async () => {
        const { deleteButtonExists, clickDeleteButton } = renderComponent();

        // show delete button
        expect(deleteButtonExists()).toBe(true);

        // delete task on click

        clickDeleteButton();

        await waitFor(() => {
          expect(mockAxios.patch).toHaveBeenCalledWith("/api/tasks/v2", {
            deleted: true,
            taskId: task._id,
          });
        });

        // call onDone
        expect(onDoneMock).toHaveBeenCalledTimes(1);
      });

      it("should not show delete action for deleted task", () => {
        const deletedTask = generateTask(1, { deleted: true });
        const { deleteButtonExists } = renderComponent({
          ...defaultProps,
          task: deletedTask,
        });

        // show delete button
        expect(deleteButtonExists()).toBe(false);
      });
    });

    describe("complete action", () => {
      it("should complete task, if task is not completed", async () => {
        const { completeButtonExists, undoButtonExists, clickCompleteButton } =
          renderComponent();

        // show complete button
        expect(completeButtonExists()).toBe(true);
        expect(undoButtonExists()).not.toBe(true);

        // complete task on click

        clickCompleteButton();

        await waitFor(() => {
          expect(mockAxios.patch).toHaveBeenCalledWith("/api/tasks/v2", {
            completed: true,
            taskId: task._id,
          });
        });

        //call onDone
        expect(onDoneMock).toHaveBeenCalledTimes(1);
      });

      it("should undo task, if task is completed", async () => {
        const completedTask = generateTask(1, { completed: true });
        const { undoButtonExists, completeButtonExists, clickUndoButton } =
          renderComponent({ ...defaultProps, task: completedTask });

        // show complete button
        expect(undoButtonExists()).toBe(true);
        expect(completeButtonExists()).toBe(false);

        // undo task on click

        clickUndoButton();

        await waitFor(() => {
          expect(mockAxios.patch).toHaveBeenCalledWith("/api/tasks/v2", {
            completed: false,
            taskId: task._id,
          });
        });

        //call onDone
        expect(onDoneMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
