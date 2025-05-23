"use client";

import { lightFormat, format } from "date-fns";
import React, { FC, useEffect, useMemo, useRef } from "react";
import { Checkbox } from "../ui/checkbox";
import { cn } from "../utils";
import styles from "./TodayEvent.module.scss";
import {
  CalendarDeadlineEntry,
  CalendarEventEntry,
  CalendarWeatherEntry,
  isCalendarDeadlineEntry,
  isCalendarEventEntry,
} from "../CalendarEvent/CalendarEvent.types";
import TaskCard from "../TaskCard";
import { useDroppable } from "@dnd-kit/core";
import useEditTask from "@/app/utils/hooks/use-edit-task";
import { Button } from "../ui/button";
import { ChevronRightIcon } from "lucide-react";
import CalendarWeatherEvent from "../CalendarWeatherEvent";
import { useEventsActions } from "@/app/utils/hooks/use-events/actions-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import useTasks from "@/app/utils/hooks/use-tasks";
import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import { TaskActions } from "../TaskActions";
import { EventActions } from "../EventActions";

export interface TodayEventProps {
  showDate?: boolean;
  event: CalendarEventEntry | CalendarDeadlineEntry;
  weatherEvent?: CalendarWeatherEntry;
  isFocused: boolean;
}

const TodayEvent: FC<TodayEventProps> = ({
  showDate,
  event,
  weatherEvent,
  isFocused,
}): JSX.Element => {
  const { update: updateEvent } = useEventsActions();
  const { editTask } = useEditTask();
  const { data: tasks } = useTasks();
  const { getProjectById } = useProjectsState();
  const ref = useRef<HTMLDivElement>(null);

  const relatedTasks = isCalendarDeadlineEntry(event)
    ? tasks.filter((t) => event.resource.task.relatedTaskIds.includes(t._id))
    : [];

  useEffect(() => {
    if (isFocused && ref.current) {
      ref.current.scrollIntoView(false);
    }
  }, [isFocused]);

  const { isOver, setNodeRef } = useDroppable({
    id: event.resource.id,
    disabled: isCalendarDeadlineEntry(event),
  });

  const handleCompleteClick = async (val: boolean) => {
    if (isCalendarDeadlineEntry(event)) {
      editTask(event.resource.id, { completed: val });
    } else {
      updateEvent(event.resource.id, { completed: val });
    }
  };

  const handleSendBackToListClick = async () => {
    editTask(event.resource.id, { deadline: null, isActive: true });
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
      {isCalendarDeadlineEntry(event) &&
        !!event.resource.task.relatedTaskIds.length && (
          <Sheet open={isFocused}>
            <SheetContent
              side="right"
              aria-describedby="Task Modal"
              onCloseClick={() => {}}
              showOverlay={false}
            >
              <SheetHeader>
                <SheetTitle>Related tasks</SheetTitle>
              </SheetHeader>
              <div className={cn(["flex flex-col gap-2"])}>
                {relatedTasks.map((rTask) => (
                  <TaskCard task={rTask} key={rTask._id} dragId={rTask._id} />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        )}
      <div
        className={cn([
          "grid grid-cols-3 gap-4 italic p-2",
          event.resource.completed ? "text-muted-foreground" : "",
          event.resource.completed ? styles.container : "",
          isFocused ? "bg-muted" : "",
        ])}
        data-testid={"today-event-container"}
      >
        {isCalendarEventEntry(event) && event.allDay ? (
          <div className="flex">All Day</div>
        ) : (
          <div className="flex">
            {event.start && showDate && (
              <div>{format(event.start, "MMM d, EEEEE")}</div>
            )}
            {event.start && event.end && (
              <div className="flex items-center gap-1">
                <div>
                  {lightFormat(event.start, "H:mm")}-
                  {lightFormat(event.end, "H:mm")}
                </div>
                {weatherEvent && <CalendarWeatherEvent event={weatherEvent} />}
              </div>
            )}
          </div>
        )}
        <div>
          {isCalendarDeadlineEntry(event) ? (
            <TaskActions task={event.resource.task}>
              <div ref={ref}>
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
            </TaskActions>
          ) : (
            <EventActions event={event}>
              <div ref={ref}>{event.title}</div>
            </EventActions>
          )}

          <div>
            {isCalendarEventEntry(event) && (
              <span className="text-xs">{event.resource.description}</span>
            )}
            {isCalendarDeadlineEntry(event) && (
              <span className="text-xs">{event.resource.task.description}</span>
            )}
            {isCalendarEventEntry(event) &&
              event.resource.tasks.map((t) => (
                <TaskCard key={t._id} task={t} dragId={t._id} />
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
