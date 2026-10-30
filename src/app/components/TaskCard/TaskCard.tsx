import React, { CSSProperties, FC, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { format } from "date-fns";
import StaleIndicator from "../StaleIndicator";
import { DraggableAttributes } from "@dnd-kit/core";
import { IconCalendar, IconProgressCheck } from "@tabler/icons-react";
import { useCalendarDate } from "../../utils/hooks/use-calendar-date";
import { Tooltip, TooltipContent } from "../ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useTaskProject } from "@/app/utils/hooks/use-projects/selectors";
import { ITask, TaskStatus } from "@/app/utils/types/task";
import { TaskActions } from "../TaskActions";
import { AdditionalAction } from "../AdditionalActions";
import { ScheduledIndicator } from "../ScheduledIndicator";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { useAllRelationshipsForEntity } from "@/app/utils/hooks/use-relationships/selectors";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { MinimalNote } from "../notes";
import { useNoteById } from "@/app/utils/hooks/use-notes/selectors";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const titleTestId = "TaskCard-title-testid";
export const cardTestId = "TaskCard-card-testid";

export interface TaskCardProps {
  testId?: string;
  task: ITask;
  indicateActive?: boolean;
  setNodeRef?: (node: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
  attributes?: DraggableAttributes;
  style?: CSSProperties;
  /** menu items the context this card sits in wants to add */
  additionalActions?: AdditionalAction[];
  /** the task is already attached to the event being looked at */
  scheduled?: boolean;
}

export const taskFormTestId = "TaskCard-task-form-test-id";

const Note: FC<{ id: number }> = ({ id }) => {
  const note = useNoteById(id);
  if (!note) {
    return null;
  }

  return <MinimalNote note={note.json_content} />;
};

const TaskCard: FC<TaskCardProps> = ({
  testId,
  task,
  indicateActive,
  setNodeRef,
  listeners,
  attributes,
  style,
  additionalActions,
  scheduled,
}): JSX.Element => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { setSelectedDate } = useCalendarDate();

  // A note on a task reads as part of the task, like its description - not as
  // somewhere you navigate to. So the card carries it everywhere the card is
  // used, rather than each caller having to pass it in. The relationship
  // navigator is only one of eight places this is rendered.
  const noteRelationships = useAllRelationshipsForEntity({
    entityId: task.id,
    entityType: RelationshipEntityType.Task,
  }).filter((r) => r.target_type === RelationshipEntityType.Note);

  const project = useTaskProject(task);

  const baseStyle: CSSProperties = {
    ...style,
    borderColor: project?.color,
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  return (
    // TODO: find out if this the outer layer needed at all
    <div data-testid={testId} className="w-full">
      <TaskActions task={task} additionalActions={additionalActions}>
        <Card
          data-testid={cardTestId}
          className={`p-0 rounded-md w-full ${
            task.status === "done" ? "opacity-40" : ""
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
              <span
                className="hover:font-bold cursor-pointer"
                onClick={
                  () =>
                    project &&
                    router.push(
                      pathname +
                        "?" +
                        createQueryString("projectId", project?.id.toString())
                    )
                  // router.push(`/?projectId=${project?.id}`, undefined)
                }
              >
                {project?.title}
              </span>

              <div className="flex items-center gap-1">
                {scheduled && <ScheduledIndicator />}
                {indicateActive && task.status === TaskStatus.Doing && (
                  <IconProgressCheck size={18} color="green" />
                )}
                {task.status === "doing" && (
                  <StaleIndicator
                    date={new Date(task.activated_at || 0).valueOf()}
                  />
                )}
                {!!task.deadline && (
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
                )}
              </div>
            </div>
            <CardTitle
              data-testid={titleTestId}
              className="font-normal flex items-center justify-between"
            >
              <div
                className={
                  task.status === TaskStatus.Done ? "line-through" : ""
                }
              >
                {task.title}
              </div>
            </CardTitle>
          </CardHeader>
          {task.description && !(task.status === "done") && (
            <CardContent className="pb-4 px-4 text-xs whitespace-pre-wrap muted">
              {task.description}
            </CardContent>
          )}
          {!!noteRelationships.length && (
            <CardContent className="pb-4 px-4 text-xs whitespace-pre-wrap muted">
              {noteRelationships.map((r) => (
                <Note key={r.target_id} id={r.target_id} />
              ))}
            </CardContent>
          )}
        </Card>
      </TaskActions>
    </div>
  );
};

export default TaskCard;
