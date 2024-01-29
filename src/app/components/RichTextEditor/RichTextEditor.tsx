import React, { FC } from 'react';
import { RichTextEditor as RichTextEditorMantine } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';

export interface RichTextEditorProps {
  testId?: string;
  editor: Editor | null;
  onKeyDown?(event: React.KeyboardEvent<HTMLDivElement>): void;
  showActions?: boolean;
}

export const textareaTestId = 'textarea-testid';

const RichTextEditor: FC<RichTextEditorProps> = ({
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
      <RichTextEditorMantine editor={editor}>
        {showActions && (
          <RichTextEditorMantine.Toolbar sticky stickyOffset={60}>
            <RichTextEditorMantine.ControlsGroup>
              <RichTextEditorMantine.Bold />
              <RichTextEditorMantine.Italic />
              <RichTextEditorMantine.Underline />
              <RichTextEditorMantine.Strikethrough />
              <RichTextEditorMantine.ClearFormatting />
              <RichTextEditorMantine.Highlight />
              <RichTextEditorMantine.Code />
            </RichTextEditorMantine.ControlsGroup>

            <RichTextEditorMantine.ControlsGroup>
              <RichTextEditorMantine.Blockquote />
              <RichTextEditorMantine.Hr />
              <RichTextEditorMantine.BulletList />
              <RichTextEditorMantine.OrderedList />
            </RichTextEditorMantine.ControlsGroup>

            <RichTextEditorMantine.ControlsGroup>
              <RichTextEditorMantine.Link />
              <RichTextEditorMantine.Unlink />
            </RichTextEditorMantine.ControlsGroup>
          </RichTextEditorMantine.Toolbar>
        )}

        <RichTextEditorMantine.Content
          data-testid={textareaTestId}
          onKeyDown={onKeyDown}
        />
      </RichTextEditorMantine>
    </div>
  );
};

export default RichTextEditor;
