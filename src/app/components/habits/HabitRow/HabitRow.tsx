import { useHabitsNewActions } from "@/app/utils/hooks/use-habits-new/actions-context";
import { useLifeAspectsState } from "@/app/utils/hooks/use-life-aspects/state-context";
import { IHabitWithLogs } from "@/app/utils/types/habit";
import { FC, useRef, useState } from "react";
import { TableCell, TableRow } from "../../ui/table";
import { Input } from "../../ui/input";
import { toBackendDate } from "#utils/date";
import { Checkbox } from "../../ui/checkbox";
import { Button } from "../../ui/button";

interface HabitRowProps {
  habit: IHabitWithLogs;
  days: Date[];
}

export const HabitRow: FC<HabitRowProps> = ({ habit, days }) => {
  const { addLog, updateHabit, deleteHabit } = useHabitsNewActions(); // TODO: rename
  const { data: lifeAspects } = useLifeAspectsState();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(habit.title);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleEditStart = () => {
    setEditTitle(habit.title);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleEditSave = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== habit.title) {
      updateHabit(habit.id, { title: trimmed });
    }
    setEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleEditSave();
    if (e.key === "Escape") setEditing(false);
  };

  return (
    <TableRow>
      <TableCell className="py-1">{lifeAspect?.title ?? "—"}</TableCell>
      <TableCell className="py-1">
        {editing ? (
          <Input
            ref={inputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleEditSave}
            onKeyDown={handleEditKeyDown}
            className="h-7 py-0 px-2"
          />
        ) : (
          habit.title
        )}
      </TableCell>
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
          <Button size="sm" variant="outline" onClick={handleEditStart}>
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
  );
};
