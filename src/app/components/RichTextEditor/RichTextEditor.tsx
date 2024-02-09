"use client";

import React, { FC } from "react";
import { EditorContent, Editor } from "@tiptap/react";
import { cn } from "../utils";

export interface RichTextEditorProps {
  testId?: string;
  editor: Editor | null;
  onKeyDown?(event: React.KeyboardEvent<HTMLDivElement>): void;
  // showActions?: boolean;
}

export const textareaTestId = "textarea-testid";

const RichTextEditorM: FC<RichTextEditorProps> = ({
  testId,
  editor,
  // todo: fix
  onKeyDown,
  // showActions,
}): JSX.Element => {
  if (!editor) {
    return <div>Error: editor not provided</div>;
  }

  return (
    <div data-testid={testId}>
      <EditorContent editor={editor} onKeyDown={onKeyDown} />
    </div>
  );
};

export default RichTextEditorM;
