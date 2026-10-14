import { useNavigator } from "@/app/components/EventRelationships/navigator-context";
import { useTaskProjectColor } from "@/app/utils/hooks/use-projects/selectors";
import { useRelevantRelationshipsForEntity } from "@/app/utils/hooks/use-relationships/selectors";
import { useTaskById } from "@/app/utils/hooks/use-tasks-new/selectors";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { IconCheckbox } from "@tabler/icons-react";
import { FC } from "react";
import { EntityTypeIcon } from "../../../EntityTypeIcon";
import TaskCard from "@/app/components/TaskCard";

export const RelatedTask: FC<{ id: number; compact: boolean }> = ({
  id,
  compact,
}) => {
  const task = useTaskById(id);
  const relationships = useRelevantRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Task,
  });
  const { main: color } = useTaskProjectColor(task);
  const { setActiveEntity, entities } = useNavigator();

  const selectEntity = () =>
    setActiveEntity({
      id,
      type: RelationshipEntityType.Task,
    });

  if (!task) {
    return null;
  }

  if (compact) {
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
          className="cursor"
          onClick={selectEntity}
        />
        {relationships.map((r) => (
          <EntityTypeIcon key={r.id} type={r.target_type} size={16} />
        ))}
      </div>
    );
  }

  return <TaskCard task={task} />;
};
