import { render, act, waitFor } from "@testing-library/react";
import CommandTool, { CommandToolProps } from "./CommandTool";
import { getCommandToolTestkit } from "./CommandTool.testkit";
import mockAxios from "jest-mock-axios";
import { ProjectsContext } from "@/app/utils/hooks/use-projects";
import { TasksContext } from "@/app/utils/hooks/use-tasks";

// todo show fetch only active tasks
describe("CommandTool", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  const defaultProps: CommandToolProps = {};
  const renderComponent = (props = defaultProps) =>
    getCommandToolTestkit(
      render(
        //todo: extract as utils for tests
        <ProjectsContext.Provider
          value={{
            data: [],
            defaultProject: {
              _id: "project1",
              title: "Project",
              color: "project-color",
              deleted: false,
              order: 1,
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
            <CommandTool {...props} />
          </TasksContext.Provider>
        </ProjectsContext.Provider>
      ).container
    );

  it("should render CommandTool", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });

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
    wrapper.enterDescription("new desc");
    wrapper.enterEta("eta-2");

    act(() => {
      wrapper.submitTaskForm();
    });

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith("/api/tasks/events", {
        description: "<p>new desc</p>",
        estimate: 2,
        isActive: true,
        projectId: "project1",
        tags: [],
        title: "new task title",
      });
    });
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
    wrapper.enterDescription("new desc");
    wrapper.enterEta("eta-2");

    act(() => {
      wrapper.submitTaskForm();
    });

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith("/api/tasks/events", {
        description: "<p>new desc</p>",
        estimate: 2,
        isActive: false,
        projectId: "project1",
        tags: [],
        title: "new task title",
      });
    });
  });
});
