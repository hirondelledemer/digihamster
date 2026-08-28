import React, { FC } from "react";
import { IconBubbleFilled } from "@tabler/icons-react";
import { CalendarJournalEntry } from "../CalendarEvent/CalendarEvent.types";
import { cn } from "../utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import MinimalNote from "../MinimalNote";

export interface CalendarJournalEventProps {
  event: CalendarJournalEntry;
  className?: string;
}

export const CalendarJournalEvent: FC<CalendarJournalEventProps> = ({
  event,
  className,
}): JSX.Element => {
  return (
    <div
      className={cn(
        // "flex text-xs items-center justify-start relative z-10",
        "flex text-xs items-center justify-end relative z-10",
        className,
      )}
    >
      <Tooltip delayDuration={0}>
        <TooltipTrigger
          className="pointer-events-auto"
          onMouseDownCapture={(e) => {
            // the calendar starts a slot selection on a native mousedown
            e.stopPropagation();
          }}
        >
          <div>
            <IconBubbleFilled size={16} />
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-[200px]" side="right">
          <MinimalNote
            note={event.resource.note.json_note || event.resource.note.note}
          />
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
