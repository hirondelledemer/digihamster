"use client";
import React, { FC } from "react";
import RichTextEditor from "../RichTextEditor";
import { useRte } from "@/app/utils/rte/rte-hook";
import { useEntriesActions } from "@/app/utils/hooks/use-entry/actions-context";
import { Button } from "../ui/button";

export interface JournalEntryFormProps {
  testId?: string;
}

export const rteTestId = "JournalEntryForm-rte-testId";

const JournalEntryForm: FC<JournalEntryFormProps> = ({
  testId,
}): JSX.Element | null => {
  const { editor, getRteValue } = useRte({
    value: "",
    editable: true,
  });

  const { create } = useEntriesActions();

  if (!editor) {
    return null;
  }

  const handleSubmit = () => {
    const { title, textContent, tags, contentJSON } = getRteValue();
    create(
      {
        title: title,
        note: textContent || "(no content)",
        json_note: contentJSON,
        tags: tags,
      },
      () => editor?.commands.setContent(""),
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && event.ctrlKey) {
      handleSubmit();
    }
  };

  const submitButtonDisabled =
    !editor?.getHTML().length || editor?.getHTML() === "<p></p>";

  return (
    <div data-testid={testId}>
      <RichTextEditor
        testId={rteTestId}
        editor={editor}
        onKeyDown={handleKeyDown}
      />
      <Button
        disabled={submitButtonDisabled}
        onClick={handleSubmit}
        className="mt-4"
      >
        Create
      </Button>
    </div>
  );
};

export default JournalEntryForm;
