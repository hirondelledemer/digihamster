import React, { FC } from "react";
import {
  Navigate,
  NavigateAction,
  ToolbarProps,
  View,
} from "react-big-calendar";
import { Button } from "../ui/button";
import {
  IconArrowBigLeft,
  IconArrowBigRight,
  IconSquareLetterD,
  IconSquareLetterM,
  IconSquareLetterT,
  IconSquareLetterW,
  IconSquarePlus,
} from "@tabler/icons-react";
import { IconSquareLetterA } from "@tabler/icons-react";
import { format } from "date-fns";
import useHotKeys from "@/app/utils/hooks/use-hotkeys";
import { CalendarEventType } from "../CalendarEvent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import useCycle from "@/app/utils/hooks/use-cycle";
import { useDroppable } from "@dnd-kit/core";
import { isCalendarDeadlineEntry } from "../CalendarEvent/CalendarEvent.types";
import { cn } from "../utils";

export interface CalendarToolbarProps extends ToolbarProps<CalendarEventType> {
  testId?: string;
  onNavigate(navigate: NavigateAction): void;
  label: string;
  onView(view: View): void;
}

const CalendarToolbar: FC<CalendarToolbarProps> = ({
  testId,
  onNavigate,
  label,
  onView,
  date,
  view,
}): JSX.Element => {
  useHotKeys([
    ["T", () => onNavigate(Navigate.TODAY)],
    ["D", () => onView("day")],
    ["W", () => onView("week")],
    ["A", () => onView("agenda")],
    ["M", () => onView("month")],
  ]);

  const { updateCycle } = useCycle();

  const { isOver, setNodeRef } = useDroppable({
    id: date.getTime(),
    disabled: view !== "agenda",
    data: {
      containerType: "calendar",
      date: date.getTime(),
    },
  });

  const addCycle = async () => {
    const startDate = date;
    startDate.setHours(0, 0, 0, 0);

    updateCycle(startDate.getTime());
  };

  return (
    <div data-testid={testId} className="flex justify-between align-center">
      <div>
        <div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate(Navigate.PREVIOUS)}
          >
            <IconArrowBigLeft size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate(Navigate.TODAY)}
          >
            <IconSquareLetterT size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate(Navigate.NEXT)}
          >
            <IconArrowBigRight size={18} />
          </Button>
        </div>
      </div>

      <div ref={setNodeRef} className={cn(isOver && "border border-primary")}>
        <div>{view === "agenda" ? format(date, "EEEE MMM dd") : label}</div>
      </div>
      <div>
        <div>
          {(view === "agenda" || view === "day") && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <IconSquarePlus />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={addCycle}>
                  Cycle Starts
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button variant="ghost" size="icon" onClick={() => onView("month")}>
            <IconSquareLetterM />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onView("week")}>
            <IconSquareLetterW />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onView("day")}>
            <IconSquareLetterD />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onView("agenda")}>
            <IconSquareLetterA />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarToolbar;
