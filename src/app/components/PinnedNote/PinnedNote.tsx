"use client";

import React, { FC, ReactNode } from "react";
import { useRte } from "@/app/utils/rte/rte-hook";
import axios from "axios";
import { INote, Note } from "@/models/note";
import { useToast } from "../ui/use-toast";
import useNotes from "@/app/utils/hooks/use-notes";
import RichTextEditor from "../RichTextEditor";
import { updateObjById } from "@/app/utils/common/update-array";

export interface PinnedNoteProps {
  testId?: string;
  note: Note;
}

const PinnedNote: FC<PinnedNoteProps> = ({ testId, note }): ReactNode => {
  const { editor, getRteValue } = useRte({
    value: note.note,
    editable: true,
  });

  const { toast } = useToast();
  const { setData } = useNotes();

  if (!editor) {
    return null;
  }

  const handleSubmit = async () => {
    const { title, content, tags } = getRteValue();

    try {
      const updatedNote = await axios.patch<INote, INote>("/api/notes", {
        id: note._id,
        title: title,
        note: content,
        tags: tags,
      });
      toast({
        title: "Success",
        description: "Note has been updated",
      });
      setData((n) =>
        updateObjById<Note>(n, note._id, {
          ...updatedNote,
        })
      );
    } catch (e) {
      toast({
        title: "Error",
        description: JSON.stringify(e),
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && event.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div data-testid={testId}>
      <RichTextEditor editor={editor} onKeyDown={handleKeyDown} />
    </div>
  );
};

export default PinnedNote;
