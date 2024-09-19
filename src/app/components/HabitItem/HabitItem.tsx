import React, { FC, useState } from "react";
import useHabits from "@/app/utils/hooks/use-habits";
import { Habit } from "@/models/habit";
import { now } from "@/app/utils/date/date";
import { Checkbox } from "../ui/checkbox";
import { format } from "date-fns";
import { Button } from "../ui/button";
import HabitFormModal from "../HabitFormModal";
import { DAY } from "@/app/utils/consts/dates";

export interface HabitItemProps {
  testId?: string;
  habit: Habit;
}

const HabitItem: FC<HabitItemProps> = ({ testId, habit }): JSX.Element => {
  const { addLog } = useHabits();
  const [habitFormOpen, setHabitFormOpen] = useState<boolean>(false);

  const today = now();
  today.setHours(0, 0, 0, 0);

  const todayTimestamp = today.getTime();
  const yesterdayTimestamp = todayTimestamp - DAY;
  const twoDayAgoTimestamp = todayTimestamp - 2 * DAY;

  const todayHabit = habit.log.find((log) => log.at === todayTimestamp);
  const yesterdayHabit = habit.log.find((log) => log.at === yesterdayTimestamp);

  const twoDaysAgoHabit = habit.log.find(
    (log) => log.at === twoDayAgoTimestamp
  );

  const handleCompleteClick = (at: number) => (checked: boolean) => {
    addLog(habit._id, {
      completed: checked,
      at,
    });
  };

  return (
    <div data-testid={testId} className="flex">
      <HabitFormModal
        open={habitFormOpen}
        editMode
        habit={habit}
        onDone={() => setHabitFormOpen(false)}
        onClose={() => setHabitFormOpen(false)}
      />
      <div className="w-40">{habit.category}</div>
      <div className="w-80">{habit.title}</div>
      <div className="w-10">
        <span>{format(twoDayAgoTimestamp, "EEEEE")}</span>
        <Checkbox
          checked={twoDaysAgoHabit && twoDaysAgoHabit.completed}
          onCheckedChange={handleCompleteClick(twoDayAgoTimestamp)}
        />
      </div>
      <div className="w-10">
        <span>{format(yesterdayTimestamp, "EEEEE")}</span>
        <Checkbox
          checked={yesterdayHabit && yesterdayHabit.completed}
          onCheckedChange={handleCompleteClick(yesterdayTimestamp)}
        />
      </div>
      <div className="w-10">
        <span>{format(todayTimestamp, "EEEEE")}</span>
        <Checkbox
          checked={todayHabit && todayHabit.completed}
          onCheckedChange={handleCompleteClick(todayTimestamp)}
        />
      </div>
      <div className="w-10">
        <Button onClick={() => setHabitFormOpen(true)}>Edit</Button>
      </div>
    </div>
  );
};

export default HabitItem;
