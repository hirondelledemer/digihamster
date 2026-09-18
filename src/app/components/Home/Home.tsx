import React, { Suspense } from "react";
import JournalEntryForm from "../JournalEntryForm";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import Calendar from "../Calendar";
import CommandTool from "../CommandTool";
import PinnedNotes from "../PinnedNotes";
import HealthChart from "../HealthChart";
import TaskInfo from "../TaskInfo";
import ProjectProgress from "../ProjectProgress";
import { Agent } from "../Agent";
import { ActiveContext } from "../ActiveContext";

export const Home = (): JSX.Element => {
  return (
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
      <Suspense>
        <TaskInfo />
      </Suspense>
      <ResizablePanel>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel style={{ overflow: "auto" }}>
            <CommandTool />
            <div className="p-6">
              <Calendar view={"day"} />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={30}>
            <div className="m-6">
              <JournalEntryForm />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <div className="flex h-screen gap-4">
          <div className="flex flex-col p-6 pb-12 w-[400px]">
            <Suspense>
              <ActiveContext />
            </Suspense>
          </div>

          <div className="flex p-6 pl-0 pb-12 flex-col grow gap-4">
            <Agent />
            <ProjectProgress />
            <div className="max-h-[400px] overflow-auto p-[1px]">
              <PinnedNotes />
            </div>
            <HealthChart />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Home;
