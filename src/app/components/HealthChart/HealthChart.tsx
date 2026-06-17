"use client";
import React, { FC, useCallback, useMemo, useState } from "react";

import { ChartConfig } from "../ui/chart";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useHabitsNewActions } from "@/app/utils/hooks/use-habits-new/actions-context";
import { useHabitsNewState } from "@/app/utils/hooks/use-habits-new/state-context";
import "./style.css";
import { BarChart } from "../../charts/BarChart";
import { Button } from "../ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import { Habit } from "@/models/habit";
import { RadarChart } from "../../charts/RadarChart";
import {
  getHabitProgress,
  getHabitProgressForLifeAspect,
} from "@/app/utils/habits/getHabitProgress";

import { GardenContainer } from "../Garden/GardenContainer";
import { useLifeAspectsState } from "@/app/utils/hooks/use-life-aspects/state-context";
import { getTodayWithZeroHours, toBackendDate } from "@/app/utils/date/date";
import { subDays } from "date-fns";

export interface HealthChartProps {
  testId?: string;
}

interface ChartItem {
  dataLabel: string;
  dataValue: number;
}

const HealthChart: FC<HealthChartProps> = (): JSX.Element => {
  const { addLog } = useHabitsNewActions();
  const { data: habits = [] } = useHabitsNewState();

  const { data: lifeAspects = [] } = useLifeAspectsState();
  const [selectedCategory, setSelectedCategory] = useState<
    undefined | string | "garden" | "chart"
  >("chart");

  const getHabitsData = useCallback(
    (habits: Habit[]) => {
      return habits.map((habit) => {
        const dataValue = Math.max(Math.min(getHabitProgress(habit), 100), 1);
        const todayTimestamp = getTodayWithZeroHours().getTime();

        const actions = [2, 1, 0]
          .map((day) => subDays(todayTimestamp, day).getTime())
          .map((timestamp) => ({
            log: habit.logs.find(
              (log) =>
                log.log_date.slice(0, 10) === toBackendDate(new Date(timestamp)),
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
    [addLog],
  );

  const chartData = useMemo(
    () =>
      habits
        .map((habit) => habit.life_aspect_id)
        .filter((item, pos, self) => self.indexOf(item) == pos)
        .reduce((prev: ChartItem[], curr) => {
          const habitsForCategory = habits.filter(
            (h) => h.life_aspect_id === curr,
          );
          const lifeAspect = lifeAspects.find(
            (la) => la.id.toString() === curr.toString(),
          );

          const progressPercentage = getHabitProgressForLifeAspect(
            habits,
            lifeAspect || [],
          );
          const boostedProgressPercentage = getHabitProgressForLifeAspect(
            habits,
            lifeAspect || [],
            true,
          );

          const allTheProgress = habitsForCategory.map((habit) => ({
            label: habit.title,
            progress: getHabitProgress(habit),
          }));

          return [
            ...prev,
            {
              dataLabel: lifeAspect ? lifeAspect.id.toString() : curr,
              dataValue: Math.floor(progressPercentage),
              dataValue1: Math.floor(boostedProgressPercentage),
              label: (
                <div className="mr-2">
                  {allTheProgress.map((pr) => (
                    <div key={pr.label}>
                      {pr.label} - {Math.floor(pr.progress)}%
                    </div>
                  ))}
                  {boostedProgressPercentage > progressPercentage && (
                    <>
                      <div>-----</div>
                      <div>
                        boosts: {boostedProgressPercentage - progressPercentage}
                      </div>
                    </>
                  )}
                </div>
              ),
            },
          ];
        }, []),
    [habits, lifeAspects],
  );

  const component = () => {
    if (selectedCategory === "chart") {
      return (
        <CardContent className="pb-0">
          <CardHeader className="flex flex-row items-center px-0 pb-0">
            <Button
              onClick={() => setSelectedCategory("garden")}
              variant="ghost"
              size="icon"
            >
              <IconArrowLeft size={12} />
            </Button>
            Go to Garden
          </CardHeader>
          <RadarChart
            data={chartData}
            onLabelClickAction={setSelectedCategory}
            config={
              {
                value: {
                  color: "hsl(var(--chart-5))",
                },
                value2: {
                  color: "hsl(var(--chart-5))",
                },
              } satisfies ChartConfig
            }
          />
        </CardContent>
      );
    }
    if (selectedCategory === "garden") {
      return (
        <CardContent>
          <CardHeader className="flex flex-row items-center px-0 pb-0">
            <Button
              onClick={() => setSelectedCategory("chart")}
              variant="ghost"
              size="icon"
            >
              <IconArrowLeft size={12} />
            </Button>
            Go to Chart
          </CardHeader>
          <GardenContainer onAssetClickAction={setSelectedCategory} />
        </CardContent>
      );
    }

    return (
      <CardContent className="pb-0 animate-slide-in">
        <CardHeader className="flex flex-row items-center px-0 pb-0">
          <Button
            onClick={() => setSelectedCategory("garden")}
            variant="ghost"
            size="icon"
          >
            <IconArrowLeft size={12} />
          </Button>
          {selectedCategory}
        </CardHeader>
        <BarChart
          data={getHabitsData(
            habits.filter(
              (h) =>
                h.life_aspect_id.toString() === selectedCategory?.toString(),
            ),
          )}
          config={{} as ChartConfig}
        />
      </CardContent>
    );
  };

  return <Card className="min-w-[350px]">{component()}</Card>;
};

export default HealthChart;
