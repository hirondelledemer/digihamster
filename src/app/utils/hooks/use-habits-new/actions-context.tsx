import { createContext, useContext } from "react";
import { CreateHabitParams } from "./api";
import { HabitLog, IHabitWithLogs } from "../../types/habit";

export interface HabitsNewActionsContextValue {
  createHabit(data: CreateHabitParams, onDone?: () => void): void;
  updateHabit(
    id: number,
    data: Partial<IHabitWithLogs>,
    onDone?: () => void,
  ): void;
  deleteHabit(id: number, onDone?: () => void): void;
  addLog(
    habitId: number,
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
