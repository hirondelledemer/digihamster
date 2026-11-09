import { useNavigator } from "@/app/components/EventRelationships/navigator-context";
import { useTaskProjectColor } from "@/app/utils/hooks/use-projects/selectors";
import { RelationshipNode } from "@/app/utils/hooks/use-relationships/use-relationship-tree";
import { useTaskById } from "@/app/utils/hooks/use-tasks/selectors";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { IconCheckbox } from "@tabler/icons-react";
import { FC } from "react";
import { EntityTypeIcon } from "../../../EntityTypeIcon";
import TaskCard from "@/app/components/TaskCard";
import { useEventScheduling } from "@/app/components/EventRelationships/use-event-scheduling";
import { RelatedEntity } from "../RelatedEntity";
import { matchesView } from "@/app/utils/relationships/edges";
import { RelatedEntityVariant } from "../RelatedEntity/RelatedEntity";

export const RelatedTask: FC<{
  id: number;
  variant: RelatedEntityVariant;
  /** whatever the walk put under this task; empty when it stopped here */
  related?: RelationshipNode[];
  /** neighbour types behind this one, for the hint row of little icons */
  summary?: RelationshipEntityType[];
}> = ({ id, variant, related = [], summary = [] }) => {
  const task = useTaskById(id);
  const { main: color } = useTaskProjectColor(task);
  const { setActiveEntity, entities } = useNavigator();
  const { scheduled, actions } = useEventScheduling(
    RelationshipEntityType.Task,
    id
  );

  const selectEntity = () =>
    setActiveEntity({
      id,
      type: RelationshipEntityType.Task,
    });

  if (!task) {
    return null;
  }

  if (variant === "icon") {
    return (
      <IconCheckbox
        size={24}
        color={color || "#fff"}
        aria-label={task.title}
        className="cursor-pointer"
        onClick={selectEntity}
      />
    );
  }

  if (variant === "compact") {
    return (
      <div
        className="flex flex-col items-center gap-1"
        style={{
          border: !!entities.find(
            (e) => e.id === id && e.type === RelationshipEntityType.Task
          )
            ? `1px solid ${color}`
            : "#fff",
        }}
      >
        <IconCheckbox
          size={24}
          color={color || "#fff"}
          aria-label={task.title}
          className="cursor-pointer"
          onClick={selectEntity}
        />
        {summary.map((type, i) => (
          <EntityTypeIcon key={`${type}-${i}`} type={type} size={16} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="grow">
        <TaskCard
          task={task}
          scheduled={scheduled}
          additionalActions={actions}
        />
        {related
          .filter((child) =>
            matchesView(
              RelationshipEntityType.Task,
              child.entity.type,
              "primary"
            )
          )
          .map((child) => (
            <div key={child.edge?.id ?? child.entity.id}>
              <RelatedEntity node={child} variant="full" />
            </div>
          ))}
      </div>
      <div>
        {related
          .filter((child) =>
            matchesView(
              RelationshipEntityType.Task,
              child.entity.type,
              "secondary"
            )
          )
          .map((child) => (
            <div key={child.edge?.id ?? child.entity.id}>
              <RelatedEntity node={child} variant="icon" />
            </div>
          ))}
      </div>
    </div>
  );
};
