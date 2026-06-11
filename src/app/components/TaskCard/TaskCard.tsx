import React, { CSSProperties, FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { format } from "date-fns";
import StaleIndicator from "../StaleIndicator";
import { useDraggable } from "@dnd-kit/core";
import { IconCalendar, IconProgressCheck } from "@tabler/icons-react";
import { useCalendarDate } from "../../utils/hooks/use-calendar-date";
import { Tooltip, TooltipContent, TooltipProvider } from "../ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import { TaskWithRelations } from "@/app/utils/types/task";
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
  const { setSelectedDate } = useCalendarDate();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: dragId,
    disabled: task.status === "done" || !!task.event_id,
    data: {
      id: task.id,
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

  const project = projects.find((p) => p._id === task.project_id);

  return (
    <div data-testid={testId}>
      <TaskActions task={task}>
        <Card
          data-testid={cardTestId}
          className={`p-0 rounded-md ${
            task.status === "done" ? "opacity-40 line-through" : ""
          } `}
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
                {indicateActive && task.status === "doing" && (
                  <IconProgressCheck size={18} color="green" />
                )}
                {task.status === "doing" && (
                  <StaleIndicator
                    date={new Date(task.activated_at || 0).valueOf()}
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
            {!(task.status === "done") && (
              <CardDescription>
                <div style={{ color: project?.color }}>{project?.title}</div>
              </CardDescription>
            )}
          </CardHeader>
          {task.description && !(task.status === "done") && (
            <CardContent className="pb-4 px-4 text-xs whitespace-pre-wrap muted">
              {task.description}
            </CardContent>
          )}
          {/* {!!taskTags.length && (
            <CardFooter className="p-4">
              <div className="space-x-1">
                {taskTags.map((tag) => (
                  <Badge variant="outline" key={tag._id}>
                    {tag.title}
                  </Badge>
                ))}
              </div>
            </CardFooter>
          )} */}
        </Card>
      </TaskActions>
    </div>
  );
};

export default TaskCard;
