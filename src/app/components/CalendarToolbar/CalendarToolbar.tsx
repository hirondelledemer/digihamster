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
} from "@tabler/icons-react";
import { IconSquareLetterA } from "@tabler/icons-react";
import { format } from "date-fns";
import useHotKeys from "@/app/utils/hooks/use-hotkeys";
import { CalendarEventType } from "../CalendarEvent";

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
      <div>{view === "agenda" ? format(date, "EEEE MMM dd") : label}</div>
      <div>
        <div>
          {/* todo: fix month style */}
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
