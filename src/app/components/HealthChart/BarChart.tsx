"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart";

export const description = "A mixed bar chart";

interface ChartBarProps {
  data: {
    dataLabel: string;
    dataValue: number;
    fill: string;
  }[];
  config: ChartConfig;
}

export function ChartBar({ data, config }: ChartBarProps) {
  return (
    <ChartContainer
      config={config}
      className="mx-auto max-h-[214px] max-w-[300px]"
      height={300}
    >
      <BarChart accessibilityLayer data={data} layout="vertical" margin={{}}>
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
      </BarChart>
    </ChartContainer>
  );
}
