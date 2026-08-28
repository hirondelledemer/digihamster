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
import { useRelationshipsActions } from "@/app/utils/hooks/use-relationships/actions-context";
import { RelationshipEntityType } from "@/app/utils/types/relationship";

export const rteTestId = "JournalEntryForm-rte-testId";
export const noEventBadgeTestId = "JournalEntryForm-no-event-badge";
export const eventBadgeTestId = "JournalEntryForm-event-badge";

const JournalEntryForm: FC = (): JSX.Element | null => {
  const { editor, getRteValue } = useRte({
    value: "",
    editable: true,
  });

  const { create: createRelationship } = useRelationshipsActions();

  const { create: createEntry } = useEntriesActions();
  const todayEvents = useEventsForDay(now());
  const currentEvent = useCurrentEvent();

  // only the explicit pick is stored, so the selection corrects itself once the
  // events have loaded instead of being frozen at whatever was known on first
  // render. `undefined` means nothing was picked yet and the event happening
  // right now stands in; `null` means "no event" was picked on purpose
  const [chosenEventId, setChosenEventId] = useState<number | null>();
  const selectedEventId =
    chosenEventId === undefined ? (currentEvent?.id ?? null) : chosenEventId;

  if (!editor) {
    return null;
  }

  const handleSubmit = async () => {
    const { title, textContent, contentJSON } = getRteValue();
    const createdEntry = await createEntry(
      {
        title: title,
        note: textContent || "(no content)",
        json_note: contentJSON,
      },
      () => editor?.commands.setContent(""),
    );

    if (!createdEntry || !selectedEventId) {
      return null;
    }

    createRelationship({
      source_id: selectedEventId,
      source_type: RelationshipEntityType.Event,
      target_id: createdEntry.id,
      target_type: RelationshipEntityType.Journal,
    });
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
        <Badge
          className="max-w-[100px] truncate cursor"
          data-testid={noEventBadgeTestId}
          data-selected={selectedEventId === null}
          variant={!selectedEventId ? "default" : "outline"}
          onClick={() => setChosenEventId(null)}
        >
          no event
        </Badge>
        {todayEvents.map((event) => (
          <Badge
            className="max-w-[100px] truncate cursor"
            key={event.id}
            data-testid={eventBadgeTestId}
            data-selected={selectedEventId === event.id}
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
