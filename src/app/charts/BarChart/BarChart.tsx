"use client";

import {
  Bar,
  BarChart as BarChartRecharts,
  Customized,
  Label,
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
import { ButtonsList } from "./ButtonsList";
import { memo, useCallback, useMemo, useState } from "react";
import { updateObjById } from "@/app/utils/common/update-array";
import { getHabitProgress } from "@/app/utils/habits/getHabitProgress";
import { Habit } from "@/models/habit";

export interface BarChartProps {
  data: {
    _id: string;
    dataLabel: string;
    dataValue: number;
    fill: string;
  }[];
  config?: ChartConfig;
}

const CustomizedLabel = memo((props) => {
  const { x, y, width, height, value } = props;
  const radius = 10;

  return (
    <g
      {...props}
      onMouseOver={() => props.onHover(value, 10)}
      onMouseOut={() => props.onHover(value, -10)}
    >
      <circle cx={x + width - 5} cy={y} r={radius} fill="#8884d8" />
      <text
        x={x + width - 5}
        y={y}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        increase
      </text>
    </g>
  );
});
CustomizedLabel.displayName = "CustomizedLabel";

const MLabelsList = memo((props) => {
  return <LabelList {...props} />;
});
MLabelsList.displayName = "MLabelsList";

export function BarChart({ data: chartData, config = {} }: BarChartProps) {
  const [data, setData] = useState<BarChartProps["data"]>(chartData);

  console.log("data", data);

  const onHover = useCallback((id: string, value: number) => {
    const object = data.find((item) => item._id === id);
    if (!object) {
      return;
    }

    console.log("value", value);
    setData(
      data.map((item) =>
        item._id === id ? { ...item, dataValue: object.dataValue + 10 } : item
      )
    );
  }, []);

  const MMLabelsList = useMemo(() => {
    return (
      <LabelList
        dataKey="_id"
        position="left"
        offset={8}
        fill="white"
        width={200}
        fontSize={12}
        overflow="hidden"
        content={<CustomizedLabel onHover={onHover} />}
      />
    );
  }, []);

  return (
    <ChartContainer
      config={config}
      className="mx-auto max-h-[214px] max-w-[300px]"
      height={300}
    >
      <BarChartRecharts accessibilityLayer data={chartData} layout="vertical">
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
        {/* <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideIndicator />}
        /> */}

        <Bar dataKey="dataValue" layout="vertical" radius={5}>
          {/* <LabelList
            dataKey="dataLabel"
            position="insideLeft"
            offset={8}
            fill="white"
            width={200}
            fontSize={12}
            overflow="hidden"
          /> */}
          {MMLabelsList}
          {/* <LabelList
            dataKey="_id"
            position="left"
            offset={8}
            fill="white"
            width={200}
            fontSize={12}
            overflow="hidden"
            content={<CustomizedLabel onHover={onHover} />}
          /> */}

          {/* <LabelList
            // dataKey="dataLabel"
            // position="right"
            // offset={100}
            position="insideLeft"
            fill="white"
            offset={8}
            fontSize={12}
            overflow="hidden"
            content={<div>AAAA</div>}
          /> */}
          {/* <ButtonsList
            dataKey="dataLabel"
            position="insideLeft"
            offset={8}
            fill="white"
            width={200}
            fontSize={12}
            overflow="hidden"
          /> */}
        </Bar>
        {/* <Customized
          component={(props: any) => {
            console.log(props);
            return (
              <>
                {props.data.map((dataItem: any) => (
                  <button id="aaaaaaaaaaaaa" key={dataItem.dataLabel}>
                    {dataItem.dataLabel}
                  </button>
                ))}
              </>
            );
          }}
        /> */}
      </BarChartRecharts>
    </ChartContainer>
  );
}
