"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { RelationshipEntityType } from "@/app/utils/types/relationship";

export type NavigatorItem = {
  id: number;
  type: RelationshipEntityType;
};

type RelationshipNavigatorValue = {
  entities: NavigatorItem[];
  /**
   * Select an entity from a given column.
   *
   * The column matters. The panel is a column browser, not a stack: every
   * column lists one entity's neighbours, and picking one of them decides
   * what the *next* column shows. Two things picked from the same column are
   * siblings, so the second replaces the first rather than landing behind it.
   * Without the column index, clicking a sibling appended it to the trail and
   * read as though it had been nested underneath.
   */
  selectFromColumn(columnIndex: number, item: NavigatorItem): void;
  /** jump straight to a level of the trail, keeping it */
  goToIndex(index: number): void;
};

export const RelationshipNavigatorContext =
  createContext<RelationshipNavigatorValue>({
    entities: [] as NavigatorItem[],
    selectFromColumn: () => {},
    goToIndex: () => {},
  });

/** which column the subtree being rendered belongs to */
const ColumnIndexContext = createContext<number | null>(null);

export const NavigatorColumn = ({
  index,
  children,
}: {
  index: number;
  children: ReactNode;
}) => (
  <ColumnIndexContext.Provider value={index}>
    {children}
  </ColumnIndexContext.Provider>
);

/**
 * `setActiveEntity` already bound to the column it is called from, so the
 * components picking entities do not each have to know where they sit.
 */
export const useNavigator = () => {
  const { entities, selectFromColumn, goToIndex } = useContext(
    RelationshipNavigatorContext
  );
  const column = useContext(ColumnIndexContext);

  // anything rendered outside a column behaves as though it came from the
  // deepest one, which is the old append-to-the-end behaviour
  const columnIndex = column ?? entities.length - 1;

  return {
    entities,
    goToIndex,
    setActiveEntity: (item: NavigatorItem) =>
      selectFromColumn(columnIndex, item),
  };
};

export function RelationshipNavigatorContextProvider({
  initialItem,
  children,
}: {
  initialItem: NavigatorItem;
  children: ReactNode;
}) {
  const [entities, setEntities] = useState<NavigatorItem[]>([initialItem]);

  const selectFromColumn = (columnIndex: number, item: NavigatorItem) => {
    setEntities((current) => {
      const isItem = (e: NavigatorItem) =>
        e.id === item.id && e.type === item.type;

      // this column already leads into that entity, and the rail draws it as
      // selected, so picking it again closes the branch
      const opened = current[columnIndex + 1];
      if (opened && isItem(opened)) {
        return current.slice(0, columnIndex + 1);
      }

      // already an ancestor - go back to it rather than opening a second copy
      // and looping the trail back through itself
      const existing = current.findIndex(isItem);
      if (existing !== -1 && existing <= columnIndex) {
        return current.slice(0, existing + 1);
      }

      // otherwise it replaces whatever this column used to lead into
      return [...current.slice(0, columnIndex + 1), item];
    });
  };

  const goToIndex = (index: number) =>
    setEntities((e) => e.slice(0, index + 1));

  return (
    <RelationshipNavigatorContext.Provider
      value={{ entities, selectFromColumn, goToIndex }}
    >
      {children}
    </RelationshipNavigatorContext.Provider>
  );
}
