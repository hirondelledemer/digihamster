"use client";
import React, { FC, ReactNode, useMemo } from "react";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Card, CardContent } from "../ui/card";
import useHabits from "@/app/utils/hooks/use-habits";
import { now } from "@/app/utils/date/date";
import { subDays } from "date-fns";

export interface HealthChartProps {
  testId?: string;
}

interface ChartItem {
  item: string;
  value: number;
  lastMonthValue: number;
  label: ReactNode;
}

const HealthChart: FC<HealthChartProps> = (): JSX.Element => {
  const { data: habits } = useHabits();

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

          const lastMonthEarliestDay = subDays(now(), 56).getTime();

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

          const lastMonthProgress = habitsForCategory.reduce((curr, prev) => {
            return (
              prev.log.filter(
                (log) =>
                  log.at >= lastMonthEarliestDay &&
                  log.at < earliestDay &&
                  log.completed
              ).length + curr
            );
          }, 0);

          const progressPercentage = Math.min((progress / total) * 100, 100);

          const lastMonthProgressPercentage = Math.min(
            (lastMonthProgress / total) * 100,
            100
          );

          return [
            ...prev,
            {
              item: curr,
              value: Math.floor(progressPercentage),
              lastMonthValue: Math.floor(lastMonthProgressPercentage),
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

  return (
    <Card>
      <CardContent className="pb-0">
        <ChartContainer
          config={{
            value: {
              color: "hsl(var(--chart-5))",
            },
            lastMonthValue: {
              label: "Last month",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="mx-auto aspect-square max-h-[300px]"
          height={300}
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="item" />
            <PolarGrid />
            <Radar
              dataKey="value"
              fill="var(--color-value)"
              fillOpacity={0.6}
            />
            <Radar
              dataKey="lastMonthValue"
              fill="var(--color-lastMonthValue)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default HealthChart;
