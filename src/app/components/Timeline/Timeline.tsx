"use client";
import React, { FC, useCallback, useMemo, useState } from "react";
import useTasks from "@/app/utils/hooks/use-tasks";
import useJournalEntries from "@/app/utils/hooks/use-entry";
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  getWeek,
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
  startOfWeek,
  sub,
} from "date-fns";
import { now } from "#utils/date";
import { sortBy } from "remeda";
import MinimalNote from "../MinimalNote";
import {
  IconCalendarCancel,
  IconCalendarCheck,
  IconCircleCheck,
} from "@tabler/icons-react";
import {
  getProjectPercentages,
  isEvent,
  isJournalEntry,
  isTask,
} from "./Timeline.utils";
import { addEstimates } from "@/app/utils/tasks/estimates";
import PercentagesBar from "../PercentagesBar";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import TimelineChart from "../TimelineChart";
import { useEventsState } from "@/app/utils/hooks/use-events/state-context";
import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";

export interface TimelineProps {
  testId?: string;
}
type IPeriod = "this_week" | "month" | "last_week" | "last_2_weeks";

const Timeline: FC<TimelineProps> = ({ testId }): JSX.Element => {
  const { data: tasks } = useTasks();
  const { data: events } = useEventsState();

  const { data: journalEntries } = useJournalEntries();
  const { data: projects } = useProjectsState();
  const [period, setPeriod] = useState<IPeriod>("this_week");

  const endOfThisWeek = endOfWeek(now(), { weekStartsOn: 1 });
  const startDate = useMemo(() => {
    if (period === "last_week") {
      return startOfWeek(
        sub(now(), {
          weeks: 1,
        }),
        { weekStartsOn: 1 }
      );
    }
    if (period === "last_2_weeks") {
      return startOfWeek(
        sub(now(), {
          weeks: 2,
        }),
        { weekStartsOn: 1 }
      );
    }
    if (period === "month") {
      return sub(now(), {
        months: 1,
      });
    }
    return startOfWeek(now(), { weekStartsOn: 1 });
  }, [period]);
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
      if (isEvent(val)) {
        return new Date(val.startAt).getTime();
      }
      if (isTask(val)) {
        return new Date(val.completedAt || 0).getTime();
      }
      return new Date(val.updatedAt).getTime();
    },
    "asc",
  ]);

  const projectPercentages = getProjectPercentages(
    filteredTasks,
    projects,
    filteredEvents
  );

  const getCompletedTasksCount = useCallback(
    (projectId?: string) =>
      filteredTasks
        .filter((t) => (projectId ? t.projectId === projectId : true))
        .reduce(addEstimates, 0),
    [filteredTasks]
  );

  const chartData = useMemo(
    () =>
      eachDayOfInterval({ start: startDate, end: endDate }).map((date) => {
        const pp = getProjectPercentages(
          tasks.filter((t) => t.completedAt && isSameDay(date, t.completedAt)),
          projects,
          events.filter((e) => isSameDay(e.startAt, date))
        );

        const newObj = Object.fromEntries(
          Object.entries(pp).map(([k, v]) => [k, v.estimate])
        );
        return {
          day: format(date, "dd, E"),
          scrollToValue: startOfDay(date || 0).valueOf(),
          ...newObj,
        };
      }),
    [endDate, events, projects, startDate, tasks]
  );

  return (
    <div data-testid={testId} className="p-4">
      This week ({getWeek(now())}):
      <ToggleGroup
        type="single"
        className="justify-start"
        value={period}
        onValueChange={(value) => {
          setPeriod(value as IPeriod);
        }}
      >
        <ToggleGroupItem value="this_week">This week</ToggleGroupItem>
        <ToggleGroupItem value="last_week">Last week</ToggleGroupItem>
        <ToggleGroupItem value="last_2_weeks">Last 2 weeks</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
      </ToggleGroup>
      <div className="h-[200px] mb-2 mt-2">
        <TimelineChart chartConfig={projectPercentages} chartData={chartData} />
      </div>
      <div className="space-y-1">
        <PercentagesBar data={projectPercentages} />
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
              <div
                key={projectId}
                className="text-sm flex items-center mb-3 space-x-2"
              >
                <IconCircleCheck
                  size={19}
                  color="black"
                  fill={projectPercentages[projectId].color}
                  className="mr-1"
                />
                {projectPercentages[projectId].estimate}
              </div>
            )
          )}
        </div>
        {sortedEvents.map((val) => {
          if (isEvent(val)) {
            return (
              <div
                key={val._id}
                className="flex items-center"
                data-testid="event-entry"
                id={`${startOfDay(val.startAt || 0).valueOf()}`}
              >
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
          if (isTask(val)) {
            return (
              <div
                key={val._id}
                data-testid="task-entry"
                className="flex items-center"
                id={`${startOfDay(val.completedAt || 0).valueOf()}`}
              >
                {getDate(val.completedAt)}
                <div className="basis-[3%]">
                  <IconCircleCheck // todo: extract this icon
                    size={19}
                    color="black"
                    fill={projects.find((p) => p._id === val.projectId)?.color}
                  />
                </div>
                <div>{val.title}</div>
              </div>
            );
          }
          if (isJournalEntry(val)) {
            return (
              <div
                key={val._id}
                className="flex"
                data-testid="journal-entry"
                id={`${startOfDay(val.updatedAt || 0).valueOf()}`}
              >
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
