import React, { CSSProperties, FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { format } from "date-fns";
import StaleIndicator from "../StaleIndicator";
import { DraggableAttributes } from "@dnd-kit/core";
import { IconCalendar, IconProgressCheck } from "@tabler/icons-react";
import { useCalendarDate } from "../../utils/hooks/use-calendar-date";
import { Tooltip, TooltipContent, TooltipProvider } from "../ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import { ITask } from "@/app/utils/types/task";
import { TaskActions } from "../TaskActions";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

export const titleTestId = "TaskCard-title-testid";
export const cardTestId = "TaskCard-card-testid";

export interface TaskCardProps {
  testId?: string;
  task: ITask;
  indicateActive?: boolean;
  transition?: string;
  setNodeRef?: (node: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
  attributes?: DraggableAttributes;
  style?: CSSProperties;
}

export const taskFormTestId = "TaskCard-task-form-test-id";

const TaskCard: FC<TaskCardProps> = ({
  testId,
  task,
  indicateActive,
  transition,
  setNodeRef,
  listeners,
  attributes,
  style,
}): JSX.Element => {
  const { data: projects } = useProjectsState();
  const { setSelectedDate } = useCalendarDate();

  // // const { attributes, listeners, setNodeRef, transform } = useDraggable({
  // //   id: dragId,
  // //   disabled: task.status === "done" || !!task.event_id,
  // //   data: {
  // //     id: task.id,
  // //   },
  // // });

  // const { attributes, listeners, setNodeRef, transform, transition } =
  //   useSortable({ id: task.id });

  const project = projects.find((p) => p.id === task.project_id);

  const baseStyle: CSSProperties = {
    ...style,
    borderColor: project?.color,
    transition,
  };

  // const style: CSSProperties | undefined = transform
  //   ? {
  //       transform: `translate(${transform.x}px, ${transform.y}px)`,
  //       position: "fixed",
  //       zIndex: 999,
  //       opacity: 0.5,
  //     }
  //   : undefined;

  return (
    <div data-testid={testId}>
      <TaskActions task={task}>
        <Card
          data-testid={cardTestId}
          className={`p-0 rounded-md ${
            task.status === "done" ? "opacity-40 line-through" : ""
          }`}
          ref={setNodeRef}
          style={{ ...baseStyle, ...style }}
          {...listeners}
          {...attributes}
        >
          <CardHeader className="p-4 pt-2">
            <div
              style={{ color: project?.color }}
              className="text-[10px] uppercase underline flex items-center justify-between"
            >
              {project?.title}

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
            </div>
            <CardTitle
              data-testid={titleTestId}
              className="font-normal flex items-center justify-between"
            >
              <div>{task.title}</div>
            </CardTitle>
          </CardHeader>
          {task.description && !(task.status === "done") && (
            <CardContent className="pb-4 px-4 text-xs whitespace-pre-wrap muted">
              {task.description}
            </CardContent>
          )}
        </Card>
      </TaskActions>
    </div>
  );
};

export default TaskCard;
