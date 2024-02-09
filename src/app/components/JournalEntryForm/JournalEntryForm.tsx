"use client";
import React, { FC, useState } from "react";
import RichTextEditor from "../RichTextEditor";
import { Button, Group, Stack } from "@mantine/core";
import { useRte } from "@/app/utils/rte/rte-hook";
import axios from "axios";
import { IJournalEntry } from "@/models/entry";
import useJournalEntries from "@/app/utils/hooks/use-entry";

export interface JournalEntryFormProps {
  testId?: string;
}

export const rteTestId = "JournalEntryForm-rte-testId";

const JournalEntryForm: FC<JournalEntryFormProps> = ({
  testId,
}): JSX.Element | null => {
  const [loading, setLoading] = useState<boolean>(false);
  const { editor, getRteValue } = useRte({
    value: "",
    editable: true,
  });

  const { setData } = useJournalEntries();

  if (!editor) {
    return null;
  }

  const handleSubmit = async () => {
    const { title, content: note, tags } = getRteValue();
    setLoading(true);
    const response = await axios.post<IJournalEntry, { data: IJournalEntry }>(
      "/api/entries",
      {
        title: title,
        note: note,
        tags: tags,
      }
    );
    setData((d) => [...d, response.data]);
    console.log("updating", response.data);
    setLoading(false);
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
      <Stack>
        <RichTextEditor
          testId={rteTestId}
          editor={editor}
          onKeyDown={handleKeyDown}
          showActions
        />
        <Group>
          <Button
            disabled={submitButtonDisabled}
            loading={loading}
            onClick={handleSubmit}
          >
            Create
          </Button>
        </Group>
      </Stack>
    </div>
  );
};

export default JournalEntryForm;
