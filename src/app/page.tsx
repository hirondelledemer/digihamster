import { Home as HomeComp } from "./components/Home/Home";
import { EntriesContextProvider } from "./utils/hooks/use-entry";

import { TagsContextProvider } from "./utils/hooks/use-tags";

import { TasksContextProvider } from "./utils/hooks/use-tasks";
import { DraggableTasksContextProvider } from "./utils/hooks/use-draggable-tasks";
import { CycleContextProvider } from "./utils/hooks/use-cycle";
import { EventsContextProvider } from "./utils/hooks/use-events/provider";
import { CalendarDateContextProvider } from "./utils/hooks/use-calendar-date";
import { ProjectsContextProvider } from "./utils/hooks/use-projects/provider";
import { NotesContextProvider } from "./utils/hooks/use-notes/provider";
import { LifeAspectsContextProvider } from "./utils/hooks/use-life-aspects/provider";
import { HabitsNewContextProvider } from "./utils/hooks/use-habits-new/provider";

export default function HomePage() {
  return (
    <EntriesContextProvider>
      <NotesContextProvider>
        <EventsContextProvider>
          <ProjectsContextProvider>
            <TagsContextProvider>
              <TasksContextProvider>
                <CycleContextProvider>
                  <DraggableTasksContextProvider>
                    <CalendarDateContextProvider>
                      <LifeAspectsContextProvider>
                        <HabitsNewContextProvider>
                          <HomeComp />
                        </HabitsNewContextProvider>
                      </LifeAspectsContextProvider>
                    </CalendarDateContextProvider>
                  </DraggableTasksContextProvider>
                </CycleContextProvider>
              </TasksContextProvider>
            </TagsContextProvider>
          </ProjectsContextProvider>
        </EventsContextProvider>
      </NotesContextProvider>
    </EntriesContextProvider>
  );
}
