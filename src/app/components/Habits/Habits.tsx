"use client";
import React, { FC, useState } from "react";
import useHabits from "@/app/utils/hooks/use-habits";
import HabitItem from "../HabitItem";
import HabitFormModal from "../HabitFormModal";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { format, subDays } from "date-fns";
import { now } from "@/app/utils/date/date";

export interface HabitsProps {
  testId?: string;
}

const Habits: FC<HabitsProps> = ({ testId }): JSX.Element => {
  const { data } = useHabits();
  const [habitFormOpen, setHabitFormOpen] = useState<boolean>(false);
  const today = now();
  today.setHours(0, 0, 0, 0); // extract today
  const twoDayAgoTimestamp = subDays(today, 2).getTime(); // extract all the days
  const yesterdayTimestamp = subDays(today, 1).getTime();
  const todayTimestamp = today.getTime();

  return (
    <div data-testid={testId}>
      <HabitFormModal
        open={habitFormOpen}
        onDone={() => setHabitFormOpen(false)}
        onClose={() => setHabitFormOpen(false)}
      />
      <Button onClick={() => setHabitFormOpen(true)}>New</Button>

      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Category</TableHead>
            <TableHead>Habit</TableHead>
            <TableHead>{format(twoDayAgoTimestamp, "EEEEE")}</TableHead>
            <TableHead>{format(yesterdayTimestamp, "EEEEE")}</TableHead>
            <TableHead>{format(todayTimestamp, "EEEEE")}</TableHead>

            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data
            .sort((h1, h2) => h1.category.localeCompare(h2.category))
            .map((habit) => (
              <HabitItem key={habit._id} habit={habit} />
            ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            {/* // add total sum */}
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default Habits;
