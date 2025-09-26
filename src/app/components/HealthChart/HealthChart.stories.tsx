import type { Meta, StoryObj } from "@storybook/react";

import HealthChart from ".";
import { HealthChartProps } from "./HealthChart";
import { HabitsContext } from "@/app/utils/hooks/use-habits";
import { now } from "@/app/utils/date/date";
import { subDays } from "date-fns";
import { generateCustomHabitList } from "@/app/utils/mocks/habit";
import { generateListOfLifeAspects } from "#src/app/utils/mocks/lifeAspect";

const lifeAspects = generateListOfLifeAspects(3);

const meta: Meta<typeof HealthChart> = {
  title: "Example/HealthChart",
  component: HealthChart,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <HabitsContext.Provider
        value={{
          data: generateCustomHabitList([
            {
              title: "Go to the gym",
              category: lifeAspects[0]._id,
              timesPerMonth: 12,
              log: [
                {
                  at: subDays(now(), 25).getTime(),
                  completed: true,
                },
                {
                  at: subDays(now(), 18).getTime(),
                  completed: true,
                },
                {
                  at: subDays(now(), 12).getTime(),
                  completed: true,
                },
                {
                  at: subDays(now(), 7).getTime(),
                  completed: true,
                },
                {
                  at: subDays(now(), 3).getTime(),
                  completed: true,
                },
                {
                  at: now().getTime(),
                  completed: true,
                },
              ],
            },
            {
              title: "Bike to work",
              category: lifeAspects[0]._id,
              timesPerMonth: 12,
              log: [
                {
                  at: subDays(now(), 25).getTime(),
                  completed: true,
                },
                {
                  at: subDays(now(), 7).getTime(),
                  completed: true,
                },
                {
                  at: subDays(now(), 3).getTime(),
                  completed: true,
                },
                {
                  at: now().getTime(),
                  completed: true,
                },
              ],
            },
            {
              title: "Write a story",
              category: lifeAspects[1]._id,
              timesPerMonth: 4,
              log: [
                {
                  at: subDays(now(), 25).getTime(),
                  completed: true,
                },
                {
                  at: subDays(now(), 7).getTime(),
                  completed: true,
                },
                {
                  at: subDays(now(), 3).getTime(),
                  completed: true,
                },
                {
                  at: now().getTime(),
                  completed: true,
                },
              ],
            },
            {
              title: "Read a book",
              category: lifeAspects[2]._id,
              timesPerMonth: 5,
              log: [
                {
                  at: subDays(now(), 25).getTime(),
                  completed: true,
                },
                {
                  at: subDays(now(), 7).getTime(),
                  completed: true,
                },
                {
                  at: subDays(now(), 3).getTime(),
                  completed: true,
                },
                {
                  at: now().getTime(),
                  completed: true,
                },
              ],
            },
            {
              title: "Drink water",
              category: "health",
              timesPerMonth: 25,
              log: [
                {
                  at: subDays(now(), 25).getTime(),
                  completed: true,
                },
                {
                  at: subDays(now(), 7).getTime(),
                  completed: true,
                },
                {
                  at: subDays(now(), 3).getTime(),
                  completed: true,
                },
                {
                  at: now().getTime(),
                  completed: true,
                },
              ],
            },
          ]),

          loading: false,
          setData: () => {},
          error: false,
          updateHabit: () => {},
          deleteHabit: () => {},
          addLog: () => {},
          createHabit: () => {},
        }}
      >
        <Story />
      </HabitsContext.Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HealthChart>;

const defaultArgs: HealthChartProps = {};

export const Default: Story = {
  args: defaultArgs,
};
