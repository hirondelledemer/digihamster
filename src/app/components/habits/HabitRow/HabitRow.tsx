import { useHabitsActions } from "@/app/utils/hooks/use-habits/actions-context";
import { useLifeAspectsState } from "@/app/utils/hooks/use-life-aspects/state-context";
import { IHabitWithLogs } from "@/app/utils/types/habit";
import { FC, useState } from "react";
import { TableCell, TableRow } from "../../ui/table";
import { toBackendDate } from "@/utils/date";
import { Checkbox } from "../../ui/checkbox";
import { Button } from "../../ui/button";
import HabitFormModal from "../HabitFormModal";

interface HabitRowProps {
  habit: IHabitWithLogs;
  days: Date[];
}

export const HabitRow: FC<HabitRowProps> = ({ habit, days }) => {
  const { addLog, deleteHabit } = useHabitsActions();
  const { data: lifeAspects } = useLifeAspectsState();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const lifeAspect = lifeAspects.find(
    (la) => la.id.toString() === habit.life_aspect_id.toString()
  );

  const handleCheck =
    (
      timestamp: number,
      existingLog: IHabitWithLogs["logs"][number] | undefined
    ) =>
    (checked: boolean) => {
      addLog(habit.id, { at: timestamp, completed: checked, existingLog });
    };

  return (
    <>
      <HabitFormModal
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        habit={habit}
        editMode
        onDone={() => setIsDialogOpen(false)}
      />
      <TableRow>
        <TableCell className="py-1">{lifeAspect?.title ?? "—"}</TableCell>
        <TableCell className="py-1">{habit.title}</TableCell>
        <TableCell className="py-1">{habit.times_per_month}</TableCell>
        {days.map((day) => {
          const ts = day.getTime();
          const log = habit.logs.find(
            (l) => l.log_date.slice(0, 10) === toBackendDate(new Date(ts))
          );
          return (
            <TableCell className="py-1" key={ts}>
              <Checkbox
                checked={log?.completed}
                onCheckedChange={handleCheck(ts, log)}
              />
            </TableCell>
          );
        })}
        <TableCell className="py-1 text-right">
          <div className="flex gap-1 justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsDialogOpen(true)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteHabit(habit.id)}
            >
              Delete
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};
