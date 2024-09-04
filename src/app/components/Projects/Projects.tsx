"use client";
import React, { FC, useState } from "react";

import useProjects from "@/app/utils/hooks/use-projects";
import { DataTable } from "../Tasks/components/DataTable/DataTable";
import useTasks from "@/app/utils/hooks/use-tasks";
import { getColumns } from "../Tasks/components/columns";
import useTags from "@/app/utils/hooks/use-tags";
import { TaskV2 } from "@/models/taskV2";
import TaskFormModal from "../TaskFormModal";

export interface ProjectsProps {
  testId?: string;
}

const Projects: FC<ProjectsProps> = ({ testId }): JSX.Element => {
  const { data: projects, defaultProject } = useProjects();
  const { data: tasks } = useTasks();
  const { data: tags } = useTags();

  const [selectedProjectId, setSelectedProjectId] = useState(
    defaultProject?._id
  );
  const [selectedTask, setSelectedTask] = useState<TaskV2 | null>(null);

  const filteredTasks = tasks.filter(
    (task) => task.projectId === selectedProjectId && !task.completed
  );
  const columns = getColumns(projects, tags);

  const openTaskForm = (task: TaskV2) => {
    setSelectedTask(task);
  };

  const closeTaskForm = () => {
    setSelectedTask(null);
  };

  return (
    <div data-testid={testId}>
      {selectedTask && (
        <TaskFormModal
          onDone={closeTaskForm}
          onClose={closeTaskForm}
          editMode
          task={selectedTask}
          open={!!selectedTask}
        />
      )}

      <div className="flex p-4">
        <div>
          {projects
            .filter((project) => !project.deleted)
            .map((project) => (
              <div>
                <div
                  onClick={() => {
                    setSelectedProjectId(project._id);
                  }}
                >
                  {project.title}
                </div>
              </div>
            ))}
        </div>
        <div>
          <DataTable
            data={filteredTasks}
            columns={columns}
            onRowClick={openTaskForm}
          />
        </div>
      </div>
    </div>
  );
};

export default Projects;
