import React, { CSSProperties, FC } from "react";
import { ITask } from "@/app/utils/types/task";
import { useSortable } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { CSS } from "@dnd-kit/utilities";

export const titleTestId = "TaskCard-title-testid";
export const cardTestId = "TaskCard-card-testid";

export interface TaskCardProps {
  task: ITask;
  indicateActive?: boolean;
}

export const SortableTaskCard: FC<TaskCardProps> = ({
  task,
  indicateActive,
}): JSX.Element => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style: CSSProperties | undefined = transform
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
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
