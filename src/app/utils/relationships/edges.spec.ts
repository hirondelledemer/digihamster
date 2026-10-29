import { generateRelationship } from "../mocks/relationship";
import { RelationshipEntityType } from "../types/relationship";
import {
  VIEWS,
  canRelate,
  edgeTypeOf,
  labelForEdge,
  resolveEdge,
  viewTypes,
} from "./edges";
import { RelationshipType } from "./relationship-types";

const row = (
  source_type: RelationshipEntityType,
  source_id: number,
  target_type: RelationshipEntityType,
  target_id: number,
  relationship_type = "related"
) =>
  generateRelationship(1, {
    source_type,
    source_id,
    target_type,
    target_id,
    relationship_type,
  });

describe("edgeTypeOf", () => {
  it("derives the verb from the pair when the row still says related", () => {
    const taskAtLocation = row(
      RelationshipEntityType.Task,
      7,
      RelationshipEntityType.Location,
      3
    );

    expect(edgeTypeOf(taskAtLocation)).toBe(RelationshipType.At);
  });

  it("derives it the same way when the row is stored back to front", () => {
    const locationHasTask = row(
      RelationshipEntityType.Location,
      3,
      RelationshipEntityType.Task,
      7
    );

    expect(edgeTypeOf(locationHasTask)).toBe(RelationshipType.At);
  });

  it("keeps a deliberately stored verb over the table's default", () => {
    const follows = row(
      RelationshipEntityType.Task,
      1,
      RelationshipEntityType.Task,
      2,
      RelationshipType.Follows
    );

    // the default for task-to-task is blocks
    expect(edgeTypeOf(follows)).toBe(RelationshipType.Follows);
  });

  it("falls back to the default for task-to-task until it is marked", () => {
    const unmarked = row(
      RelationshipEntityType.Task,
      1,
      RelationshipEntityType.Task,
      2
    );

    expect(edgeTypeOf(unmarked)).toBe(RelationshipType.Blocks);
  });

  it("resolves related to related where that is the real answer", () => {
    const twoPeople = row(
      RelationshipEntityType.Person,
      1,
      RelationshipEntityType.Person,
      2
    );

    expect(edgeTypeOf(twoPeople)).toBe(RelationshipType.Related);
  });

  it("rejects a pair the table does not allow", () => {
    // tasks carry project_id; a relationship row saying so is awaiting cleanup
    const taskToProject = row(
      RelationshipEntityType.Task,
      7,
      RelationshipEntityType.Project,
      2
    );

    expect(edgeTypeOf(taskToProject)).toBeNull();
  });

  it("ignores a stored verb it does not recognise", () => {
    const junk = row(
      RelationshipEntityType.Note,
      1,
      RelationshipEntityType.Task,
      2,
      "something_else"
    );

    expect(edgeTypeOf(junk)).toBe(RelationshipType.Annotates);
  });
});

describe("resolveEdge", () => {
  const task = { id: 7, type: RelationshipEntityType.Task };
  const location = { id: 3, type: RelationshipEntityType.Location };

  it("reads forwards from the canonical source", () => {
    const edge = resolveEdge(
      row(
        RelationshipEntityType.Task,
        7,
        RelationshipEntityType.Location,
        3
      ),
      task
    );

    expect(edge).toMatchObject({ viewpoint: "source", other: location });
    expect(labelForEdge(edge!)).toBe("at");
  });

  it("reads backwards from the canonical target", () => {
    const edge = resolveEdge(
      row(
        RelationshipEntityType.Task,
        7,
        RelationshipEntityType.Location,
        3
      ),
      location
    );

    expect(edge).toMatchObject({ viewpoint: "target", other: task });
    expect(labelForEdge(edge!)).toBe("has");
  });

  it("ignores how the row happens to be stored", () => {
    // same edge, saved from the location's form instead of the task's
    const stored = row(
      RelationshipEntityType.Location,
      3,
      RelationshipEntityType.Task,
      7
    );

    expect(resolveEdge(stored, task)).toMatchObject({
      viewpoint: "source",
      other: location,
    });
    expect(resolveEdge(stored, location)).toMatchObject({
      viewpoint: "target",
      other: task,
    });
  });

  it("uses the stored orientation when both ends are the same type", () => {
    const blocks = row(
      RelationshipEntityType.Task,
      1,
      RelationshipEntityType.Task,
      2
    );

    const blocker = resolveEdge(blocks, {
      id: 1,
      type: RelationshipEntityType.Task,
    });
    const blocked = resolveEdge(blocks, {
      id: 2,
      type: RelationshipEntityType.Task,
    });

    expect(labelForEdge(blocker!)).toBe("blocks");
    expect(labelForEdge(blocked!)).toBe("blocked by");
  });

  it("returns null for a row that does not touch the viewer", () => {
    const elsewhere = row(
      RelationshipEntityType.Task,
      99,
      RelationshipEntityType.Location,
      3
    );

    expect(resolveEdge(elsewhere, task)).toBeNull();
  });

  it("returns null for a pair the table does not allow", () => {
    const taskToProject = row(
      RelationshipEntityType.Task,
      7,
      RelationshipEntityType.Project,
      2
    );

    expect(resolveEdge(taskToProject, task)).toBeNull();
  });
});

/**
 * EDGES and VIEWS used to be two tables in two files that drifted apart: a
 * link you could make but no panel would show, or a panel listing a link that
 * could not exist. Both directions had already produced bugs, so they are
 * pinned here rather than left to agree by habit.
 */
describe("VIEWS agrees with EDGES", () => {
  const allTypes = Object.values(RelationshipEntityType);

  it.each(allTypes)("%s lists only types it can link to", (type) => {
    viewTypes(type).forEach((neighbour) => {
      expect([neighbour, canRelate(type, neighbour)]).toEqual([
        neighbour,
        true,
      ]);
    });
  });

  it.each(allTypes)("%s lists every type it can link to", (type) => {
    const linkable = allTypes.filter((other) => canRelate(type, other));

    expect([...viewTypes(type)].sort()).toEqual([...linkable].sort());
  });

  it.each(allTypes)("%s only narrows as a child, never widens", (type) => {
    const { asChild } = VIEWS[type];
    if (!asChild) {
      return;
    }

    asChild.forEach((neighbour) =>
      expect(viewTypes(type)).toContain(neighbour)
    );
  });
});

describe("the panels a type appears in", () => {
  it("shows a note what it is about, rather than nothing", () => {
    // ALLOWED_TYPES[Note] was empty, so a note's own column always read
    // "no stuff here" however much was attached to it
    expect(viewTypes(RelationshipEntityType.Note, "primary")).not.toHaveLength(
      0
    );
  });

  it("shows a journal its own thread", () => {
    expect(viewTypes(RelationshipEntityType.Journal, "primary")).toContain(
      RelationshipEntityType.Journal
    );
  });

  it("shows an event the events it was moved to or from", () => {
    expect(viewTypes(RelationshipEntityType.Event, "primary")).toContain(
      RelationshipEntityType.Event
    );
  });
});
