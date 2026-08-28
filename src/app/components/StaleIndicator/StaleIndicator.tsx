import React, { FC, useMemo } from "react";
import { differenceInCalendarDays } from "date-fns";
import DinosaurIcon from "../icons/DinosaurIcon";
import { cn } from "../utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { now } from "@/app/utils/date/now";

export interface StaleIndicatorProps {
  className?: string;
  date: number;
}

const StaleIndicator: FC<StaleIndicatorProps> = ({
  date,
  className,
}): JSX.Element | null => {
  const staleDays = differenceInCalendarDays(now(), date);

  const color = useMemo(() => {
    if (staleDays > 21) {
      return "fill-red-500";
    }

    if (staleDays > 14) {
      return "fill-amber-500";
    }
    if (staleDays > 7) {
      return "fill-gray-200";
    }
    return null;
  }, [staleDays]);

  if (!color) {
    return null;
  }

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger>
        {<DinosaurIcon className={cn("h-4 w-4", color, className)} />}
      </TooltipTrigger>
      <TooltipContent>{staleDays}</TooltipContent>
    </Tooltip>
  );
};

export default StaleIndicator;
