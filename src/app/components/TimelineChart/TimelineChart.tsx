import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent } from "@/app/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart";
import { FC } from "react";

export const description = "<<description>>";

export interface TimelineChartProps {
  testId?: string;
  chartData: any;
  chartConfig: ChartConfig;
}

const TimelineChart: FC<TimelineChartProps> = ({ chartConfig, chartData }) => {
  return (
    <Card className="h-full">
      <CardContent>
        <ChartContainer config={chartConfig} height={200}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />

            {Object.keys(chartConfig)
              .filter((key) => !!chartConfig[key])
              .map((key) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="key"
                  fill={chartConfig[key].color}
                />
              ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TimelineChart;
