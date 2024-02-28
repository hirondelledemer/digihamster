"use client";

import React, { FC } from "react";
import { EditorContent, Editor } from "@tiptap/react";

export interface RichTextEditorProps {
  testId?: string;
  editor: Editor | null;
  onKeyDown?(event: React.KeyboardEvent<HTMLDivElement>): void;
  onBlur?(): void;
}

export const textareaTestId = "textarea-testid";

const RichTextEditorM: FC<RichTextEditorProps> = ({
  testId,
  editor,
  onKeyDown,
  onBlur,
}): JSX.Element => {
  if (!editor) {
    return <div>Error: editor not provided</div>;
  }

  return (
    <div data-testid={testId}>
      <EditorContent editor={editor} onKeyDown={onKeyDown} onBlur={onBlur} />
    </div>
  );
};

export default RichTextEditorM;
