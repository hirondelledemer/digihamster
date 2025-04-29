"use client"; // todo: rethink
import React, { FC } from "react";

import PinnedNote from "../PinnedNote/PinnedNote";
import { useNotesState } from "@/app/utils/hooks/use-notes/state-context";

export interface PinnedNotesProps {
  testId?: string;
}

const PinnedNotes: FC<PinnedNotesProps> = ({ testId }): JSX.Element => {
  const { data: notes } = useNotesState();

  const activeNotes = notes.filter((note) => note.isActive);

  console.log(notes);

  return (
    <div data-testid={testId} className="space-y-6">
      {activeNotes.map((note) => (
        <PinnedNote key={note._id} note={note} />
      ))}
    </div>
  );
};

export default PinnedNotes;
