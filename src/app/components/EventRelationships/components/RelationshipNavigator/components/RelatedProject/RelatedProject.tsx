import { useNavigator } from "@/app/components/EventRelationships/navigator-context";
import { useProjectById } from "@/app/utils/hooks/use-projects/selectors";
import { useRelevantRelationshipsForEntity } from "@/app/utils/hooks/use-relationships/selectors";
import { useFirstTaskForTheProject } from "@/app/utils/hooks/use-tasks/selectors";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { IconCheckbox } from "@tabler/icons-react";
import { FC } from "react";
import { EntityTypeIcon } from "../../../EntityTypeIcon";
import TaskCard from "@/app/components/TaskCard";
import { ProjectSwitchableTask } from "../RelatedLocation/components/ProjectSwitchableTask";

export const RelatedProject: FC<{ id: number; compact: boolean }> = ({
  id,
  compact,
}) => {
  const project = useProjectById(id);
  const relationships = useRelevantRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Project,
  });

  // const task = useFirstTaskForTheProject(id);

  const { entities, setActiveEntity } = useNavigator();

  const selectEntity = () =>
    setActiveEntity({
      id,
      type: RelationshipEntityType.Project,
    });

  if (!project) {
    return null;
  }

  if (compact) {
    return (
      <div
        className="flex flex-col items-center gap-1"
        style={{
          border: !!entities.find(
            (e) => e.id === id && e.type === RelationshipEntityType.Project
          )
            ? `1px solid ${project.color}`
            : "#fff",
        }}
      >
        <IconCheckbox
          size={24}
          color={project.color || "#fff"}
          aria-label={project.title}
          className="cursor"
          onClick={selectEntity}
        />
        {relationships.map((r) => (
          <EntityTypeIcon key={r.id} type={r.target_type} size={16} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <ProjectSwitchableTask project={project} />
      {/* <TaskCard task={task} /> */}
      <div>
        {relationships.map((r) => (
          <EntityTypeIcon key={r.id} type={r.target_type} size={16} />
        ))}
      </div>
    </div>
  );
};
