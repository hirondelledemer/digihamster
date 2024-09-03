"use client";
import React, { FC, useCallback, useMemo } from "react";
import useTasks from "@/app/utils/hooks/use-tasks";
import useEvents from "@/app/utils/hooks/use-events";
import useJournalEntries from "@/app/utils/hooks/use-entry";
import {
  endOfWeek,
  format,
  getWeek,
  isAfter,
  isBefore,
  startOfWeek,
} from "date-fns";
import { now } from "@/app/utils/date/date";
import { sortBy } from "remeda";
import MinimalNote from "../MinimalNote";
import {
  IconCalendarCancel,
  IconCalendarCheck,
  IconCircleCheck,
} from "@tabler/icons-react";
import { getProjectPercentages } from "./Timeline.utils";
import useProjects from "@/app/utils/hooks/use-projects";
import { TaskV2 } from "@/models/taskV2";
import { addEstimates } from "@/app/utils/tasks/estimates";

export interface TimelineProps {
  testId?: string;
}

const Timeline: FC<TimelineProps> = ({ testId }): JSX.Element => {
  const { data: tasks } = useTasks();
  const { data: events } = useEvents();
  const { data: journalEntries } = useJournalEntries();
  const { data: projects } = useProjects();

  const endOfThisWeek = endOfWeek(now());
  const startDate = startOfWeek(now());
  const endDate = isBefore(now(), endOfThisWeek) ? now() : endOfThisWeek;

  const filteredTasks = tasks.filter(
    (task) =>
      task.completedAt &&
      isAfter(task.completedAt, startDate) &&
      isBefore(task.completedAt, endDate)
  );

  const filteredEvents = events.filter(
    (event) =>
      isAfter(event.startAt, startDate) && isBefore(event.startAt, endDate)
  );

  const filteredEntries = journalEntries.filter(
    (entry) =>
      isAfter(entry.updatedAt, startDate) && isBefore(entry.updatedAt, endDate)
  );

  const logEvents = [...filteredTasks, ...filteredEntries, ...filteredEvents];
  const sortedEvents = sortBy(logEvents, [
    (val) => {
      console.log(val);
      if ("startAt" in val) {
        // todo: typequards
        return new Date(val.startAt).getTime();
      }
      if ("completedAt" in val) {
        return new Date(val.completedAt || 0).getTime();
      }
      return new Date(val.updatedAt).getTime();
    },
    "asc",
  ]);

  const projectPercentages = getProjectPercentages(filteredTasks, projects);

  const getCompletedTasksCount = useCallback(
    (projectId?: string) =>
      filteredTasks
        .filter((t) => (projectId ? t.projectId === projectId : true))
        .reduce(addEstimates, 0),
    [filteredTasks]
  );

  return (
    <div data-testid={testId} className="p-4">
      This week ({getWeek(now())}):
      <div className="space-y-1">
        <div className="h-5 flex">
          {Object.keys(projectPercentages).map(
            (
              key // todo: extract
            ) => (
              <div
                key={key}
                style={{
                  width: `${projectPercentages[key].percentage}%`,
                  backgroundColor: `${projectPercentages[key].color}`,
                }}
              />
            )
          )}
        </div>
        <div className="flex space-x-2">
          <div className="text-sm flex items-center mb-3 space-x-2">
            <IconCircleCheck
              size={19}
              color="black"
              fill="green"
              className="mr-1"
            />
            {getCompletedTasksCount()}
          </div>
          {Object.keys(projectPercentages).map(
            (
              projectId // todo: extract and add tooltip
            ) => (
              <div className="text-sm flex items-center mb-3 space-x-2">
                <IconCircleCheck
                  size={19}
                  color="black"
                  fill={projectPercentages[projectId].color}
                  className="mr-1"
                />
                {getCompletedTasksCount(projectId)}
              </div>
            )
          )}
        </div>
        {sortedEvents.map((val) => {
          if ("startAt" in val) {
            return (
              <div key={val._id} className="flex items-center">
                {getDate(val.startAt)}
                <div className="basis-[3%]">
                  {val.completed ? (
                    <IconCalendarCheck color="green" size={18} />
                  ) : (
                    <IconCalendarCancel color="red" size={18} />
                  )}
                </div>
                <div>{val.title}</div>
              </div>
            );
          }
          if ("completedAt" in val) {
            return (
              <div key={val._id} className="flex items-center">
                {getDate(val.completedAt)}
                <div className="basis-[3%]">
                  <IconCircleCheck // todo: extract this icon
                    size={19}
                    color="black"
                    fill="green"
                  />
                </div>
                <div>{val.title}</div>
              </div>
            );
          }
          if ("note" in val) {
            return (
              <div key={val._id} className="flex">
                {getDate(val.updatedAt)}
                <div className="w-[90%]">
                  <MinimalNote note={val.note} />
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

function getDate(date: string | number | undefined): JSX.Element {
  return (
    <div className="basis-[10%]">
      {format(new Date(date || 0).getTime(), "EEEEEE, HH:mm")}
    </div>
  );
}

export default Timeline;
