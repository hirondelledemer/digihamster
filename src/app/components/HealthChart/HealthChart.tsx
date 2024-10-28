"use client";
import React, { FC } from "react";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Card, CardContent } from "../ui/card";
import useHabits from "@/app/utils/hooks/use-habits";
import { now } from "@/app/utils/date/date";
import { DAY } from "@/app/utils/consts/dates";

export interface HealthChartProps {
  testId?: string;
}

const HealthChart: FC<HealthChartProps> = (): JSX.Element => {
  const { data: habits } = useHabits();

  const chartData = habits
    .map((habit) => habit.category)
    .filter(function (item, pos, self) {
      return self.indexOf(item) == pos;
    })
    .reduce((prev: object[], curr) => {
      const habitsForCategory = habits.filter((h) => h.category === curr);

      const total = habitsForCategory.reduce((prev, curr) => {
        return curr.timesPerMonth + prev;
      }, 0);

      const earliestDay = now().getTime() - 28 * DAY;

      const allTheProgress = habitsForCategory.map((habit) => {
        const progress = habit.log.filter(
          (log) => log.at >= earliestDay && log.completed
        ).length;
        const percentage = (progress / habit.timesPerMonth) * 100;
        return { label: habit.title, progress: percentage };
      });

      const progress = habitsForCategory.reduce((curr, prev) => {
        return (
          prev.log.filter((log) => log.at >= earliestDay && log.completed)
            .length + curr
        );
      }, 0);
      const progressPercentage = (progress / total) * 100;
      return [
        ...prev,
        {
          month: curr,
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
    }, []);

  return (
    <Card>
      <CardContent className="pb-0">
        <ChartContainer
          config={{}}
          className="mx-auto aspect-square max-h-[300px]"
          height={300}
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideIndicator />}
            />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar
              dataKey="value"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default HealthChart;
