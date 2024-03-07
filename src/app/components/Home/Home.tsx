import React from "react";
import JournalEntryForm from "../JournalEntryForm";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import Calendar from "../Calendar";
import ActiveTaskList from "../ActiveTaskList";
import CommandTool from "../CommandTool";

export const Home = (): JSX.Element => {
  return (
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
      <ResizablePanel>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel>
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
        <div className="flex p-6 pb-12">
          <ActiveTaskList />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Home;
