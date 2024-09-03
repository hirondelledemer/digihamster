import React, { FC } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export interface PercentagesData {
  [key: string]: {
    percentage: number;
    color: string;
    estimate: number;
    label: string;
  };
}
export interface PercentagesBarProps {
  testId?: string;
  data: PercentagesData;
}

const PercentagesBar: FC<PercentagesBarProps> = ({
  testId,
  data,
}): JSX.Element => {
  return (
    <div data-testid={testId} className="h-5 flex">
      {Object.keys(data).map((key) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              style={{
                width: `${data[key].percentage}%`,
              }}
              className="hover:border-color-transparent hover:border-2"
            >
              <div
                key={key}
                style={{
                  height: "100%",
                  width: "100%",
                  backgroundColor: `${data[key].color}`,
                }}
              />
            </TooltipTrigger>
            <TooltipContent>{data[key].label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default PercentagesBar;
