import { createContext, useContext } from "react";
import { CreateHabitParams } from "./api";
import { Habit, HabitLog } from "@/models/habit";

export interface HabitsNewActionsContextValue {
  createHabit(data: CreateHabitParams, onDone?: () => void): void;
  updateHabit(id: string, data: Partial<Habit>, onDone?: () => void): void;
  deleteHabit(id: string, onDone?: () => void): void;
  addLog(
    habitId: string,
    props: { at: number; completed: boolean; existingLog?: HabitLog },
    onDone?: () => void,
  ): void;
}

const DEFAULT_ACTIONS: HabitsNewActionsContextValue = {
  createHabit: () => {},
  updateHabit: () => {},
  deleteHabit: () => {},
  addLog: () => {},
};

export const HabitsNewActionsContext =
  createContext<HabitsNewActionsContextValue>(DEFAULT_ACTIONS);

export const useHabitsNewActions = () => useContext(HabitsNewActionsContext);
