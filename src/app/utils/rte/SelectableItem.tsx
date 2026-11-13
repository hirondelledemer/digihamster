import { Badge } from "@/app/components/ui/badge";
import { FC } from "react";

export type Item = { id: number; label: string };

export const SelectableItem: FC<{
  item: Item;
  selected?: boolean;
  onSelect(): void;
}> = ({ item, selected, onSelect }) => {
  return (
    <div key={item.id}>
      <Badge
        variant={selected ? "default" : "outline"}
        onClick={onSelect}
        className={selected ? "font-extrabold" : "font-normal"}
      >
        {item.label}
      </Badge>
    </div>
  );
};
