import { cloneElement, ReactElement } from "react";
import { render, screen, fireEvent } from "@/config/utils/test-utils";
import { RadarChart, RadarChartDataItem } from "./RadarChart";

// Recharts' ResponsiveContainer reports 0x0 in jsdom, so the chart renders
// nothing. Give the inner chart concrete dimensions so the SVG is produced.
jest.mock("recharts", () => {
  const Original = jest.requireActual("recharts");
  return {
    ...Original,
    ResponsiveContainer: ({ children }: { children: ReactElement }) =>
      cloneElement(children, { width: 500, height: 500 }),
  };
});

type ValueKey = "basePercentage" | "boostedPercentage";

const data: RadarChartDataItem<ValueKey>[] = [
  {
    dataId: "10",
    dataLabel: "self care",
    basePercentage: 62,
    boostedPercentage: 62,
    tooltipLabel: "self care tooltip",
  },
  {
    dataId: "9",
    dataLabel: "relationships",
    basePercentage: 75,
    boostedPercentage: 80,
    tooltipLabel: "relationships tooltip",
  },
  {
    dataId: "11",
    dataLabel: "mental health",
    basePercentage: 27,
    boostedPercentage: 27,
    tooltipLabel: "mental health tooltip",
  },
];

const renderComponent = (
  props: Partial<React.ComponentProps<typeof RadarChart<ValueKey>>> = {},
) =>
  render(
    <RadarChart
      data={data}
      dataValueKeys={["basePercentage", "boostedPercentage"]}
      {...props}
    />,
  );

describe("RadarChart", () => {
  it("renders nothing when data is empty", () => {
    const { container } = renderComponent({ data: [] });

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a radar polygon for each value key present in the data", () => {
    const { container } = renderComponent();

    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelectorAll(".recharts-radar")).toHaveLength(2);
  });

  it("renders a label for every data point", () => {
    renderComponent();

    expect(screen.getByText("self care")).toBeInTheDocument();
    expect(screen.getByText("relationships")).toBeInTheDocument();
    expect(screen.getByText("mental health")).toBeInTheDocument();
  });

  it("only renders radars for keys that exist on the data items", () => {
    const { container } = renderComponent({
      // "boostedPercentage" is requested but absent from the data
      dataValueKeys: ["basePercentage", "boostedPercentage"],
      data: data.map(({ boostedPercentage: _, ...rest }) => rest) as never,
    });

    // eslint-disable-next-line testing-library/no-container
    expect(container.querySelectorAll(".recharts-radar")).toHaveLength(1);
  });

  it("calls onLabelClickAction with the dataId when a label is clicked", () => {
    const onLabelClickAction = jest.fn();
    renderComponent({ onLabelClickAction });

    fireEvent.click(screen.getByText("mental health"));

    expect(onLabelClickAction).toHaveBeenCalledWith("11");
  });
});
