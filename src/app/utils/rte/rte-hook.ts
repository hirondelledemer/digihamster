import { Content, JSONContent, useEditor } from "@tiptap/react";
import Mention from "@tiptap/extension-mention";
import StarterKit from "@tiptap/starter-kit";
import { reduce } from "remeda";
import styles from "./rte-hook.module.scss";
import { PluginKey } from "@tiptap/pm/state";
import { getMentionsConfig } from "./suggestions";
import { MentionList } from "./MentionList";
import { ProjectsList } from "./ProjectsList";
import { ParamsList } from "./ParamList";
import { getRteValue } from "./get-rte-value";

export interface RteValue {
  title: string;
  tags: string[];
  tasks: string[];
  textContent: string;
  contentJSON: JSONContent;
  projectId?: string;
  params: string[];
}

const CustomMention = Mention.extend({
  name: "mention",
}).configure({
  suggestion: {
    char: "@",
    pluginKey: new PluginKey("tagsSuggestion"),
  },
});

const ProjectMention = Mention.extend({
  name: "projectMention",
}).configure({
  suggestion: {
    char: "/p ",
    pluginKey: new PluginKey("projectSuggestion"),
    allow: ({ editor }) => {
      const json = editor.getJSON();
      if (!json || !json.content) {
        return false;
      }
      return (
        reduce(
          json.content,
          (acc: Record<string, object>[], curr: JSONContent) => [
            ...acc,
            ...(
              curr.content?.filter((val) => val.type === "projectMention") || []
            ).map((mention) => mention!.attrs!),
          ],
          []
        ).length < 1
      );
    },
  },
});

const ParamsMention = Mention.extend({
  name: "paramsMention",
}).configure({
  suggestion: {
    char: "$",
    pluginKey: new PluginKey("paramsSuggestion"),
  },
});

export function useRte({
  value,
  editable,
}: {
  value: Content;
  editable: boolean;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomMention.configure({
        HTMLAttributes: {
          class: styles.tag,
        },
        suggestion: getMentionsConfig(MentionList),
      }),
      ProjectMention.configure({
        HTMLAttributes: {
          class: styles.project,
        },
        suggestion: getMentionsConfig(ProjectsList),
      }),
      ParamsMention.configure({
        HTMLAttributes: {
          class: styles.param,
        },
        suggestion: getMentionsConfig(ParamsList),
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

  return { editor, getRteValue: () => getRteValue(editor!.getJSON()) };
}
