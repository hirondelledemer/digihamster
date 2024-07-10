"use client"; // todo: rethink
import React, { FC } from "react";
import useTasks from "@/app/utils/hooks/use-tasks";
import { DataTable } from "./components/DataTable/DataTable";
import { columns } from "./components/columns";

export interface TasksProps {
  testId?: string;
}

const Tasks: FC<TasksProps> = ({ testId }): JSX.Element => {
  const { data: tasks } = useTasks();

  return (
    <div className="h-full w-full p-6" data-testid={testId}>
      <DataTable data={tasks} columns={columns} />
    </div>
  );
};

export default Tasks;
