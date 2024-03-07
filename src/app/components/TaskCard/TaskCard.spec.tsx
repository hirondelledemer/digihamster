import { render } from "@testing-library/react";
import TaskCard, { TaskCardProps } from "./TaskCard";
import { getTaskCardTestkit } from "./TaskCard.testkit";
import { ProjectsContext } from "@/app/utils/hooks/use-projects";
import { generateTask } from "@/app/utils/mocks/task";

describe("TaskCard", () => {
  const task = generateTask();
  const defaultProps: TaskCardProps = {
    task,
  };

  const renderComponent = (props = defaultProps) =>
    getTaskCardTestkit(
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
            loading: false,
            setData: jest.fn(),
          }}
        >
          <TaskCard {...props} />
        </ProjectsContext.Provider>
      ).container
    );

  it("should render TaskCard", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });

  it("shows task title, project name, description, tags", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent().textContent).toBe(
      "Task 1Project 1task description"
    );
  });
});
