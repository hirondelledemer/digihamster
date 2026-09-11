import { ComponentType, ReactNode } from "react";

import { EntriesContextProvider } from "@/app/utils/hooks/use-entry/provider";
import { NotesContextProvider } from "@/app/utils/hooks/use-notes/provider";
import { EventsContextProvider } from "@/app/utils/hooks/use-events/provider";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";
import { TagsContextProvider } from "@/app/utils/hooks/use-tags/provider";
import { CycleContextProvider } from "@/app/utils/hooks/use-cycle";
import { TasksNewContextProvider } from "@/app/utils/hooks/use-tasks-new/provider";
import { DraggableTasksContextProvider } from "@/app/utils/hooks/use-draggable-tasks";
import { CalendarDateContextProvider } from "@/app/utils/hooks/use-calendar-date";
import { LifeAspectsContextProvider } from "@/app/utils/hooks/use-life-aspects/provider";
import { HabitsNewContextProvider } from "@/app/utils/hooks/use-habits-new/provider";
import { RelationshipsContextProvider } from "@/app/utils/hooks/use-relationships/provider";
import { TooltipProvider } from "../ui/tooltip";
import { PeopleContextProvider } from "@/app/utils/hooks/use-people/provider";

const PROVIDERS: ComponentType<{ children: ReactNode }>[] = [
  EntriesContextProvider,
  NotesContextProvider,
  EventsContextProvider,
  ProjectsContextProvider,
  TagsContextProvider,
  CycleContextProvider,
  TasksNewContextProvider,
  DraggableTasksContextProvider,
  CalendarDateContextProvider,
  LifeAspectsContextProvider,
  HabitsNewContextProvider,
  RelationshipsContextProvider,
  PeopleContextProvider,
  TooltipProvider,
];

export const HomeProviders = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {PROVIDERS.reduceRight<ReactNode>(
        (tree, Provider) => (
          <Provider>{tree}</Provider>
        ),
        children
      )}
    </>
  );
};

export default HomeProviders;
