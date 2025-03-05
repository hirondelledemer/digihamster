"use client";
import React, { FC, useEffect } from "react";
import RichTextEditor from "../RichTextEditor";
import { useRte } from "@/app/utils/rte/rte-hook";
import { useToast } from "../ui/use-toast";

interface RegularProps {
  editable?: false;
}
interface EditableProps {
  editable: true;
  forForm: boolean;
  onSubmit(value: string): void;
}
interface CommonProps {
  testId?: string;
  note: string;
}
export type MinimalNoteProps = RegularProps & CommonProps;
export type MinimalNoteEditableProps = EditableProps & CommonProps;

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
  const editable = isEditable(restProps) ? restProps.editable : false;
  const forForm = isEditable(restProps) ? restProps.forForm : false;

  const { toast } = useToast();
  const { editor } = useRte({
    value: note,
    editable: editable,
  });

  useEffect(() => {
    editor?.setEditable(editable);

    if (editable && !forForm) {
      editor?.commands.focus("end");
    }
  }, [editor, editable, forForm]);

  useEffect(() => {
    editor?.commands.setContent(note);
  }, [editor, note]);

  if (!editor) {
    return null;
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!editor) {
      toast({
        title: "Error",
        description: "Cannot submit the note: Editor not found",
      });
    }
    if (event.key === "Enter" && event.ctrlKey && isEditable(restProps)) {
      restProps.onSubmit(editor?.getHTML());
      toast({
        title: "Success",
        description: "Note submitted",
      });
    }
  };

  return (
    <RichTextEditor testId={testId} editor={editor} onKeyDown={handleKeyDown} />
  );
};

export default MinimalNote;
