import React, { CSSProperties, FC } from "react";
import { useDraggable } from "@dnd-kit/core";
import { ITask } from "@/app/utils/types/task";
import TaskCard from "./TaskCard";

export const titleTestId = "TaskCard-title-testid";
export const cardTestId = "TaskCard-card-testid";

export interface TaskCardProps {
  task: ITask;
  dragId: number;
  indicateActive?: boolean;
}

export const taskFormTestId = "TaskCard-task-form-test-id";

export const DraggableTaskCard: FC<TaskCardProps> = ({
  task,

  dragId,
  indicateActive,
}): JSX.Element => {
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

  return (
    <TaskCard
      task={task}
      indicateActive={indicateActive}
      attributes={attributes}
      listeners={listeners}
      setNodeRef={setNodeRef}
      style={style}
    />
  );
};
