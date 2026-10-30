import { useNoteById } from "@/app/utils/hooks/use-notes/selectors";
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

export const RelatedNote: FC<{
  id: number;
  compact: boolean;
  /** neighbour types behind this one, for the hint row of little icons */
  summary?: RelationshipEntityType[];
  depth: number;
}> = ({ id, compact, summary = [], depth }) => {
  const note = useNoteById(id);

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
      <div className="flex flex-col items-center gap-1 w-5">
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
      <StickyNote note={note} variant={depth === 1 ? "pin" : "tape"} />
    </div>
  );
};
