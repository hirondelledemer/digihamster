"use client";

import React, { FC, ReactNode, useState } from "react";
import { useRte } from "@/app/utils/rte/rte-hook";
import { Note } from "@/models/note";
import useNotes from "@/app/utils/hooks/use-notes";
import RichTextEditor from "../RichTextEditor";
import { IconLoader } from "@tabler/icons-react";
import { cn } from "../utils";

export interface PinnedNoteProps {
  testId?: string;
  note: Note;
}

const PinnedNote: FC<PinnedNoteProps> = ({ testId, note }): ReactNode => {
  const { editor, getRteValue } = useRte({
    value: note.note,
    editable: true,
  });

  const { updateNote } = useNotes();

  const [loading, setLoading] = useState<boolean>(false);

  if (!editor) {
    return null;
  }

  const handleSubmit = async () => {
    const { title, content, tags } = getRteValue();
    setLoading(true);
    await updateNote(note._id, {
      title,
      note: content,
      tags,
    });
    setLoading(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && event.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div data-testid={testId} className="relative">
      {loading && (
        <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center">
          <IconLoader className="animate-spin-slow" />
        </div>
      )}
      <div className={cn(loading && "border border-primary rounded-md")}>
        <div className={cn(loading && "blur-[2px]")}>
          <RichTextEditor editor={editor} onKeyDown={handleKeyDown} />
        </div>
      </div>
    </div>
  );
};

export default PinnedNote;
