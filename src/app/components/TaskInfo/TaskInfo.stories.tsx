import type { Meta, StoryObj } from "@storybook/react";

import TaskInfo from ".";
import { TaskInfoProps } from "./TaskInfo";
import { useRouter, useSearchParams } from "@/app/lib/navigation.mock";
import { ReadonlyURLSearchParams } from "next/navigation";
import { TasksContext } from "@/app/utils/hooks/use-tasks";
import { generateCustomTasksList } from "@/app/utils/mocks/task";
import { NotesStateContext } from "@/app/utils/hooks/use-notes/state-context";
import { generateCustomNotesList } from "@/app/utils/mocks/note";

const meta: Meta<typeof TaskInfo> = {
  title: "Example/TaskInfo",
  component: TaskInfo,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <NotesStateContext.Provider
        value={{
          data: generateCustomNotesList([{ _id: "note1" }, { _id: "note1" }]),
          isLoading: false,
        }}
      >
        <TasksContext.Provider
          value={{
            data: generateCustomTasksList([
              {
                _id: "task0",
                relatedTaskIds: ["task1", "task2"],
                relatedNoteIds: ["note0", "note1"],
              },
              { _id: "task1" },
              { _id: "task2" },
            ]),
            loading: false,
            setData: () => {},
          }}
        >
          <Story />
        </TasksContext.Provider>
      </NotesStateContext.Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TaskInfo>;

const defaultArgs: TaskInfoProps = {};

export const Default: Story = {
  async beforeEach() {
    useRouter.mockReturnValue({
      push: () => {},
      replace: () => {},
      back: () => {},
      forward: () => {},
      refresh: () => {},
      prefetch: () => {},
    });

    useSearchParams.mockReturnValue({
      get: () => "task0",
    } as unknown as ReadonlyURLSearchParams);
  },
  args: defaultArgs,
};
