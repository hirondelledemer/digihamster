import React, { FC, useState } from "react";
import useHabits from "@/app/utils/hooks/use-habits";
import { Habit } from "@/models/habit";
import { now } from "@/app/utils/date/date";
import { Checkbox } from "../ui/checkbox";
import { format, subDays } from "date-fns";
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

  const today = now();
  today.setHours(0, 0, 0, 0);

  const todayTimestamp = today.getTime();
  const yesterdayTimestamp = subDays(today, 1).getTime();
  const twoDayAgoTimestamp = subDays(today, 2).getTime();
  const sixDaysAgoTimestamp = subDays(today, 3).getTime();
  const fiveDaysAgoTimestamp = subDays(today, 3).getTime();
  const fourDaysAgoTimestamp = subDays(today, 3).getTime();
  const threeDaysAgoTimestamp = subDays(today, 3).getTime();

  const todayHabit = habit.log.find((log) => log.at === todayTimestamp);
  const yesterdayHabit = habit.log.find((log) => log.at === yesterdayTimestamp);

  const twoDaysAgoHabit = habit.log.find(
    (log) => log.at === twoDayAgoTimestamp
  );
  const threeDaysAgoHabit = habit.log.find(
    (log) => log.at === threeDaysAgoTimestamp
  );
  const fourDaysAgoHabit = habit.log.find(
    (log) => log.at === fourDaysAgoTimestamp
  );
  const fiveDaysAgoHabit = habit.log.find(
    (log) => log.at === fiveDaysAgoTimestamp
  );
  const sixDaysAgoHabit = habit.log.find(
    (log) => log.at === sixDaysAgoTimestamp
  );

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
        <TableCell className="font-medium">{habit.category}</TableCell>
        <TableCell>{habit.title}</TableCell>
        <TableCell>{habit.timesPerMonth}</TableCell>
        <TableCell>
          <Checkbox
            checked={sixDaysAgoHabit && sixDaysAgoHabit.completed}
            onCheckedChange={handleCompleteClick(sixDaysAgoTimestamp)}
          />
        </TableCell>
        <TableCell>
          <Checkbox
            checked={fiveDaysAgoHabit && fiveDaysAgoHabit.completed}
            onCheckedChange={handleCompleteClick(fiveDaysAgoTimestamp)}
          />
        </TableCell>
        <TableCell>
          <Checkbox
            checked={fourDaysAgoHabit && fourDaysAgoHabit.completed}
            onCheckedChange={handleCompleteClick(fourDaysAgoTimestamp)}
          />
        </TableCell>
        <TableCell>
          <Checkbox
            checked={threeDaysAgoHabit && threeDaysAgoHabit.completed}
            onCheckedChange={handleCompleteClick(threeDaysAgoTimestamp)}
          />
        </TableCell>
        <TableCell>
          <Checkbox
            checked={twoDaysAgoHabit && twoDaysAgoHabit.completed}
            onCheckedChange={handleCompleteClick(twoDayAgoTimestamp)}
          />
        </TableCell>
        <TableCell>
          <Checkbox
            checked={yesterdayHabit && yesterdayHabit.completed}
            onCheckedChange={handleCompleteClick(yesterdayTimestamp)}
          />
        </TableCell>
        <TableCell>
          <Checkbox
            checked={todayHabit && todayHabit.completed}
            onCheckedChange={handleCompleteClick(todayTimestamp)}
          />
        </TableCell>
        <TableCell className="text-right">
          <Button onClick={() => setHabitFormOpen(true)}>Edit</Button>
        </TableCell>
      </TableRow>
    </>
  );
  // return (
  //   <div data-testid={testId} className="flex hover:bg hover:bg-secondary">
  //     <HabitFormModal
  //       open={habitFormOpen}
  //       editMode
  //       habit={habit}
  //       onDone={() => setHabitFormOpen(false)}
  //       onClose={() => setHabitFormOpen(false)}
  //     />
  //     <div className="w-40">{habit.category}</div>
  //     <div className="w-80">{habit.title}</div>
  //     <div className="w-10">
  //       <span>{format(twoDayAgoTimestamp, "EEEEE")}</span>
  //       <Checkbox
  //         checked={twoDaysAgoHabit && twoDaysAgoHabit.completed}
  //         onCheckedChange={handleCompleteClick(twoDayAgoTimestamp)}
  //       />
  //     </div>
  //     <div className="w-10">
  //       <span>{format(yesterdayTimestamp, "EEEEE")}</span>
  // <Checkbox
  //   checked={yesterdayHabit && yesterdayHabit.completed}
  //   onCheckedChange={handleCompleteClick(yesterdayTimestamp)}
  // />;
  //     </div>
  //     <div className="w-10">
  //       <span>{format(todayTimestamp, "EEEEE")}</span>
  // <Checkbox
  //   checked={todayHabit && todayHabit.completed}
  //   onCheckedChange={handleCompleteClick(todayTimestamp)}
  // />
  //     </div>
  //     <div className="w-10">
  //       <Button onClick={() => setHabitFormOpen(true)}>Edit</Button>
  //     </div>
  //   </div>
  // );
};

export default HabitItem;
