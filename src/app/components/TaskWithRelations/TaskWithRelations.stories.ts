import type { Meta, StoryObj } from "@storybook/react";

import TaskWithRelations from ".";
import { TaskWithRelationsProps } from "./TaskWithRelations";
import { generateCustomTasksList, generateTask } from "@/app/utils/mocks/task";

const meta: Meta<typeof TaskWithRelations> = {
  title: "Today/TaskWithRelations",
  component: TaskWithRelations,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TaskWithRelations>;

const relatedTasks = generateCustomTasksList([
  {
    title: "find birthday cake",
  },
  {
    title: "buy balloons",
  },
]);

const defaultArgs: TaskWithRelationsProps = {
  task: generateTask(0, {
    title: "Prepare for birthday party",
    relatedTaskIds: relatedTasks.map((t) => t._id),
  }),
};

export const Default: Story = {
  args: defaultArgs,
};
