import { render, screen, userEvent } from "@/config/utils/test-utils";
import TaskWithRelations, { TaskWithRelationsProps } from "./TaskWithRelations";

import { generateCustomTasksList, generateTask } from "@/app/utils/mocks/task";

describe("TaskWithRelations", () => {
  const defaultProps: TaskWithRelationsProps = { task: generateTask() };
  const renderComponent = (props = defaultProps) =>
    render(<TaskWithRelations {...props} />).container;

  it("should render TaskWithRelations", () => {
    renderComponent();
    expect(screen.getByText(defaultProps.task.title)).toBeInTheDocument();
  });

  it("should not show 'more tasks' button", () => {
    renderComponent();
    expect(screen.queryByText(/related tasks/i)).not.toBeInTheDocument();
  });

  describe("related tasks exists", () => {
    it("should show 'more tasks' button", async () => {
      const relatedTasks = generateCustomTasksList([
        { title: "Related Task 1" },
        { title: "Related Task 2" },
      ]);
      const taskWithRelatedTasks = generateTask(0, { relatedTasks });
      const props: TaskWithRelationsProps = { task: taskWithRelatedTasks };

      renderComponent(props);
      expect(screen.getByText(/related tasks/i)).toBeInTheDocument();
      await userEvent.click(screen.getByText(/related tasks/i));

      expect(screen.getAllByText(/related task/i)).toHaveLength(3);
    });
  });
});
