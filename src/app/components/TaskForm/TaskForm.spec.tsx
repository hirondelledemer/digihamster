import { act, render, waitFor } from "@/config/utils/test-utils";

import TaskForm, { TaskFormProps } from "./TaskForm";
import { generateTask } from "@/app/utils/mocks/task";
import { getTaskFormTestkit } from "./TaskForm.testkit";

import { TasksContext } from "@/app/utils/hooks/use-tasks";
import { ProjectsContext } from "@/app/utils/hooks/use-projects";
import mockAxios from "jest-mock-axios";

jest.mock("../../utils/date/date");

describe("Today", () => {
  const defaultProps: TaskFormProps = { onDone: jest.fn() };
  const renderComponent = (props: TaskFormProps = defaultProps) =>
    getTaskFormTestkit(
      render(
        <ProjectsContext.Provider
          value={{
            data: [
              {
                _id: "project1",
                title: "Project 1",
                deleted: false,
                color: "color1",
                order: 0,
              },
            ],
            defaultProject: {
              _id: "project1",
              title: "Project 1",
              deleted: false,
              color: "color1",
              order: 0,
            },
            loading: false,
            setData: jest.fn(),
          }}
        >
          <TasksContext.Provider
            value={{
              data: [],
              loading: false,
              setData: jest.fn(),
            }}
          >
            <TaskForm {...props} />
          </TasksContext.Provider>
        </ProjectsContext.Provider>
      ).container
    );

  afterEach(() => {
    mockAxios.reset();
  });

  it("should render TaskForm", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
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
