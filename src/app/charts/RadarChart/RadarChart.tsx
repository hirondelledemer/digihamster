"use client";

import {
  RadarChart as RadarChartRecharts,
  PolarAngleAxis,
  PolarRadiusAxis,
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

export type RadarChartDataItem<ValueKey extends string = never> = {
  dataId: string | number;
  dataLabel: string;
  tooltipLabel: ReactNode;
} & Record<ValueKey, number>;

export interface RadarChartProps<ValueKey extends string = never> {
  data: RadarChartDataItem<ValueKey>[];
  dataValueKeys: ValueKey[];
  config?: ChartConfig;
  onLabelClickAction?: (label: string) => void;
  /** Radius axis domain [min, max]. Defaults to [0, 100]. */
  domain?: [number, number];
}

export function RadarChart<ValueKey extends string>({
  data,
  config = {},
  onLabelClickAction,
  dataValueKeys,
  domain = [0, 100],
}: RadarChartProps<ValueKey>) {
  if (!data.length) {
    return null;
  }

  const firstItem = data[0];

  const keysToShow = dataValueKeys.filter((key) => key in firstItem);

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
        <PolarRadiusAxis domain={domain} tick={false} axisLine={false} />
        {keysToShow.map((key) => (
          <Radar
            key={key}
            dataKey={key}
            fill="var(--color-value)"
            fillOpacity={0.6}
            stroke="var(--color-value)"
            strokeWidth={2}
            dot={{ r: 3, fillOpacity: 1 }}
          />
        ))}
      </RadarChartRecharts>
    </ChartContainer>
  );
}
