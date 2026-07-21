import React, { FC, useState } from "react";
import useHabits from "@/app/utils/hooks/use-habits";
import { Habit } from "@/models/habit";
import { getTodayWithZeroHours } from "@/app/utils/date/now";
import { Checkbox } from "../ui/checkbox";
import { differenceInDays, subDays } from "date-fns";
import { Button } from "../ui/button";
import HabitFormModal from "../HabitFormModal";
import { TableCell, TableRow } from "../ui/table";
import { useLifeAspectsState } from "@/app/utils/hooks/use-life-aspects/state-context";

export interface HabitItemProps {
  testId?: string;
  habit: Habit;
}

const HabitItem: FC<HabitItemProps> = ({ habit }): JSX.Element => {
  const { addLog } = useHabits();
  const { data: lifeAspects } = useLifeAspectsState();
  const [habitFormOpen, setHabitFormOpen] = useState<boolean>(false);

  const today = getTodayWithZeroHours();

  console.log("kabiy", habit);
  const logs = [6, 5, 4, 3, 2, 1, 0]
    .map((day) => subDays(today, day).getTime())
    .map((timestamp) => ({
      log: habit.logs.find(
        (log) => differenceInDays(log.log_date, timestamp) === 0,
      ),
      timestamp,
    }));

  const handleCompleteClick =
    (at: number, existingLog?: (typeof logs)[number]["log"]) =>
    (checked: boolean) => {
      addLog(habit.id, {
        completed: checked,
        at,
        existingLog,
      });
    };

  // const earliestDay = subDays(now(), 28).getTime();

  // const progress = habit.logs.filter(
  //   (log) => log.at >= earliestDay && log.completed,
  // ).length;
  // const progressPercentage = (progress / habit.times_per_month) * 100;
  // {
  //   console.log(logs);
  // }

  return (
    <>
      <HabitFormModal
        open={habitFormOpen}
        editMode
        habit={habit}
        onDone={() => setHabitFormOpen(false)}
        onClose={() => setHabitFormOpen(false)}
      />
      <TableRow>
        <TableCell className="font-medium py-1">
          {
            lifeAspects.find((la) => la.id.toString() === habit.life_aspect_id)
              ?.title
          }
        </TableCell>
        <TableCell className="py-1">{habit.title}</TableCell>
        <TableCell className="py-1">
          {/* {Math.floor(progressPercentage)}% */} progress TODO
        </TableCell>
        <TableCell className="py-1">{habit.times_per_month}</TableCell>
        {logs.map((log, index) => (
          <TableCell className="py-1" key={index}>
            <>
              {console.log("log completed", index, log)}
              <Checkbox
                checked={log.log?.completed}
                onCheckedChange={handleCompleteClick(log.timestamp, log.log)}
              />
            </>
          </TableCell>
        ))}
        <TableCell className="text-right py-1">
          <Button onClick={() => setHabitFormOpen(true)}>Edit</Button>
        </TableCell>
      </TableRow>
    </>
  );
};

export default HabitItem;
