import type { Meta, StoryObj } from "@storybook/react";

import CalendarWeatherEvent from ".";
import { CalendarWeatherEventProps } from "./CalendarWeatherEvent";

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
    resource: {
      type: "weather",
      id: "id",
      temp: 20,
      weather: [
        {
          main: "Clear",
        },
      ],
    },
  },
};

export const Default: Story = {
  args: defaultArgs,
};
