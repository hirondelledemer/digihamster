import React, { FC, ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "../utils";
import { getHours } from "date-fns";

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

  const isEvenHour = getHours(date) % 2 === 0 && resource === undefined;
  return (
    <div {...props}>
      {resource === null && (
        <div
          ref={setNodeRef}
          className={cn(isOver && "border border-primary", "h-4")}
        />
      )}

      {isEvenHour ? children : null}
    </div>
  );
};

export default CalendarSlot;
