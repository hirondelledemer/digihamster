import React, { FC, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import ProjectModalForm from "../ProjectModalForm";
import { IconCircleCheck, IconXboxX } from "@tabler/icons-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IProject, ProjectStatus } from "@/app/utils/types/project";
import { useTasksNewState } from "@/app/utils/hooks/use-tasks-new/state-context";
import { TaskStatus } from "@/app/utils/types/task";
import { ProjectProgressBar } from "../ProjectProgressBar";

export interface ProjectCardProps {
  testId?: string;
  project: IProject;
  selected: boolean;
}

const ProjectCard: FC<ProjectCardProps> = ({
  testId,
  project,
  selected,
}): JSX.Element => {
  const { data: tasks } = useTasksNewState();

  const [projectModalOpen, setProjectModalOpen] = useState<boolean>(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const taskCount = useMemo(
    () => tasks.filter((t) => t.project_id === project.id).length,
    [tasks, project],
  );

  const completedTasksCount = useMemo(
    () =>
      tasks.filter(
        (t) => t.project_id === project.id && t.status === TaskStatus.Done,
      ).length,
    [tasks, project.id],
  );

  const completed = useMemo(
    () =>
      tasks.filter(
        (t) => t.project_id === project.id && t.status !== TaskStatus.Done,
      ).length === 0,
    [tasks, project],
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
              project.status === ProjectStatus.Cancelled
                ? "opacity-40 line-through"
                : ""
            } ${selected && "border border-[#791027]"}`}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
          >
            <CardHeader className="p-4">
              <CardTitle className="font-normal flex items-center justify-between">
                <div>{project.title}</div>
                <div className="flex">
                  {completed && (
                    <IconCircleCheck
                      data-testid="completed-icon"
                      size={19}
                      color="black"
                      fill={project.color}
                      className="mr-1"
                    />
                  )}
                  {!completed && project.status !== ProjectStatus.Cancelled && (
                    <div className="flex items-center text-xs">
                      {completedTasksCount}/{taskCount}
                    </div>
                  )}
                  {project.status === ProjectStatus.Cancelled && (
                    <IconXboxX
                      data-testid="disabled-icon"
                      size={19}
                      color="black"
                      fill={project.color}
                      className="mr-1"
                    />
                  )}
                </div>
              </CardTitle>
            </CardHeader>

            {project.status === ProjectStatus.Doing && (
              <CardContent>
                <ProjectProgressBar project={project} />
              </CardContent>
            )}
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
