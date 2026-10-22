import { ProjectStatus } from "../types/project";
import { IRelationship, RelationshipEntityType } from "../types/relationship";
import { TaskStatus } from "../types/task";

/**
 * Which target types are worth showing when you are looking at a given entity
 * type. A relationship is stored both ways, so without this every panel would
 * show every neighbour, including the ones that say nothing in that context.
 */
export const ALLOWED_TYPES: Record<
  RelationshipEntityType,
  RelationshipEntityType[]
> = {
  [RelationshipEntityType.Location]: [
    RelationshipEntityType.Task,
    RelationshipEntityType.Habit,
    RelationshipEntityType.Project,
  ],
  [RelationshipEntityType.Event]: [
    RelationshipEntityType.Task,
    RelationshipEntityType.Habit,
    RelationshipEntityType.Note,
    RelationshipEntityType.Person,
    RelationshipEntityType.Journal,
    RelationshipEntityType.Location,
    RelationshipEntityType.Project,
  ],
  [RelationshipEntityType.Person]: [
    RelationshipEntityType.Task,
    RelationshipEntityType.Journal,
    RelationshipEntityType.Note,
    RelationshipEntityType.Habit,
    RelationshipEntityType.Event,
  ],
  [RelationshipEntityType.Project]: [
    RelationshipEntityType.Task,
    RelationshipEntityType.Note,
  ],
  [RelationshipEntityType.Task]: [
    RelationshipEntityType.Task,
    RelationshipEntityType.Note,
    RelationshipEntityType.Person,
    RelationshipEntityType.Location,
  ],
  [RelationshipEntityType.Journal]: [
    RelationshipEntityType.Person,
    RelationshipEntityType.Event,
  ],
  [RelationshipEntityType.Habit]: [
    // what you wrote during an occurrence, which is the point of looking a
    // habit up later. The form already creates these straight off the habit.
    RelationshipEntityType.Note,
    RelationshipEntityType.Journal,
    RelationshipEntityType.Person,
  ],
  [RelationshipEntityType.Note]: [],
};

export const isAllowedTarget = (
  entityType: RelationshipEntityType,
  relationship: IRelationship
): boolean => ALLOWED_TYPES[entityType].includes(relationship.target_type);

/**
 * Terminal statuses: a done or cancelled thing is history, not something you
 * can still act on, so it drops out of the panel entirely.
 *
 * This has to be decided here rather than inside the leaf component. A leaf
 * that returns null still looks like a renderable child to its parent, so the
 * parent would keep drawing the chrome (actions, empty state) around nothing.
 */
const TERMINAL_TASK_STATUSES = [TaskStatus.Done, TaskStatus.Cancelled];

export const isTerminalTaskStatus = (status: TaskStatus): boolean =>
  TERMINAL_TASK_STATUSES.includes(status);

const TERMINAL_PROJECT_STATUSES = [
  ProjectStatus.Cancelled,
  ProjectStatus.Done,
  ProjectStatus.Todo,
];

export const isTerminalProjectStatus = (status: ProjectStatus): boolean =>
  TERMINAL_PROJECT_STATUSES.includes(status);
