"use client";
import { now } from "@/app/utils/date/date";
import useJournalEntries from "@/app/utils/hooks/use-entry";
import useHabits from "@/app/utils/hooks/use-habits";
import useTasks from "@/app/utils/hooks/use-tasks";
import { eachDayOfInterval, isSameDay, subDays } from "date-fns";
import React, { FC, useMemo } from "react";

export interface DailyProgressProps {
  testId?: string;
}

const DailyProgress: FC<DailyProgressProps> = ({ testId }): JSX.Element => {
  const { data: tasks } = useTasks();
  const { data: habits } = useHabits();
  const { data: journalEntries } = useJournalEntries();

  const last11Days = useMemo(
    () => eachDayOfInterval({ start: subDays(now(), 10), end: now() }),
    []
  );

  const completedTasksCount = useMemo(
    () =>
      last11Days.map(
        (date) =>
          tasks.filter(
            (t) => t.completedAt && isSameDay(t.completedAt, date.getTime())
          ).length
      ),
    [last11Days, tasks]
  );

  const journalEntriesCreated = useMemo(
    () =>
      last11Days.map(
        (date) =>
          journalEntries.filter(
            (j) => j.createdAt && isSameDay(j.createdAt, date.getTime())
          ).length
      ),
    [journalEntries, last11Days]
  );

  const completedHabitsCount = useMemo(
    () =>
      last11Days.map(
        (date) =>
          habits.filter(
            (h) =>
              h.log.filter(
                (log) => log.completed && isSameDay(log.at, date.getTime())
              ).length > 0
          ).length
      ),
    [habits, last11Days]
  );

  return (
    <div data-testid={testId} className="flex items-end h-full relative">
      <div className="w-full h-[1px] bg-muted-foreground absolute bottom-[10px]" />
      <div className="flex justify-items-stretch gap-2 items-end w-full">
        {completedTasksCount.map((taskCount, index) => (
          <div
            data-testid="bar-testid"
            key={index}
            style={{
              minWidth: "15px",
              height:
                taskCount * 3 +
                  completedHabitsCount[index] +
                  journalEntriesCreated[index] || "1px",
              backgroundColor: "#f43f6e",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DailyProgress;
