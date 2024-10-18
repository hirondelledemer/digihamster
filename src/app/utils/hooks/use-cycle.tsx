"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

import { useToast } from "@/app/components/ui/use-toast";

import { Cycle } from "@/models/cycle";
import { DAY } from "../consts/dates";

export interface CycleContextValue {
  data: Cycle | null;
  updateCycle(startDate: number): void;
  error?: unknown;
  loading: boolean;
}

export const CycleContext = createContext<CycleContextValue>({
  data: null,
  updateCycle: () => {},
  loading: false,
});

const { Provider } = CycleContext;

export const CycleContextProvider = ({ children }: any) => {
  const [data, setData] = useState<Cycle | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    (async function () {
      try {
        const cycleResponse = await axios.get<Cycle>("/api/cycle");
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
      setData(
        (p) =>
          ({
            ...p,
            dates: [
              ...(p?.dates || []),
              {
                startDate,
                endDate: startDate + DAY * 5,
              },
            ],
          } as Cycle)
      );

      await axios.patch("/api/cycle", {
        startDate: startDate,
      });

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
