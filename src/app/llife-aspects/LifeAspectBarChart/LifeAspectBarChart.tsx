import { toBackendDate } from "#utils/date";
import { BarChart } from "@/app/charts/BarChart";
import { ChartConfig } from "@/app/components/ui/chart";
import { getTodayWithZeroHours } from "@/app/utils/date/now";
import { getHabitProgress } from "@/app/utils/habits/habit-progress";
import { useHabitsNewActions } from "@/app/utils/hooks/use-habits-new/actions-context";
import { useHabitsNewState } from "@/app/utils/hooks/use-habits-new/state-context";
import { IHabitWithLogs } from "@/app/utils/types/habit";
import { subDays } from "date-fns";
import { FC, useCallback } from "react";

export const LifeAspectBarChart: FC<{ lifeAspectId: number }> = ({
  lifeAspectId,
}) => {
  const { addLog } = useHabitsNewActions();
  const { data: habits = [] } = useHabitsNewState();

  const getHabitsData = useCallback(
    (habits: IHabitWithLogs[]) => {
      return habits.map((habit) => {
        const dataValue = Math.max(Math.min(getHabitProgress(habit), 100), 1);
        const todayTimestamp = getTodayWithZeroHours().getTime();

        const actions = [2, 1, 0]
          .map((day) => subDays(todayTimestamp, day).getTime())
          .map((timestamp) => ({
            log: habit.logs.find(
              (log) =>
                log.log_date.slice(0, 10) === toBackendDate(new Date(timestamp))
            ),
            timestamp,
          }))
          .map((log) => ({
            disabled: log.log?.completed,
            onClick: () => {
              addLog(habit.id, {
                completed: true,
                at: log.timestamp,
              });
            },
          }));

        return {
          dataLabel: habit.title,
          _id: habit.id.toString(),
          tempDataValue: 0,
          dataValue,
          getFillColor: (value: number) =>
            `hsl(var(--scale-color-${Math.floor(value / 10)}))`,
          fill: `hsl(var(--scale-color-${Math.floor(dataValue / 10)}))`,
          actions,
        };
      });
    },
    [addLog]
  );

  return (
    <BarChart
      data={getHabitsData(
        habits.filter((h) => h.life_aspect_id === lifeAspectId)
      )}
      config={{} as ChartConfig}
    />
  );
};
