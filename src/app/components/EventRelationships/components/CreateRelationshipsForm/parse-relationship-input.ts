import { JSONContent } from "@tiptap/react";

/**
 * The relationship textarea is line-oriented: each paragraph is one instruction.
 * `getRteValue` deliberately flattens the whole document into one bag of
 * mentions, which loses that grouping — `/t buy milk /at shop` has to keep the
 * shop attached to the task rather than to whatever the document is about.
 */
export enum LineKind {
  /** `/n ...` — create a note out of the line. */
  Note = "note",
  /** `/j ...` — create a journal entry out of the line. */
  Journal = "journal",
  /** no prefix — only wire up whatever the line mentions. */
  Attach = "attach",
}

export interface ParsedLine {
  kind: LineKind;
  /** the line's text, command prefix stripped and mention labels inlined */
  text: string;
  /** the paragraph nodes the line is made of, kept for the stored json */
  paragraphs: JSONContent[];
  tasks: string[];
  people: string[];
  locations: string[];
  habits: string[];
  projects: string[];
}

type MentionBucket = "tasks" | "people" | "locations" | "habits" | "projects";

/** tiptap node name -> the field its ids land in */
const MENTION_BUCKETS: Record<string, MentionBucket> = {
  taskMention: "tasks",
  mention: "people",
  locationMention: "locations",
  habitMention: "habits",
  projectMention: "projects",
};

/** people and locations encode their colour into the mention id: `12:#f97316` */
const toId = (raw: string): string => `${raw}`.split(":")[0];

const COMMAND = /^\/(n|j)(?:\s+|$)/;

const hasMentions = (line: ParsedLine): boolean =>
  !!(
    line.tasks.length ||
    line.people.length ||
    line.locations.length ||
    line.habits.length ||
    line.projects.length
  );

const KIND_BY_COMMAND: Record<string, LineKind> = {
  n: LineKind.Note,
  j: LineKind.Journal,
};

/**
 * `/t`, `/at` and `/h` never survive as text — tiptap swallows them the moment
 * a suggestion is picked and leaves a mention node behind. Only `/n` and `/j`
 * reach us literally, which is why they are the only prefixes we look for.
 */
const parseParagraph = (paragraph: JSONContent): ParsedLine | null => {
  const nodes = paragraph.content ?? [];

  const line: ParsedLine = {
    kind: LineKind.Attach,
    text: "",
    paragraphs: [paragraph],
    tasks: [],
    people: [],
    locations: [],
    habits: [],
    projects: [],
  };

  const text = nodes
    .map((node) => {
      // shift+enter keeps the line in one paragraph, so it stays one record —
      // but the break still has to survive into the stored text
      if (node.type === "hardBreak") {
        return "\n";
      }

      const bucket = node.type ? MENTION_BUCKETS[node.type] : undefined;

      if (!bucket) {
        return node.text ?? "";
      }

      if (node.attrs?.id !== undefined) {
        line[bucket].push(toId(node.attrs.id));
      }
      return node.attrs?.label ?? "";
    })
    .join("")
    .trim();

  const command = COMMAND.exec(text);

  if (command) {
    line.kind = KIND_BY_COMMAND[command[1]];
    line.text = text.slice(command[0].length).trim();
  } else {
    line.text = text;
  }

  // a blank line, or one holding nothing but its own command, is not an
  // instruction — dropping it here keeps the caller from making empty notes
  if (!line.text && !hasMentions(line)) {
    return null;
  }

  return line;
};

/** only a note or a journal entry has a body for stray prose to belong to */
const producesRecord = (line: ParsedLine): boolean =>
  line.kind === LineKind.Note || line.kind === LineKind.Journal;

/**
 * A line with no command and nothing to attach cannot stand on its own — it
 * would quietly do nothing — so it reads as more of the note being written.
 * A line carrying a mention is never swallowed: `@mom` or `/at shop` on its own
 * line still attaches to the entity, which is the only way to say "this belongs
 * to the event, not to the note above it".
 */
const isContinuation = (line: ParsedLine): boolean =>
  line.kind === LineKind.Attach && !hasMentions(line);

export const parseRelationshipInput = (doc: JSONContent): ParsedLine[] => {
  if (!doc || !doc.content) {
    return [];
  }

  return doc.content
    .filter((node) => node.type === "paragraph")
    .reduce<ParsedLine[]>((lines, paragraph) => {
      const line = parseParagraph(paragraph);

      if (!line) {
        return lines;
      }

      const previous = lines[lines.length - 1];

      if (previous && isContinuation(line) && producesRecord(previous)) {
        return [
          ...lines.slice(0, -1),
          {
            ...previous,
            text: `${previous.text}\n${line.text}`,
            paragraphs: [...previous.paragraphs, ...line.paragraphs],
          },
        ];
      }

      return [...lines, line];
    }, []);
};
