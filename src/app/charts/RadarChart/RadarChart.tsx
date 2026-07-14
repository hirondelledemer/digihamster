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
import { ReactNode } from "react";

export interface RadarChartProps {
  data: {
    dataId: string;
    dataValue: number;
    dataValue1: number;
    dataLabel: string;
    tooltipLabel: ReactNode;
  }[];
  config?: ChartConfig;
  onLabelClickAction?: (label: string) => void;
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
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              className="w-[180px]"
              formatter={(_value, _name, item, index) => {
                if (index === 0) {
                  return item.payload.tooltipLabel;
                }
                return;
              }}
            />
          }
        />
        <PolarAngleAxis
          dataKey="dataId"
          onClick={({ value }) => {
            return onLabelClickAction && onLabelClickAction(value);
          }}
          tick={(e) => (
            <Text {...e} className="chart-tick">
              {data[e.index].dataLabel}
            </Text>
          )}
        />
        <PolarGrid gridType="circle" />
        <Radar
          dataKey="dataValue"
          fill="var(--color-value)"
          fillOpacity={0.6}
        />
        <Radar
          dataKey="dataValue1"
          fill="var(--color-value2)"
          fillOpacity={0.6}
        />
      </RadarChartRecharts>
    </ChartContainer>
  );
}
