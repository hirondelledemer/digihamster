import { useNavigator } from "@/app/components/EventRelationships/navigator-context";
import { useJournalEntryById } from "@/app/utils/hooks/use-entry/selectors";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { RelationshipNode } from "@/app/utils/hooks/use-relationships/use-relationship-tree";
import { RelatedEntity } from "../RelatedEntity";
import { IconFeather } from "@tabler/icons-react";
import { FC } from "react";
import { EntityTypeIcon } from "../../../EntityTypeIcon";
import { Card } from "@/app/components/ui/card";
import { MinimalNote } from "@/app/components/notes";

export const RelatedJournal: FC<{
  id: number;
  compact: boolean;
  /** neighbour types behind this one, for the hint row of little icons */
  summary?: RelationshipEntityType[];
  /** the thread this entry picks up, and what it was written about */
  related?: RelationshipNode[];
}> = ({ id, compact, summary = [], related = [] }) => {
  const journal = useJournalEntryById(id);

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
        {summary.map((type, i) => (
          <EntityTypeIcon key={`${type}-${i}`} type={type} size={16} />
        ))}
      </div>
    );
  }
  return (
    <>
      <Card className="p-0 rounded-md">
        <MinimalNote note={journal.json_note} />
      </Card>
      {related.map((child) => (
        <RelatedEntity
          key={child.edge?.id ?? child.entity.id}
          node={child}
          compact={false}
        />
      ))}
    </>
  );
};
