"use client";
import React, { FC, useRef, useState } from "react";
import { format, subDays } from "date-fns";
import { toBackendDate } from "#utils/date";
import { HabitsNewContextProvider } from "@/app/utils/hooks/use-habits-new/provider";
import { useHabitsNewState } from "@/app/utils/hooks/use-habits-new/state-context";
import { useHabitsNewActions } from "@/app/utils/hooks/use-habits-new/actions-context";
import { LifeAspectsContextProvider } from "@/app/utils/hooks/use-life-aspects/provider";
import { useLifeAspectsState } from "@/app/utils/hooks/use-life-aspects/state-context";
import { Habit } from "@/models/habit";
import { getTodayWithZeroHours } from "@/app/utils/date/now";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { TIMES_PER_MONTH } from "@/app/components/HabitForm/HabitForm.consts";

const DAY_COUNT = 6;

function getDayColumns(today: Date) {
  return Array.from({ length: DAY_COUNT + 1 }, (_, i) =>
    subDays(today, DAY_COUNT - i),
  );
}

interface HabitRowProps {
  habit: Habit;
  days: Date[];
}

const HabitRow: FC<HabitRowProps> = ({ habit, days }) => {
  const { addLog, updateHabit, deleteHabit } = useHabitsNewActions();
  const { data: lifeAspects } = useLifeAspectsState();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(habit.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const lifeAspect = lifeAspects.find(
    (la) => la.id.toString() === habit.life_aspect_id.toString(),
  );

  const handleCheck =
    (timestamp: number, existingLog: Habit["logs"][number] | undefined) =>
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
          (l) => l.log_date.slice(0, 10) === toBackendDate(new Date(ts)),
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

const NewHabitForm: FC = () => {
  const { createHabit } = useHabitsNewActions();
  const { data: lifeAspects } = useLifeAspectsState();
  const [title, setTitle] = useState("");
  const [lifeAspectId, setLifeAspectId] = useState("");
  const [timesPerMonth, setTimesPerMonth] = useState<number>(0);

  const canSubmit =
    title.trim().length > 0 && lifeAspectId !== "" && timesPerMonth > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    createHabit({
      title: title.trim(),
      life_aspect_id: Number(lifeAspectId),
      times_per_month: timesPerMonth,
    });
    setTitle("");
    setLifeAspectId("");
    setTimesPerMonth(0);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-4">
      <Input
        placeholder="Habit title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="max-w-xs"
      />
      <Select value={lifeAspectId} onValueChange={setLifeAspectId}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Life aspect" />
        </SelectTrigger>
        <SelectContent>
          {lifeAspects.map((la) => (
            <SelectItem key={la.id} value={la.id.toString()}>
              {la.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={timesPerMonth > 0 ? timesPerMonth.toString() : ""}
        onValueChange={(v) => setTimesPerMonth(Number(v))}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Frequency" />
        </SelectTrigger>
        <SelectContent>
          {TIMES_PER_MONTH.map((item) => (
            <SelectItem key={item.value} value={item.value.toString()}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" disabled={!canSubmit}>
        Add
      </Button>
    </form>
  );
};

const HabitsNewTable: FC = () => {
  const { data, isLoading } = useHabitsNewState();
  const today = getTodayWithZeroHours();
  const days = getDayColumns(today);

  return (
    <div className="p-4">
      <NewHabitForm />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Habit</TableHead>
            <TableHead>n/month</TableHead>
            {days.map((day) => (
              <TableHead key={day.getTime()} data-chromatic="ignore">
                {format(day, "E")}
              </TableHead>
            ))}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={3 + days.length}>Loading…</TableCell>
            </TableRow>
          )}
          {data
            .sort((a, b) =>
              (a.life_aspect_id.toString() ?? "").localeCompare(
                b.life_aspect_id ?? "",
              ),
            )
            .map((habit) => (
              <HabitRow key={habit.id} habit={habit} days={days} />
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default function HabitsNewPage() {
  return (
    <HabitsNewContextProvider>
      <LifeAspectsContextProvider>
        <HabitsNewTable />
      </LifeAspectsContextProvider>
    </HabitsNewContextProvider>
  );
}
