import React, { FC } from "react";
import { RichTextEditor } from "@mantine/tiptap";
import { Editor } from "@tiptap/react";

export interface RichTextEditorProps {
  testId?: string;
  editor: Editor | null;
  onKeyDown?(event: React.KeyboardEvent<HTMLDivElement>): void;
  showActions?: boolean;
}

export const textareaTestId = "textarea-testid";

const RichTextEditorM: FC<RichTextEditorProps> = ({
  testId,
  editor,
  onKeyDown,
  showActions,
}): JSX.Element => {
  if (!editor) {
    return <div>Error: editor not provided</div>;
  }

  return (
    <div data-testid={testId}>
      <RichTextEditor editor={editor}>
        {showActions && (
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
            </RichTextEditor.ControlsGroup>

            {/* <RichTextEditor.ControlsGroup> */}
            {/* <RichTextEditor.Link />
              <RichTextEditor.Unlink /> */}
            {/* </RichTextEditor.ControlsGroup> */}
          </RichTextEditor.Toolbar>
        )}

        <RichTextEditor.Content
          data-testid={textareaTestId}
          onKeyDown={onKeyDown}
        />
      </RichTextEditor>
    </div>
  );
};

export default RichTextEditorM;
