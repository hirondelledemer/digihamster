"use client"; // todo: rethink
import React, { FC } from "react";
import useTasks from "@/app/utils/hooks/use-tasks";
import { DataTable } from "./components/DataTable/DataTable";
import { getColumns } from "./components/columns";
import useProjects from "@/app/utils/hooks/use-projects";

export interface TasksProps {
  testId?: string;
}

const Tasks: FC<TasksProps> = ({ testId }): JSX.Element => {
  const { data: tasks } = useTasks();
  const { data: projects } = useProjects();

  const columns = getColumns(projects);
  return (
    <div className="h-full w-full p-6" data-testid={testId}>
      <DataTable data={tasks} columns={columns} />
    </div>
  );
};

export default Tasks;
