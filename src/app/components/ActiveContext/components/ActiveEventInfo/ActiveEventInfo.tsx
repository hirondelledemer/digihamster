"use client";
//todo: make this component server. need to rethink how it gets its data

import React, { FC } from "react";

import { useTasksForEvent } from "@/app/utils/hooks/use-tasks-new/selectors";
import { IEvent } from "@/app/utils/types/event";

import TaskCard from "@/app/components/TaskCard";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { useJournalEntriesForEvent } from "@/app/utils/hooks/use-entry/selectors";
import MinimalNote from "@/app/components/MinimalNote";
import { useHabitsForEvent } from "@/app/utils/hooks/use-habits-new/selectors";
import { HabitCard } from "@/app/components/HabitCard/HabitCard";
import { format, isSameDay } from "date-fns";
import { now } from "@/app/utils/date/now";
import ActiveTaskList from "@/app/components/ActiveTaskList";

interface ActiveEventInfoProps {
  event: IEvent;
}
export const ActiveEventInfo: FC<ActiveEventInfoProps> = ({
  event,
}): JSX.Element | null => {
  const tasks = useTasksForEvent(event.id);
  const entries = useJournalEntriesForEvent(event.id);
  const habits = useHabitsForEvent(event.id);

  const isEventToday = isSameDay(event.start_at, now());

  return (
    <div className="w-full h-full">
      <div className="py-4 flex">
        {!isEventToday && (
          <div className="mr-5">{format(event.start_at, "MMM d")}</div>
        )}
        <div>
          {format(event.start_at, "HH:mm")} - {format(event.end_at, "HH:mm")}
        </div>
      </div>
      <ScrollArea className="h-[50%] pb-[60px]">
        <div className="flex flex-col gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} event={event} />
          ))}

          {tasks.length + habits.length === 0 && (
            <div>
              <div>There are no tasks here. Pick something?</div>
              <ActiveTaskList />
            </div>
          )}
        </div>
      </ScrollArea>
      <ScrollArea className="h-[50%] pb-[60px]">
        <div className="flex flex-col gap-4">
          {entries.map((entry) => (
            <MinimalNote key={entry.id} note={entry.json_note || entry.note} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
