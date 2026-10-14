import { useNavigator } from "@/app/components/EventRelationships/navigator-context";
import { usePersonById } from "@/app/utils/hooks/use-people/selectors";
import { useRelevantRelationshipsForEntity } from "@/app/utils/hooks/use-relationships/selectors";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { IconManFilled } from "@tabler/icons-react";
import { FC } from "react";
import { EntityTypeIcon } from "../../../EntityTypeIcon";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

export const RelatedPerson: FC<{ id: number; compact: boolean }> = ({
  id,
  compact,
}) => {
  const person = usePersonById(id);
  const relationships = useRelevantRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Person,
  });

  const { setActiveEntity, entities } = useNavigator();

  const selectEntity = () =>
    setActiveEntity({
      id,
      type: RelationshipEntityType.Person,
    });

  if (!person) {
    return null;
  }

  if (compact) {
    const relationshipNumber = 3; // todo: move to const
    return (
      <div
        className="flex flex-col items-center gap-1"
        style={{
          border: !!entities.find(
            (e) => e.id === id && e.type === RelationshipEntityType.Person
          )
            ? `1px solid ${person.color}`
            : "#fff",
        }}
      >
        <IconManFilled
          size={24}
          color={person.color}
          aria-label={person.name}
          className="cursor"
          onClick={selectEntity}
        />
        {relationships.slice(0, 3).map((r) => (
          <EntityTypeIcon key={r.id} type={r.target_type} size={16} />
        ))}
        {relationships.length - relationshipNumber}
      </div>
    );
  }

  return (
    <Card className="p-0 rounded-md w-full">
      <CardHeader className="p-4 pt-2">
        <CardTitle className="font-normal flex gap-2">
          <IconManFilled size={16} color={person.color} aria-label="location" />
          <div style={{ color: person.color }}>{person.name}</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex overflow-hidden">
          {relationships.slice(0, 5).map(
            (
              r // todo: maybe show somehow differently
            ) => (
              <EntityTypeIcon key={r.id} type={r.target_type} size={16} />
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};
