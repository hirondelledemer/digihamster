import React, { FC, ReactNode } from "react";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

export interface ProjectModalProps {
  testId?: string;
  open: boolean;
  onClose(): void;
  children: ReactNode;
}

const ProjectModal: FC<ProjectModalProps> = ({
  testId,
  open,
  onClose,
  children,
}): JSX.Element => {
  return (
    <div data-testid={testId}>
      <Sheet open={open}>
        <SheetContent
          side="left"
          onCloseClick={onClose}
          onEscapeKeyDown={onClose}
          aria-describedby="Project Form Modal"
        >
          <SheetHeader>
            <SheetTitle>Project</SheetTitle>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProjectModal;
