import { useNoteById } from "@/app/utils/hooks/use-notes/selectors";
import {
  useAllRelationshipsForEntity,
} from "@/app/utils/hooks/use-relationships/selectors";
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
import { StickyNote } from "@/app/components/notes";
import { noteAttachment } from "@/app/utils/relationships/display-rules";

export const RelatedNote: FC<{
  id: number;
  compact: boolean;
  /** neighbour types behind this one, for the hint row of little icons */
  summary?: RelationshipEntityType[];
}> = ({ id, compact, summary = [] }) => {
  const note = useNoteById(id);

  // every edge the note has, not just the ones the panel would list. What a
  // note is taped to is about the note's own edges, not about which of them
  // the panel it happens to be sitting in cares to show.
  const neighbours = useAllRelationshipsForEntity({
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
              aria-label="note"
              className="cursor"
              onClick={selectEntity}
            />
          </TooltipTrigger>
          <TooltipContent className="w-[200px]" side="right">
            {note.title}
          </TooltipContent>
        </Tooltip>
        {summary.map((type, i) => (
          <EntityTypeIcon key={`${type}-${i}`} type={type} size={16} />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <StickyNote note={note} variant={noteAttachment(neighbours)} />
      <div className="flex">
        {summary.map((type, i) => (
          <EntityTypeIcon key={`${type}-${i}`} type={type} size={16} />
        ))}
      </div>
    </div>
  );
};
