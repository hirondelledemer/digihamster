"use client";
import React, { FC, useMemo, useState } from "react";

import useProjects from "@/app/utils/hooks/use-projects";
import { DataTable } from "../Tasks/components/DataTable/DataTable";
import useTasks from "@/app/utils/hooks/use-tasks";
import { getColumns } from "../Tasks/components/columns";
import useTags from "@/app/utils/hooks/use-tags";
import { TaskV2 } from "@/models/taskV2";
import TaskFormModal from "../TaskFormModal";
import ProjectCard from "../ProjectCard";
import { Button } from "../ui/button";
import ProjectModalForm from "../ProjectModalForm";

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
  const [openTaskForm, setOpenTaskForm] = useState<{
    open: boolean;
    selectedTask: TaskV2 | null;
  }>({ selectedTask: null, open: false });
  const [openProjectForm, setOpenProjectForm] = useState<boolean>(false);

  const filteredTasks = tasks.filter(
    (task) => task.projectId === selectedProjectId && !task.completed
  );
  const columns = getColumns(projects, tags);

  const closeTaskForm = () => {
    setOpenTaskForm({ selectedTask: null, open: false });
  };
  const closeOpenProjectForm = () => {
    setOpenProjectForm(false);
  };

  const sortedProjects = useMemo(
    () =>
      projects.sort((a) =>
        tasks.filter((t) => !t.completed && t.projectId === a._id).length > 0
          ? -1
          : 1
      ),
    [projects, tasks]
  );

  return (
    <div data-testid={testId}>
      <TaskFormModal
        onDone={closeTaskForm}
        onClose={closeTaskForm}
        editMode={!!openTaskForm.selectedTask}
        task={
          !!openTaskForm.selectedTask
            ? openTaskForm.selectedTask
            : (null as any)
        }
        initialValues={{ project: selectedProjectId }}
        open={openTaskForm.open}
      />

      <ProjectModalForm
        onDone={closeOpenProjectForm}
        onClose={closeOpenProjectForm}
        open={openProjectForm}
      />
      <div className="flex p-4 space-x-6">
        <div className="space-y-2">
          <div className="space-x-2">
            <Button onClick={() => setOpenProjectForm(true)}>
              Create Project
            </Button>
            <Button
              onClick={() =>
                setOpenTaskForm({ open: true, selectedTask: null })
              }
            >
              Create Task
            </Button>
          </div>
          {sortedProjects.map((project) => (
            <div
              key={project._id}
              onClick={() => {
                setSelectedProjectId(project._id);
              }}
            >
              <ProjectCard
                project={project}
                selected={project._id === selectedProjectId}
              />
            </div>
          ))}
        </div>
        <div>
          <DataTable
            data={filteredTasks}
            columns={columns}
            onRowClick={(task: TaskV2) => {
              setOpenTaskForm({ selectedTask: task, open: true });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Projects;
