"use client";
import React, { FC, useEffect } from "react";
import RichTextEditor from "../RichTextEditor";
import { useRte } from "@/app/utils/rte/rte-hook";

// todo: do discriminated union
export interface MinimalNoteProps {
  testId?: string;
  note: string;
  editable?: false;
}
export interface MinimalNoteEditableProps {
  testId?: string;
  note: string;
  editable: true;
  onSubmit(value: string): void;
}

// todo: remove
const isEditable = (props: MinimalNoteProps | MinimalNoteEditableProps) =>
  props.editable || false;

const MinimalNote: FC<MinimalNoteProps | MinimalNoteEditableProps> = ({
  testId,
  note,
  ...restProps
}): JSX.Element | null => {
  const { editor } = useRte({
    value: note,
    editable: restProps.editable || false,
  });

  useEffect(() => {
    editor?.setEditable(restProps.editable || false);
    if (restProps.editable) {
      editor?.commands.focus("end");
    }
  }, [editor, restProps.editable]);

  useEffect(() => {
    editor?.commands.setContent(note);
  }, [editor, note]);

  if (!editor) {
    return null;
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((restProps.editable && !restProps.onSubmit) || !editor) {
      throw Error("cannot submit note");
    }
    if (event.key === "Enter" && event.ctrlKey && restProps.editable) {
      restProps.onSubmit(editor?.getHTML());
    }
  };

  return (
    <RichTextEditor testId={testId} editor={editor} onKeyDown={handleKeyDown} />
  );
};

export default MinimalNote;
