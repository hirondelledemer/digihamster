"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { INote, Note } from "@/models/note";
import { useToast } from "@/app/components/ui/use-toast";
import { updateObjById } from "../common/update-array";

type UpdateNoteValues = Pick<Note, "title" | "note" | "tags">;
export const NotesContext = createContext<{
  data: Note[];
  loading: boolean;
  updateNote(noteId: string, data: UpdateNoteValues): void;
}>({
  data: [],
  updateNote: () => {},
  loading: false,
});

const { Provider } = NotesContext;

export const NotesContextProvider = ({ children }: any) => {
  const [data, setData] = useState<Note[]>([]);
  // todo: look into utilising this
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const notesResponse = await axios.get<Note[]>(
          "/api/notes?isActive=true"
        );
        setData(notesResponse.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateNote = async (noteId: string, data: UpdateNoteValues) => {
    try {
      setLoading(true);
      const updatedNote = await axios.patch<INote, INote>("/api/notes", {
        id: noteId,
        title: data.title,
        note: data.note,
        tags: data.tags,
      });
      toast({
        title: "Success",
        description: "Note has been updated",
      });
      setData((n) =>
        updateObjById<Note>(n, noteId, {
          ...updatedNote,
        })
      );
    } catch (e) {
      toast({
        title: "Error",
        description: JSON.stringify(e),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return <Provider value={{ data, updateNote, loading }}>{children}</Provider>;
};

export default function useNotes() {
  const { data, updateNote, loading } = useContext(NotesContext);

  return { data, updateNote, loading };
}
