"use client";
//todo: make this component server. need to rethink how it gets its data

import React, { FC } from "react";

import { IEvent } from "@/app/utils/types/event";

import { ScrollArea } from "@/app/components/ui/scroll-area";
import { format, isSameDay } from "date-fns";
import { now } from "@/app/utils/date/now";
import { RelationshipNavigator } from "@/app/components/EventRelationships/EventRealtionships";
import { RelationshipEntityType } from "@/app/utils/types/relationship";

interface ActiveEventInfoProps {
  event: IEvent;
}
export const ActiveEventInfo: FC<ActiveEventInfoProps> = ({
  event,
}): JSX.Element | null => {
  // const tasks = useTasksForEvent(event.id);
  // const entries = useJournalEntriesForEvent(event.id);
  // const habits = useHabitsForEvent(event.id);
  // const projects = useProjectsForTheEventByLocation(event.id);
  // const suggestedTasks = useFirstTaskForTheProjects(projects.map((p) => p.id));

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
      <ScrollArea className="h-full pb-[60px]">
        <div className="flex flex-col gap-4">
          <RelationshipNavigator
            entityId={event.id}
            entityType={RelationshipEntityType.Event}
          />
          {/* {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} event={event} />
          ))}
          {tasks.length + habits.length === 0 && (
            <>
              <div>There are no tasks here. Pick something?</div>
              {suggestedTasks.map((task) => (
                <TaskCard key={task.id} task={task} indicateActive />
              ))}
            </>
          )} */}
        </div>
      </ScrollArea>
      {/* <ScrollArea className="h-[50%] pb-[60px]">
        <div className="flex flex-col gap-4"> */}
      {/* {entries.map((entry) => (
            <MinimalNote key={entry.id} note={entry.json_note || entry.note} />
          ))} */}
      {/* <RelationshipNavigator
            entityId={event.id}
            entityType={RelationshipEntityType.Event}
          />
        </div>
      </ScrollArea> */}
    </div>
  );
};
