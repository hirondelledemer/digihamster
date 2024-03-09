import { render } from "@testing-library/react";
import CommandTool, { CommandToolProps } from "./CommandTool";
import { getCommandToolTestkit } from "./CommandTool.testkit";

// todo show fetch only active tasks
describe("CommandTool", () => {
  const defaultProps: CommandToolProps = {};
  const renderComponent = (props = defaultProps) =>
    getCommandToolTestkit(render(<CommandTool {...props} />).container);

  it("should render CommandTool", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
