import { MENTION_KEYS } from "@/utils/rte/constants";
import { LineKind, parseRelationshipInput } from "./parse-relationship-input";

const text = (value: string) => ({ type: "text", text: value });

const mention = (type: string, id: string, label: string) => ({
  type,
  attrs: { id, label },
});

const paragraph = (...content: object[]) => ({ type: "paragraph", content });

describe("parseRelationshipInput", () => {
  it("returns nothing for an empty document", () => {
    expect(parseRelationshipInput({})).toStrictEqual([]);
    expect(
      parseRelationshipInput({ type: "doc", content: [{ type: "paragraph" }] })
    ).toStrictEqual([]);
  });

  it("keeps a task and its location on the same line", () => {
    // what `/t buy grocerries /at shop` looks like once both suggestions ran
    const doc = {
      type: "doc",
      content: [
        paragraph(
          mention(MENTION_KEYS.task, "7", "buy grocerries"),
          text(" "),
          mention(MENTION_KEYS.location, "3", "shop")
        ),
      ],
    };

    const [line] = parseRelationshipInput(doc);

    expect(line.kind).toBe(LineKind.Attach);
    expect(line.tasks).toStrictEqual(["7"]);
    expect(line.locations).toStrictEqual(["3"]);
    expect(line.text).toBe("buy grocerries shop");
  });

  it("reads a note line and the people it mentions", () => {
    const doc = {
      type: "doc",
      content: [
        paragraph(
          text("/n here is a note that i need to remember regarding "),
          mention(MENTION_KEYS.person, "12", "mom")
        ),
      ],
    };

    expect(parseRelationshipInput(doc)).toStrictEqual([
      {
        kind: LineKind.Note,
        text: "here is a note that i need to remember regarding mom",
        // the stored json is the line without its command
        paragraphs: [
          paragraph(
            text("here is a note that i need to remember regarding "),
            mention(MENTION_KEYS.person, "12", "mom")
          ),
        ],
        tasks: [],
        people: ["12"],
        locations: [],
        habits: [],
        projects: [],
        attachments: [],
      },
    ]);
  });

  it("reads a journal line", () => {
    const doc = {
      type: "doc",
      content: [
        paragraph(
          text("/j this is my thoughs, i need to talk about my "),
          mention(MENTION_KEYS.person, "12", "mom"),
          text(" more")
        ),
      ],
    };

    const [line] = parseRelationshipInput(doc);

    expect(line.kind).toBe(LineKind.Journal);
    expect(line.people).toStrictEqual(["12"]);
    expect(line.text).toBe(
      "this is my thoughs, i need to talk about my mom more"
    );
  });

  it("parses every line of a multi line entry and drops the blank ones", () => {
    const doc = {
      type: "doc",
      content: [
        paragraph(
          mention(MENTION_KEYS.task, "7", "buy grocerries"),
          text(" "),
          mention(MENTION_KEYS.location, "3", "shop")
        ),
        { type: "paragraph" },
        paragraph(text("/n remember this")),
        paragraph(text("   ")),
        paragraph(text("/j thoughts")),
      ],
    };

    expect(parseRelationshipInput(doc).map((line) => line.kind)).toStrictEqual([
      LineKind.Attach,
      LineKind.Note,
      LineKind.Journal,
    ]);
  });

  it("keeps a shift+enter break inside the same line", () => {
    const doc = {
      type: "doc",
      content: [
        paragraph(
          text("/n remember to call the bank"),
          { type: "hardBreak" },
          text("they close at 5")
        ),
      ],
    };

    const [line] = parseRelationshipInput(doc);

    expect(line.kind).toBe(LineKind.Note);
    expect(line.text).toBe("remember to call the bank\nthey close at 5");
  });

  it("drops a line holding nothing but a break", () => {
    const doc = {
      type: "doc",
      content: [paragraph({ type: "hardBreak" })],
    };

    expect(parseRelationshipInput(doc)).toStrictEqual([]);
  });

  it("folds prose on its own line into the note above it", () => {
    const doc = {
      type: "doc",
      content: [
        paragraph(text("/n remember to call the bank")),
        paragraph(text("they close at 5")),
      ],
    };

    const lines = parseRelationshipInput(doc);

    expect(lines).toHaveLength(1);
    expect(lines[0].kind).toBe(LineKind.Note);
    expect(lines[0].text).toBe("remember to call the bank\nthey close at 5");
    // both paragraphs have to reach the stored json, not just the first
    expect(lines[0].paragraphs).toStrictEqual([
      paragraph(text("remember to call the bank")),
      doc.content[1],
    ]);
  });

  it("keeps the command out of the stored json", () => {
    const doc = {
      type: "doc",
      content: [
        paragraph(text("/j "), mention(MENTION_KEYS.person, "12", "mom")),
        paragraph(text("/n my note")),
      ],
    };

    const lines = parseRelationshipInput(doc);

    // `/j ` was the whole text node: it goes, the mention stays
    expect(lines[0].paragraphs).toStrictEqual([
      paragraph(mention(MENTION_KEYS.person, "12", "mom")),
    ]);
    expect(lines[1].paragraphs).toStrictEqual([paragraph(text("my note"))]);
  });

  it("leaves a mention on its own line attached to the entity", () => {
    // the whole point of putting `/at shop` on its own line after a note
    const doc = {
      type: "doc",
      content: [
        paragraph(text("/n here is my note")),
        paragraph(mention(MENTION_KEYS.location, "3", "shop")),
      ],
    };

    const lines = parseRelationshipInput(doc);

    expect(lines).toHaveLength(2);
    expect(lines[0].kind).toBe(LineKind.Note);
    expect(lines[0].text).toBe("here is my note");
    expect(lines[1].kind).toBe(LineKind.Attach);
    expect(lines[1].locations).toStrictEqual(["3"]);
  });

  it("does not fold prose into a line that creates no record", () => {
    const doc = {
      type: "doc",
      content: [
        paragraph(mention(MENTION_KEYS.task, "7", "buy grocerries")),
        paragraph(text("some stray thought")),
      ],
    };

    const lines = parseRelationshipInput(doc);

    expect(lines).toHaveLength(2);
    expect(lines[0].tasks).toStrictEqual(["7"]);
    expect(lines[1].kind).toBe(LineKind.Attach);
  });

  it("does not fold one command line into another", () => {
    const doc = {
      type: "doc",
      content: [
        paragraph(text("/n first note")),
        paragraph(text("/n second note")),
      ],
    };

    expect(parseRelationshipInput(doc).map((line) => line.text)).toStrictEqual([
      "first note",
      "second note",
    ]);
  });

  it("treats a bare command with no content as a blank line", () => {
    const doc = {
      type: "doc",
      content: [paragraph(text("/n")), paragraph(text("/j  "))],
    };

    expect(parseRelationshipInput(doc)).toStrictEqual([]);
  });

  it("does not mistake a slash mid sentence for a command", () => {
    const doc = {
      type: "doc",
      content: [paragraph(text("ask about the and/or thing"))],
    };

    const [line] = parseRelationshipInput(doc);

    expect(line.kind).toBe(LineKind.Attach);
    expect(line.text).toBe("ask about the and/or thing");
  });
});
