"use client"; // todo: rethink
import React, { FC, useState } from "react";
import useTasks from "@/app/utils/hooks/use-tasks";
import { DataTable } from "./components/DataTable/DataTable";
import { getColumns } from "./components/columns";
import useProjects from "@/app/utils/hooks/use-projects";
import { TaskV2 } from "@/models/taskV2";
import useEditTask from "@/app/utils/hooks/use-edit-task";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import TaskForm from "../TaskForm";
import { FormValues } from "../TaskForm/TaskForm";

export interface TasksProps {
  testId?: string;
}

const Tasks: FC<TasksProps> = ({ testId }): JSX.Element => {
  const { data: tasks } = useTasks();
  const { data: projects } = useProjects();
  const [selectedTask, setSelectedTask] = useState<TaskV2 | null>(null);
  const { editTask } = useEditTask();

  const openTaskForm = (task: TaskV2) => {
    setSelectedTask(task);
  };

  const closeTaskForm = () => {
    setSelectedTask(null);
  };

  const columns = getColumns(projects);
  return (
    <div className="h-full w-full p-6" data-testid={testId}>
      <Sheet open={selectedTask !== null}>
        <SheetContent
          side="left"
          onCloseClick={closeTaskForm}
          onEscapeKeyDown={closeTaskForm}
        >
          <SheetHeader>
            <SheetTitle>Edit Task</SheetTitle>
            <SheetDescription>
              <TaskForm
                onSubmit={(data: FormValues) =>
                  selectedTask &&
                  editTask(
                    selectedTask._id,
                    {
                      title: data.title,
                      description: data.description,
                      estimate: data.eta,
                      projectId: data.project,
                      deadline: data.deadline,
                    },
                    closeTaskForm
                  )
                }
                initialValues={
                  selectedTask
                    ? {
                        title: selectedTask.title || "",
                        description: selectedTask.description || "",
                        eta: selectedTask.estimate || 0,
                        project: selectedTask.projectId || undefined,
                        deadline: selectedTask.deadline,
                      }
                    : {}
                }
              />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <DataTable data={tasks} columns={columns} onRowClick={openTaskForm} />
    </div>
  );
};

export default Tasks;
