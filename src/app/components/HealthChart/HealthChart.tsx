"use client";
import React, { FC, useMemo, useState } from "react";

import { ChartConfig } from "../ui/chart";
import { Card, CardContent, CardHeader } from "../ui/card";
import useHabits from "@/app/utils/hooks/use-habits";
import "./style.css";
import { BarChart } from "../../charts/BarChart";
import { Button } from "../ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import { Habit } from "#src/models/habit.js";
import { RadarChart } from "../../charts/RadarChart";
import {
  getHabitProgress,
  getHabitProgressForCategory,
} from "#src/app/utils/habits/getHabitProgress";

import { Category } from "../HabitForm/HabitForm.consts";
import { GardenContainer } from "../Garden/GardenContainer";

const getHabitsData = (habits: Habit[]) => {
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
  const [selectedCategory, setSelectedCategory] = useState<
    Category | "garden" | "chart"
  >("chart");

  const chartData = useMemo(
    () =>
      habits
        .map((habit) => habit.category)
        .filter((item, pos, self) => self.indexOf(item) == pos)
        .reduce((prev: ChartItem[], curr) => {
          const habitsForCategory = habits.filter((h) => h.category === curr);

          const progressPercentage = getHabitProgressForCategory(habits, curr);

          const allTheProgress = habitsForCategory.map((habit) => ({
            label: habit.title,
            progress: getHabitProgress(habit),
          }));

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
            habits.filter((h) => h.category === selectedCategory)
          )}
          config={getChartConfig(
            habits.filter((h) => h.category === selectedCategory)
          )}
        />
      </CardContent>
    );
  };

  return <Card className="min-w-[350px]">{component()}</Card>;
};

export default HealthChart;
