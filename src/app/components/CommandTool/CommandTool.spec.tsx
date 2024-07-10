import { act } from "react";
import { render, waitFor } from "@testing-library/react";
import CommandTool, { CommandToolProps } from "./CommandTool";
import { getCommandToolTestkit } from "./CommandTool.testkit";
import mockAxios from "jest-mock-axios";
import {
  wrapWithProjectsProvider,
  wrapWithTasksProvider,
} from "@/app/utils/tests/wraps";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const useRouterMock = useRouter as unknown as jest.Mock;

describe("CommandTool", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  const defaultProps: CommandToolProps = {};
  const renderComponent = (props = defaultProps) =>
    getCommandToolTestkit(
      render(
        wrapWithProjectsProvider(
          wrapWithTasksProvider(<CommandTool {...props} />, { data: [] }),
          {
            projects: [],
            defaultProject: {
              _id: "project1",
              title: "Project",
              color: "project-color",
              deleted: false,
              order: 1,
            },
          }
        )
      ).container
    );

  it("should render CommandTool", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });

  describe("go-to actions", () => {
    it("should to tasks page", async () => {
      const pushMock = jest.fn();
      const useRouter = jest.spyOn(require("next/navigation"), "useRouter");
      useRouter.mockImplementation(() => ({
        push: pushMock,
      }));

      const wrapper = renderComponent();
      await act(async () => {
        wrapper.pressCmdK();
      });
      expect(wrapper.commandToolOpen()).toBe(true);

      wrapper.clickGoToTasks();

      expect(pushMock).toHaveBeenCalledWith("/tasks");
    });

    it("should to home page", async () => {
      const pushMock = jest.fn();
      const useRouter = jest.spyOn(require("next/navigation"), "useRouter");
      useRouter.mockImplementation(() => ({
        push: pushMock,
      }));

      const wrapper = renderComponent();
      await act(async () => {
        wrapper.pressCmdK();
      });
      expect(wrapper.commandToolOpen()).toBe(true);

      wrapper.clickGoToHome();

      expect(pushMock).toHaveBeenCalledWith("/home");
    });
  });

  describe("create task actions", () => {
    it("should create active task", async () => {
      const wrapper = renderComponent();
      act(() => {
        wrapper.pressCmdK();
      });
      expect(wrapper.commandToolOpen()).toBe(true);

      act(() => {
        wrapper.clickCreateActiveTask();
      });

      expect(wrapper.taskFormIsOpen()).toBe(true);

      wrapper.enterTitle("new task title");
      await wrapper.enterDescription("new desc");
      wrapper.enterEta("eta-2");

      act(() => {
        wrapper.submitTaskForm();
      });

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith("/api/tasks/v2", {
          description: "new desc",
          estimate: 2,
          isActive: true,
          projectId: "project1",
          title: "new task title",
          deadline: null,
        });
      });
    });

    it("should create task with predefined title", async () => {
      const wrapper = renderComponent();
      act(() => {
        wrapper.pressCmdK();
      });
      expect(wrapper.commandToolOpen()).toBe(true);

      act(() => {
        wrapper.enterSearch("new task title");
        wrapper.clickCreateActiveTask();
      });

      expect(wrapper.taskFormIsOpen()).toBe(true);
      expect(wrapper.getTitle()).toBe("new task title");
    });

    it("should create regular task", async () => {
      const wrapper = renderComponent();
      act(() => {
        wrapper.pressCmdK();
      });
      expect(wrapper.commandToolOpen()).toBe(true);

      act(() => {
        wrapper.clickCreateTask();
      });

      expect(wrapper.taskFormIsOpen()).toBe(true);

      wrapper.enterTitle("new task title");
      await wrapper.enterDescription("new desc");
      wrapper.enterEta("eta-2");

      act(() => {
        wrapper.submitTaskForm();
      });

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith("/api/tasks/v2", {
          description: "new desc",
          estimate: 2,
          isActive: false,
          projectId: "project1",
          title: "new task title",
          deadline: null,
        });
      });
    });
  });
});
