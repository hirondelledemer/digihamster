"use client";
import React, { FC, useState } from "react";
import RichTextEditor from "../RichTextEditor";
import { useRte } from "@/app/utils/rte/rte-hook";
import { Button } from "../ui/button";
import { useNotesActions } from "@/app/utils/hooks/use-notes/actions-context";

export interface NoteFormProps {
  testId?: string;
  onDone(): void;
  parentTaskId?: string;
}

export const rteTestId = "rte-testId";

const NoteForm: FC<NoteFormProps> = ({
  testId,
  onDone,
  parentTaskId: primaryTaskId,
}): JSX.Element | null => {
  const [loading, setLoading] = useState<boolean>(false);
  const { create } = useNotesActions();
  const { editor, getRteValue } = useRte({
    value: "",
    editable: true,
  });

  if (!editor) {
    return null;
  }

  const handleSubmit = async () => {
    const { title, textContent, tags, contentJSON } = getRteValue();
    setLoading(true);

    create({
      title: title,
      note: textContent || "(no content)",
      jsonNote: contentJSON,
      tags: tags,
      parentTaskId: primaryTaskId,
    });

    editor?.commands.setContent("");

    setLoading(false);
    onDone();
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
        disabled={submitButtonDisabled || loading}
        onClick={handleSubmit}
        className="mt-4"
      >
        Create
      </Button>
    </div>
  );
};

export default NoteForm;
