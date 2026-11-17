import { createContext, useContext } from "react";
import { CreateHabitParams } from "./api";
import { HabitLog, IHabitWithLogs } from "../../types/habit";

export interface HabitsActionsContextValue {
  createHabit(data: CreateHabitParams, onDone?: () => void): void;
  updateHabit(
    id: number,
    data: Partial<IHabitWithLogs>,
    onDone?: () => void
  ): void;
  deleteHabit(id: number, onDone?: () => void): void;
  addLog(
    habitId: number,
    props: { at: number; completed: boolean; existingLog?: HabitLog },
    onDone?: () => void
  ): void;
}

const DEFAULT_ACTIONS: HabitsActionsContextValue = {
  createHabit: () => {},
  updateHabit: () => {},
  deleteHabit: () => {},
  addLog: () => {},
};

export const HabitsActionsContext =
  createContext<HabitsActionsContextValue>(DEFAULT_ACTIONS);

export const useHabitsActions = () => useContext(HabitsActionsContext);
