import { useEventsByProject } from "@/app/utils/hooks/use-events/selectors";
import { useTasksForProject } from "@/app/utils/hooks/use-tasks/selectors";
import { EventStatus } from "@/app/utils/types/event";
import { IProject } from "@/app/utils/types/project";
import { TaskStatus } from "@/app/utils/types/task";
import { FC, useMemo } from "react";

export interface ProjectProgressBarProps {
  project: IProject;
}

export const ProjectProgressBar: FC<ProjectProgressBarProps> = ({
  project,
}) => {
  const tasks = useTasksForProject(project.id);
  const events = useEventsByProject(project.id);

  const allTasksCount = tasks.length + events.length;

  const activeTaskCount = useMemo(
    () =>
      tasks.filter((task) => task.status === TaskStatus.Doing).length +
      events.filter((e) => e.status === EventStatus.Pending).length,
    [tasks, events]
  );

  const completedTaskCount = useMemo(
    () =>
      tasks.filter((task) => task.status === TaskStatus.Done).length +
      events.filter((e) => e.status !== EventStatus.Pending).length,
    [tasks, events]
  );

  return (
    <div
      data-testid="progress-bar"
      className="w-full h-2"
      style={{
        border: `1px solid ${project.color}`,
        borderRadius: "3px",
      }}
    >
      <div
        data-testid="progress-bar-outer"
        style={{
          height: "100%",
          width: `${
            ((activeTaskCount + completedTaskCount) / allTasksCount) * 100
          }%`,
          background: `repeating-linear-gradient(135deg, ${project.color}, ${project.color} 2px, transparent 2px, transparent 4px)`,
        }}
      >
        <div
          data-testid="progress-bar-inner"
          style={{
            height: "100%",
            backgroundColor: project.color,

            width: `${
              (completedTaskCount / (activeTaskCount + completedTaskCount)) *
              100
            }%`,
          }}
        />
      </div>
    </div>
  );
};
