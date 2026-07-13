import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { TableCell, TableRow } from "@/app/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/app/components/ui/toggle-group";
import { cn } from "@/app/components/utils";
import { useLifeAspectsState } from "@/app/utils/hooks/use-life-aspects/state-context";
import { useProjectsActions } from "@/app/utils/hooks/use-projects/actions-context";
import { IProject, ProjectStatus } from "@/app/utils/types/project";
import React, { FC, useRef, useState } from "react";

interface ProjectRowProps {
  project: IProject;
  selected: boolean;
  onSelect: (id: number) => void;
}

export const ProjectRow: FC<ProjectRowProps> = ({
  project,
  selected,
  onSelect,
}) => {
  const { update, delete: deleteProject } = useProjectsActions();
  const { data: lifeAspects, isLoading: isLifeAspectsLoading } =
    useLifeAspectsState();
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

  if (isLifeAspectsLoading) {
    return "loading...";
  }

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
        {lifeAspects.find((la) => la.id === project.life_aspect_id)?.title}
      </TableCell>
      <TableCell className="py-1">
        <ToggleGroup
          type="single"
          value={project.status}
          onClick={(e) => e.stopPropagation()}
          onValueChange={(status: ProjectStatus) =>
            update(project.id.toString(), { status })
          }
        >
          <ToggleGroupItem value={ProjectStatus.Todo}>Todo</ToggleGroupItem>
          <ToggleGroupItem value={ProjectStatus.Doing}>
            In Progress
          </ToggleGroupItem>
          <ToggleGroupItem value={ProjectStatus.Done}>Done</ToggleGroupItem>
          <ToggleGroupItem value={ProjectStatus.Cancelled}>
            Canceled
          </ToggleGroupItem>
        </ToggleGroup>
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
