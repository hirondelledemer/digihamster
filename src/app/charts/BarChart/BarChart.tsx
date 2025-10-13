"use client";

import { Bar, BarChart as BarChartRecharts, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart";

import { useCallback, useState } from "react";

import { Button } from "@/app/components/ui/button";
import { CheckCheckIcon } from "lucide-react";

type ActionItem = {
  onClick: () => void;
  disabled?: boolean;
};
export interface BarChartProps {
  data: {
    _id: string;
    dataLabel: string;
    dataValue: number;
    fill: string;
    getFillColor?(val: number): string;
    actions: ActionItem[];
  }[];
  config: ChartConfig;
}

export function BarChart({ data: chartData, config }: BarChartProps) {
  const [data, setData] = useState<BarChartProps["data"]>(chartData);

  const onHover = useCallback((id: string, value: number) => {
    setData((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              dataValue: item.dataValue + value,
              fill: item.getFillColor
                ? item.getFillColor(item.dataValue + value)
                : "", // todo: add default color
            }
          : item
      )
    );
  }, []);

  return (
    <div className="relative">
      <div>
        <ChartContainer
          config={config}
          className="mx-auto max-h-[214px] max-w-[300px] flex"
          height={300}
        >
          <BarChartRecharts
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
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
            <Bar
              dataKey="dataValue"
              layout="vertical"
              radius={5}
              barSize={20}
              stackId={"a"}
            />
          </BarChartRecharts>
        </ChartContainer>
      </div>
      <div className=" border-primary absolute right-0 top-0 flex flex-col gap-[2px]">
        {data.map((actionsItem) => (
          <div
            key={actionsItem._id}
            style={{ height: 130 / data.length }}
            className="flex justify-end items-baseline"
          >
            <div className="text-[10px]">{actionsItem.dataLabel}</div>
            {actionsItem &&
              actionsItem.actions.map((item: ActionItem, index: number) => (
                <Button
                  key={index}
                  disabled={item.disabled}
                  size="sm"
                  variant="ghost"
                  onMouseEnter={() => onHover(actionsItem._id, 20)}
                  onMouseLeave={() => onHover(actionsItem._id, -20)}
                  onClick={item.onClick}
                  className="p-1"
                >
                  <CheckCheckIcon size={12} />
                </Button>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
