import { ProjectStatus } from "../types/project";
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
