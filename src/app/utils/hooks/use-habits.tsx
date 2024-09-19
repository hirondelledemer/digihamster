"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { useToast } from "@/app/components/ui/use-toast";
import { updateObjById } from "../common/update-array";
import { Habit } from "@/models/habit";

type FieldsRequired = "title" | "category" | "timesPerMonth";

export const HabitsContext = createContext<{
  data: Habit[];
  setData: Dispatch<SetStateAction<Habit[]>>;
  error?: unknown;
  loading: boolean;
  updateHabit(id: string, props: Partial<Habit>, onDone?: () => void): void;
  deleteHabit(id: string, onDone?: () => void): void;
  addLog(
    id: string,
    props: { completed: boolean; at: number },
    onDone?: () => void
  ): void;
  createHabit(data: Pick<Habit, FieldsRequired>): void;
}>({
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
        const habitsResponse = await axios.get<Habit[]>("/api/habits");
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
      _id: tempId,
      deleted: false,
      log: [],
      updatedAt: "",
      ...data,
    };
    setData((e) => [...e, tempHabit]);

    try {
      const response = await axios.post<Habit>("/api/habits", data);
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
    onDone?: () => void
  ) => {
    try {
      setData((habits) => habits.filter((h) => h._id !== habitId));
      onDone && onDone();
      await axios.patch("/api/habits", {
        id: habitId,
        deleted: true,
      });
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
    onDone?: () => void
  ) => {
    try {
      setData((p) =>
        updateObjById<Habit>(p, habitId, {
          ...props,
        })
      );
      onDone && onDone();
      await axios.patch("/api/habits", {
        id: habitId,
        ...props,
      });
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
    props: { at: number; completed: boolean },
    onDone?: () => void
  ) => {
    try {
      //   setData((p) =>
      //     updateObjById<Habit>(p, habitId, {
      //       ...props,
      //     })
      //   );
      onDone && onDone();
      await axios.patch("/api/habits/logs", {
        id: habitId,
        completed: props.completed,
        at: props.at,
      });
      toast({
        title: "Success",
        description: "Log has been added",
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
