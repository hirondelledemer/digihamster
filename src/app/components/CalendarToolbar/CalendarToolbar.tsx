import { ActionIcon, Group } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import {
  IconArrowBigLeft,
  IconArrowBigRight,
  IconSquareLetterD,
  IconSquareLetterM,
  IconSquareLetterT,
  IconSquareLetterW,
} from "@tabler/icons-react";
import React, { FC } from "react";
import {
  Navigate,
  NavigateAction,
  ToolbarProps,
  View,
} from "react-big-calendar";

export interface CalendarToolbarProps extends ToolbarProps {
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
}): JSX.Element => {
  useHotkeys([
    ["T", () => onView("work_week")],
    ["D", () => onView("day")],
    ["W", () => onView("week")],
  ]);

  console.log(testId, onNavigate, label, onView);

  return (
    <Group data-testid={testId}>
      <div>
        <Group>
          <ActionIcon
            size="sm"
            variant="transparent"
            color="gray"
            onClick={() => onNavigate(Navigate.PREVIOUS)}
          >
            <IconArrowBigLeft size={18} />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="transparent"
            color="gray"
            onClick={() => onNavigate(Navigate.TODAY)}
          >
            <IconSquareLetterT size={18} />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="transparent"
            color="gray"
            onClick={() => onNavigate(Navigate.NEXT)}
          >
            <IconArrowBigRight size={18} />
          </ActionIcon>
        </Group>
      </div>
      <div>{label}</div>
      <div>
        <Group>
          {/* todo: fix month style */}
          <ActionIcon
            size="sm"
            variant="transparent"
            color="gray"
            onClick={() => onView("month")}
          >
            <IconSquareLetterM />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="transparent"
            color="gray"
            onClick={() => onView("week")}
          >
            <IconSquareLetterW />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="transparent"
            color="gray"
            onClick={() => onView("day")}
          >
            <IconSquareLetterD />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="transparent"
            color="gray"
            onClick={() => onView("work_week")}
          >
            <IconSquareLetterT />
          </ActionIcon>
        </Group>
      </div>
    </Group>
  );
};

export default CalendarToolbar;
