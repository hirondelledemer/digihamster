import React, { FC } from "react";
import ProjectModal from "../ProjectModal";
import ProjectForm from "../ProjectForm";
import { ProjectModalProps } from "../ProjectModal/ProjectModal";
import { ProjectFormProps } from "../ProjectForm/ProjectForm";

export type ProjectModalFormProps = Omit<ProjectModalProps, "children"> &
  ProjectFormProps;

const ProjectModalForm: FC<ProjectModalFormProps> = ({
  testId,
  open,
  onClose,
  ...projectFormProps
}): JSX.Element => {
  return (
    <div data-testid={testId}>
      <ProjectModal open={open} onClose={onClose}>
        <ProjectForm {...projectFormProps} />
      </ProjectModal>
    </div>
  );
};

export default ProjectModalForm;
