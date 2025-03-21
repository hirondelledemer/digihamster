import type { Meta, StoryObj } from "@storybook/react";

import TodayEvent from ".";
import { TodayEventProps } from "./TodayEvent";
import { generateCustomTasksList, generateTask } from "@/app/utils/mocks/task";
import { now } from "@/app/utils/date/date";

const meta: Meta<typeof TodayEvent> = {
  title: "Today/TodayEvent",
  component: TodayEvent,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TodayEvent>;

const defaultArgs: TodayEventProps = {
  isFocused: false,
  event: {
    title: "Birthday Party",
    start: now(),
    resource: {
      id: "event1",
      completed: false,
      type: "event",
      description: "don't forget to bring the birthday cake",
      tasks: [],
    },
  },
};

export const Default: Story = {
  args: defaultArgs,
};

const focusedArgs: TodayEventProps = {
  isFocused: true,
  event: {
    title: "Birthday Party",
    start: now(),
    resource: {
      id: "event1",
      completed: false,
      type: "event",
      description: "don't forget to bring the birthday cake",
      tasks: [],
    },
  },
};

export const Focused: Story = {
  args: focusedArgs,
};

const completedArgs: TodayEventProps = {
  isFocused: false,
  event: {
    title: "Birthday Party",
    start: now(),
    resource: {
      id: "event1",
      completed: true,
      type: "event",
      description: "don't forget to bring the birthday cake",
      tasks: [],
    },
  },
};

export const Completed: Story = {
  args: completedArgs,
};

const tasks = generateCustomTasksList([
  { title: "by candles" },
  { title: "buy balloons" },
]);

const withTasksArgs: TodayEventProps = {
  isFocused: false,
  event: {
    title: "Birthday Party",
    start: now(),
    resource: {
      id: "event1",
      completed: false,
      type: "event",
      description: "don't forget to bring the birthday cake",
      tasks,
    },
  },
};

export const WithTasks: Story = {
  args: withTasksArgs,
};

const taskEventArgs: TodayEventProps = {
  isFocused: false,
  event: {
    title: "Buy Candles",
    start: now(),
    resource: {
      id: "event1",
      completed: false,
      type: "deadline",
      task: generateTask(0, {
        title: "Buy Candles",
      }),
    },
  },
};

export const TaskEvent: Story = {
  args: taskEventArgs,
};
