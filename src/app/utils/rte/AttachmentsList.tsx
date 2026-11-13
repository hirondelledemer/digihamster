import React, { forwardRef } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { MentionsConfigProps } from "./types";
import { useAttachmentsState } from "../hooks/use-attachments/state-context";
import { useHandler } from "./use-handler";
import { Item, SelectableItem } from "./SelectableItem";

export type HabitsListProps = MentionsConfigProps;

export const AttachmentsList = forwardRef(
  ({ command, query }: HabitsListProps, ref) => {
    const { data: attachments } = useAttachmentsState();
    const items = attachments
      .filter((att) =>
        att.file_name.toLowerCase().startsWith(query.toLowerCase())
      )
      .slice(0, 5)
      .map<Item>((att) => ({ id: att.id, label: att.file_name }));

    const { selectedIndex, selectItem } = useHandler({
      command,
      query,
      ref,
      items,
    });

    return (
      <Card>
        <CardContent className="py-2 px-4">
          {items.map((attachment: Item, index: number) => {
            return (
              <SelectableItem
                key={attachment.id}
                selected={selectedIndex === index}
                onSelect={() => selectItem(index)}
                item={attachment}
              />
            );
          })}
        </CardContent>
      </Card>
    );
  }
);

AttachmentsList.displayName = "AttachmentsList";
