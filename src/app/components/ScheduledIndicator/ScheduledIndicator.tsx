import { FC } from "react";
import { IconCalendarCheck } from "@tabler/icons-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

/**
 * Shown on a card suggested out of an event - a task you do at this location,
 * a habit you keep there - once it is already in that event. The suggestion
 * stays on the list either way: taking it away would answer "shall I plan
 * this?" by making the thing you planned disappear.
 */
export const ScheduledIndicator: FC = () => (
  <Tooltip delayDuration={0}>
    <TooltipTrigger>
      <IconCalendarCheck size={18} color="green" aria-label="in this event" />
    </TooltipTrigger>
    <TooltipContent>Already in this event</TooltipContent>
  </Tooltip>
);
