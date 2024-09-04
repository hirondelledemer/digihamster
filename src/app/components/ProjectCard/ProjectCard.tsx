import React, { FC, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Project } from "@/models/project";
import useTasks from "@/app/utils/hooks/use-tasks";
import { addEstimates } from "@/app/utils/tasks/estimates";

export interface ProjectCardProps {
  testId?: string;
  project: Project;
}

const ProjectCard: FC<ProjectCardProps> = ({
  testId,
  project,
}): JSX.Element => {
  const { data: tasks } = useTasks();

  const taskCount = useMemo(
    () => tasks.filter((t) => t.projectId === project._id).length,
    [tasks, project]
  );

  const completedTasksCount = useMemo(
    () =>
      tasks.filter((t) => t.projectId === project._id && !t.completed).length,
    [tasks, project._id]
  );

  const estimatedTaskCount = useMemo(
    () =>
      tasks.filter((t) => t.projectId === project._id && !!t.estimate).length,
    [project._id, tasks]
  );

  const completed = useMemo(
    () =>
      tasks.filter((t) => t.projectId === project._id && !t.completed)
        .length === 0,
    [tasks, project._id]
  );

  const completedTasksEta = useMemo(
    () =>
      tasks
        .filter((t) => t.projectId === project._id && t.completed)
        .reduce(addEstimates, 0),
    [tasks, project._id]
  );

  const totalTaskEta = useMemo(
    () =>
      tasks.filter((t) => t.projectId === project._id).reduce(addEstimates, 0),
    [tasks, project._id]
  );

  return (
    <Card
      data-testid={testId}
      className={`w-[350px] p-0 rounded-md ${
        completed ? "opacity-40 line-through" : ""
      }`}
    >
      <CardHeader className="p-4">
        <CardTitle className="font-normal flex items-center justify-between">
          <div>{project.title}</div>
          <div className="flex items-center text-xs">
            {completedTasksCount}/{taskCount}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-4 px-4 text-xs whitespace-pre-wrap muted">
        <div className="w-full border bg--secondary h-2 bg-[#3a3300]">
          <div
            style={{
              height: "100%",
              width: `${(estimatedTaskCount / taskCount) * 100}%`,
              backgroundColor: "#1b1917",
            }}
          >
            <div
              style={{
                height: "100%",
                backgroundColor: project.color,
                width: `${(completedTasksEta / totalTaskEta) * 100}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
