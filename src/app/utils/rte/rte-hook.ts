import { JSONContent, useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import { Mention } from '@tiptap/extension-mention';
import { suggestionsConfig } from './suggestions';
import { reduce } from 'remeda';
import styles from './rte-hook.module.scss';

export function useRte({
  value,
  editable,
}: {
  value: string;
  editable: boolean;
}) {
  const editor = useEditor({
    extensions: [
      Underline,
      Link,
      StarterKit,
      Highlight,
      Mention.configure({
        HTMLAttributes: {
          class: styles.tag,
        },
        suggestion: suggestionsConfig,
      }),
    ],
    content: value,
    editable,
  });

  const getRteValue = () => {
    const defaultValue = {
      title: '',
      content: '',
      tags: [],
    };
    if (!editor) {
      return defaultValue;
    }
    const json = editor.getJSON();

    if (!json || !json.content) {
      return defaultValue;
    }

    const value = editor.getHTML() || '';
    const title = value.startsWith('<p><br></p>')
      ? ''
      : value.split('</p>')[0].replace('<p>', '');

    const tags = reduce(
      json.content,
      (acc: string[], curr: JSONContent) => [
        ...acc,
        ...(
          curr.content?.filter((val) => val.type === 'mention') || []
        ).map((mention) => mention?.attrs?.id),
      ],
      [],
    ).map((tagId) => tagId.split(':')[0]);

    return { title, content: value, tags };
  };

  return { editor, getRteValue };
}
