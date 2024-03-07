import React, { FC } from "react";
import { Task } from "@/models/task";
import useProjects from "@/app/utils/hooks/use-projects";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export interface TaskCardProps {
  testId?: string;
  className?: string;
  task: Task;
}

const TaskCard: FC<TaskCardProps> = ({
  testId,
  task,
  className,
}): JSX.Element => {
  const { data: projects } = useProjects();
  const project = projects.find((p) => p._id === task.projectId);
  return (
    <div data-testid={testId} className={className}>
      <Card className="w-[350px] p-0 rounded-md">
        <CardHeader className="p-4">
          <CardTitle>{task.title}</CardTitle>
          <CardDescription>
            <div style={{ color: project?.color }}>{project?.title}</div>
          </CardDescription>
        </CardHeader>
        {task.description && <CardContent>{task.description}</CardContent>}
      </Card>
    </div>
  );
};

export default TaskCard;