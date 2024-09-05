import React, { FC, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Project } from "@/models/project";
import useTasks from "@/app/utils/hooks/use-tasks";
import { addEstimates } from "@/app/utils/tasks/estimates";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import ProjectModalForm from "../ProjectModalForm";

export interface ProjectCardProps {
  testId?: string;
  project: Project;
  selected: boolean;
}

const ProjectCard: FC<ProjectCardProps> = ({
  testId,
  project,
  selected,
}): JSX.Element => {
  const { data: tasks } = useTasks();
  const [projectModalOpen, setProjectModalOpen] = useState<boolean>(false);

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

  const closeProjectForm = () => setProjectModalOpen(false);
  return (
    <div data-testid={testId}>
      <ProjectModalForm
        editMode
        open={projectModalOpen}
        onDone={closeProjectForm}
        onClose={closeProjectForm}
        project={project}
      />
      <ContextMenu>
        <ContextMenuTrigger>
          <Card
            className={`w-[350px] p-0 rounded-md hover:border hover:border-primary ${
              completed ? "opacity-40 line-through" : ""
            } ${selected && "border border-[#791027]"}`}
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
              <div className="w-full border bg--secondary h-2 bg-[#22040b]">
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
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem inset onClick={() => setProjectModalOpen(true)}>
            Edit
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export default ProjectCard;
