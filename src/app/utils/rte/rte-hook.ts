import {
  Content,
  JSONContent,
  useEditor,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import Mention from "@tiptap/extension-mention";
import StarterKit from "@tiptap/starter-kit";
import { reduce } from "remeda";
import { Placeholder } from "@tiptap/extensions";
import styles from "./rte-hook.module.scss";
import { PluginKey } from "@tiptap/pm/state";
import { getMentionsConfig } from "./suggestions";
import { MentionList } from "./MentionList";
import { ProjectsList } from "./ProjectsList";
import { ParamsList } from "./ParamList";
import { getRteValue } from "./get-rte-value";
import { TasksList } from "./TasksList";
import { HabitsList } from "./HabitsList";
import { LocationList } from "./LocationList";
import { AttachmentsList } from "./AttachmentsList";
import { AttachmentChip } from "./AttachmentChip";
import { InteractivePersonChip, PersonChip } from "./PersonChip";
import { MENTION_KEYS } from "./constants";

export interface RteValue {
  title: string;
  tags: string[];
  tasks: string[];
  textContent: string;
  contentJSON: JSONContent;
  projectId?: string;
  params: string[];
}

// TODO: rename to reflect that this is a person mention
// TODO: move extensions into the different file
const CustomMention = Mention.extend({
  name: MENTION_KEYS.person,
})
  .configure({
    suggestion: {
      char: "@",
      pluginKey: new PluginKey("tagsSuggestion"),
    },
  })
  .extend({
    addNodeView() {
      if (this.editor.options.editable) {
        return ReactNodeViewRenderer(PersonChip);
      }
      return ReactNodeViewRenderer(InteractivePersonChip);
    },
  });

const ProjectMention = Mention.extend({
  name: MENTION_KEYS.project,
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
              curr.content?.filter(
                (val) => val.type === MENTION_KEYS.project
              ) || []
            ).map((mention) => mention!.attrs!),
          ],
          []
        ).length < 1
      );
    },
  },
});

const TaskMention = Mention.extend({
  name: MENTION_KEYS.task,
}).configure({
  suggestion: {
    char: "/t ",
    pluginKey: new PluginKey("taskSuggestion"),
    allowSpaces: true,
  },
});

const LocationMention = Mention.extend({
  name: MENTION_KEYS.location,
}).configure({
  suggestion: {
    char: "/at ",
    pluginKey: new PluginKey("locationSuggestion"),
    allowSpaces: true,
  },
});

const HabitMention = Mention.extend({
  name: MENTION_KEYS.habit,
}).configure({
  suggestion: {
    char: "/h ",
    pluginKey: new PluginKey("habitSuggestion"),
    allowSpaces: true,
  },
});

const AttachmentMention = Mention.extend({
  name: MENTION_KEYS.attachment,
})
  .configure({
    suggestion: {
      char: "/a ",
      pluginKey: new PluginKey("attachmentSuggestion"),
      allowSpaces: true,
    },
  })
  .extend({
    addNodeView() {
      return ReactNodeViewRenderer(AttachmentChip);
    },
  });

const ParamsMention = Mention.extend({
  name: MENTION_KEYS.param,
}).configure({
  suggestion: {
    char: "$",
    pluginKey: new PluginKey("paramsSuggestion"),
  },
});

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
      CustomMention.configure({
        suggestion: getMentionsConfig(MentionList),
      }),
      TaskMention.configure({
        HTMLAttributes: {
          class: styles.project,
        },
        suggestion: getMentionsConfig(TasksList),
      }),
      HabitMention.configure({
        HTMLAttributes: {
          class: styles.project,
        },
        suggestion: getMentionsConfig(HabitsList),
      }),
      AttachmentMention.configure({
        suggestion: getMentionsConfig(AttachmentsList),
      }),
      LocationMention.configure({
        HTMLAttributes: {
          class: styles.project,
        },
        suggestion: getMentionsConfig(LocationList),
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
