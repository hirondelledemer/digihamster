import React, { FC } from "react";
import { Habit } from "@/models/habit";
import { cn } from "../utils";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import useHabits from "@/app/utils/hooks/use-habits";

export interface TodayHabitProps {
  testId?: string;
  habit: Habit;
  date: Date;
  percentage: number;
}

const TodayHabit: FC<TodayHabitProps> = ({
  testId,
  habit,
  date,
  percentage,
}): JSX.Element | null => {
  const todayTimestamp = date.getTime();
  const { addLog } = useHabits();
  const todayHabit = habit.log.find((log) => log.at === todayTimestamp);

  console.log("todayHabit", todayHabit);

  const handleCompleteClick = (completed: boolean) => {
    addLog(habit._id, {
      completed,
      at: todayTimestamp,
    });
  };

  return (
    <div data-testid={testId}>
      <div className={cn(["grid grid-cols-4 gap-4 italic mt-4"])}>
        <div className="flex">Ready to:</div>

        <div>{habit.title}</div>

        <div className={cn([percentage < 30 ? "text-primary" : ""])}>
          {Math.floor(percentage)}%
        </div>

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
