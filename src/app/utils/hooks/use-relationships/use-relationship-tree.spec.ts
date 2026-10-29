import { generateRelationship } from "../../mocks/relationship";
import {
  IRelationship,
  RelationshipEntityType as Type,
} from "../../types/relationship";
import { RelationshipType } from "../../relationships/relationship-types";
import {
  RelationshipNode,
  WalkContext,
  buildIndex,
  walk,
} from "./use-relationship-tree";

const rel = (
  id: number,
  source_type: Type,
  source_id: number,
  target_type: Type,
  target_id: number
): IRelationship =>
  generateRelationship(id, {
    source_type,
    source_id,
    target_type,
    target_id,
  });

const context = (rows: IRelationship[]): WalkContext => ({
  index: buildIndex(rows),
  liveTasks: new Set([1, 2, 3, 4, 5]),
  liveProjects: new Set([1, 2]),
});

const from = (
  root: { id: number; type: Type },
  rows: IRelationship[],
  depth: number,
  priority?: "primary" | "secondary"
): RelationshipNode =>
  walk(root, null, depth, new Set(), context(rows), priority);

/** how many nodes the tree holds in total, root included */
const size = (node: RelationshipNode): number =>
  1 + node.children.reduce((total, child) => total + size(child), 0);

const childTypes = (node: RelationshipNode) =>
  node.children.map((child) => child.entity.type);

const childIds = (node: RelationshipNode) =>
  node.children.map((child) => child.entity.id);

describe("buildIndex", () => {
  it("files a row under both ends", () => {
    const index = buildIndex([rel(1, Type.Task, 7, Type.Location, 9)]);

    expect(index.get("task:7")).toHaveLength(1);
    expect(index.get("location:9")).toHaveLength(1);
  });

  it("files a row joining something to itself only once", () => {
    const index = buildIndex([rel(1, Type.Task, 7, Type.Task, 7)]);

    expect(index.get("task:7")).toHaveLength(1);
  });
});

describe("buildIndex - sharing", () => {
  it("reuses the index for the same array", () => {
    // every consumer builds its own inside a useMemo, and a day view renders
    // one per calendar event
    const rows = [rel(1, Type.Task, 1, Type.Location, 9)];

    expect(buildIndex(rows)).toBe(buildIndex(rows));
  });

  it("builds a new one when the data changes", () => {
    const rows = [rel(1, Type.Task, 1, Type.Location, 9)];
    const changed = [...rows, rel(2, Type.Task, 2, Type.Location, 9)];

    expect(buildIndex(changed)).not.toBe(buildIndex(rows));
    expect(buildIndex(changed).get("location:9")).toHaveLength(2);
  });
});

describe("walk - nesting", () => {
  it("does not build a subtree for something that draws no children", () => {
    // `annotates` expands - a note's own panel lists what it is about - but
    // RelatedNote renders content and a hint row, so walking into one from a
    // task would build a subtree nothing reads
    const tree = from({ id: 1, type: Type.Task }, [
      rel(1, Type.Note, 7, Type.Task, 1),
      rel(2, Type.Note, 7, Type.Event, 5),
    ], 3);

    const note = tree.children[0];
    expect(note.entity.type).toBe(Type.Note);
    expect(note.children).toHaveLength(0);
    // the hint row still knows there is an event behind it
    expect(note.summary).toEqual([Type.Event]);
  });

  it("still builds one for something that does", () => {
    const tree = from({ id: 5, type: Type.Event }, [
      rel(1, Type.Event, 5, Type.Task, 1),
      rel(2, Type.Task, 1, Type.Person, 4),
    ], 3);

    expect(tree.children[0].entity.type).toBe(Type.Task);
    expect(tree.children[0].children).toHaveLength(1);
  });
});

describe("walk - termination", () => {
  it("stops on a task-to-task cycle", () => {
    // blocks does not expand, so the cycle is never entered in the first place
    const tree = from({ id: 1, type: Type.Task }, [
      rel(1, Type.Task, 1, Type.Task, 2),
    ], 5);

    expect(size(tree)).toBe(2);
    expect(tree.children[0].children).toHaveLength(0);
  });

  it("stops on the task - location - task triangle that used to hang", () => {
    // the location opens up now, so this walks one step further than it used
    // to - but the ancestry check still stops it coming back out again
    const tree = from({ id: 1, type: Type.Task }, [
      rel(1, Type.Task, 1, Type.Location, 9),
      rel(2, Type.Task, 2, Type.Location, 9),
    ], 6);

    expect(size(tree)).toBe(3);
    expect(tree.children[0].entity.type).toBe(Type.Location);
    expect(childIds(tree.children[0])).toEqual([2]);
  });

  it("walks a cycle of journal entries once in each direction", () => {
    // continues is the one expanding edge type that can loop, so this is the
    // case the ancestry check exists for
    const tree = from({ id: 1, type: Type.Journal }, [
      rel(1, Type.Journal, 1, Type.Journal, 2),
      rel(2, Type.Journal, 2, Type.Journal, 3),
      rel(3, Type.Journal, 3, Type.Journal, 1),
    ], 10);

    expect(size(tree)).toBe(5);
  });

  it("follows a long chain only as far as the depth allows", () => {
    const chain = [
      rel(1, Type.Journal, 1, Type.Journal, 2),
      rel(2, Type.Journal, 2, Type.Journal, 3),
      rel(3, Type.Journal, 3, Type.Journal, 4),
      rel(4, Type.Journal, 4, Type.Journal, 5),
    ];

    expect(size(from({ id: 1, type: Type.Journal }, chain, 2))).toBe(3);
    expect(size(from({ id: 1, type: Type.Journal }, chain, 10))).toBe(5);
  });
});

describe("walk - depth", () => {
  const eventTaskNote = [
    rel(1, Type.Event, 5, Type.Task, 1),
    rel(2, Type.Note, 7, Type.Task, 1),
  ];

  it("shows the root's neighbours only at depth 1", () => {
    const tree = from({ id: 5, type: Type.Event }, eventTaskNote, 1);

    expect(childTypes(tree)).toEqual([Type.Task]);
    expect(tree.children[0].children).toHaveLength(0);
  });

  it("reaches a task's notes at depth 2", () => {
    const tree = from({ id: 5, type: Type.Event }, eventTaskNote, 2);

    expect(childTypes(tree.children[0])).toEqual([Type.Note]);
  });

  it("does not list the node it came from", () => {
    const tree = from({ id: 5, type: Type.Event }, eventTaskNote, 3);

    expect(childIds(tree.children[0])).not.toContain(5);
  });
});

describe("walk - truncated", () => {
  const eventTaskNote = [
    rel(1, Type.Event, 5, Type.Task, 1),
    rel(2, Type.Note, 7, Type.Task, 1),
  ];

  it("marks a node whose children the depth cut off", () => {
    const tree = from({ id: 5, type: Type.Event }, eventTaskNote, 1);

    expect(tree.children[0].truncated).toBe(true);
  });

  it("leaves a genuine leaf alone", () => {
    const tree = from({ id: 5, type: Type.Event }, eventTaskNote, 2);

    // the note's only other edge is the one we arrived on
    expect(tree.children[0].children[0].truncated).toBe(false);
  });

  it("does not mark an edge that simply does not expand", () => {
    // a person is a chip by design - that is not something to offer a click
    // through to, however much is attached to them
    const tree = from({ id: 1, type: Type.Task }, [
      rel(1, Type.Task, 1, Type.Person, 4),
      rel(2, Type.Task, 2, Type.Person, 4),
    ], 5);

    expect(tree.children[0].entity.type).toBe(Type.Person);
    expect(tree.children[0].truncated).toBe(false);
  });
});

describe("walk - filtering", () => {
  const taskNeighbours = [
    rel(1, Type.Task, 1, Type.Task, 2),
    rel(2, Type.Note, 7, Type.Task, 1),
    rel(3, Type.Task, 1, Type.Person, 4),
    rel(4, Type.Task, 1, Type.Location, 9),
  ];

  it("narrows the root to its primary neighbours", () => {
    const tree = from({ id: 1, type: Type.Task }, taskNeighbours, 1, "primary");

    expect(childTypes(tree)).toEqual([Type.Task, Type.Note]);
  });

  it("narrows the root to its secondary neighbours", () => {
    const tree = from(
      { id: 1, type: Type.Task },
      taskNeighbours,
      1,
      "secondary"
    );

    expect(childTypes(tree)).toEqual([Type.Person, Type.Location]);
  });

  it("sorts neighbours into a stable order", () => {
    const tree = from({ id: 1, type: Type.Task }, taskNeighbours, 1);

    expect(childTypes(tree)).toEqual([
      Type.Task,
      Type.Note,
      Type.Person,
      Type.Location,
    ]);
  });

  it("applies priority to the root only, not to the levels below it", () => {
    // a location is secondary to a task, but the task is not the root here
    const tree = from(
      { id: 5, type: Type.Event },
      [
        rel(1, Type.Event, 5, Type.Task, 1),
        rel(2, Type.Task, 1, Type.Location, 9),
      ],
      2,
      "primary"
    );

    expect(childTypes(tree.children[0])).toEqual([Type.Location]);
  });

  it("drops a pair the edge table does not allow", () => {
    // tasks carry project_id; rows saying so are awaiting the backfill
    const tree = from({ id: 1, type: Type.Task }, [
      rel(1, Type.Task, 1, Type.Project, 2),
    ], 2);

    expect(tree.children).toHaveLength(0);
  });

  it("drops a task that is done or cancelled", () => {
    const rows = [rel(1, Type.Event, 5, Type.Task, 99)];
    const tree = walk(
      { id: 5, type: Type.Event },
      null,
      2,
      new Set(),
      { ...context(rows), liveTasks: new Set([1]) } // 99 is not live
    );

    expect(tree.children).toHaveLength(0);
  });
});

describe("walk - what a location opens up to", () => {
  const atTheLocation = [
    rel(1, Type.Event, 5, Type.Location, 9),
    rel(2, Type.Task, 1, Type.Location, 9),
    rel(3, Type.Habit, 3, Type.Location, 9),
    rel(4, Type.Project, 1, Type.Location, 9),
    rel(5, Type.Person, 4, Type.Location, 9),
    rel(6, Type.Event, 6, Type.Location, 9),
  ];

  it("shows what you could do here, not everything that touches it", () => {
    const tree = from({ id: 5, type: Type.Event }, atTheLocation, 2);
    const location = tree.children[0];

    expect(location.entity.type).toBe(Type.Location);
    expect(childTypes(location)).toEqual([Type.Task, Type.Habit, Type.Project]);
  });

  it("does not list the event it hangs off", () => {
    const tree = from({ id: 5, type: Type.Event }, atTheLocation, 2);

    expect(childIds(tree.children[0])).not.toContain(5);
  });

  it("shows everything once the location is the thing you opened", () => {
    const tree = from({ id: 9, type: Type.Location }, atTheLocation, 1);

    expect(childTypes(tree)).toEqual(
      expect.arrayContaining([Type.Person, Type.Event])
    );
  });
});

describe("walk - what a habit opens up to", () => {
  it("does not list the habit's other occurrences under an event", () => {
    // they all carry the habit's title, so they read as the event you opened
    // showing up underneath itself
    const tree = from({ id: 5, type: Type.Event }, [
      rel(1, Type.Event, 5, Type.Habit, 3),
      rel(2, Type.Event, 6, Type.Habit, 3),
      rel(3, Type.Event, 7, Type.Habit, 3),
    ], 3);

    expect(tree.children[0].entity.type).toBe(Type.Habit);
    expect(tree.children[0].children).toHaveLength(0);
  });

  it("shows what was written during it", () => {
    const tree = from({ id: 5, type: Type.Event }, [
      rel(1, Type.Event, 5, Type.Habit, 3),
      rel(2, Type.Note, 7, Type.Habit, 3),
      rel(3, Type.Journal, 2, Type.Habit, 3),
    ], 3);

    expect(childTypes(tree.children[0])).toEqual([Type.Note, Type.Journal]);
  });
});

describe("walk - the root", () => {
  it("never appears anywhere inside its own tree", () => {
    const tree = from({ id: 5, type: Type.Event }, [
      rel(1, Type.Event, 5, Type.Event, 5), // a row joining it to itself
      rel(2, Type.Event, 5, Type.Task, 1),
      rel(3, Type.Note, 7, Type.Event, 5),
      rel(4, Type.Event, 5, Type.Habit, 3),
    ], 4);

    const ids: string[] = [];
    const collect = (node: RelationshipNode) =>
      node.children.forEach((child) => {
        ids.push(`${child.entity.type}:${child.entity.id}`);
        collect(child);
      });
    collect(tree);

    expect(ids).not.toContain("event:5");
  });
});

describe("walk - summary", () => {
  it("never hints at the entity you are looking at", () => {
    // the person is at the event, so a naive lookup from the person would
    // list the event right back - which reads as the event you opened showing
    // up inside its own panel
    const tree = from({ id: 5, type: Type.Event }, [
      rel(1, Type.Event, 5, Type.Person, 4),
      rel(2, Type.Event, 6, Type.Person, 4),
    ], 2);

    const person = tree.children[0];
    expect(person.entity.type).toBe(Type.Person);
    expect(person.summary).toEqual([Type.Event]); // only the other one
    expect(person.summary).toHaveLength(1);
  });

  it("is populated even when the edge does not expand", () => {
    const tree = from({ id: 5, type: Type.Event }, [
      rel(1, Type.Event, 5, Type.Person, 4),
      rel(2, Type.Task, 1, Type.Person, 4),
    ], 2);

    // `includes` is a chip, so there are no children - but the hint row still
    // knows there is a task behind the person
    expect(tree.children[0].children).toHaveLength(0);
    expect(tree.children[0].summary).toEqual([Type.Task]);
  });

  it("respects what is worth showing under the entity", () => {
    const tree = from({ id: 5, type: Type.Event }, [
      rel(1, Type.Event, 5, Type.Habit, 3),
      rel(2, Type.Event, 6, Type.Habit, 3),
      rel(3, Type.Note, 7, Type.Habit, 3),
    ], 2);

    // the habit's other occurrences are not worth hinting at either
    expect(tree.children[0].summary).toEqual([Type.Note]);
  });
});

describe("walk - edges", () => {
  it("carries the row id and a viewpoint-correct type", () => {
    const tree = from({ id: 9, type: Type.Location }, [
      rel(42, Type.Task, 1, Type.Location, 9),
    ], 1);

    expect(tree.children[0].edge).toMatchObject({
      id: 42,
      type: RelationshipType.At,
      viewpoint: "target", // the location is the far end of "task at location"
    });
  });

  it("gives the root no edge", () => {
    const tree = from({ id: 1, type: Type.Task }, [], 1);

    expect(tree.edge).toBeNull();
  });
});
