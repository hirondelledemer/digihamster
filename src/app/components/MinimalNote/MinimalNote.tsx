import React, { FC, useEffect } from "react";
import RichTextEditor from "../RichTextEditor";
import { useRte } from "@/app/utils/rte/rte-hook";

// todo: do discriminated union
export interface MinimalNoteProps {
  testId?: string;
  note: string;
  editable?: boolean;
  onSubmit?(value: string): void;
}

const MinimalNote: FC<MinimalNoteProps> = ({
  testId,
  note,
  editable = false,
  onSubmit,
}): JSX.Element => {
  const { editor } = useRte({
    value: note,
    editable,
  });

  useEffect(() => {
    editor?.setEditable(editable);
    if (editable) {
      editor?.commands.focus("end");
    }
  }, [editable]);

  useEffect(() => {
    editor?.commands.setContent(note);
  }, [note]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onSubmit || !editor) {
      throw Error("cannot submit note");
    }
    if (event.key === "Enter" && event.ctrlKey) {
      onSubmit(editor?.getHTML());
    }
  };

  return (
    <RichTextEditor testId={testId} editor={editor} onKeyDown={handleKeyDown} />
  );
};

export default MinimalNote;
