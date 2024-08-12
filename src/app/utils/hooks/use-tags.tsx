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
import { Tag } from "@/models/tag";

export const TagsContext = createContext<{
  data: Tag[];
  setData: Dispatch<SetStateAction<Tag[]>>;
  error?: unknown;
  loading: boolean;
}>({
  data: [],
  setData: () => {},
  loading: false,
});

const { Provider } = TagsContext;

export const TagsContextProvider = ({ children }: any) => {
  const [data, setData] = useState<Tag[]>([]);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const tagsResponse = await axios.get<Tag[]>("/api/tags");
        setData(tagsResponse.data);
      } catch (err) {
        setError(err);
        toast({
          title: "Error",
          description: "error while getting tags",
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

export default function useTags() {
  const { data, setData, loading } = useContext(TagsContext);

  return { data, setData, loading };
}
