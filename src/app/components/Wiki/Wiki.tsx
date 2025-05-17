"use client";
import React, { Suspense } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";

import CommandTool from "../CommandTool";

import TaskInfo from "../TaskInfo";

export const Wiki = (): JSX.Element => {
  return (
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
      <Suspense>
        <TaskInfo />
      </Suspense>
      <ResizablePanel>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel style={{ overflow: "auto" }}>
            <CommandTool />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={30}>journal</ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <iframe
          src="https://digihamster-wiki.vercel.app/wiki.html"
          style={{ width: "100%", height: "100vh" }}
          title="Private Wiki"
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Wiki;
