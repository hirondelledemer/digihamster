"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useToast } from "@/app/components/ui/use-toast";

import { Cycle } from "@/models/cycle";
// import { DAY } from "../consts/dates";
import apiClient from "../api-client";
import { toBackendDate } from "#utils/date";

export interface CycleContextValue {
  data: Cycle[] | null;
  updateCycle(startDate: number): void;
  error?: unknown;
  loading: boolean;
}

// export const DEFAULT_CYCLE = {
//   id: "no-id",
//   dates: [],
//   futureDates: [],
// } as const satisfies Cycle;

export const CycleContext = createContext<CycleContextValue>({
  data: null,
  updateCycle: () => {},
  loading: false,
});

const { Provider } = CycleContext;

export const CycleContextProvider = ({ children }: any) => {
  const [data, setData] = useState<Cycle[] | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    (async function () {
      try {
        const cycleResponse = await apiClient.get<Cycle[]>("/period-cycles");
        setData(cycleResponse.data);
      } catch (err) {
        setError(err);
        toast({
          title: "Error",
          description: "error while getting cycle data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const updateCycle = async (startDate: number) => {
    try {
      const response = await apiClient.post("/period-cycles", {
        start_date: toBackendDate(new Date(startDate)),
      });

      setData(response.data);

      toast({
        title: "Success",
        description: "Cycle has started",
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
        error,
        loading,
        updateCycle,
      }}
    >
      {children}
    </Provider>
  );
};

export default function useCycle() {
  const { data, error, loading, updateCycle } = useContext(CycleContext);

  return {
    data,
    error,
    loading,
    updateCycle,
  };
}
