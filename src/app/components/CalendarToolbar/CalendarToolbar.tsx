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

export interface CalendarToolbarProps extends ToolbarProps {
  testId?: string;
  onNavigate(navigate: NavigateAction): void;
  label: string;
  onView(view: View): void;
}

// todo: make this component server
const CalendarToolbar: FC<CalendarToolbarProps> = ({
  testId,
  onNavigate,
  label,
  onView,
}): JSX.Element => {
  return (
    <div data-testid={testId} className="flex justify-between">
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
      <div>{label}</div>
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView("work_week")}
          >
            <IconSquareLetterA />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarToolbar;
