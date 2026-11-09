"use client";
import React from "react";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";
import { LifeAspectsContextProvider } from "@/app/utils/hooks/use-life-aspects/provider";
import { TasksContextProvider } from "@/app/utils/hooks/use-tasks/provider";
import CommandTool from "../components/CommandTool";
import Projects from "../components/Projects";
import { LocationsContextProvider } from "../utils/hooks/use-location/provider";
import { RelationshipsContextProvider } from "../utils/hooks/use-relationships/provider";

export default function ProjectsNewPage() {
  return (
    <ProjectsContextProvider>
      <LifeAspectsContextProvider>
        <TasksContextProvider>
          <LocationsContextProvider>
            <RelationshipsContextProvider>
              <CommandTool />
              <Projects />
            </RelationshipsContextProvider>
          </LocationsContextProvider>
        </TasksContextProvider>
      </LifeAspectsContextProvider>
    </ProjectsContextProvider>
  );
}
