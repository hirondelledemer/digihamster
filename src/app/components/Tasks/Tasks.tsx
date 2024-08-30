"use client"; // todo: rethink
import React, { FC, useState } from "react";
import useTasks from "@/app/utils/hooks/use-tasks";
import { DataTable } from "./components/DataTable/DataTable";
import { getColumns } from "./components/columns";
import useProjects from "@/app/utils/hooks/use-projects";
import { TaskV2 } from "@/models/taskV2";

import useTags from "@/app/utils/hooks/use-tags";
import TaskFormModal from "../TaskFormModal";

export interface TasksProps {
  testId?: string;
}

const Tasks: FC<TasksProps> = ({ testId }): JSX.Element => {
  const { data: tasks } = useTasks();
  const { data: projects } = useProjects();
  const { data: tags } = useTags();
  const [selectedTask, setSelectedTask] = useState<TaskV2 | null>(null);

  const notCompletedTasks = tasks.filter((task) => !task.completed);

  const activeTasks = notCompletedTasks.filter((task) => task.isActive);
  const restTasks = notCompletedTasks.filter((task) => !task.isActive);

  const openTaskForm = (task: TaskV2) => {
    setSelectedTask(task);
  };

  const closeTaskForm = () => {
    setSelectedTask(null);
  };

  const columns = getColumns(projects, tags);
  return (
    <div className="h-full w-full p-6" data-testid={testId}>
      {selectedTask && (
        <TaskFormModal
          onDone={closeTaskForm}
          onClose={closeTaskForm}
          editMode
          task={selectedTask}
          open={!!selectedTask}
        />
      )}

      <div className="mb-12">
        <DataTable
          data={activeTasks}
          columns={columns}
          onRowClick={openTaskForm}
          disablePagination
          disableSorting
          disableToolbar
        />
      </div>
      <DataTable data={restTasks} columns={columns} onRowClick={openTaskForm} />
    </div>
  );
};

export default Tasks;
