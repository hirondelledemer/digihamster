import React, { FC, useState } from "react";
import useHabits from "@/app/utils/hooks/use-habits";
import { Habit } from "@/models/habit";
import { getTodayWithZeroHours } from "@/app/utils/date/date";
import { Checkbox } from "../ui/checkbox";
import { subDays } from "date-fns";
import { Button } from "../ui/button";
import HabitFormModal from "../HabitFormModal";
import { TableCell, TableRow } from "../ui/table";

export interface HabitItemProps {
  testId?: string;
  habit: Habit;
}

const HabitItem: FC<HabitItemProps> = ({ testId, habit }): JSX.Element => {
  const { addLog } = useHabits();
  const [habitFormOpen, setHabitFormOpen] = useState<boolean>(false);

  const today = getTodayWithZeroHours();

  const logs = [6, 5, 4, 3, 2, 1, 0]
    .map((day) => subDays(today, day).getTime())
    .map((timestamp) => ({
      log: habit.log.find((log) => log.at === timestamp),
      timestamp,
    }));

  const handleCompleteClick = (at: number) => (checked: boolean) => {
    addLog(habit._id, {
      completed: checked,
      at,
    });
  };

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
        <TableCell className="font-medium py-1">{habit.category}</TableCell>
        <TableCell className="py-1">{habit.title}</TableCell>
        <TableCell className="py-1">{habit.timesPerMonth}</TableCell>
        {logs.map((log) => (
          <TableCell className="py-1" key={log.log?.at}>
            <Checkbox
              checked={log.log?.completed}
              onCheckedChange={handleCompleteClick(log.timestamp)}
            />
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
