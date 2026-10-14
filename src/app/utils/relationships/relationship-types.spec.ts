import { generateRelationship } from "../mocks/relationship";
import { RelationshipEntityType } from "../types/relationship";
import {
  isOccurrence,
  relationshipTypeFor,
  RelationshipType,
} from "./relationship-types";

const habitEventEdge = (relationship_type: string) =>
  generateRelationship(1, {
    source_type: RelationshipEntityType.Habit,
    source_id: 7,
    target_type: RelationshipEntityType.Event,
    target_id: 91,
    relationship_type,
  });

describe("relationshipTypeFor", () => {
  it("marks a habit joined to an event as an occurrence, either way round", () => {
    expect(
      relationshipTypeFor(
        RelationshipEntityType.Habit,
        RelationshipEntityType.Event
      )
    ).toBe(RelationshipType.OccurrenceOf);

    expect(
      relationshipTypeFor(
        RelationshipEntityType.Event,
        RelationshipEntityType.Habit
      )
    ).toBe(RelationshipType.OccurrenceOf);
  });

  it("leaves everything else as a plain association", () => {
    expect(
      relationshipTypeFor(
        RelationshipEntityType.Note,
        RelationshipEntityType.Person
      )
    ).toBe(RelationshipType.Related);
  });
});

describe("isOccurrence", () => {
  it("recognises an explicitly stamped edge", () => {
    expect(isOccurrence(habitEventEdge(RelationshipType.OccurrenceOf))).toBe(
      true
    );
  });

  it("never counts an edge between other types", () => {
    const edge = generateRelationship(1, {
      source_type: RelationshipEntityType.Note,
      target_type: RelationshipEntityType.Person,
      relationship_type: RelationshipType.Related,
    });

    expect(isOccurrence(edge)).toBe(false);
  });

  describe("rows written before the type existed", () => {
    it("still count, so existing data does not silently stop counting", () => {
      expect(isOccurrence(habitEventEdge(RelationshipType.Related))).toBe(true);
    });

    // this is the behaviour the backfill unlocks: once every real session is
    // stamped, `related` goes back to meaning a plain association, and you can
    // link a habit to an event without it counting as a session you did
    it("stop counting once the legacy allowance is turned off", () => {
      expect(
        isOccurrence(habitEventEdge(RelationshipType.Related), {
          includeLegacy: false,
        })
      ).toBe(false);

      expect(
        isOccurrence(habitEventEdge(RelationshipType.OccurrenceOf), {
          includeLegacy: false,
        })
      ).toBe(true);
    });
  });
});
