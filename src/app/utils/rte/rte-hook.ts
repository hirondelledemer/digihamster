import { JSONContent, useEditor } from "@tiptap/react";
import Mention from "@tiptap/extension-mention";
import StarterKit from "@tiptap/starter-kit";
import { suggestionsConfig } from "./suggestions";
import { reduce } from "remeda";
import styles from "./rte-hook.module.scss";

export function useRte({
  value,
  editable,
}: {
  value: string;
  editable: boolean;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Mention.configure({
        HTMLAttributes: {
          class: styles.tag,
        },
        suggestion: suggestionsConfig,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      },
    },

    content: value,
    editable,
  });

  const getRteValue = () => {
    const defaultValue = {
      title: "",
      content: "",
      tags: [],
    };
    if (!editor) {
      return defaultValue;
    }
    const json = editor.getJSON();

    if (!json || !json.content) {
      return defaultValue;
    }

    const value = editor.getHTML() || "";

    const title = value.startsWith("<p><br></p>")
      ? ""
      : value.split("</p>")[0].replace("<p>", "");

    const tags = reduce(
      json.content,
      (acc: string[], curr: JSONContent) => [
        ...acc,
        ...(curr.content?.filter((val) => val.type === "mention") || []).map(
          (mention) => mention?.attrs?.id
        ),
      ],
      []
    ).map((tagId) => tagId.split(":")[0]);

    return { title, content: value, tags };
  };

  return { editor, getRteValue };
}
