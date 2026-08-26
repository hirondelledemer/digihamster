import React, { FC, ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "../utils";
import { getHours, getMinutes } from "date-fns";

export interface CalendarSlotProps {
  children: ReactNode;
  value: Date;
  resource: null | undefined;
}

const CalendarSlot: FC<CalendarSlotProps> = ({
  children,
  value: date,
  resource,
  ...props
}): JSX.Element => {
  const { isOver, setNodeRef } = useDroppable({
    id: date.getTime(),
    data: {
      containerType: "calendar",
      date: date,
    },
  });

  const isTimeLabelSlot = resource === undefined;
  const isEvenHour = getHours(date) % 2 === 0;
  const minutesAreZero = getMinutes(date) === 0;

  return (
    <div {...props}>
      {resource === null && (
        <div
          ref={setNodeRef}
          className={cn(isOver && "border border-primary", "h-4")}
        />
      )}

      {isEvenHour && minutesAreZero && isTimeLabelSlot ? (
        <div className="mt-[-15px] flex items-center">
          <div className="mr-2 z-10">{children}</div>

          <div className="h-3 w-3 bg bg-primary absolute ml-1 left-[70px] rounded-xl z-10" />
        </div>
      ) : null}

      {!isEvenHour && !minutesAreZero && isTimeLabelSlot ? (
        <div className="mt-[-15px] flex items-bottom">
          <div className="mr-2">{children}</div>

          <div className="h-2 w-2 bg bg-primary absolute ml-1 mt-[10px] left-[72px] rounded-xl z-10" />
        </div>
      ) : null}
    </div>
  );
};

export default CalendarSlot;
