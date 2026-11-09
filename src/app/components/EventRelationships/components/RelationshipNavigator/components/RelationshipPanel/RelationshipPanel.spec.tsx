import { render } from "@/config/utils/test-utils";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import {
  NavigatorItem,
  RelationshipNavigatorContext,
} from "@/app/components/EventRelationships/navigator-context";
import { RelationshipPanel } from "./RelationshipPanel";

/**
 * The panel is wired, not rendered, by this spec: what it gets right or wrong
 * is which props each column is handed, and the columns themselves pull in the
 * whole entity-hook tree.
 */
const columnProps: {
  entityType: RelationshipEntityType;
  relationshipPriority?: "primary" | "secondary";
}[] = [];

jest.mock("../EntityWithRelationships", () => ({
  EntityWithRelationships: (props: {
    entityType: RelationshipEntityType;
    relationshipPriority?: "primary" | "secondary";
  }) => {
    columnProps.push(props);
    return null;
  },
}));

jest.mock("../NavigatorPath/NavigatorPath", () => ({
  NavigatorPath: () => null,
}));

jest.mock("../../../CreateRelationshipsForm", () => ({
  CreateRelationshipsForm: () => null,
}));

const EVENT = { id: 1, type: RelationshipEntityType.Event };
const TASK = { id: 2, type: RelationshipEntityType.Task };
const PERSON = { id: 3, type: RelationshipEntityType.Person };

const renderPanel = (
  entities: NavigatorItem[],
  relationshipPriority: "primary" | "secondary"
) =>
  render(
    <RelationshipNavigatorContext.Provider
      value={{
        entities,
        selectFromColumn: () => {},
        goToIndex: () => {},
      }}
    >
      <RelationshipPanel relationshipPriority={relationshipPriority} />
    </RelationshipNavigatorContext.Provider>
  );

describe("RelationshipPanel", () => {
  beforeEach(() => {
    columnProps.length = 0;
  });

  describe("relationshipPriority", () => {
    it("narrows the entity the navigator was opened on", () => {
      renderPanel([EVENT], "primary");

      expect(columnProps).toEqual([
        expect.objectContaining({
          entityType: RelationshipEntityType.Event,
          relationshipPriority: "primary",
        }),
      ]);
    });

    /**
     * The priority is this pane's half of the *event* - "primary" means the
     * tasks and notes pane, "secondary" the places-and-people one. Read
     * against a task it means something else entirely: a task's person and
     * location sit in its secondary half, so carrying "primary" down the
     * trail filtered every neighbour out and the task's panel came back
     * saying "no stuff here".
     */
    it("stops applying once you drill past it", () => {
      renderPanel([EVENT, TASK], "primary");

      expect(columnProps[1]).toEqual(
        expect.objectContaining({
          entityType: RelationshipEntityType.Task,
          relationshipPriority: undefined,
        })
      );
    });

    it("stays off for every level below the first", () => {
      renderPanel([EVENT, TASK, PERSON], "secondary");

      expect(columnProps.map((p) => p.relationshipPriority)).toEqual([
        "secondary",
        undefined,
        undefined,
      ]);
    });
  });
});
