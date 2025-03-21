import { JSONContent, useEditor } from "@tiptap/react";
import Mention from "@tiptap/extension-mention";
import StarterKit from "@tiptap/starter-kit";
import { reduce } from "remeda";
import styles from "./rte-hook.module.scss";
import { PluginKey } from "@tiptap/pm/state";
import { getMentionsConfig } from "./suggestions";
import { MentionList } from "./MentionList";
import { ProjectMentions } from "./ProjectsList";
import { ParamsList } from "./ParamList";

export interface RteValue {
  title: string;
  content: string;
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
          (acc: Record<string, any>[], curr: JSONContent) => [
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
  value: string;
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
        suggestion: getMentionsConfig(ProjectMentions),
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

  const getRteValue: () => RteValue = () => {
    const defaultValue = {
      title: "",
      content: "",
      tags: [],
      tasks: [],
      textContent: "",
      contentJSON: [],
      projectId: undefined,
      params: [],
    };
    if (!editor) {
      return defaultValue;
    }
    const json = editor.getJSON();

    if (!json || !json.content) {
      return defaultValue;
    }

    const value = editor.getHTML() || "";

    const textContent = editor.getText();

    const title = value.startsWith("<p><br></p>")
      ? ""
      : textContent.split("\n")[0];

    const tags = reduce(
      json.content,
      (acc: Record<string, any>[], curr: JSONContent) => [
        ...acc,
        ...(curr.content?.filter((val) => val.type === "mention") || []).map(
          (mention) => mention!.attrs!
        ),
      ],
      []
    );

    const project = reduce(
      json.content,
      (acc: Record<string, any>[], curr: JSONContent) => [
        ...acc,
        ...(
          curr.content?.filter((val) => val.type === "projectMention") || []
        ).map((mention) => mention!.attrs!),
      ],
      []
    )[0];

    const params = reduce(
      json.content,
      (acc: Record<string, any>[], curr: JSONContent) => [
        ...acc,
        ...(
          curr.content?.filter((val) => val.type === "paramsMention") || []
        ).map((mention) => mention!.attrs!.id),
      ],
      []
    );

    const projectId = project ? project.id.split(":")[0] : undefined;

    const regularTags = tags
      .filter((tag) => tag.label !== "task")
      .map((tag) => tag.id.split(":")[0]);

    const tasks = reduce(
      json.content,
      (acc: string[], curr: JSONContent) => {
        const taskMentionExists = curr.content?.find(
          (val) => val.type === "mention" && val.attrs?.label === "task"
        );
        if (!!taskMentionExists) {
          return [
            ...acc,
            ...(curr.content?.filter((val) => val.type === "text") || []).map(
              (val) => val!.text!
            ),
          ];
        }
        return [...acc];
      },
      []
    ).map((task) => task.trim());

    return {
      title,
      content: value,
      tags: regularTags,
      tasks,
      textContent,
      contentJSON: json,
      projectId,
      params,
    };
  };

  return { editor, getRteValue };
}
