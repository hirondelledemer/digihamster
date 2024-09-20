import React, { FC } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Project } from "@/models/project";

export interface ProjectsListProps {
  testId?: string;
  projects: Project[];
  onSelect(id: string): void;
  selected?: string;
}

const ProjectsList: FC<ProjectsListProps> = ({
  testId,
  projects,
  onSelect,
  selected,
}): JSX.Element => {
  return (
    <div data-testid={testId}>
      {projects.map((project) => (
        <Card
          key={project._id}
          className={`w-[350px] p-0 rounded-md ${
            selected ? "border-red-200" : ""
          }`}
          onClick={() => onSelect(project._id)}
        >
          <CardHeader className="p-4">
            <CardTitle className="font-normal">{project.title}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default ProjectsList;
