"use client";
import React, { FC, useState } from "react";
import RichTextEditor from "../RichTextEditor";
import { useRte } from "@/app/utils/rte/rte-hook";
import { useEntriesActions } from "@/app/utils/hooks/use-entry/actions-context";
import { Button } from "../ui/button";
import {
  useCurrentEvent,
  useEventsForDay,
} from "@/app/utils/hooks/use-events/selectors";
import { now } from "@/app/utils/date/now";
import { Badge } from "../ui/badge";

export const rteTestId = "JournalEntryForm-rte-testId";

const JournalEntryForm: FC = (): JSX.Element | null => {
  const { editor, getRteValue } = useRte({
    value: "",
    editable: true,
  });

  const { create } = useEntriesActions();
  const todayEvents = useEventsForDay(now());
  const currentEvent = useCurrentEvent();

  // only the explicit pick is stored — the event that is happening right now is
  // the fallback until then, so the selection corrects itself once the events
  // have loaded instead of being frozen at whatever was known on first render
  const [chosenEventId, setChosenEventId] = useState<number | null>(null);
  const selectedEventId = chosenEventId ?? currentEvent?.id ?? null;

  if (!editor) {
    return null;
  }

  const handleSubmit = () => {
    const { title, textContent, contentJSON } = getRteValue();
    create(
      {
        title: title,
        note: textContent || "(no content)",
        json_note: contentJSON,
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
    <div>
      <div className="mb-4 flex gap-2">
        {todayEvents.map((event) => (
          <Badge
            className="max-w-[100px] truncate cursor"
            key={event.id}
            variant={selectedEventId === event.id ? "default" : "outline"}
            onClick={() => setChosenEventId(event.id)}
          >
            {event.title}
          </Badge>
        ))}
      </div>
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
