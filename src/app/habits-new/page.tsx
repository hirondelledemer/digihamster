"use client";
import React, { FC, useState } from "react";
import { format, subDays } from "date-fns";
import { HabitsNewContextProvider } from "@/app/utils/hooks/use-habits-new/provider";
import { useHabitsNewState } from "@/app/utils/hooks/use-habits-new/state-context";
import { useHabitsNewActions } from "@/app/utils/hooks/use-habits-new/actions-context";
import { LifeAspectsContextProvider } from "@/app/utils/hooks/use-life-aspects/provider";
import { useLifeAspectsState } from "@/app/utils/hooks/use-life-aspects/state-context";
import { getTodayWithZeroHours } from "@/app/utils/date/now";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { TIMES_PER_MONTH } from "@/app/components/HabitForm/constants";
import { HabitRow } from "../components/habits/HabitRow/HabitRow";

const DAY_COUNT = 6;

function getDayColumns(today: Date) {
  return Array.from({ length: DAY_COUNT + 1 }, (_, i) =>
    subDays(today, DAY_COUNT - i)
  );
}

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
      description: "",
      encouragement: "",
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
                b.life_aspect_id.toString() ?? ""
              )
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
