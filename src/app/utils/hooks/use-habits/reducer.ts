import { updateObjById } from "../../common/update-array";
import { HabitsState, HabitsAction, HabitsActionType } from "./actions";
import { IHabitWithLogs } from "../../types/habit";
import { now } from "../../date/now";
import { toBackendDate } from "#utils/date";

export function reducer(state: HabitsState, action: HabitsAction): HabitsState {
  switch (action.type) {
    case HabitsActionType.StartLoading: {
      return { isLoading: true, data: [] };
    }
    case HabitsActionType.FinishLoading: {
      return { isLoading: false, data: action.payload.data };
    }
    case HabitsActionType.Error: {
      return {
        isLoading: false,
        data: [],
        errorMessage: action.payload.errorMessage,
      };
    }
    case HabitsActionType.CreateHabit: {
      return {
        isLoading: true,
        data: [...state.data, action.payload.habit],
      };
    }
    case HabitsActionType.UpdateHabit: {
      return {
        isLoading: false,
        data: updateObjById<IHabitWithLogs>(
          state.data,
          action.payload.id,
          action.payload.habit
        ),
      };
    }
    case HabitsActionType.DeleteHabit: {
      return {
        isLoading: false,
        data: state.data.filter((h) => h.id !== action.payload.id),
      };
    }
    case HabitsActionType.UpsertLog: {
      const { habitId, logDate, completed } = action.payload;
      return {
        isLoading: false,
        data: state.data.map((habit) => {
          if (habit.id !== habitId) return habit;
          const idx = habit.logs.findIndex((l) =>
            l.log_date.startsWith(logDate)
          );
          if (idx >= 0) {
            const newLogs = [...habit.logs];
            newLogs[idx] = { ...newLogs[idx], completed };
            return { ...habit, logs: newLogs };
          }
          const date = now();
          const tempId = -date.valueOf();
          return {
            ...habit,
            logs: [
              ...habit.logs,
              {
                log_date: logDate,
                completed,
                id: tempId,
                habit_id: habit.id,
                created_at: toBackendDate(date),
              },
            ],
          };
        }),
      };
    }
    default: {
      throw Error("Unknown action");
    }
  }
}
