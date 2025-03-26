import React, { CSSProperties, FC, useState } from "react";
import useProjects from "@/app/utils/hooks/use-projects";
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
import { Button } from "../ui/button";
import { TaskV2 } from "@/models/taskV2";
import { IconCalendar } from "@tabler/icons-react";
import { useCalendarDate } from "../../utils/hooks/use-calendar-date";

export const titleTestId = "TaskCard-title-testid";
export const cardTestId = "TaskCard-card-testid";

export interface TaskCardProps {
  testId?: string;
  className?: string;
  task: TaskV2;
  dragId: string;
  fullHeight?: boolean;
  relatedTasksCta?: {
    label: string;
    onClick(): void;
  };
}

export const taskFormTestId = "TaskCard-task-form-test-id";

const TaskCard: FC<TaskCardProps> = ({
  testId,
  task,
  className,
  relatedTasksCta,
  dragId,
  fullHeight = false,
}): JSX.Element => {
  const { data: projects } = useProjects();
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
            } ${fullHeight ? "w-[296px]" : "w-[267px]"}`}
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
                <div>
                  {task.title}
                  {task.deadline && (
                    <span className="text-destructive ml-4">
                      {format(new Date(task.deadline), "MM-dd")}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <StaleIndicator
                    date={task.activatedAt || 0}
                    className="mr-2"
                  />
                  {!!task.deadline && (
                    <IconCalendar
                      size={18}
                      onClick={() => {
                        console.log("clicking", new Date(task.deadline!));
                        setSelectedDate(new Date(task.deadline!));
                      }}
                    />
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
            {(task.deadline || !!taskTags.length || relatedTasksCta) && (
              <CardFooter className="p-4">
                <div className="space-x-1">
                  {task.deadline && (
                    <Badge variant="destructive">Deadline</Badge>
                  )}
                  {taskTags.map((tag) => (
                    <Badge variant="outline" key={tag._id}>
                      {tag.title}
                    </Badge>
                  ))}
                  {relatedTasksCta && (
                    <Button
                      variant="link"
                      onMouseDown={(e) => {
                        console.log("clickHappened");
                        e.stopPropagation();
                        relatedTasksCta.onClick();
                      }}
                    >
                      {relatedTasksCta.label}
                    </Button>
                  )}
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
          {!task.eventId && (
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
