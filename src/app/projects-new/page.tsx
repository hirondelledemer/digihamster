"use client";
import React, { FC, useRef, useState } from "react";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";
import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import { useProjectsActions } from "@/app/utils/hooks/use-projects/actions-context";
import { LifeAspectsContextProvider } from "@/app/utils/hooks/use-life-aspects/provider";
import { useLifeAspectsState } from "@/app/utils/hooks/use-life-aspects/state-context";
import { TasksNewContextProvider } from "@/app/utils/hooks/use-tasks-new/provider";
import { useTasksNewState } from "@/app/utils/hooks/use-tasks-new/state-context";
import { useTasksNewActions } from "@/app/utils/hooks/use-tasks-new/actions-context";
import { Project } from "@/models/project";
import { TaskV2 } from "@/models/taskV2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Switch } from "@/app/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { colors } from "@/app/components/ProjectForm/ProjectForm.consts";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/app/components/utils";

// ─── Task components ──────────────────────────────────────────────────────────

interface TaskRowProps {
  task: TaskV2;
}

const STATUS_CYCLE: TaskV2["status"][] = ["todo", "doing", "done", "cancelled"];

const TaskRow: FC<TaskRowProps> = ({ task }) => {
  const { updateTask, deleteTask } = useTasksNewActions();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEditStart = () => {
    setEditTitle(task.title);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleEditSave = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== task.title) {
      updateTask(task.id, { title: trimmed });
    }
    setEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleEditSave();
    if (e.key === "Escape") setEditing(false);
  };

  const cycleStatus = () => {
    const next =
      STATUS_CYCLE[
        (STATUS_CYCLE.indexOf(task.status) + 1) % STATUS_CYCLE.length
      ];
    updateTask(task.id, { status: next });
  };

  const statusVariant: Record<
    TaskV2["status"],
    "default" | "secondary" | "outline" | "destructive"
  > = {
    todo: "outline",
    doing: "secondary",
    done: "default",
    cancelled: "destructive",
  };

  return (
    <TableRow
      className={cn(
        task.status === "done" && "opacity-50",
        task.status === "cancelled" && "opacity-30 line-through",
      )}
    >
      <TableCell className="py-1">
        {editing ? (
          <Input
            ref={inputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleEditSave}
            onKeyDown={handleEditKeyDown}
            className="h-7 py-0 px-2"
          />
        ) : (
          task.title
        )}
      </TableCell>
      <TableCell className="py-1">
        <button onClick={cycleStatus}>
          <Badge variant={statusVariant[task.status]}>{task.status}</Badge>
        </button>
      </TableCell>
      <TableCell className="py-1 text-right">
        <div className="flex gap-1 justify-end">
          <Button size="sm" variant="outline" onClick={handleEditStart}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => deleteTask(task.id)}
          >
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

interface TasksPanelProps {
  project: Project;
}

const TasksPanel: FC<TasksPanelProps> = ({ project }) => {
  const { data: tasks, isLoading } = useTasksNewState();
  const { createTask } = useTasksNewActions();
  const [title, setTitle] = useState("");

  const projectTasks = tasks.filter((t) => t.project_id === project.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    createTask({ title: trimmed, project_id: project.id });
    setTitle("");
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">
        Tasks — <span style={{ color: project.color }}>{project.title}</span>
      </h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <Input
          placeholder="New task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="max-w-sm"
        />
        <Button type="submit" disabled={!title.trim()}>
          Add task
        </Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={3}>Loading…</TableCell>
            </TableRow>
          )}
          {!isLoading && projectTasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-muted-foreground">
                No tasks yet.
              </TableCell>
            </TableRow>
          )}
          {projectTasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// ─── Project components ───────────────────────────────────────────────────────

interface ProjectRowProps {
  project: Project;
  selected: boolean;
  onSelect: (id: number) => void;
}

const ProjectRow: FC<ProjectRowProps> = ({ project, selected, onSelect }) => {
  const { update, delete: deleteProject } = useProjectsActions();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(project.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEditStart = () => {
    setEditTitle(project.title);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleEditSave = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== project.title) {
      update(project.id.toString(), { title: trimmed });
    }
    setEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleEditSave();
    if (e.key === "Escape") setEditing(false);
  };

  return (
    <TableRow
      className={cn("cursor-pointer", selected && "bg-muted")}
      onClick={() => onSelect(project.id)}
    >
      <TableCell className="py-1">
        <div
          className="w-5 h-5 rounded-full border border-border"
          style={{ backgroundColor: project.color }}
        />
      </TableCell>
      <TableCell className="py-1">
        {editing ? (
          <Input
            ref={inputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleEditSave}
            onKeyDown={handleEditKeyDown}
            className="h-7 py-0 px-2"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          project.title
        )}
      </TableCell>
      <TableCell className="py-1 text-muted-foreground">
        {project.life_aspect_id}
      </TableCell>
      <TableCell className="py-1">
        <Switch
          checked={!project.disabled}
          onCheckedChange={(checked) =>
            update(project.id.toString(), { disabled: !checked })
          }
          onClick={(e) => e.stopPropagation()}
        />
      </TableCell>
      <TableCell className="py-1 text-right">
        <div className="flex gap-1 justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleEditStart();
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              deleteProject(project.id.toString());
            }}
          >
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

const NewProjectForm: FC = () => {
  const { create } = useProjectsActions();
  const { data: lifeAspects } = useLifeAspectsState();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState(colors[0]);

  const canSubmit = title.trim().length > 0 && category !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    create({
      title: title.trim(),
      life_aspect_id: Number(category),
      color,
    });
    setTitle("");
    setCategory("");
    setColor(colors[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-4">
      <Input
        placeholder="Project title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="max-w-xs"
      />
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Life aspect" />
        </SelectTrigger>
        <SelectContent>
          {lifeAspects.map((la) => (
            <SelectItem key={la.id} value={la.id.toString()}>
              {la.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex gap-1 items-center">
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
            style={{
              backgroundColor: c,
              borderColor: color === c ? "white" : "transparent",
            }}
          />
        ))}
      </div>
      <Button type="submit" disabled={!canSubmit}>
        Add
      </Button>
    </form>
  );
};

const ProjectsNewTable: FC = () => {
  const { data = [], isLoading } = useProjectsState();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );

  const selectedProject = data.find((p) => p.id === selectedProjectId) ?? null;

  return (
    <div className="p-4">
      <NewProjectForm />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">Color</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={5}>Loading…</TableCell>
            </TableRow>
          )}
          {data
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                selected={project.id === selectedProjectId}
                onSelect={(id) =>
                  setSelectedProjectId((prev) => (prev === id ? null : id))
                }
              />
            ))}
        </TableBody>
      </Table>

      {selectedProject && <TasksPanel project={selectedProject} />}
    </div>
  );
};

export default function ProjectsNewPage() {
  return (
    <ProjectsContextProvider>
      <LifeAspectsContextProvider>
        <TasksNewContextProvider>
          <ProjectsNewTable />
        </TasksNewContextProvider>
      </LifeAspectsContextProvider>
    </ProjectsContextProvider>
  );
}
