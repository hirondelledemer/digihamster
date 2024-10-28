import React, { FC, useCallback, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { eachDayOfInterval, format } from "date-fns";
import { firstBy, pipe } from "remeda";
import useTasks from "@/app/utils/hooks/use-tasks";
import { now } from "@/app/utils/date/date";

export interface ProjectBurnDownChartProps {
  projectId: string;
}

const chartConfig = {
  completedTasks: {
    label: "Completed Tasks",
    color: "hsl(var(--chart-2))",
  },
  restTasks: {
    label: "Rest Tasks",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const ProjectBurnDownChart: FC<ProjectBurnDownChartProps> = ({
  projectId,
}): JSX.Element => {
  const { data: tasks } = useTasks();

  const filteredTasks = useMemo(
    () => tasks.filter((task) => task.projectId === projectId),
    [tasks, projectId]
  );

  const getData = useCallback(() => {
    const startDate = pipe(
      filteredTasks,
      firstBy((task) => new Date(task.createdAt || 0).getTime())
    )?.createdAt;

    if (!startDate) {
      return [];
    }
    const endDate = now();

    return eachDayOfInterval({ start: startDate, end: endDate }).map((date) => {
      const completedTasksCount = filteredTasks.filter(
        (t) =>
          t.completedAt && new Date(t.completedAt).getTime() <= date.getTime()
      ).length;
      return {
        day: format(date, "MMM, d"),
        completedTasks: completedTasksCount,
        restTasks:
          filteredTasks.filter(
            (t) => new Date(t.createdAt || 0).getTime() <= date.getTime()
          ).length - completedTasksCount,
      };
    });
  }, [filteredTasks]);

  return (
    <div className="h-[300px] mb-2 mt-2">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} height={200}>
            <AreaChart
              accessibilityLayer
              data={getData()}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="completedTasks"
                type="natural"
                fill="var(--color-completedTasks)"
                fillOpacity={0.4}
                stroke="var(--color-completedTasks)"
                stackId="a"
              />
              <Area
                dataKey="restTasks"
                type="natural"
                fill="var(--color-restTasks)"
                fillOpacity={0.4}
                stroke="var(--color-restTasks)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectBurnDownChart;
