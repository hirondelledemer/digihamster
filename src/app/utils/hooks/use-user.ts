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
import { Task } from "@/models/task";
import { useToast } from "@/app/components/ui/use-toast";
import { User } from "@/models/user";

export const UserContext = createContext<{
  data: User | null;
  setData: Dispatch<SetStateAction<User>>;
  error?: unknown;
  loading: boolean;
}>({
  data: [],
  setData: () => {},
  error: undefined,
  loading: false,
});

const { Provider } = UserContext;

export const UserContextProvider = ({ children }: any) => {
  const [data, setData] = useState<User>(null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const userResponse = await axios.get<User>("/api/users/me");
        setData(userResponse.data);
      } catch (err) {
        setError(err);
        toast({
          title: "Error",
          description: "error while getting user",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  return (
    <Provider value={{ data, setData, error, loading }}>{children}</Provider>
  );
};

export default function useUser() {
  const { data, setData } = useContext(UserContext);

  return { data, setData };
}
