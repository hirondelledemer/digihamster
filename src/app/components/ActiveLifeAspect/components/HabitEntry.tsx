import { useHabitById } from "@/app/utils/hooks/use-habits-new/selectors";
import { HabitLog } from "@/app/utils/types/habit";
import { FC } from "react";
import { EntryContainer } from "./EntryContainer";

export const HabitEntry: FC<{ log: HabitLog }> = ({ log }) => {
  const habit = useHabitById(log.habit_id);

  if (!habit) {
    return <div>No habit. Smth wrong?</div>;
  }

  return <EntryContainer value={1} title={habit.title} date={log.log_date} />;
};
