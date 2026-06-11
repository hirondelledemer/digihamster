"use client";
import { ReactNode, useCallback, useEffect, useReducer } from "react";
import { useToast } from "@/app/components/ui/use-toast";

import { reducer } from "./reducer";
import { HabitsNewAction, HabitsNewActionType } from "./actions";
import { api, CreateHabitParams } from "./api";
import { HabitsNewStateContext } from "./state-context";
import { HabitsNewActionsContext } from "./actions-context";
import { Habit, HabitLog } from "@/models/habit";
import { toBackendDate } from "#utils/date";

const handleApiError = (
  error: any,
  toast: ReturnType<typeof useToast>["toast"],
) => {
  const errorMessage =
    error.response?.data?.message || "An unexpected error occurred";
  toast({ title: "Error", description: errorMessage, variant: "destructive" });
};

const fetchHabits = async (
  dispatch: React.Dispatch<HabitsNewAction>,
  toast: ReturnType<typeof useToast>["toast"],
) => {
  try {
    dispatch({ type: HabitsNewActionType.StartLoading });
    const response = await api.getHabits();
    dispatch({
      type: HabitsNewActionType.FinishLoading,
      payload: { data: response.data || [] },
    });
  } catch (err) {
    dispatch({
      type: HabitsNewActionType.Error,
      payload: { errorMessage: err },
    });
    handleApiError(err, toast);
  }
};

export const HabitsNewContextProvider = ({
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
      const tempId = "temp-id";
      const tempHabit: Habit = {
        id: tempId,
        title: data.title,
        logs: [],
        times_per_month: data.times_per_month,
        life_aspect_id: data.life_aspect_id.toString(),
        updatedAt: "",
      };

      dispatch({
        type: HabitsNewActionType.CreateHabit,
        payload: { habit: tempHabit },
      });

      if (onDone) onDone();

      try {
        const response = await api.createHabit(data);
        dispatch({
          type: HabitsNewActionType.UpdateHabit,
          payload: { id: tempId, habit: response.data },
        });
        toast({ title: "Success", description: "Habit has been created" });
      } catch (e: any) {
        dispatch({
          type: HabitsNewActionType.UpdateHabit,
          payload: {
            id: tempId,
            habit: { id: "" },
          },
        });
        handleApiError(e, toast);
      }
    },
    [toast],
  );

  const updateHabit = useCallback(
    async (id: string, data: Partial<Habit>, onDone?: () => void) => {
      dispatch({
        type: HabitsNewActionType.UpdateHabit,
        payload: { id, habit: data },
      });
      if (onDone) onDone();
      try {
        await api.updateHabit(id, data);
        toast({ title: "Success", description: "Habit has been updated" });
      } catch (e: any) {
        handleApiError(e, toast);
      }
    },
    [toast],
  );

  const deleteHabit = useCallback(
    async (id: string, onDone?: () => void) => {
      dispatch({ type: HabitsNewActionType.DeleteHabit, payload: { id } });
      if (onDone) onDone();
      try {
        await api.deleteHabit(id);
        toast({ title: "Success", description: "Habit has been deleted" });
      } catch (e: any) {
        handleApiError(e, toast);
      }
    },
    [toast],
  );

  const addLog = useCallback(
    async (
      habitId: string,
      props: { at: number; completed: boolean; existingLog?: HabitLog },
      onDone?: () => void,
    ) => {
      const logDate = toBackendDate(new Date(props.at));

      dispatch({
        type: HabitsNewActionType.UpsertLog,
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
      } catch (e: any) {
        handleApiError(e, toast);
      }
    },
    [toast],
  );

  return (
    <HabitsNewStateContext.Provider value={state}>
      <HabitsNewActionsContext.Provider
        value={{ createHabit, updateHabit, deleteHabit, addLog }}
      >
        {children}
      </HabitsNewActionsContext.Provider>
    </HabitsNewStateContext.Provider>
  );
};
