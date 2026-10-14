import { Card, CardHeader, CardTitle } from "@/app/components/ui/card";
import { useNoteById } from "@/app/utils/hooks/use-notes/selectors";
import { useRelevantRelationshipsForEntity } from "@/app/utils/hooks/use-relationships/selectors";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { IconNote } from "@tabler/icons-react";
import { FC } from "react";
import { EntityTypeIcon } from "../../../EntityTypeIcon";

export const RelatedNote: FC<{ id: number }> = ({ id }) => {
  const note = useNoteById(id);
  const relationships = useRelevantRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Note,
  });

  if (!note) {
    return null;
  }

  return (
    <div className="w-full">
      <Card className="p-0 rounded-md">
        <CardHeader className="p-4 pt-2">
          <CardTitle className="font-normal flex gap-2 items-center">
            <IconNote size={16} aria-label="note" />
            <div>{note.title}</div>
          </CardTitle>
        </CardHeader>
      </Card>
      <div className="flex">
        {relationships.map((r) => (
          <EntityTypeIcon key={r.id} type={r.target_type} size={16} />
        ))}
      </div>
    </div>
  );
};
