import React, { Suspense } from "react";
import JournalEntryForm from "../JournalEntryForm";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import Calendar from "../Calendar";
import CommandTool from "../CommandTool";
import TaskInfo from "../TaskInfo";
import { ActiveContext } from "../ActiveContext";
import { ActiveSecondaryContext } from "../ActiveContext/ActiveSecondaryContext";

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
        <div className="flex h-screen">
          <div className="p-6 pb-12 w-[50%]">
            <Suspense>
              <ActiveContext />
            </Suspense>
          </div>

          <div className="p-6 pb-12 w-[50%]">
            {/* <Suspense>
              <ActiveSecondaryContext />
            </Suspense> */}
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Home;
