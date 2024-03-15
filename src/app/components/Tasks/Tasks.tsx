"use client"; // todo: rethink
import React, { FC, useState } from "react";
import style from "./Tasks.module.scss";
import TasksList from "../TasksList";
import useProjects from "@/app/utils/hooks/use-projects";
import ProjectsList from "../ProjectsList";
import useTasks from "@/app/utils/hooks/use-tasks";

export interface TasksProps {
  testId?: string;
}

const Tasks: FC<TasksProps> = ({ testId }): JSX.Element => {
  const { data: projects, defaultProject } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | undefined
  >(defaultProject?._id);
  const { data: tasks } = useTasks();

  const tasksToShow = tasks.filter(
    (task) => task.projectId === selectedProjectId
  );
  return (
    <div className="h-full w-full p-6">
      <div data-testid={testId} className="grid grid-cols-4">
        <div className="col-span-1">
          <ProjectsList
            projects={projects}
            onSelect={setSelectedProjectId}
            selected={selectedProjectId}
          />
        </div>
        <div className="col-span-3">
          <TasksList data={tasksToShow} />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
