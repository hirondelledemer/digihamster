import { render, screen, userEvent, waitFor } from "@/config/utils/test-utils";

import TaskForm, { TaskFormProps } from "./TaskForm";
import { generateTask } from "@/app/utils/mocks/task";
import { getTaskFormTestkit } from "./TaskForm.testkit";

import { TasksContext } from "@/app/utils/hooks/use-tasks";
import mockAxios from "jest-mock-axios";
import { wrapWithProjectsProvider } from "@/app/utils/tests/wraps";
import { ProjectsContextValue } from "@/app/utils/hooks/use-projects";
import { generateCustomProjectsList } from "@/app/utils/mocks/project";

jest.mock("../../utils/date/date");

describe("TaskForm", () => {
  const defaultProps: TaskFormProps = { onDone: jest.fn() };
  const renderComponent = (
    props: TaskFormProps = defaultProps,
    projectsProps?: Partial<ProjectsContextValue>
  ) =>
    getTaskFormTestkit(
      render(
        wrapWithProjectsProvider(
          <TasksContext.Provider
            value={{
              data: [],
              loading: false,
              setData: jest.fn(),
            }}
          >
            <TaskForm {...props} />
          </TasksContext.Provider>,
          projectsProps
        )
      ).container
    );

  afterEach(() => {
    mockAxios.reset();
  });

  it("should render TaskForm", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });

  it("should non disabled projects in dropdown", async () => {
    renderComponent(defaultProps, {
      data: generateCustomProjectsList([
        { disabled: false },
        { disabled: false },
        { disabled: true },
      ]),
    });

    userEvent.click(screen.getByRole("combobox", { name: /project/i }));

    const options = await screen.findAllByRole("option");

    expect(options.map((o) => o.textContent)).toStrictEqual([
      "Project 0",
      "Project 1",
    ]);
  });

  describe("regular mode", () => {
    it("should not show delete button", () => {
      const wrapper = renderComponent();
      expect(wrapper.deleteButtonExists()).toBe(false);
    });

    it("should not show complete button", () => {
      const wrapper = renderComponent();
      expect(wrapper.completeButtonExists()).toBe(false);
    });
  });

  describe("editMode", () => {
    const task = generateTask();
    const onDoneMock = jest.fn();
    const props: TaskFormProps = {
      onDone: onDoneMock,
      editMode: true,
      task: generateTask(),
    };
    beforeEach(() => {
      onDoneMock.mockClear();
      mockAxios.patch.mockResolvedValueOnce({ data: {} });
    });
    describe("delete action", () => {
      it("should delete task, if it is not deleted", async () => {
        const wrapper = renderComponent(props);

        // show delete button
        expect(wrapper.deleteButtonExists()).toBe(true);

        // delete task on click

        wrapper.clickDeleteButton();

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
        const wrapper = renderComponent({ ...props, task: deletedTask });

        // show delete button
        expect(wrapper.deleteButtonExists()).toBe(false);
      });
    });

    describe("complete action", () => {
      it("should complete task, if task is not completed", async () => {
        const wrapper = renderComponent(props);

        // show complete button
        expect(wrapper.completeButtonExists()).toBe(true);
        expect(wrapper.undoButtonExists()).not.toBe(true);

        // complete task on click

        wrapper.clickCompleteButton();

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
        const wrapper = renderComponent({ ...props, task: completedTask });

        // show complete button
        expect(wrapper.undoButtonExists()).toBe(true);
        expect(wrapper.completeButtonExists()).toBe(false);

        // undo task on click

        wrapper.clickUndoButton();

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
