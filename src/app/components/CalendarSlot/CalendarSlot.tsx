import React, { FC, ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "../utils";

export interface CalendarSlotProps {
  children: ReactNode;
  value: Date;
  resource: null | undefined;
}

const CalendarSlot: FC<any> = ({
  children,
  value,
  resource,
  ...props
}): JSX.Element => {
  const { isOver, setNodeRef } = useDroppable({
    id: value.getTime(),
    data: {
      containerType: "calendar",
      date: value.getTime(),
    },
  });
  return (
    <div {...props}>
      {resource === null && (
        <div
          ref={setNodeRef}
          className={cn(isOver && "border border-primary", "h-4")}
        />
      )}
      {children}
    </div>
  );
};

export default CalendarSlot;
