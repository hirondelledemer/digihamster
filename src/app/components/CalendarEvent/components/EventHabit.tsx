import { FC } from "react";
import { cn } from "../../utils";
import { Checkbox } from "../../ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { IHabitWithLogs } from "@/app/utils/types/habit";
import { toBackendDate } from "#utils/date";
import { useHabitsNewActions } from "@/app/utils/hooks/use-habits-new/actions-context";

interface EventHabitProps {
  habit: IHabitWithLogs;
  onCompletedChange: (value: CheckedState) => void;
  date: Date;
}

export const EventHabit: FC<EventHabitProps> = ({ habit, date }) => {
  const { addLog } = useHabitsNewActions();

  date.setHours(0, 0, 0, 0);
  const log = habit.logs.find(
    (log) => log.log_date.slice(0, 10) === toBackendDate(new Date(date))
  );
  const isCompleted = log?.completed;

  const onCompletedChange = (val: CheckedState) => {
    addLog(habit.id, {
      completed: val ? true : false,
      at: date.valueOf(),
    });
  };

  return (
    <div
      className={cn(
        "text-sm mt-1 border bg-card rounded-md p-1 flex items-center gap-2"
      )}
    >
      <Checkbox
        checked={isCompleted} // TODO
        onCheckedChange={onCompletedChange}
        onClick={(event) => {
          event.stopPropagation();
        }}
        onMouseDownCapture={(event) => {
          // the calendar listens for mousedown natively to start a
          // slot selection, so it has to be stopped in the capture phase
          event.stopPropagation();
        }}
      />
      {habit.title}
    </div>
  );
};
