"use client";
import React, { FC, useMemo, useState } from "react";

import { ChartConfig } from "../ui/chart";
import { Card, CardContent, CardHeader } from "../ui/card";
import useHabits from "@/app/utils/hooks/use-habits";
import { now } from "@/app/utils/date/date";
import { subDays } from "date-fns";
import "./style.css";
import { BarChart } from "../../charts/BarChart";
import { Button } from "../ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import { Habit } from "#src/models/habit.js";
import { RadarChart } from "../../charts/RadarChart";

const getHabitsData = (habits: Habit[]) => {
  const earliestDay = subDays(now(), 28).getTime();

  const getHabitProgress = (habit: Habit) => {
    const progress = habit.log.filter(
      (log) => log.at >= earliestDay && log.completed
    ).length;
    const percentage = (progress / habit.timesPerMonth) * 100;
    return percentage;
  };

  return habits.map((habit) => {
    const dataValue = Math.max(Math.min(getHabitProgress(habit), 100), 1);

    return {
      dataLabel: habit.title,
      dataValue,
      fill: `hsl(var(--scale-color-${Math.floor(dataValue / 10)}))`,
    };
  });
};

const getChartConfig = (habits: { title: string }[]) => {
  return habits.reduce((config, habit, index) => {
    return {
      ...config,
      [habit.title]: {
        label: habit.title,
        color: `var(--chart-${index + 1})`,
      },
    };
  }, {}) satisfies ChartConfig;
};

export interface HealthChartProps {
  testId?: string;
}

interface ChartItem {
  dataLabel: string;
  dataValue: number;
}

const HealthChart: FC<HealthChartProps> = (): JSX.Element => {
  const { data: habits } = useHabits();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const chartData = useMemo(
    () =>
      habits
        .map((habit) => habit.category)
        .filter((item, pos, self) => self.indexOf(item) == pos)
        .reduce((prev: ChartItem[], curr) => {
          const habitsForCategory = habits.filter((h) => h.category === curr);

          const total = habitsForCategory.reduce((prev, curr) => {
            return curr.timesPerMonth + prev;
          }, 0);

          const earliestDay = subDays(now(), 28).getTime();

          const progress = habitsForCategory.reduce((curr, prev) => {
            return (
              prev.log.filter((log) => log.at >= earliestDay && log.completed)
                .length + curr
            );
          }, 0);

          const progressPercentage = Math.min((progress / total) * 100, 100);

          const allTheProgress = habitsForCategory.map((habit) => {
            const progress = habit.log.filter(
              (log) => log.at >= earliestDay && log.completed
            ).length;
            const percentage = (progress / habit.timesPerMonth) * 100;
            return { label: habit.title, progress: percentage };
          });

          return [
            ...prev,
            {
              dataLabel: curr,
              dataValue: Math.floor(progressPercentage),
              label: (
                <div className="mr-2">
                  {allTheProgress.map((pr) => (
                    <div key={pr.label}>
                      {pr.label} - {Math.floor(pr.progress)}%
                    </div>
                  ))}
                </div>
              ),
            },
          ];
        }, []),
    [habits]
  );

  const component = () => {
    if (!selectedCategory) {
      return (
        <CardContent className="pb-0">
          <RadarChart
            data={chartData}
            onLabelClickAction={setSelectedCategory}
            config={
              {
                value: {
                  color: "hsl(var(--chart-5))",
                },
              } satisfies ChartConfig
            }
          />
        </CardContent>
      );
    }

    return (
      <CardContent className="pb-0 animate-slide-in">
        <CardHeader className="flex flex-row items-center px-0">
          <Button
            onClick={() => setSelectedCategory(null)}
            variant="ghost"
            size="icon"
          >
            <IconArrowLeft size={12} />
          </Button>
          {selectedCategory}
        </CardHeader>
        <BarChart
          data={getHabitsData(
            habits.filter((h) => h.category === selectedCategory)
          )}
          config={getChartConfig(
            habits.filter((h) => h.category === selectedCategory)
          )}
        />
      </CardContent>
    );
  };

  return <Card>{component()}</Card>;
};

export default HealthChart;
