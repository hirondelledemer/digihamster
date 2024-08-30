import type { Meta, StoryObj } from "@storybook/react";

import CalendarEvent from ".";
import { CalendarEventProps } from "./CalendarEvent";

const meta: Meta<typeof CalendarEvent> = {
  title: "Example/CalendarEvent",
  component: CalendarEvent,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CalendarEvent>;

const defaultArgs: CalendarEventProps = {
  event: {
    allDay: false,
    title: "New Event",
    start: new Date(),
    end: new Date(),
    resource: {
      id: "event1",
      completed: false,
      type: "event",
    },
  },
};

export const Default: Story = {
  args: defaultArgs,
};

const completedArgs: CalendarEventProps = {
  event: {
    allDay: false,
    title: "New Event",
    start: new Date(),
    end: new Date(),
    resource: {
      id: "event1",
      completed: true,
      type: "event",
    },
  },
};

export const Completed: Story = {
  args: completedArgs,
};
