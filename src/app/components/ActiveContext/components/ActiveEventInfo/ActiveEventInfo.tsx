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

interface ActiveEventInfoProps {
  event: IEvent;
}
export const ActiveEventInfo: FC<ActiveEventInfoProps> = ({
  event,
}): JSX.Element | null => {
  const tasks = useTasksForEvent(event.id);
  const entries = useJournalEntriesForEvent(event.id);
  const habits = useHabitsForEvent(event.id);

  return (
    <div className="w-full h-full">
      <ScrollArea className="h-[50%] pb-[60px]">
        <div className="flex flex-col gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} event={event} />
          ))}
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
