import type { Meta, StoryObj } from "@storybook/react";

import CalendarWeatherEvent from ".";
import { CalendarWeatherEventProps } from "./CalendarWeatherEvent";
import { now } from "@/app/utils/date/date";

const meta: Meta<typeof CalendarWeatherEvent> = {
  title: "Example/CalendarWeatherEvent",
  component: CalendarWeatherEvent,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CalendarWeatherEvent>;

const defaultArgs: CalendarWeatherEventProps = {
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

export const Default: Story = {
  args: defaultArgs,
};
