import { Habit } from "@/models/habit";
import { updateObjById } from "../../common/update-array";
import {
  HabitsNewState,
  HabitsNewAction,
  HabitsNewActionType,
} from "./actions";

export function reducer(
  state: HabitsNewState,
  action: HabitsNewAction,
): HabitsNewState {
  switch (action.type) {
    case HabitsNewActionType.StartLoading: {
      return { isLoading: true, data: [] };
    }
    case HabitsNewActionType.FinishLoading: {
      return { isLoading: false, data: action.payload.data };
    }
    case HabitsNewActionType.Error: {
      return {
        isLoading: false,
        data: [],
        errorMessage: action.payload.errorMessage,
      };
    }
    case HabitsNewActionType.CreateHabit: {
      return {
        isLoading: true,
        data: [...state.data, action.payload.habit],
      };
    }
    case HabitsNewActionType.UpdateHabit: {
      return {
        isLoading: false,
        data: updateObjById<Habit>(
          state.data,
          action.payload.id,
          action.payload.habit,
        ),
      };
    }
    case HabitsNewActionType.DeleteHabit: {
      return {
        isLoading: false,
        data: state.data.filter((h) => h.id !== action.payload.id),
      };
    }
    case HabitsNewActionType.UpsertLog: {
      const { habitId, logDate, completed } = action.payload;
      return {
        isLoading: false,
        data: state.data.map((habit) => {
          if (habit.id !== habitId) return habit;
          const idx = habit.logs.findIndex((l) =>
            l.log_date.startsWith(logDate),
          );
          if (idx >= 0) {
            const newLogs = [...habit.logs];
            newLogs[idx] = { ...newLogs[idx], completed };
            return { ...habit, logs: newLogs };
          }
          return {
            ...habit,
            logs: [...habit.logs, { log_date: logDate, completed }],
          };
        }),
      };
    }
    default: {
      throw Error("Unknown action");
    }
  }
}
