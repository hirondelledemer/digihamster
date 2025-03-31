"use client";
import React, { FC, useState } from "react";
import RichTextEditor from "../RichTextEditor";
import { useRte } from "@/app/utils/rte/rte-hook";
import axios from "axios";
import { IJournalEntry } from "@/models/entry";
import useJournalEntries from "@/app/utils/hooks/use-entry";
import { Button } from "../ui/button";
import { useToast } from "@/app/components/ui/use-toast";

export interface JournalEntryFormProps {
  testId?: string;
}

export const rteTestId = "JournalEntryForm-rte-testId";

const JournalEntryForm: FC<JournalEntryFormProps> = ({
  testId,
}): JSX.Element | null => {
  const { toast } = useToast();
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
    const { title, textContent, tags, contentJSON } = getRteValue();
    setLoading(true);
    try {
      const response = await axios.post<IJournalEntry, { data: IJournalEntry }>(
        "/api/entries",
        {
          title: title,
          note: textContent || "(no content)",
          jsonNote: contentJSON,
          tags: tags,
        }
      );
      toast({
        title: "Success",
        description: "Note has been submitted",
      });
      editor?.commands.setContent("");
      setData((d) => [...d, response.data]);
    } catch (e) {
      toast({
        title: "Error",
        description: JSON.stringify(e),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

export default JournalEntryForm;
