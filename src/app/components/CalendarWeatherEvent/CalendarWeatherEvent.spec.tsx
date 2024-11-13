import { render } from "@testing-library/react";
import CalendarWeatherEvent, {
  CalendarWeatherEventProps,
} from "./CalendarWeatherEvent";
import { getCalendarWeatherEventTestkit } from "./CalendarWeatherEvent.testkit";
import { now } from "@/app/utils/date/date";

describe("CalendarWeatherEvent", () => {
  const defaultProps: CalendarWeatherEventProps = {
    event: {
      title: "weather",
      start: now(),
      resource: {
        type: "weather",
        id: "id",
        temp: 20,
        weather: [
          {
            main: "Clear",
            description: "",
          },
        ],
      },
    },
  };
  const renderComponent = (props = defaultProps) =>
    getCalendarWeatherEventTestkit(
      render(<CalendarWeatherEvent {...props} />).container
    );

  it("should render CalendarWeatherEvent", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
