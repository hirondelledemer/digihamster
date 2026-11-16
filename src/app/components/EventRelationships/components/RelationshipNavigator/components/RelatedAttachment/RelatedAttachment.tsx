import { useNavigator } from "@/app/components/EventRelationships/navigator-context";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { RelationshipNode } from "@/app/utils/hooks/use-relationships/use-relationship-tree";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { IconPaperclip } from "@tabler/icons-react";
import { FC } from "react";
import { RelatedEntity } from "../RelatedEntity";
import { EntityTypeIcon } from "../../../EntityTypeIcon";
import { RelatedEntityVariant } from "../RelatedEntity/RelatedEntity";
import { useAttachmentById } from "@/app/utils/hooks/use-attachments/selectors";
import { Attachment } from "@/app/components/molcules/attachments/Attachment";

export const RelatedAttachment: FC<{
  id: number;
  variant: RelatedEntityVariant;
  /** whatever the walk put under this location; empty when it stopped here */
  related?: RelationshipNode[];
  /** neighbour types behind this one, for the hint row of little icons */
  summary?: RelationshipEntityType[];
}> = ({ id, variant, related = [], summary = [] }) => {
  const attachment = useAttachmentById(id);
  const { setActiveEntity } = useNavigator();

  const selectEntity = () =>
    setActiveEntity({
      id,
      type: RelationshipEntityType.Location,
    });

  if (!attachment) {
    return null;
  }

  if (variant === "compact" || variant === "icon") {
    return (
      <div className="flex flex-col items-center gap-1 w-[20px]">
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <IconPaperclip
              size={variant === "compact" ? 24 : 16}
              aria-label="attachment"
              className="cursor"
              onClick={selectEntity}
            />
          </TooltipTrigger>
          <TooltipContent className="w-[200px]" side="right">
            {attachment.file_name}
          </TooltipContent>
        </Tooltip>
        {variant === "compact" &&
          summary.map((type, i) => (
            <EntityTypeIcon key={`${type}-${i}`} type={type} size={16} />
          ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <Card className="p-0 rounded-md">
        <CardHeader className="p-4 pt-2">
          <CardTitle className="flex flex-col gap-2">
            <div className="flex gap-2">
              <IconPaperclip size={16} aria-label="attachment" />
              <div>{attachment.file_name}</div>
            </div>
            <Attachment id={attachment.id} />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {related.map((child) => (
            <RelatedEntity
              key={child.edge?.id ?? child.entity.id}
              node={child}
              variant="full"
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
