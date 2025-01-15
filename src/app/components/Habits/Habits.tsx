"use client";
import React, { FC, useState } from "react";
import useHabits from "@/app/utils/hooks/use-habits";
import HabitItem from "../HabitItem";
import HabitFormModal from "../HabitFormModal";
import { Button } from "../ui/button";

export interface HabitsProps {
  testId?: string;
}

const Habits: FC<HabitsProps> = ({ testId }): JSX.Element => {
  const { data } = useHabits();
  const [habitFormOpen, setHabitFormOpen] = useState<boolean>(false);

  return (
    <div data-testid={testId}>
      <HabitFormModal
        open={habitFormOpen}
        onDone={() => setHabitFormOpen(false)}
        onClose={() => setHabitFormOpen(false)}
      />
      <Button onClick={() => setHabitFormOpen(true)}>New</Button>
      {data
        .sort((h1, h2) => h1.category.localeCompare(h2.category))
        .map((habit) => (
          <HabitItem key={habit._id} habit={habit} />
        ))}
    </div>
  );
};

export default Habits;
