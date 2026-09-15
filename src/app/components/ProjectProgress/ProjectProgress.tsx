"use client";
import React, { FC } from "react";
import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import { ProjectStatus } from "@/app/utils/types/project";
import { useRouter } from "next/navigation";
import ProjectCard from "../ProjectCard";

const ProjectProgress: FC = (): JSX.Element => {
  const { data: projects } = useProjectsState();
  const router = useRouter();

  const activeProjects = projects
    .filter((project) => project.status === ProjectStatus.Doing)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex flex-col gap-3">
      {activeProjects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          selected={false}
          onClick={() => router.push(`/?projectId=${project.id}`, undefined)}
        />
      ))}
    </div>
  );
};

export default ProjectProgress;
