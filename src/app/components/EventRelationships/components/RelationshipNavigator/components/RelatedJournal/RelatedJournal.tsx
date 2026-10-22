import { useNavigator } from "@/app/components/EventRelationships/navigator-context";
import { useJournalEntryById } from "@/app/utils/hooks/use-entry/selectors";
import { useRelevantRelationshipsForEntity } from "@/app/utils/hooks/use-relationships/selectors";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { IconFeather } from "@tabler/icons-react";
import { FC } from "react";
import { EntityTypeIcon } from "../../../EntityTypeIcon";
import { Card } from "@/app/components/ui/card";
import MinimalNote from "@/app/components/notes/MinimalNote";

export const RelatedJournal: FC<{ id: number; compact: boolean }> = ({
  id,
  compact,
}) => {
  const journal = useJournalEntryById(id);
  const relationships = useRelevantRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Journal,
  });

  const { setActiveEntity, entities } = useNavigator();

  const selectEntity = () =>
    setActiveEntity({
      id,
      type: RelationshipEntityType.Journal,
    });

  if (!journal) {
    return null;
  }

  if (compact) {
    return (
      <div
        className="flex flex-col items-center gap-1"
        style={{
          border: !!entities.find(
            (e) => e.id === id && e.type === RelationshipEntityType.Journal
          )
            ? `1px solid #fff`
            : "none",
        }}
      >
        <IconFeather
          size={24}
          color={"#fff"}
          aria-label={journal.title}
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
    <Card className="p-0 rounded-md">
      <MinimalNote note={journal.json_note} />
    </Card>
  );
};
