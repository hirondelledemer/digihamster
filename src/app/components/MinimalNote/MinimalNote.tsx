"use client";
import React, { FC, useEffect } from "react";
import RichTextEditor from "../RichTextEditor";
import { useRte } from "@/app/utils/rte/rte-hook";

interface RegularProps {
  editable?: false;
}
interface EditableProps {
  editable: true;
  onSubmit(value: string): void;
}
interface CommonProps {
  testId?: string;
  note: string;
}
type MinimalNoteProps = RegularProps & CommonProps;
type MinimalNoteEditableProps = EditableProps & CommonProps;

function isEditable(
  restProps: RegularProps | EditableProps
): restProps is EditableProps {
  return (restProps as EditableProps).editable;
}

const MinimalNote: FC<MinimalNoteProps | MinimalNoteEditableProps> = ({
  testId,
  note,
  ...restProps
}): JSX.Element | null => {
  const { editor } = useRte({
    value: note,
    editable: isEditable(restProps),
  });

  useEffect(() => {
    editor?.setEditable(isEditable(restProps));
    if (restProps.editable) {
      editor?.commands.focus("end");
    }
  }, [editor, restProps]);

  useEffect(() => {
    editor?.commands.setContent(note);
  }, [editor, note]);

  if (!editor) {
    return null;
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((isEditable(restProps) && !restProps.onSubmit) || !editor) {
      throw Error("cannot submit note");
    }
    if (event.key === "Enter" && event.ctrlKey && isEditable(restProps)) {
      restProps.onSubmit(editor?.getHTML());
    }
  };

  return (
    <RichTextEditor testId={testId} editor={editor} onKeyDown={handleKeyDown} />
  );
};

export default MinimalNote;
