"use client";

import {
  Bar,
  BarChart as BarChartRecharts,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart";

export interface BarChartProps {
  data: {
    dataLabel: string;
    dataValue: number;
    fill: string;
  }[];
  config?: ChartConfig;
}

export function BarChart({ data, config = {} }: BarChartProps) {
  return (
    <ChartContainer
      config={config}
      className="mx-auto max-h-[214px] max-w-[300px]"
      height={300}
    >
      <BarChartRecharts accessibilityLayer data={data} layout="vertical">
        <YAxis
          dataKey="dataLabel"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) =>
            config[value as keyof typeof config]?.label as string
          }
          padding={{ bottom: 150 }}
          hide
        />
        <XAxis dataKey="dataValue" type="number" hide domain={[0, 100]} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideIndicator />}
        />

        <Bar dataKey="dataValue" layout="vertical" radius={5}>
          <LabelList
            dataKey="dataLabel"
            position="insideLeft"
            offset={8}
            fill="white"
            width={200}
            fontSize={12}
            overflow="hidden"
          />
        </Bar>
      </BarChartRecharts>
    </ChartContainer>
  );
}
