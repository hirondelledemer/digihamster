"use client";
import React, { FC, useState } from "react";

import { DataTable } from "../Tasks/components/DataTable/DataTable";
import useTasks from "@/app/utils/hooks/use-tasks";
import useTags from "@/app/utils/hooks/use-tags";
import { TaskV2 } from "@/models/taskV2";
import TaskFormModal from "../TaskFormModal";
import ProjectCard from "../ProjectCard";
import { Button } from "../ui/button";
import ProjectModalForm from "../ProjectModalForm";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import ProjectBurnDownChart from "../ProjectBurnDownChart";
import { getColumns } from "./columns";
import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import { useProjectsActions } from "@/app/utils/hooks/use-projects/actions-context";

export interface ProjectsProps {
  testId?: string;
}

const Projects: FC<ProjectsProps> = ({ testId }): JSX.Element => {
  const { data: projects, defaultProject, isLoading } = useProjectsState();
  const { updateOrder } = useProjectsActions();
  const { data: tasks } = useTasks();
  const { data: tags } = useTags();

  const [selectedProjectId, setSelectedProjectId] = useState(
    defaultProject?._id
  );

  const [enableSorting, setEnableSorting] = useState<boolean>(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      updateOrder(active.id, over.id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
      <div className="flex p-4 space-x-6 justify-stretch">
        <div className="space-y-2">
          <div className="space-x-2 flex items-center">
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
            <Label>Sort:</Label>
            <Switch
              checked={enableSorting}
              onCheckedChange={setEnableSorting}
            />
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={projects.map((p) => ({ ...p, id: p._id }))}
              strategy={verticalListSortingStrategy}
              disabled={!enableSorting}
            >
              {projects.map((project, index) => (
                <div
                  key={project._id}
                  onClick={() => {
                    setSelectedProjectId(project._id);
                  }}
                  className={
                    enableSorting
                      ? index % 2 === 0
                        ? "animate-wiggle cursor-grab"
                        : "animate-wiggle2 cursor-grab"
                      : ""
                  }
                >
                  <ProjectCard
                    project={project}
                    selected={project._id === selectedProjectId}
                  />
                </div>
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <div className="grow">
          {selectedProjectId && (
            <ProjectBurnDownChart projectId={selectedProjectId} />
          )}
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
