import { RelationshipEntityType } from "../types/relationship";
import { RelationshipType } from "./relationship-types";

/**
 * What a pair of entity types means when you link it.
 *
 * The point of this table is that you never pick a relationship type by hand.
 * Linking a task to a location can only ever mean "at", so the pair decides
 * and the picker stays a list of things, not a list of verbs. The only pair
 * that is genuinely ambiguous is task-to-task, which is why it is the one
 * entry carrying `alternatives`.
 *
 * Edges are listed once, in their canonical direction. A row stored the other
 * way round is the same edge read from the far end - see `canonicalEdge`.
 */
export const EDGES: Partial<
  Record<
    RelationshipEntityType,
    Partial<Record<RelationshipEntityType, RelationshipType>>
  >
> = {
  [RelationshipEntityType.Task]: {
    [RelationshipEntityType.Task]: RelationshipType.Blocks,
    [RelationshipEntityType.Location]: RelationshipType.At,
    [RelationshipEntityType.Person]: RelationshipType.Includes,
  },
  [RelationshipEntityType.Event]: {
    [RelationshipEntityType.Event]: RelationshipType.Related,
    [RelationshipEntityType.Task]: RelationshipType.Contains,
    [RelationshipEntityType.Habit]: RelationshipType.OccurrenceOf,
    [RelationshipEntityType.Location]: RelationshipType.At,
    [RelationshipEntityType.Person]: RelationshipType.Includes,
  },
  [RelationshipEntityType.Project]: {
    [RelationshipEntityType.Project]: RelationshipType.Blocks,
    [RelationshipEntityType.Habit]: RelationshipType.Contains,
    [RelationshipEntityType.Location]: RelationshipType.At,
    [RelationshipEntityType.Person]: RelationshipType.Includes,
  },
  [RelationshipEntityType.Habit]: {
    [RelationshipEntityType.Location]: RelationshipType.At,
    [RelationshipEntityType.Person]: RelationshipType.Includes,
  },
  [RelationshipEntityType.Journal]: {
    [RelationshipEntityType.Journal]: RelationshipType.Continues,
    [RelationshipEntityType.Task]: RelationshipType.During,
    [RelationshipEntityType.Event]: RelationshipType.During,
    [RelationshipEntityType.Habit]: RelationshipType.During,
    [RelationshipEntityType.Location]: RelationshipType.At,
    [RelationshipEntityType.Person]: RelationshipType.Includes,
  },
  [RelationshipEntityType.Note]: {
    [RelationshipEntityType.Note]: RelationshipType.Related,
    [RelationshipEntityType.Task]: RelationshipType.Annotates,
    [RelationshipEntityType.Event]: RelationshipType.Annotates,
    [RelationshipEntityType.Project]: RelationshipType.Annotates,
    [RelationshipEntityType.Habit]: RelationshipType.Annotates,
    [RelationshipEntityType.Person]: RelationshipType.Annotates,
    [RelationshipEntityType.Location]: RelationshipType.Annotates,
  },
  [RelationshipEntityType.Person]: {
    [RelationshipEntityType.Person]: RelationshipType.Related,
    [RelationshipEntityType.Location]: RelationshipType.At,
  },
  [RelationshipEntityType.Location]: {
    [RelationshipEntityType.Location]: RelationshipType.Near,
  },
};

/**
 * Pairs you can link but where the verb is a real choice rather than a lookup.
 * The value in EDGES is the default; these are the other options the form has
 * to offer. Keep this as close to empty as you can - every entry here is a
 * question the UI has to ask you.
 */
export const EDGE_ALTERNATIVES: Partial<
  Record<
    RelationshipEntityType,
    Partial<Record<RelationshipEntityType, RelationshipType[]>>
  >
> = {
  [RelationshipEntityType.Task]: {
    [RelationshipEntityType.Task]: [RelationshipType.Follows],
  },
};

export interface RelationshipTypeRule {
  /** reading the edge from its canonical source: "task <at> location" */
  label: string;
  /** reading the same row from the other end: "location <has> task" */
  inverseLabel: string;
  /**
   * Direction carries no meaning, so the two labels are the same and nothing
   * should try to normalise which end is stored as the source.
   */
  symmetric: boolean;
  /**
   * Whether the neighbour renders its own relationships underneath it, or
   * stops at a chip. This is the knob that keeps the panel finite: `at` and
   * `includes` not expanding is what stops task -> location -> task.
   */
  expands: boolean;
}

export const RELATIONSHIP_TYPE_RULES: Record<
  RelationshipType,
  RelationshipTypeRule
> = {
  [RelationshipType.Related]: {
    label: "related",
    inverseLabel: "related",
    symmetric: true,
    expands: false,
  },
  [RelationshipType.OccurrenceOf]: {
    label: "occurrence of",
    inverseLabel: "occurrences",
    symmetric: false,
    // unbounded by nature - a weekly habit grows one a week forever, so
    // whatever renders these has to bound by date rather than list them all
    expands: true,
  },
  [RelationshipType.At]: {
    label: "at",
    inverseLabel: "has",
    symmetric: false,
    expands: false,
  },
  [RelationshipType.Includes]: {
    label: "includes",
    inverseLabel: "part of",
    symmetric: false,
    expands: false,
  },
  [RelationshipType.Annotates]: {
    label: "about",
    inverseLabel: "notes",
    symmetric: false,
    expands: true,
  },
  [RelationshipType.During]: {
    label: "during",
    inverseLabel: "thoughts during",
    symmetric: false,
    expands: true,
  },
  [RelationshipType.Contains]: {
    label: "has",
    inverseLabel: "part of",
    symmetric: false,
    expands: true,
  },
  [RelationshipType.Blocks]: {
    label: "blocks",
    inverseLabel: "blocked by",
    symmetric: false,
    expands: false,
  },
  [RelationshipType.Follows]: {
    label: "follows",
    inverseLabel: "precedes",
    symmetric: false,
    expands: false,
  },
  [RelationshipType.Continues]: {
    label: "continues",
    inverseLabel: "continued by",
    symmetric: false,
    expands: true,
  },
  [RelationshipType.Near]: {
    label: "near",
    inverseLabel: "near",
    symmetric: true,
    expands: false,
  },
};

export interface CanonicalEdge {
  type: RelationshipType;
  /** the type that belongs in source_type once the row is normalised */
  source: RelationshipEntityType;
  /** the type that belongs in target_type once the row is normalised */
  target: RelationshipEntityType;
  /** true when the pair was given to us the other way round */
  flipped: boolean;
}

/**
 * The edge for a pair of types, in whichever order you happen to hold them,
 * plus whether what you passed was back to front. Returns null when the pair
 * is not a relationship at all - which is also the answer to "can I link
 * these", so the picker and the writer agree by construction.
 */
export const canonicalEdge = (
  a: RelationshipEntityType,
  b: RelationshipEntityType
): CanonicalEdge | null => {
  const forward = EDGES[a]?.[b];
  if (forward) {
    return { type: forward, source: a, target: b, flipped: false };
  }

  const reverse = EDGES[b]?.[a];
  if (reverse) {
    return { type: reverse, source: b, target: a, flipped: true };
  }

  return null;
};

/** whether these two types are allowed to be linked at all */
export const canRelate = (
  a: RelationshipEntityType,
  b: RelationshipEntityType
): boolean => canonicalEdge(a, b) !== null;

/** every type you are allowed to attach to this one, for the create form */
export const allowedTargetsFor = (
  entityType: RelationshipEntityType
): RelationshipEntityType[] =>
  Object.values(RelationshipEntityType).filter((other) =>
    canRelate(entityType, other)
  );

/** the verbs the form has to offer for a pair, default first */
export const typeOptionsFor = (
  a: RelationshipEntityType,
  b: RelationshipEntityType
): RelationshipType[] => {
  const edge = canonicalEdge(a, b);
  if (!edge) {
    return [];
  }

  const alternatives =
    EDGE_ALTERNATIVES[edge.source]?.[edge.target] ?? [];

  return [edge.type, ...alternatives];
};

/**
 * How to read an edge when you are looking at it from `viewingFrom`. The
 * stored row always points one way; which label applies depends on which end
 * of it you are standing on.
 */
export const labelFor = (
  type: RelationshipType,
  viewpoint: "source" | "target"
): string => {
  const rule = RELATIONSHIP_TYPE_RULES[type];
  return viewpoint === "source" ? rule.label : rule.inverseLabel;
};

/** whether a neighbour joined by this edge renders its own relationships */
export const expands = (type: RelationshipType): boolean =>
  RELATIONSHIP_TYPE_RULES[type].expands;
