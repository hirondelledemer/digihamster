import React, { FC } from "react";
import { differenceInCalendarDays } from "date-fns";
import { now } from "@/app/utils/date/date";
import DinosaurIcon from "../icons/DinosaurIcon";
import { cn } from "../utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

export interface StaleIndicatorProps {
  className?: string;
  date: number;
}

const StaleIndicator: FC<StaleIndicatorProps> = ({
  date,
  className,
}): JSX.Element | null => {
  const staleDays = differenceInCalendarDays(now(), date);

  if (staleDays > 14) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <DinosaurIcon className={cn("h-4 w-4 fill-amber-500", className)} />
          </TooltipTrigger>
          <TooltipContent>{staleDays}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (staleDays > 7) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <DinosaurIcon className={cn("h-4 w-4 fill-gray-200", className)} />
          </TooltipTrigger>
          <TooltipContent>{staleDays}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return null;
};

export default StaleIndicator;
