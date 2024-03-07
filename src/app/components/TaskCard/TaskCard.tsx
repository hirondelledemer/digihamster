import React, { FC } from "react";
import { Task } from "@/models/task";
import useProjects from "@/app/utils/hooks/use-projects";

export interface TaskCardProps {
  testId?: string;
  task: Task;
}

const TaskCard: FC<TaskCardProps> = ({ testId, task }): JSX.Element => {
  const { data: projects } = useProjects();
  return (
    <div data-testid={testId}>
      <div>{task.title}</div>
      <div>{projects.find((p) => p._id === task.projectId)?.title}</div>
      <div>{task.description}</div>
    </div>
  );
};

export default TaskCard;
