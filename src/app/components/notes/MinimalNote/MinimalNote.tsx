"use client";
import React, { FC, useEffect } from "react";
import RichTextEditor from "../../RichTextEditor";
import { useRte } from "@/app/utils/rte/rte-hook";
import { useToast } from "../../ui/use-toast";
import { Content } from "@tiptap/react";

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
  styledAsNote?: boolean;
  styledVariant?: "pin" | "tape";
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
  styledAsNote = false,
  styledVariant = "tape",
  ...restProps
}): JSX.Element | null => {
  const editable = isEditable(restProps) ? restProps.editable : false;
  const forForm = isEditable(restProps) ? restProps.forForm : false;

  const { toast } = useToast();
  const { editor } = useRte({
    value: note,
    editable: editable,
    styledAsNote,
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

  if (styledAsNote) {
    return (
      <div className="relative inline-block pt-3 group">
        {/* EMBELLISHMENT: Messy Torn-Edge Sticky Tape Overlay */}
        {styledVariant === "tape" && (
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-6
                 bg-zinc-100/10 border border-zinc-100/15 backdrop-blur-[1.5px]
                 shadow-[0_1px_3px_rgba(0,0,0,0.3)] transform -rotate-3 z-20 pointer-events-none"
          ></div>
        )}

        {/* EMBELLISHMENT: 3D Plastic Push-Pin */}
        {styledVariant === "pin" && (
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-7 z-30 pointer-events-none drop-shadow-[2px_4px_3px_rgba(0,0,0,0.5)]">
            {/* Pin Head (Shiny Translucent Plastic) */}
            <div className="w-4 h-4 mx-auto rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-rose-300 shadow-inner z-50"></div>

            {/* Pin Point / Metal Needle Shadow Cast */}
            <div className="w-[2px] h-3 mx-auto bg-gradient-to-b from-zinc-400 to-zinc-600 shadow-[1px_2px_2px_rgba(0,0,0,0.4)]"></div>
          </div>
        )}
        {/* Tiptap Rich Text Component Container */}
        <RichTextEditor
          testId={testId}
          editor={editor}
          onKeyDown={handleKeyDown}
        />
      </div>
    );
  }

  return (
    <RichTextEditor testId={testId} editor={editor} onKeyDown={handleKeyDown} />
  );
};

export default MinimalNote;
