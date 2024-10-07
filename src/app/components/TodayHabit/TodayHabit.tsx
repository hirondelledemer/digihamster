import React, { FC } from "react";
import { Habit } from "@/models/habit";
import { cn } from "../utils";
import { Button } from "../ui/button";
import useHabits from "@/app/utils/hooks/use-habits";
import { differenceInDays, formatDistanceStrict } from "date-fns";

export interface TodayHabitProps {
  testId?: string;
  habit: Habit;
  date: Date;
}

const TodayHabit: FC<TodayHabitProps> = ({
  testId,
  habit,
  date,
}): JSX.Element | null => {
  const todayTimestamp = date.getTime();
  const { addLog } = useHabits();

  const handleCompleteClick = (completed: boolean) => {
    addLog(habit._id, {
      completed,
      at: todayTimestamp,
    });
  };

  const lastLog = habit.log.findLast(
    (log) => log.at < date.getTime() && log.completed
  );

  const diff = lastLog ? differenceInDays(date, lastLog.at) : 29;

  const formattedDiff = lastLog
    ? formatDistanceStrict(lastLog.at, date, {
        unit: "day",
        addSuffix: true,
      })
    : "never";

  const averageAcceptableDiff = 28 / habit.timesPerMonth;
  const readyIn = Math.floor(averageAcceptableDiff - diff);

  return (
    <div data-testid={testId}>
      <div className={cn(["grid grid-cols-3 gap-4 italic mt-4"])}>
        {readyIn > 0 ? (
          <div className="text-xs">ready in {readyIn} days</div>
        ) : (
          <div
            className={cn(
              "text-xs",
              diff > averageAcceptableDiff ? "text-primary " : ""
            )}
          >
            {formattedDiff}
          </div>
        )}
        <div>{habit.title}</div>

        <div className="flex justify-end self-baseline">
          <Button
            onClick={() => handleCompleteClick(false)}
            variant="ghost"
            className="p-2 h-5"
          >
            No
          </Button>
          <Button
            onClick={() => handleCompleteClick(true)}
            variant="ghost"
            className="p-2 h-5"
          >
            Yes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TodayHabit;
