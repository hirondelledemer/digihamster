import React, {
  FC,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { MentionsConfigProps } from "./types";
import { SuggestionKeyDownProps } from "@tiptap/suggestion";
import { IAttachment } from "../types/attachment";
import { useAttachmentsState } from "../hooks/use-attachments/state-context";

export type HabitsListProps = MentionsConfigProps;

const HabitListItem: FC<{
  attachment: IAttachment;
  selected?: boolean;
  onSelect(): void;
}> = ({ attachment, selected, onSelect }) => {
  return (
    <div key={attachment.id}>
      <Badge
        variant={selected ? "default" : "outline"}
        onClick={onSelect}
        className={selected ? "font-extrabold" : "font-normal"}
      >
        {attachment.file_name}
      </Badge>
    </div>
  );
};

export const AttachmentsList = forwardRef(
  ({ command, query }: HabitsListProps, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const { data: attachments } = useAttachmentsState();

    useEffect(() => {
      setSelectedIndex(0);
    }, [query]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: SuggestionKeyDownProps) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    const items = attachments
      .filter((habit) =>
        habit.file_name.toLowerCase().startsWith(query.toLowerCase())
      )
      .slice(0, 5);

    const selectItem = (index: number) => {
      const item = items[index];
      command({
        id: `${item.id}`,
        label: item.file_name,
      });
    };

    const upHandler = () => {
      setSelectedIndex((selectedIndex + items.length - 1) % items.length);
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    return (
      <Card>
        <CardContent className="py-2 px-4">
          {items.map((attachment: IAttachment, index: number) => {
            return (
              <HabitListItem
                key={attachment.id}
                selected={selectedIndex === index}
                onSelect={() => selectItem(index)}
                attachment={attachment}
              />
            );
          })}
        </CardContent>
      </Card>
    );
  }
);

AttachmentsList.displayName = "AttachmentsList";
