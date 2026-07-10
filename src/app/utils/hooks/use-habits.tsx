"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
// import axios from "axios";
import { useToast } from "@/app/components/ui/use-toast";
import { updateObjById } from "../common/update-array";
import { Habit, HabitLog } from "@/models/habit";
import apiClient from "../api-client";
import { toBackendDate } from "#utils/date";

type FieldsRequired = "title" | "life_aspect_id" | "times_per_month";

export interface HabitsContextValue {
  data: Habit[];
  setData: Dispatch<SetStateAction<Habit[]>>;
  error?: unknown;
  loading: boolean;
  updateHabit(id: string, props: Partial<Habit>, onDone?: () => void): void;
  deleteHabit(id: string, onDone?: () => void): void;
  addLog(
    id: string,
    props: { completed: boolean; at: number; existingLog?: HabitLog },
    onDone?: () => void,
  ): void;
  createHabit(data: Pick<Habit, FieldsRequired>): void;
}

export const HabitsContext = createContext<HabitsContextValue>({
  data: [],
  setData: () => {},
  loading: false,
  updateHabit: () => {},
  createHabit: () => {},
  deleteHabit: () => {},
  addLog: () => {},
});

const { Provider } = HabitsContext;

export const HabitsContextProvider = ({ children }: any) => {
  const [data, setData] = useState<Habit[]>([]);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const habitsResponse =
          await apiClient.get<Habit[]>("/habits/with-logs");
        setData(habitsResponse.data);
      } catch (err) {
        setError(err);
        toast({
          title: "Error",
          description: "error while getting habits",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const createHabit = async (data: Pick<Habit, FieldsRequired>) => {
    const tempId = "temp-id";

    const tempHabit: Habit = {
      id: tempId,
      logs: [],
      updatedAt: "",
      ...data,
    };
    setData((e) => [...e, tempHabit]);

    try {
      const response = await apiClient.post<Habit>("/habits", {
        ...data,
        encouragement: "en",
        description: "des",
      });
      setData((e) => updateObjById<Habit>(e, tempId, response.data));
      toast({
        title: "Success",
        description: "Habit has been created",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: JSON.stringify(e),
        variant: "destructive",
      });
    }
  };

  const deleteHabit = async (
    // todo: maybe rename
    habitId: string,
    onDone?: () => void,
  ) => {
    try {
      setData((habits) => habits.filter((h) => h.id !== habitId));
      if (onDone) {
        onDone();
      }
      await apiClient.delete(`/habits/${habitId}`);
      toast({
        title: "Success",
        description: "Habit has been deleted",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: JSON.stringify(e),
        variant: "destructive",
      });
    }
  };

  const updateHabit = async (
    habitId: string,
    props: Partial<Habit>,
    onDone?: () => void,
  ) => {
    try {
      setData((p) =>
        updateObjById<Habit>(p, habitId, {
          ...props,
        }),
      );
      if (onDone) {
        onDone();
      }
      await apiClient.patch(`/habits/${habitId}`, props);
      toast({
        title: "Success",
        description: "Habit has been updated",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: JSON.stringify(e),
        variant: "destructive",
      });
    }
  };

  const addLog = async (
    habitId: string,
    props: { at: number; completed: boolean; existingLog?: HabitLog },
    onDone?: () => void,
  ) => {
    try {
      setData((p) =>
        updateObjById<Habit>(p, habitId, {
          logs: [props],
        }),
      );
      if (onDone) {
        onDone();
      }

      const logDate = toBackendDate(new Date(props.at));

      if (props.existingLog) {
        await apiClient.patch(`/habits/${habitId}/logs/${logDate}`, {
          completed: props.completed,
        });
      } else {
        await apiClient.post(`/habits/${habitId}/logs`, {
          habit_id: habitId,
          completed: props.completed,
          log_date: `${logDate}T00:00:00Z`,
        });
      }
      toast({
        title: "Success",
        description: "Log has been updated",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: JSON.stringify(e),
        variant: "destructive",
      });
    }
  };

  return (
    <Provider
      value={{
        data,
        setData,
        error,
        loading,
        updateHabit,
        createHabit,
        addLog,
        deleteHabit,
      }}
    >
      {children}
    </Provider>
  );
};

export default function useHabits() {
  const { data, setData, updateHabit, createHabit, addLog, deleteHabit } =
    useContext(HabitsContext);

  return { data, setData, updateHabit, createHabit, addLog, deleteHabit };
}
