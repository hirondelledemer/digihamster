import React, { FC, useEffect, useState } from "react";
import RichTextEditor from "../RichTextEditor";
import { Button, Group, Stack } from "@mantine/core";
import { useRte } from "@/app/utils/rte/rte-hook";
import axios from "axios";
import { IJournalEntry } from "@/models/entry";

export interface JournalEntryFormParams {
  title: string;
  note: string;
  id?: string;
}

interface CommonProps {
  testId?: string;
  onSubmitDone?(response: IJournalEntry): void;
}

interface JournalEntryFormPropsEdit extends CommonProps {
  editMode: true;
  initialValues: {
    id: string;
    title: string;
    note: string;
  };
}

interface JournalEntryFormPropsNew extends CommonProps {
  editMode?: false;
}

export type JournalEntryFormProps =
  | JournalEntryFormPropsEdit
  | JournalEntryFormPropsNew;

export const rteTestId = "JournalEntryForm-rte-testId";

// todo: rename to smth more general
const JournalEntryForm: FC<JournalEntryFormProps> = ({
  testId,
  onSubmitDone,
  ...restProps
}): JSX.Element | null => {
  const [loading, setLoading] = useState<boolean>(false);
  const { editor, getRteValue } = useRte({
    value: restProps.editMode ? restProps.initialValues.note : "",
    editable: true,
  });

  // useEffect(() => {
  //   if (restProps.editMode) {
  //     editor?.commands.setContent(restProps.initialValues.note);
  //   } else {
  //     editor?.commands.clearContent();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [restProps.editMode, editor?.commands]);

  if (!editor) {
    return null;
  }

  const onDone = (entry: IJournalEntry) => {
    editor?.commands.setContent("");
    if (onSubmitDone) {
      onSubmitDone(entry);
    }
  };

  const handleSubmit = async () => {
    const { title, content: note, tags } = getRteValue();

    if (restProps.editMode) {
      // editJournalEntry({
      //   variables: {
      //     title,
      //     note,
      //     id: restProps.editMode ? restProps.initialValues.id : "",
      //     tags: tags as string[],
      //   },
      // }).then(
      //   (
      //     response: FetchResult<
      //       EditJournalEntry,
      //       Record<string, any>,
      //       Record<string, any>
      //     >
      //   ) => {
      //     if (response.data && response.data.updateJournalEntry) {
      //       onDone(response.data.updateJournalEntry);
      //     }
      //   }
      // );
      return;
    }
    setLoading(true);
    const response = await axios.post<IJournalEntry, { data: IJournalEntry }>(
      "/api/entries",
      {
        title: title,
        note: note,
        tags: tags,
      }
    );
    onDone(response.data);
    setLoading(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && event.ctrlKey) {
      handleSubmit();
    }
  };

  const submitButtonDisabled = restProps.editMode
    ? restProps.initialValues.note === editor?.getHTML()
    : !editor?.getHTML().length || editor?.getHTML() === "<p></p>";

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
            {restProps.editMode ? "Save" : "Create"}
          </Button>
          {/* {restProps.editMode && (
            <Button color="red" onClick={handleDelete}>
              Delete
            </Button>
          )} */}
        </Group>
      </Stack>
    </div>
  );
};

export default JournalEntryForm;
