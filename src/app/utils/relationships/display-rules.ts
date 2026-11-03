import { ProjectStatus } from "../types/project";
import { RelationshipEntityType } from "../types/relationship";
import { TaskStatus } from "../types/task";

/**
 * Terminal statuses: a done or cancelled thing is history, not something you
 * can still act on, so it drops out of the panel entirely.
 *
 * This has to be decided here rather than inside the leaf component. A leaf
 * that returns null still looks like a renderable child to its parent, so the
 * parent would keep drawing the chrome (actions, empty state) around nothing.
 */
const TERMINAL_TASK_STATUSES = [TaskStatus.Cancelled];

export const isTerminalTaskStatus = (status: TaskStatus): boolean =>
  TERMINAL_TASK_STATUSES.includes(status);

const TERMINAL_PROJECT_STATUSES = [
  ProjectStatus.Cancelled,
  ProjectStatus.Done,
  ProjectStatus.Todo,
];

export const isTerminalProjectStatus = (status: ProjectStatus): boolean =>
  TERMINAL_PROJECT_STATUSES.includes(status);

/**
 * Rules that depend on who is asking, not just on the thing itself.
 *
 * A terminal status above is a fact about the entity - cancelled is cancelled
 * no matter who points at it. These are not: the same live task is worth
 * showing under an event and not worth showing under a location, because a
 * place answers "what could I do here" and a thing you have already done is
 * not an answer to that.
 *
 * Keyed on the parent, so the rule travels with the panel rather than with
 * whatever happened to be at the root of the tree.
 */
const HIDDEN_TASK_STATUSES_UNDER: Partial<
  Record<RelationshipEntityType, TaskStatus[]>
> = {
  [RelationshipEntityType.Location]: [TaskStatus.Done],
};

export const isHiddenTaskUnder = (
  parentType: RelationshipEntityType,
  status: TaskStatus
): boolean => (HIDDEN_TASK_STATUSES_UNDER[parentType] ?? []).includes(status);

/**
 * Same idea for habits, except the condition is one bit rather than a status,
 * so this is a list of parents rather than a map of parents to values.
 *
 * "Completed" here means completed *on the day the panel is being read
 * against* - see the `on` option of useRelationshipTree. A habit has no
 * terminal state of its own, so without a day in play there is nothing to
 * hide and this never fires.
 */
const HIDES_COMPLETED_HABITS: RelationshipEntityType[] = [
  RelationshipEntityType.Location,
];

export const hidesCompletedHabits = (
  parentType: RelationshipEntityType
): boolean => HIDES_COMPLETED_HABITS.includes(parentType);
