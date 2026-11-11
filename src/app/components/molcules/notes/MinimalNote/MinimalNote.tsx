"use client";
import React, { FC, useEffect } from "react";
import { useRte } from "@/app/utils/rte/rte-hook";
import { Content } from "@tiptap/react";
import { useToast } from "@/app/components/ui/use-toast";
import RichTextEditor from "@/app/components/RichTextEditor";

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
  note: Content;
  className?: string;
}
export type MinimalNoteProps = RegularProps & CommonProps;
export type MinimalNoteEditableProps = EditableProps & CommonProps;

function isEditable(
  restProps: RegularProps | EditableProps
): restProps is EditableProps {
  return (restProps as EditableProps).editable;
}

export const MinimalNote: FC<MinimalNoteProps | MinimalNoteEditableProps> = ({
  testId,
  note,
  className,
  ...restProps
}): JSX.Element | null => {
  const editable = isEditable(restProps) ? restProps.editable : false;
  const forForm = isEditable(restProps) ? restProps.forForm : false;

  const { toast } = useToast();
  const { editor } = useRte({
    value: note,
    editable: editable,
    className,
  });

  useEffect(() => {
    editor?.setEditable(editable);

    if (editable && !forForm) {
      editor?.commands.focus("end");
    }
  }, [editor, editable, forForm]);

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
