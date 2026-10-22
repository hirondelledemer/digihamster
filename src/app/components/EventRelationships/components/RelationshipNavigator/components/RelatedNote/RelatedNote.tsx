import { useNoteById } from "@/app/utils/hooks/use-notes/selectors";
import { useRelevantRelationshipsForEntity } from "@/app/utils/hooks/use-relationships/selectors";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { IconNote } from "@tabler/icons-react";
import { FC } from "react";
import { EntityTypeIcon } from "../../../EntityTypeIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { useNavigator } from "@/app/components/EventRelationships/navigator-context";
import { MinimalNote } from "@/app/components/notes";

export const RelatedNote: FC<{ id: number; compact: boolean }> = ({
  id,
  compact,
}) => {
  const note = useNoteById(id);
  const relationships = useRelevantRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Note,
  });

  const { setActiveEntity } = useNavigator();

  const selectEntity = () =>
    setActiveEntity({
      id,
      type: RelationshipEntityType.Note,
    });

  if (!note) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-1 w-[20px]">
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <IconNote
              size={20}
              aria-label="location"
              className="cursor"
              onClick={selectEntity}
            />
          </TooltipTrigger>
          <TooltipContent className="w-[200px]" side="right">
            {note.title}
          </TooltipContent>
        </Tooltip>
        {relationships.map((r) => (
          <EntityTypeIcon key={r.id} type={r.target_type} size={16} />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <MinimalNote note={note.json_content} styledAsNote />
      <div className="flex">
        {relationships.map((r) => (
          <EntityTypeIcon key={r.id} type={r.target_type} size={16} />
        ))}
      </div>
    </div>
  );
};
