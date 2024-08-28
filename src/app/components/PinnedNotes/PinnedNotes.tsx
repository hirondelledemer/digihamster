"use client"; // todo: rethink
import React, { FC } from "react";

import useNotes from "@/app/utils/hooks/use-notes";
import PinnedNote from "../PinnedNote/PinnedNote";

export interface PinnedNotesProps {
  testId?: string;
}

const PinnedNotes: FC<PinnedNotesProps> = ({ testId }): JSX.Element => {
  const { data: notes } = useNotes();

  console.log(notes);
  return (
    <div data-testid={testId} className="space-y-6">
      {notes.map((note) => (
        <PinnedNote key={note._id} note={note} />
      ))}
    </div>
  );
};

export default PinnedNotes;
