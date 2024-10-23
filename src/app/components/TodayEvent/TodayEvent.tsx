"use client";

import { lightFormat, format } from "date-fns";
import React, { FC, useMemo } from "react";
import { Checkbox } from "../ui/checkbox";
import { cn } from "../utils";
import styles from "./TodayEvent.module.scss";
import {
  CalendarDeadlineEntry,
  CalendarEventEntry,
  isCalendarDeadlineEntry,
  isCalendarEventEntry,
} from "../CalendarEvent/CalendarEvent.types";
import TaskCard from "../TaskCard";
import { useDroppable } from "@dnd-kit/core";
import useEditEvent from "@/app/utils/hooks/use-edit-events";
import useEditTask from "@/app/utils/hooks/use-edit-task";
import useProjects from "@/app/utils/hooks/use-projects";
import { Button } from "../ui/button";
import { ChevronRightIcon } from "lucide-react";

export interface TodayEventProps {
  testId?: string;
  showDate?: boolean;
  event: CalendarEventEntry | CalendarDeadlineEntry;
}

const TodayEvent: FC<TodayEventProps> = ({
  testId,
  showDate,
  event,
}): JSX.Element => {
  const { editEvent } = useEditEvent();
  const { editTask } = useEditTask();
  const { getProjectById } = useProjects();

  const { isOver, setNodeRef } = useDroppable({
    id: event.resource.id,
    disabled: isCalendarDeadlineEntry(event),
  });

  const handleCompleteClick = async (val: boolean) => {
    if (isCalendarDeadlineEntry(event)) {
      editTask(event.resource.id, { completed: val });
    } else {
      editEvent(event.resource.id, { completed: val });
    }
  };

  const handleSendBackToListClick = async () => {
    editTask(event.resource.id, { deadline: null });
  };

  const project = useMemo(
    () =>
      isCalendarDeadlineEntry(event)
        ? getProjectById(event.resource.task.projectId || "")
        : null,
    [getProjectById, event]
  );

  return (
    <div ref={setNodeRef} className={cn(isOver ? "border border-primary" : "")}>
      <div
        className={cn([
          "grid grid-cols-3 gap-4 italic mt-4",
          event.resource.completed ? "text-muted-foreground" : "",
          event.resource.completed ? styles.container : "",
        ])}
        data-testid={testId}
      >
        {isCalendarEventEntry(event) && event.allDay ? (
          <div className="flex">All Day</div>
        ) : (
          <div className="flex">
            {event.start && showDate && (
              <div>{format(event.start, "MMM d, EEEEE")}</div>
            )}
            {event.start && event.end && (
              <div>
                {lightFormat(event.start, "H:mm")}-
                {lightFormat(event.end, "H:mm")}
              </div>
            )}
          </div>
        )}
        <div>
          <div>
            {event.title}
            {project && (
              <span
                className="ml-4"
                style={{
                  color: project.color,
                  opacity: event.resource.completed ? 0.7 : 1,
                }}
              >
                {project.title}
              </span>
            )}
          </div>
          <div>
            {isCalendarEventEntry(event) && (
              <span className="text-xs">{event.resource.description}</span>
            )}
            {isCalendarDeadlineEntry(event) && (
              <span className="text-xs">{event.resource.task.description}</span>
            )}
            {isCalendarEventEntry(event) &&
              event.resource.tasks.map((t) => (
                <TaskCard key={t._id} task={t} />
              ))}
          </div>
        </div>

        <div className="flex justify-end self-baseline gap-1">
          {isCalendarDeadlineEntry(event) && (
            <Button
              variant="outline"
              size="icon"
              className="h-[16px] w-[16px] rounded-sm"
              aria-label="Move back to list"
              onClick={handleSendBackToListClick}
            >
              <ChevronRightIcon className="h-4 w-4" size={1} name="ass" />
            </Button>
          )}
          <Checkbox
            checked={event.resource.completed}
            onCheckedChange={handleCompleteClick}
            variant={event.resource.completed ? "secondary" : "default"}
          />
        </div>
      </div>
    </div>
  );
};

export default TodayEvent;
