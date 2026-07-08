"use client";
import React, { FC } from "react";
import { Content } from "@tiptap/react";
import RichTextEditor from "../RichTextEditor";
import { useRte, RteValue } from "@/app/utils/rte/rte-hook";
import { Button } from "../ui/button";

export interface RteFormProps {
  value?: Content;
  submitLabel: string;
  onSubmit(value: RteValue): void;
  onCancel?(): void;
  clearOnSubmit?: boolean;
  testId?: string;
}

const RteForm: FC<RteFormProps> = ({
  value = "",
  submitLabel,
  onSubmit,
  onCancel,
  clearOnSubmit,
  testId,
}): JSX.Element | null => {
  const { editor, getRteValue } = useRte({ value, editable: true });

  if (!editor) {
    return null;
  }

  const handleSubmit = () => {
    onSubmit(getRteValue());
    if (clearOnSubmit) {
      editor.commands.setContent("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && event.ctrlKey) {
      handleSubmit();
    }
  };

  const submitDisabled =
    !editor.getHTML().length || editor.getHTML() === "<p></p>";

  return (
    <div data-testid={testId} className="space-y-3">
      <RichTextEditor editor={editor} onKeyDown={handleKeyDown} />
      <div className="flex gap-2">
        <Button disabled={submitDisabled} onClick={handleSubmit}>
          {submitLabel}
        </Button>
        {onCancel ? (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default RteForm;
