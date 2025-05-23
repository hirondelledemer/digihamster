import React, { CSSProperties, FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import useTags from "@/app/utils/hooks/use-tags";
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
import { TaskWithRelations } from "@/app/utils/types/task";
import { useRouter } from "next/navigation";
import { TaskActions } from "../TaskActions";

export const titleTestId = "TaskCard-title-testid";
export const cardTestId = "TaskCard-card-testid";

export interface TaskCardProps {
  testId?: string;
  task: TaskWithRelations;
  dragId: string;
  indicateActive?: boolean;
}

export const taskFormTestId = "TaskCard-task-form-test-id";

const TaskCard: FC<TaskCardProps> = ({
  testId,
  task,

  dragId,
  indicateActive,
}): JSX.Element => {
  const { data: projects } = useProjectsState();
  const { data: tags } = useTags();
  const { setSelectedDate } = useCalendarDate();

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

  const taskTags = tags.filter((tag) => task.tags.includes(tag._id));

  const router = useRouter();

  return (
    <div data-testid={testId}>
      <TaskActions task={task}>
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
                {(!!task.relatedTaskIds.length ||
                  !!task.relatedNoteIds.length) && (
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
      </TaskActions>
    </div>
  );
};

export default TaskCard;
