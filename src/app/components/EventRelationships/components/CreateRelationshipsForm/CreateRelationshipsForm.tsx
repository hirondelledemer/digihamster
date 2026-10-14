"use client";
import React, { FC, useState } from "react";

import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { relationshipTypeFor } from "@/app/utils/relationships/relationship-types";
import { useEntityLabel } from "../../use-entity-label";
import { useRelationshipsActions } from "@/app/utils/hooks/use-relationships/actions-context";
import { useNotesActions } from "@/app/utils/hooks/use-notes/actions-context";
import { useEntriesActions } from "@/app/utils/hooks/use-entry/actions-context";
import { useRte } from "@/app/utils/rte/rte-hook";
import RichTextEditor from "../../../RichTextEditor";
import { Button } from "../../../ui/button";
import {
  LineKind,
  ParsedLine,
  parseRelationshipInput,
} from "./parse-relationship-input";

export interface CreateEventFormProps {
  entityId: number;
  entityType: RelationshipEntityType;
}

export const rteTestId = "CreateRelationshipsForm-rte-testId";
export const headerTestId = "CreateRelationshipsForm-header-testId";

const TITLE_LENGTH = 60;

/** notes and journal entries both want a short title and only have the line */
const toTitle = (text: string) =>
  text.length <= TITLE_LENGTH ? text : `${text.slice(0, TITLE_LENGTH)}…`;

/** each line is stored as a document of its own */
const toDocument = (line: ParsedLine) => ({
  type: "doc",
  content: line.paragraphs,
});

interface EntityRef {
  id: number;
  type: RelationshipEntityType;
}

export const CreateRelationshipsForm: FC<CreateEventFormProps> = ({
  entityId,
  entityType,
}): JSX.Element | null => {
  const [submitting, setSubmitting] = useState(false);

  const { create: createRelationship } = useRelationshipsActions();
  const { create: createNote } = useNotesActions();
  const { create: createEntry } = useEntriesActions();

  const label = useEntityLabel(entityId, entityType);

  const placeholder = `Attach items to this ${entityType}`;

  const { editor } = useRte({
    value: "",
    editable: true,
    placeholder,
  });

  if (!editor) {
    return null;
  }

  const self: EntityRef = { id: entityId, type: entityType };

  const link = (source: EntityRef, target: EntityRef) =>
    createRelationship({
      source_id: source.id,
      source_type: source.type,
      target_id: target.id,
      target_type: target.type,
      // what the edge means follows from what it joins, so no caller has to
      // remember to say "this one is an occurrence"
      relationship_type: relationshipTypeFor(source.type, target.type),
    });

  /** everything the line mentions, in the order the ids were collected */
  const mentionsOf = (line: ParsedLine): EntityRef[] => [
    ...line.people.map((id) => ({
      id: Number(id),
      type: RelationshipEntityType.Person,
    })),
    ...line.locations.map((id) => ({
      id: Number(id),
      type: RelationshipEntityType.Location,
    })),
    ...line.habits.map((id) => ({
      id: Number(id),
      type: RelationshipEntityType.Habit,
    })),
    ...line.projects.map((id) => ({
      id: Number(id),
      type: RelationshipEntityType.Project,
    })),
  ];

  const applyNote = async (line: ParsedLine) => {
    const note = await createNote({
      title: toTitle(line.text),
      content: line.text,
      json_content: toDocument(line),
    });

    if (!note) {
      return;
    }

    const ref = { id: note.id, type: RelationshipEntityType.Note };

    // the note is what the line produced, so it anchors the line: it hangs off
    // the entity, and everything the line mentioned hangs off it
    await link(self, ref);
    await Promise.all(
      [
        ...mentionsOf(line),
        ...line.tasks.map((id) => ({
          id: Number(id),
          type: RelationshipEntityType.Task,
        })),
      ].map((target) => link(ref, target))
    );
  };

  const applyJournal = async (line: ParsedLine) => {
    const entry = await createEntry({
      title: toTitle(line.text),
      note: line.text || "(no content)",
      json_note: toDocument(line),
      mentioned_people_ids: line.people.map(Number),
    });

    if (!entry) {
      return;
    }

    const ref = { id: entry.id, type: RelationshipEntityType.Journal };

    await link(self, ref);
    // people are left out on purpose: the backend already wires them up from
    // `mentioned_people_ids`, the same way JournalEntryForm relies on
    await Promise.all(
      [
        ...mentionsOf(line).filter(
          (m) => m.type !== RelationshipEntityType.Person
        ),
        ...line.tasks.map((id) => ({
          id: Number(id),
          type: RelationshipEntityType.Task,
        })),
      ].map((target) => link(ref, target))
    );
  };

  const applyAttach = async (line: ParsedLine) => {
    const tasks = line.tasks.map((id) => ({
      id: Number(id),
      type: RelationshipEntityType.Task,
    }));

    // tasks always belong to the entity being edited, and the rest of the line
    // describes the first of them when there is one — `/t buy milk /at shop`
    // puts the shop on the task, not on the event
    const anchor = tasks[0] ?? self;

    await Promise.all([
      ...tasks.map((task) => link(self, task)),
      ...mentionsOf(line).map((target) => link(anchor, target)),
    ]);
  };

  const applyLine = (line: ParsedLine) => {
    switch (line.kind) {
      case LineKind.Note:
        return applyNote(line);
      case LineKind.Journal:
        return applyJournal(line);
      case LineKind.Attach:
        return applyAttach(line);
    }
  };

  const handleSubmit = async () => {
    const lines = parseRelationshipInput(editor.getJSON());

    if (!lines.length) {
      return;
    }

    setSubmitting(true);

    try {
      // one line at a time: a line can create an entity that the next one is
      // allowed to read, and the toasts stay in the order they were typed
      for (const line of lines) {
        await applyLine(line);
      }

      editor.commands.setContent("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && event.ctrlKey) {
      handleSubmit();
    }
  };

  const submitButtonDisabled =
    !editor.getHTML().length || editor.getHTML() === "<p></p>";

  return (
    <div>
      {/* the placeholder says the same thing but disappears on the first
          keystroke, which is exactly when it stops being obvious what the
          line is going to be attached to */}
      <div
        className="mb-2 text-sm text-muted-foreground"
        data-testid={headerTestId}
      >
        Attach to this {entityType}
        {label && <span className="text-foreground">: {label}</span>}
      </div>
      <RichTextEditor
        testId={rteTestId}
        editor={editor}
        onKeyDown={handleKeyDown}
      />
      <Button
        disabled={submitButtonDisabled || submitting}
        onClick={handleSubmit}
        className="mt-4"
      >
        Create
      </Button>
    </div>
  );
};
