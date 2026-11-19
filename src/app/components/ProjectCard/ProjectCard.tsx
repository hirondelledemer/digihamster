import React, { FC, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import ProjectModalForm from "../ProjectModalForm";
import {
  IconArrowRightCircleFilled,
  IconCalendar,
  IconCircleCheck,
  IconProgressCheck,
  IconXboxX,
} from "@tabler/icons-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IProject, ProjectStatus } from "@/app/utils/types/project";
import { TaskStatus } from "@/app/utils/types/task";
import { ProjectProgressBar } from "../ProjectProgressBar";
import { useProjectLifeAspectAssetIcon } from "@/app/utils/hooks/use-life-aspects/selectors";
import { useTasksForProject } from "@/app/utils/hooks/use-tasks/selectors";
import { useEventsByProject } from "@/app/utils/hooks/use-events/selectors";
import { EventStatus } from "@/app/utils/types/event";

export interface ProjectCardProps {
  testId?: string;
  project: IProject;
  selected?: boolean;
  onClick?(): void;
}

const ProjectCard: FC<ProjectCardProps> = ({
  testId,
  project,
  selected,
  onClick,
}): JSX.Element => {
  const tasks = useTasksForProject(project.id);
  const events = useEventsByProject(project.id);

  const assetIcon = useProjectLifeAspectAssetIcon(project);

  const [projectModalOpen, setProjectModalOpen] = useState<boolean>(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const taskCount = tasks.length;

  const eventsCount = events.length;

  const allTasksCount = tasks.length + events.length;

  const activeTasksCount = useMemo(
    () =>
      tasks.filter((task) => task.status === TaskStatus.Doing).length +
      events.filter((e) => e.status === EventStatus.Pending).length,
    [tasks, events]
  );

  const completedTasksCount = useMemo(
    () => tasks.filter((task) => task.status === TaskStatus.Done).length,
    [tasks]
  );

  const completedEventsCount = useMemo(
    () => events.filter((e) => e.status !== EventStatus.Pending).length,
    [events]
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
            <CardHeader className="pb-1 pt-3 px-3" onClick={onClick}>
              <CardTitle
                className="font-normal flex items-center justify-between"
                style={{ color: project?.color }}
              >
                <div className="text-xs uppercase flex items-center justify-between">
                  {assetIcon} {project.title}
                </div>
                <div className="flex">
                  {project.status === ProjectStatus.Done && (
                    <IconCircleCheck
                      data-testid="completed-icon"
                      size={19}
                      color="black"
                      fill={project.color}
                      className="mr-1"
                    />
                  )}
                  {project.status === ProjectStatus.Doing && (
                    <div className="flex items-center text-xs gap-2">
                      {!!eventsCount && (
                        <div className="flex gap-1 items-center">
                          <IconCalendar size={12} />
                          {completedEventsCount}/{eventsCount}
                        </div>
                      )}
                      <div className="flex gap-1 items-center">
                        <IconProgressCheck size={12} />
                        {completedTasksCount}/{taskCount}
                      </div>
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
                  {project.status === ProjectStatus.Todo && (
                    <IconArrowRightCircleFilled
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
              <CardContent className="pb-3 px-3">
                <ProjectProgressBar
                  project={project}
                  completedCount={completedTasksCount + completedEventsCount}
                  allCount={allTasksCount}
                  activeCount={activeTasksCount}
                />
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
