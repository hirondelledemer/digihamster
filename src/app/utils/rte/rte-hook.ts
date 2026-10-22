import { Content, JSONContent, useEditor } from "@tiptap/react";
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
import { cn } from "@/app/components/utils";

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

const TaskMention = Mention.extend({
  name: "taskMention",
}).configure({
  suggestion: {
    char: "/t ",
    pluginKey: new PluginKey("taskSuggestion"),
    allowSpaces: true,
  },
});

const LocationMention = Mention.extend({
  name: "locationMention",
}).configure({
  suggestion: {
    char: "/at ",
    pluginKey: new PluginKey("locationSuggestion"),
    allowSpaces: true,
  },
});

const HabitMention = Mention.extend({
  name: "habitMention",
}).configure({
  suggestion: {
    char: "/h ",
    pluginKey: new PluginKey("habitSuggestion"),
    allowSpaces: true,
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
  placeholder,
  styledAsNote,
}: {
  value: Content;
  editable: boolean;
  placeholder?: string;
  styledAsNote?: boolean;
}) {
  // // Array of messy hand-placed rotations to choose from
  // const rotations = [
  //   "rotate-1",
  //   "-rotate-1",
  //   "rotate-[1.5deg]",
  //   "-rotate-[0.5deg]",
  //   "rotate-[0.8deg]",
  // ];
  // // Select a rotation based on placeholder/content length or keep it fixed to a messy tilt
  // const randomRotation =
  //   rotations[Math.floor((placeholder?.length || 0) % rotations.length)] ||
  //   "rotate-1";

  // Deterministic index based on placeholder length to ensure visual stability on re-renders
  // const variantIndex = String(value)?.length % 4;
  const variantIndex = Math.floor(Math.random() * 4);

  // Mix of messy hand-placed rotations
  const rotations = [
    "-rotate-1",
    "rotate-1",
    "rotate-[1.4deg]",
    "-rotate-[0.7deg]",
  ];
  const randomRotation = rotations[variantIndex];

  // Variations of organic, imperfectly cut note corners (top-left, top-right, bottom-right, bottom-left)
  const paperShapes = [
    "rounded-[4px_12px_4px_30px_/_12px_4px_30px_4px]", // Peeled bottom-left look
    "rounded-[16px_4px_45px_6px_/_4px_20px_6px_35px]", // Heavy bottom-right curl look
    "rounded-[6px_35px_8px_16px_/_25px_6px_20px_5px]", // Folded top-right look
    "rounded-[20px_8px_12px_8px_/_8px_30px_6px_25px]", // Slightly skewed all around
  ];
  const randomShape = paperShapes[variantIndex];

  const calculated = cn(
    // Base Structure & Interactive State
    "relative block max-w-64 h-auto min-h-[4.5rem] p-4 pl-5 text-xs font-mono leading-relaxed transform transition-all duration-200 focus-within:rotate-0 focus-within:scale-[1.02]",
    // Dark Mode Sticky Note Colors
    "bg-secondary bg-gradient-to-br from-zinc-800 to-zinc-900 text-amber-100 placeholder:text-amber-600/40 border border-zinc-700/40",
    // Shadow Layers
    "shadow-[5px_5px_14px_rgba(0,0,0,0.55),_0_8px_16px_rgba(0,0,0,0.35)] outline-none focus:outline-none focus:ring-0 [&_*]:outline-none",
    // Embellishments (Notebook Lines, Margin Line, Left Binder Holes)
    "bg-[linear-gradient(to_bottom,transparent_96%,rgba(245,159,11,0.15)_96%)] bg-[size:100%_2rem]",
    "after:content-[''] after:absolute after:top-0 after:left-7 after:w-[1px] after:h-full after:bg-amber-500/30",
    "before:content-[''] before:absolute before:top-0 before:left-2 before:w-3 before:h-full before:bg-[radial-gradient(circle_4px_at_center,rgba(0,0,0,0.85)_95%,transparent_100%)] before:bg-[size:100%_1.5rem] before:opacity-70",
    // Inner block element positioning
    "[&_p]:pl-6 [&_p]:mb-0 [&_p]:leading-[1.5rem] [&_p]:min-h-[1.5rem]",

    // Dynamic Additions resolved safely via clsx / twMerge
    randomRotation,
    randomShape
  );
  const textAreaClass = styledAsNote
    ? calculated
    : // `relative block font-mono max-w-64 h-auto min-h-[4.5rem] p-4 pl-8 text-sm leading-relaxed transform transition-all duration-200 focus-within:rotate-0 focus-within:scale-[1.02] ${randomRotation} ${randomShape} ` +
      //   // Dark Mode Sticky Note Colors (Deep Charcoal to Obsidian Amber)
      //   "bg-gradient-to-br from-zinc-800 to-zinc-900 text-amber-100 placeholder:text-amber-600/40 border border-zinc-700/40 " +
      //   // Deep Organic Shadow Drop (Blends softer over irregular shapes)
      //   "shadow-[5px_5px_14px_rgba(0,0,0,0.55),_0_8px_16px_rgba(0,0,0,0.35)] outline-none focus:outline-none focus:ring-0 [&_*]:outline-none " +
      //   // EMBELLISHMENT 1: Lined Notebook Paper Background
      //   "bg-[linear-gradient(to_bottom,transparent_96%,rgba(245,158,11,0.06)_96%)] bg-[size:100%_1.5rem] " +
      //   // EMBELLISHMENT 2: Left Margin Rule Line
      //   "after:content-[''] after:absolute after:top-0 after:left-7 after:w-[1px] after:h-full after:bg-amber-500/20 " +
      //   // EMBELLISHMENT 3: Punch Binder Holes on the Left Edge
      //   "before:content-[''] before:absolute before:top-0 before:left-2 before:w-3 before:h-full " +
      //   "before:bg-[radial-gradient(circle_4px_at_center,rgba(0,0,0,0.85)_95%,transparent_100%)] before:bg-[size:100%_1.5rem] before:opacity-70"
      "min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      CustomMention.configure({
        HTMLAttributes: {
          class: styles.tag,
        },
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
        // style: `transform: rotate(${(
        //   Math.sin(placeholder?.length || 0) * 1.5
        // ).toFixed(1)}deg);`,
        // style: {
        //   color: "red",
        // },
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
