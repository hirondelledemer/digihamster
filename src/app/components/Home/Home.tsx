import React, { Suspense } from "react";
import JournalEntryForm from "../JournalEntryForm";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import Calendar from "../Calendar";
import ActiveTaskList from "../ActiveTaskList";
import CommandTool from "../CommandTool";
import PinnedNotes from "../PinnedNotes";
import HealthChart from "../HealthChart";
import DailyProgress from "../DailyProgress";
import TaskInfo from "../TaskInfo";
import ProjectProgress from "../ProjectProgress";

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
              <Calendar view={"agenda"} />
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
            <ProjectProgress />
            <ActiveTaskList />
          </div>
          <div className="flex p-6 pl-0 pb-12 flex-col grow">
            <div className="min-h-16 mb-4 overflow-auto p-[1px]">
              <DailyProgress />
            </div>
            <div className="max-h-[400px] mb-4 overflow-auto p-[1px]">
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
