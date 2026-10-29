import { useNavigator } from "@/app/components/EventRelationships/navigator-context";
import { useProjectById } from "@/app/utils/hooks/use-projects/selectors";
import { RelationshipNode } from "@/app/utils/hooks/use-relationships/use-relationship-tree";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { IconCheckbox } from "@tabler/icons-react";
import { FC } from "react";
import { EntityTypeIcon } from "../../../EntityTypeIcon";
import { ProjectSwitchableTask } from "../RelatedLocation/components/ProjectSwitchableTask";
import { RelatedEntity } from "../RelatedEntity";

export const RelatedProject: FC<{
  id: number;
  compact: boolean;
  /** whatever the walk put under this project; empty when it stopped here */
  related?: RelationshipNode[];
  /** neighbour types behind this one, for the hint row of little icons */
  summary?: RelationshipEntityType[];
}> = ({ id, compact, related = [], summary = [] }) => {
  const project = useProjectById(id);

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
        {summary.map((type, i) => (
          <EntityTypeIcon key={`${type}-${i}`} type={type} size={16} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <ProjectSwitchableTask project={project} />

      {related.map((child) => (
        <div
          key={child.edge?.id ?? child.entity.id}
          className={
            child.entity.type === RelationshipEntityType.Note
              ? "mt-[-12px]"
              : ""
          }
        >
          <RelatedEntity node={child} compact={false} />
        </div>
      ))}
    </div>
  );
};
