import { render } from "@testing-library/react";
import TimelineChart, { TimelineChartProps } from "./TimelineChart";
import { getTimelineChartTestkit } from "./TimelineChart.testkit";
import { sub } from "date-fns";
import { now } from "../../utils/date/date";

jest.mock("../../utils/date/date");

describe("TimelineChart", () => {
  const defaultProps: TimelineChartProps = {
    chartConfig: {
      project1: {
        color: "#FF6B6B",
        label: "Project 1",
      },
      project2: {
        color: "#713f12",
        label: "Project 2",
      },
      project3: {
        color: "#84cc16",
        label: "Project 3",
      },
    },
    chartData: [
      {
        day: sub(now(), {
          days: 1,
        }),
        project1: 1,
        project2: 4,
        project3: 3,
      },
      {
        day: sub(now(), {
          days: 2,
        }),
        project1: 3,
        project2: 0,
        project3: 3,
      },
      {
        day: sub(now(), {
          days: 3,
        }),
        project1: 4,
        project2: 2,
        project3: 1,
      },
    ],
  };
  const renderComponent = (props = defaultProps) =>
    getTimelineChartTestkit(render(<TimelineChart {...props} />).container);

  it("should render TimelineChart", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
