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

export const RelatedTask: FC<{
  id: number;
  compact: boolean;
  /** whatever the walk put under this task; empty when it stopped here */
  related?: RelationshipNode[];
  /** neighbour types behind this one, for the hint row of little icons */
  summary?: RelationshipEntityType[];
}> = ({ id, compact, related = [], summary = [] }) => {
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
        {summary.map((type, i) => (
          <EntityTypeIcon key={`${type}-${i}`} type={type} size={16} />
        ))}
      </div>
    );
  }

  const card = (
    <TaskCard task={task} scheduled={scheduled} additionalActions={actions} />
  );

  // the card draws its own notes, wherever it is rendered, so listing them
  // again underneath would show each one twice
  const beside = related.filter(
    (child) => child.entity.type !== RelationshipEntityType.Note
  );

  if (!beside.length) {
    return card;
  }

  return (
    <div>
      {card}
      {beside.map((child) => (
        <div key={child.edge?.id ?? child.entity.id}>
          <RelatedEntity node={child} compact={false} />
        </div>
      ))}
    </div>
  );
};
