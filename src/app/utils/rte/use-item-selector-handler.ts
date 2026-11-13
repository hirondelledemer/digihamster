import { SuggestionKeyDownProps } from "@tiptap/suggestion";
import { useEffect, useImperativeHandle, useState } from "react";

export const useItemSelectorHandler = ({
  items,
  command,
  query,
  ref,
}: {
  items: { id: number; label: string }[];
  command: (props: { id: string; label: string }) => void;
  query: string;
  ref: React.ForwardedRef<unknown>;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const selectItem = (index: number) => {
    const item = items[index];
    command({
      id: `${item.id}`,
      label: item.label,
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

  return { selectedIndex, selectItem };
};
