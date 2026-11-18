import Mention from "@tiptap/extension-mention";
import { MENTION_KEYS } from "./constants";
import { JSONContent, ReactNodeViewRenderer } from "@tiptap/react";
import { AttachmentChip } from "./AttachmentChip";
import { PluginKey } from "@tiptap/pm/state";
import { InteractivePersonChip, PersonChip } from "./PersonChip";
import { reduce } from "remeda";
import { getMentionsConfig } from "./suggestions";
import styles from "./rte-hook.module.scss";
import { ParamsList } from "./ParamList";
import { ProjectsList } from "./ProjectsList";
import { LocationList } from "./LocationList";
import { AttachmentsList } from "./AttachmentsList";
import { HabitsList } from "./HabitsList";
import { TasksList } from "./TasksList";
import { MentionList } from "./MentionList";

const PersonMention = Mention.extend({
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

export const mentionExtensions = [
  PersonMention.configure({
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
];
