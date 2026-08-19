"use client";
import React, { FC, useState } from "react";

import { DataTable } from "../Tasks/components/DataTable/DataTable";
// import useTasks from "@/app/utils/hooks/use-tasks";
// import { useTagsState } from "@/app/utils/hooks/use-tags/state-context";
// import { TaskV2 } from "@/models/taskV2";
// import TaskFormModal from "../TaskFormModal";
import ProjectCard from "../ProjectCard";
import { Button } from "../ui/button";
import ProjectModalForm from "../ProjectModalForm";
import {
  arrayMove,
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
  DragEndEvent,
} from "@dnd-kit/core";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
// import ProjectBurnDownChart from "../ProjectBurnDownChart";
import { getColumns } from "./columns";
import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import { useProjectsActions } from "@/app/utils/hooks/use-projects/actions-context";
import { useTasksNewState } from "@/app/utils/hooks/use-tasks-new/state-context";
import CreateTaskForm from "../CreateTaskForm";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { ITask } from "@/app/utils/types/task";
import { Card, CardHeader, CardTitle } from "../ui/card";

const Projects: FC = (): JSX.Element => {
  const { data: projects, isLoading } = useProjectsState();
  const { updateOrder } = useProjectsActions();
  const { data: tasks } = useTasksNewState();

  const sortedProjects = projects.sort(
    (projectA, projectB) =>
      (projectA.sort_order || 0) - (projectB.sort_order || 0),
  );

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );

  const [enableSorting, setEnableSorting] = useState<boolean>(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const [openTaskForm, setOpenTaskForm] = useState<{
    open: boolean;
    selectedTask: ITask | null;
  }>({ selectedTask: null, open: false });
  const [openProjectForm, setOpenProjectForm] = useState<boolean>(false);

  const filteredTasks = tasks.filter((task) => {
    if (!selectedProjectId) {
      return !task.project_id;
    }
    return task.project_id === selectedProjectId;
  });
  const columns = getColumns(projects, []);

  const closeTaskForm = () => {
    setOpenTaskForm({ selectedTask: null, open: false });
  };
  const closeOpenProjectForm = () => {
    setOpenProjectForm(false);
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = projects.findIndex((project) => project.id === active.id);
    const newIndex = projects.findIndex((project) => project.id === over.id);
    const reordered = arrayMove(projects, oldIndex, newIndex);

    updateOrder(reordered.map((project) => project.id));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Sheet open={openTaskForm.open}>
        <SheetContent
          side="left"
          onCloseClick={closeTaskForm}
          onEscapeKeyDown={closeTaskForm}
          aria-describedby="Task Modal"
        >
          <SheetHeader>
            <SheetTitle>Create Task</SheetTitle>
          </SheetHeader>
          <CreateTaskForm
            onDone={closeTaskForm}
            projectId={selectedProjectId || undefined}
          />
        </SheetContent>
      </Sheet>

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
              items={sortedProjects}
              strategy={verticalListSortingStrategy}
              disabled={!enableSorting}
            >
              <div
                onClick={() => {
                  setSelectedProjectId(null);
                }}
              >
                <Card
                  className={`w-[350px] p-0 rounded-md hover:border hover:border-primary ${selectedProjectId === null && "border border-[#791027]"}`}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="font-normal flex items-center justify-between">
                      <div>No Project</div>
                      <div className="flex"></div>
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>
              {sortedProjects.map((project, index) => (
                <div
                  key={project.id}
                  onClick={() => {
                    setSelectedProjectId(project.id);
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
                    selected={project.id === selectedProjectId}
                  />
                </div>
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <div className="grow">
          {/* {selectedProjectId && (
            <ProjectBurnDownChart projectId={selectedProjectId} />
          )} */}
          <DataTable
            data={filteredTasks}
            columns={columns}
            onRowClick={(task: ITask) => {
              setOpenTaskForm({ selectedTask: task, open: true });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Projects;
