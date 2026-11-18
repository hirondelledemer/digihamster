import { Content, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import { getRteValue } from "./get-rte-value";
import { mentionExtensions } from "./extensions";

export interface RteValue {
  title: string;
  tags: string[];
  tasks: string[];
  textContent: string;
  contentJSON: JSONContent;
  projectId?: string;
  params: string[];
}

export function useRte({
  value,
  editable,
  placeholder,
  className,
}: {
  value: Content;
  editable: boolean;
  placeholder?: string;
  className?: string;
}) {
  const textAreaClass =
    className ||
    "min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      ...mentionExtensions,
    ],
    editorProps: {
      attributes: {
        class: textAreaClass,
      },
    },
    content: value,
    editable,
  });

  return {
    editor,
    getRteValue: () => getRteValue(editor!.getJSON()),
  };
}
