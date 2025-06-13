"use client";
import React, { FC, useMemo, useState } from "react";

import { PolarAngleAxis, PolarGrid, Radar, Text, RadarChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Card, CardContent, CardHeader } from "../ui/card";
import useHabits from "@/app/utils/hooks/use-habits";
import { now } from "@/app/utils/date/date";
import { subDays } from "date-fns";
import "./style.css";
import { ChartBar } from "./BarChart";
import { Button } from "../ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import { Habit } from "#src/models/habit.js";

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
  item: string;
  value: number;
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
              item: curr,
              value: Math.floor(progressPercentage),
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
          <ChartContainer
            config={{
              value: {
                color: "hsl(var(--chart-5))",
              },
            }}
            className="mx-auto aspect-square max-h-[300px]"
            height={300}
          >
            <RadarChart data={chartData}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <PolarAngleAxis
                dataKey="item"
                onClick={({ value }) => setSelectedCategory(value)}
                tick={(e) => (
                  <Text {...e} className="chart-tick">
                    {e.payload.value}
                  </Text>
                )}
              />
              <PolarGrid gridType="circle" />
              <Radar
                dataKey="value"
                fill="var(--color-value)"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      );
    }

    return (
      <CardContent className="pb-0">
        <CardHeader>
          <Button onClick={() => setSelectedCategory(null)}>
            <IconArrowLeft />
          </Button>
        </CardHeader>
        <ChartBar
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
