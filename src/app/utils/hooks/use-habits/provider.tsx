"use client";
import { ReactNode, useCallback, useEffect, useReducer } from "react";
import { useToast } from "@/app/components/ui/use-toast";

import { reducer } from "./reducer";
import { HabitsAction, HabitsActionType } from "./actions";
import { api, CreateHabitParams } from "./api";
import { HabitsStateContext } from "./state-context";
import { HabitsActionsContext } from "./actions-context";
import { toBackendDate, toBackendDateTime } from "#utils/date";
import { getApiErrorMessage } from "../../axios";
import { now } from "../../date/now";
import { HabitLog, IHabitWithLogs } from "../../types/habit";

const handleApiError = (
  error: unknown,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  toast({
    title: "Error",
    description: getApiErrorMessage(error),
    variant: "destructive",
  });
};

const fetchHabits = async (
  dispatch: React.Dispatch<HabitsAction>,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  try {
    dispatch({ type: HabitsActionType.StartLoading });
    const response = await api.getHabits();
    dispatch({
      type: HabitsActionType.FinishLoading,
      payload: { data: response.data || [] },
    });
  } catch (err) {
    dispatch({
      type: HabitsActionType.Error,
      payload: { errorMessage: err },
    });
    handleApiError(err, toast);
  }
};

export const HabitsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    data: [],
  });

  const { toast } = useToast();

  const fetchDataMemoized = useCallback(() => {
    fetchHabits(dispatch, toast);
  }, [toast]);

  useEffect(() => {
    fetchDataMemoized();
  }, [fetchDataMemoized]);

  const createHabit = useCallback(
    async (data: CreateHabitParams, onDone?: () => void) => {
      const nowDate = now();
      const tempId = -nowDate.valueOf();
      const tempHabit: IHabitWithLogs = {
        id: tempId,
        title: data.title,
        logs: [],
        times_per_month: data.times_per_month,
        life_aspect_id: data.life_aspect_id,
        description: data.description,
        encouragement: data.encouragement,
        created_at: toBackendDateTime(nowDate),
      };

      dispatch({
        type: HabitsActionType.CreateHabit,
        payload: { habit: tempHabit },
      });

      if (onDone) onDone();

      try {
        const response = await api.createHabit(data);
        dispatch({
          type: HabitsActionType.UpdateHabit,
          payload: { id: tempId, habit: response.data },
        });
        toast({ title: "Success", description: "Habit has been created" });
      } catch (e: unknown) {
        handleApiError(e, toast);
      }
    },
    [toast]
  );

  const updateHabit = useCallback(
    async (id: number, data: Partial<IHabitWithLogs>, onDone?: () => void) => {
      dispatch({
        type: HabitsActionType.UpdateHabit,
        payload: { id, habit: data },
      });
      if (onDone) onDone();
      try {
        await api.updateHabit(id, data);
        toast({ title: "Success", description: "Habit has been updated" });
      } catch (e: unknown) {
        handleApiError(e, toast);
      }
    },
    [toast]
  );

  const deleteHabit = useCallback(
    async (id: number, onDone?: () => void) => {
      dispatch({ type: HabitsActionType.DeleteHabit, payload: { id } });
      if (onDone) onDone();
      try {
        await api.deleteHabit(id);
        toast({ title: "Success", description: "Habit has been deleted" });
      } catch (e: unknown) {
        handleApiError(e, toast);
      }
    },
    [toast]
  );

  const addLog = useCallback(
    async (
      habitId: number,
      props: { at: number; completed: boolean; existingLog?: HabitLog },
      onDone?: () => void
    ) => {
      const logDate = toBackendDate(new Date(props.at));

      dispatch({
        type: HabitsActionType.UpsertLog,
        payload: { habitId, logDate, completed: props.completed },
      });

      if (onDone) onDone();

      try {
        if (props.existingLog) {
          await api.updateLog(habitId, logDate, {
            completed: props.completed,
          });
        } else {
          await api.addLog(habitId, {
            habit_id: habitId,
            log_date: `${logDate}T00:00:00Z`,
            completed: props.completed,
          });
        }
        toast({ title: "Success", description: "Log has been updated" });
      } catch (e: unknown) {
        handleApiError(e, toast);
      }
    },
    [toast]
  );

  return (
    <HabitsStateContext.Provider value={state}>
      <HabitsActionsContext.Provider
        value={{ createHabit, updateHabit, deleteHabit, addLog }}
      >
        {children}
      </HabitsActionsContext.Provider>
    </HabitsStateContext.Provider>
  );
};
