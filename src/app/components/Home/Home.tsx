import React from "react";
import JournalEntryForm from "../JournalEntryForm";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import Calendar from "../Calendar";

export const Home = (): JSX.Element => {
  return (
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
      <ResizablePanel>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel style={{ overflow: "auto" }}>
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
        <div className="flex h-[200px] items-center justify-center p-6">
          here
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Home;
