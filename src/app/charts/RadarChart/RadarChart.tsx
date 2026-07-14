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
  dataValueKeys: string[];
  config?: ChartConfig;
  onLabelClickAction?: (label: string) => void;
}

export function RadarChart({
  data,
  config = {},
  onLabelClickAction,
  dataValueKeys,
}: RadarChartProps) {
  if (!data.length) {
    return null;
  }

  const firstItem = data[0];

  const itemsToShow = dataValueKeys.reduce((acc, key: string) => {
    if (key in firstItem) {
      acc[key] = firstItem[key];
    }
    return acc;
  }, {});

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
        {Object.keys(itemsToShow).map((key) => (
          <Radar
            key={key}
            dataKey={key}
            fill="var(--color-value)"
            fillOpacity={0.6}
          />
        ))}
      </RadarChartRecharts>
    </ChartContainer>
  );
}
