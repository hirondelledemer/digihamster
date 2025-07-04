"use client";

import {
  RadarChart as RadarChartRecharts,
  PolarAngleAxis,
  Text,
  PolarGrid,
  Radar,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart";
import { Category } from "#src/app/components/HabitForm/HabitForm.consts.js";

export interface RadarChartProps {
  data: {
    dataLabel: string;
    dataValue: number;
    fill?: string;
  }[];
  config?: ChartConfig;
  onLabelClickAction?: (label: Category) => void;
}

export function RadarChart({
  data,
  config = {},
  onLabelClickAction,
}: RadarChartProps) {
  return (
    <ChartContainer
      config={config}
      className="mx-auto aspect-square max-h-[300px]"
      height={300}
    >
      <RadarChartRecharts data={data}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <PolarAngleAxis
          dataKey="dataLabel"
          onClick={({ value }) =>
            onLabelClickAction && onLabelClickAction(value)
          }
          tick={(e) => (
            <Text {...e} className="chart-tick">
              {e.payload.value}
            </Text>
          )}
        />
        <PolarGrid gridType="circle" />
        <Radar
          dataKey="dataValue"
          fill="var(--color-value)"
          fillOpacity={0.6}
        />
      </RadarChartRecharts>
    </ChartContainer>
  );
}
