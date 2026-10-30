import { StickyNoteVariant } from "../types/note";
import { ProjectStatus } from "../types/project";
import { IRelationship, RelationshipEntityType } from "../types/relationship";
import { TaskStatus } from "../types/task";

/**
 * What a note has to be joined to before it counts as documenting that thing
 * rather than merely sitting beside it.
 */
const TAPED_TO: RelationshipEntityType[] = [
  RelationshipEntityType.Project,
  RelationshipEntityType.Task,
  RelationshipEntityType.Habit,
];

/**
 * How a note is held in place, decided by the note's own neighbours rather
 * than by whatever panel it is being shown in.
 *
 * The panel is the wrong thing to ask. The navigator is always entered from
 * an event, so its first column lists an event's notes, tasks and projects
 * side by side - and a note belonging to one of those projects is still a
 * note about that project while it sits in the event's column. Taping is
 * about what the note documents, which only its own edges can say.
 *
 * Takes the unfiltered neighbours from `useAllRelationshipsForEntity`, so it
 * does not depend on what any panel has decided is worth showing.
 */
export const noteAttachment = (
  neighbours: IRelationship[]
): StickyNoteVariant =>
  neighbours.some((r) => TAPED_TO.includes(r.target_type)) ? "tape" : "pin";

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
