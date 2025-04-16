import ActiveTaskList, { ActiveTaskListProps } from "./ActiveTaskList";
import { getActiveTaskListTestkit } from "./ActiveTaskList.testkit";
import { generateCustomTasksList } from "@/app/utils/mocks/task";
import { TasksContext } from "@/app/utils/hooks/use-tasks";
import { fireEvent, render, screen } from "@/config/utils/test-utils";
import { TagsContext } from "@/app/utils/hooks/use-tags";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";
import mockAxios from "jest-mock-axios";
import { generateListOfProjects } from "@/app/utils/mocks/project";

describe("ActiveTaskList", () => {
  const defaultTasks = generateCustomTasksList([
    { isActive: true },
    { isActive: true },
    { isActive: true },
    { isActive: false },
    { isActive: true, deadline: 1100000 },
    { isActive: false, deadline: 1100000, completed: true },
  ]);
  const defaultProps: ActiveTaskListProps = {};

  afterEach(() => {
    mockAxios.reset();
  });

  const renderComponent = (props = defaultProps, tasks = defaultTasks) =>
    getActiveTaskListTestkit(
      render(
        <ProjectsContextProvider>
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
            <TasksContext.Provider
              value={{
                data: tasks,
                loading: false,
                setData: jest.fn(),
              }}
            >
              <ActiveTaskList {...props} />
            </TasksContext.Provider>
          </TagsContext.Provider>
        </ProjectsContextProvider>
      ).container
    );

  it("renders active tasks and tasks with not completed tasks without deadline", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
    expect(wrapper.getTasksCount()).toBe(3);
    expect(wrapper.getTaskTitleAt(0)).toBe(defaultTasks[0].title);
    expect(wrapper.getTaskTitleAt(1)).toBe(defaultTasks[1].title);
    expect(wrapper.getTaskTitleAt(2)).toBe(defaultTasks[2].title);
  });

  it('should render tasks in order "not completed" -> "completed"', () => {
    const tasks = generateCustomTasksList([
      { completed: false, isActive: true },
      { completed: true, isActive: true },
      { completed: false, deadline: 1100000, isActive: true },
      { completed: false, isActive: true },
    ]);

    const wrapper = renderComponent(defaultProps, tasks);
    expect(wrapper.getTaskTitleAt(0)).toBe(defaultTasks[0].title);
    expect(wrapper.getTaskTitleAt(1)).toBe(`${defaultTasks[3].title}`);
    expect(wrapper.getTaskTitleAt(2)).toBe(defaultTasks[1].title);
  });

  it("should sort tasks by estimate", () => {
    const tasks = generateCustomTasksList([
      { isActive: true, estimate: 3 },
      { isActive: true, estimate: 1 },
      { isActive: true, estimate: 2 },
    ]);

    const wrapper = renderComponent(defaultProps, tasks);

    expect(wrapper.getTaskTitleAt(0)).toBe(tasks[1].title);
    expect(wrapper.getTaskTitleAt(1)).toBe(tasks[2].title);
    expect(wrapper.getTaskTitleAt(2)).toBe(tasks[0].title);
  });

  describe("tags filter", () => {
    it("should not show any tags if there are no", async () => {
      const mockData = {
        projects: generateListOfProjects(3),
        defaultProject: null,
      };
      mockAxios.get.mockResolvedValue({ data: mockData });
      const tasks = generateCustomTasksList([
        { isActive: true },
        { isActive: true },
        { isActive: true },
      ]);

      const wrapper = renderComponent(defaultProps, tasks);

      await expect(screen.findByText("300")).resolves.toBeInTheDocument();
      expect(wrapper.getComponent().textContent).toContain(
        "Task 0Project 1task description 0Task 1Project 1task description 1Task 2Project 1task description 2"
      );
    });

    it("should show tags if there are tasks with tags", async () => {
      const mockData = {
        projects: generateListOfProjects(3),
        defaultProject: null,
      };
      mockAxios.get.mockResolvedValue({ data: mockData });

      const tasks = generateCustomTasksList([
        { isActive: true, tags: ["tag1"] },
        { isActive: true, tags: ["tag1"] },
        { isActive: true, tags: ["tag1", "tag2"] },
      ]);

      const wrapper = renderComponent(defaultProps, tasks);

      await expect(screen.findByText("300")).resolves.toBeInTheDocument();
      expect(wrapper.getComponent().textContent).toContain(
        "Task 0Project 1task description 0Tag 1Task 1Project 1task description 1Tag 1Task 2Project 1task description 2Tag 1Tag 2"
      );
    });

    it("should filter tasks if tag is deselected", async () => {
      const tasks = generateCustomTasksList([
        { isActive: true, tags: ["tag1"] },
        { isActive: true, tags: ["tag1"] },
        { isActive: true, tags: ["tag1", "tag2"] },
        { isActive: true },
      ]);

      const wrapper = renderComponent(defaultProps, tasks);

      const [tag1, tag2] = wrapper.getTags();

      expect(tag1.className).toContain("bg-primary");
      expect(tag2.className).toContain("bg-primary");

      fireEvent.click(tag1);

      expect(tag1.className).not.toContain("bg-primary");
      expect(tag2.className).toContain("bg-primary");
      expect(wrapper.getTasksCount()).toBe(1);
      expect(wrapper.getTaskTitleAt(0)).toBe(tasks[3].title);

      fireEvent.click(tag1);
      expect(tag1.className).toContain("bg-primary");
      expect(tag2.className).toContain("bg-primary");
      expect(wrapper.getTasksCount()).toBe(4);
      expect(wrapper.getTaskTitleAt(0)).toBe(tasks[0].title);
      expect(wrapper.getTaskTitleAt(1)).toBe(tasks[1].title);
      expect(wrapper.getTaskTitleAt(2)).toBe(tasks[2].title);
      expect(wrapper.getTaskTitleAt(3)).toBe(tasks[3].title);
    });
  });
});
