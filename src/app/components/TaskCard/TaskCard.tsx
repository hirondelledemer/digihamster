import React, { CSSProperties, FC, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import useEditTask from "@/app/utils/hooks/use-edit-task";
import useTags from "@/app/utils/hooks/use-tags";
import TaskFormModal from "../TaskFormModal";
import StaleIndicator from "../StaleIndicator";
import { useDraggable } from "@dnd-kit/core";
import {
  IconCalendar,
  IconLayoutSidebarRightExpand,
  IconProgressCheck,
} from "@tabler/icons-react";
import { useCalendarDate } from "../../utils/hooks/use-calendar-date";
import { Tooltip, TooltipContent, TooltipProvider } from "../ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import { TaskWithRelatedTasks } from "@/app/utils/types/task";
import { useRouter } from "next/navigation";

export const titleTestId = "TaskCard-title-testid";
export const cardTestId = "TaskCard-card-testid";

export interface TaskCardProps {
  testId?: string;
  className?: string;
  task: TaskWithRelatedTasks;
  dragId: string;
  indicateActive?: boolean;
}

export const taskFormTestId = "TaskCard-task-form-test-id";

const TaskCard: FC<TaskCardProps> = ({
  testId,
  task,
  className,
  dragId,
  indicateActive,
}): JSX.Element => {
  const { data: projects } = useProjectsState();
  const { data: tags } = useTags();
  const { setSelectedDate } = useCalendarDate();
  const [taskFormOpen, setTaskFormOpen] = useState<boolean>(false);
  const { editTask } = useEditTask();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: dragId,
    disabled: task.completed || !!task.eventId,
    data: {
      id: task._id,
    },
  });

  const style: CSSProperties | undefined = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        position: "fixed",
        zIndex: 999,
        opacity: 0.5,
      }
    : undefined;

  const project = projects.find((p) => p._id === task.projectId);

  const closeTaskForm = () => setTaskFormOpen(false);
  const taskTags = tags.filter((tag) => task.tags.includes(tag._id));

  const router = useRouter();

  return (
    <div data-testid={testId} className={className}>
      <TaskFormModal
        testId={taskFormTestId}
        editMode
        open={taskFormOpen}
        onDone={closeTaskForm}
        onClose={closeTaskForm}
        task={task}
      />
      <ContextMenu>
        <ContextMenuTrigger>
          <Card
            data-testid={cardTestId}
            className={`p-0 rounded-md ${
              task.completed ? "opacity-40 line-through" : ""
            } w-[300px]`}
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
          >
            <CardHeader className="p-4">
              <CardTitle
                data-testid={titleTestId}
                className="font-normal flex items-center justify-between"
              >
                <div>{task.title}</div>

                <div className="flex items-center gap-1">
                  {indicateActive && task.isActive && (
                    <IconProgressCheck size={18} color="green" />
                  )}
                  {task.isActive && (
                    <StaleIndicator date={task.activatedAt || 0} />
                  )}
                  {!!task.relatedTaskIds.length && (
                    <IconLayoutSidebarRightExpand
                      data-testid="task-info-icon"
                      size={18}
                      onClick={() =>
                        router.push(`/?taskId=${task._id}`, undefined)
                      }
                    />
                  )}
                  {!!task.deadline && (
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                          <IconCalendar
                            size={18}
                            onClick={() => {
                              setSelectedDate(new Date(task.deadline!));
                            }}
                          />
                          <TooltipContent>
                            {format(task.deadline, "MM-dd")}
                          </TooltipContent>
                        </TooltipTrigger>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </CardTitle>
              {!task.completed && (
                <CardDescription>
                  <div style={{ color: project?.color }}>{project?.title}</div>
                </CardDescription>
              )}
            </CardHeader>
            {task.description && !task.completed && (
              <CardContent className="pb-4 px-4 text-xs whitespace-pre-wrap muted">
                {task.description}
              </CardContent>
            )}
            {!!taskTags.length && (
              <CardFooter className="p-4">
                <div className="space-x-1">
                  {taskTags.map((tag) => (
                    <Badge variant="outline" key={tag._id}>
                      {tag.title}
                    </Badge>
                  ))}
                </div>
              </CardFooter>
            )}
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          {task.completed && (
            <ContextMenuItem
              inset
              onClick={() =>
                editTask(task._id, { completed: false }, () =>
                  setTaskFormOpen(false)
                )
              }
            >
              Undo
            </ContextMenuItem>
          )}
          {!task.completed && (
            <ContextMenuItem
              inset
              onClick={() =>
                editTask(task._id, { completed: true }, () =>
                  setTaskFormOpen(false)
                )
              }
            >
              Complete
            </ContextMenuItem>
          )}
          {!task.eventId && task.isActive && (
            <ContextMenuItem
              inset
              onClick={() =>
                editTask(task._id, { isActive: false }, () =>
                  setTaskFormOpen(false)
                )
              }
            >
              Deactivate
            </ContextMenuItem>
          )}
          {!task.eventId && !task.isActive && (
            <ContextMenuItem
              inset
              onClick={() =>
                editTask(task._id, { isActive: true }, () =>
                  setTaskFormOpen(false)
                )
              }
            >
              Activate
            </ContextMenuItem>
          )}
          <ContextMenuItem inset onClick={() => setTaskFormOpen(true)}>
            Edit
          </ContextMenuItem>
          {!!task.eventId && (
            <ContextMenuItem
              inset
              onClick={() => editTask(task._id, { eventId: null })}
            >
              Remove from event
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export default TaskCard;
